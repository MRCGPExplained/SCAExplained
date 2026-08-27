"use client";

import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  createStudyRoomAction,
  joinStudyRoomAction,
  leaveStudyRoomAction,
  setRoomRolesAction,
  startRecordingAction,
  cancelRecordingAction,
  getMostRecentRecordingForStation,
  getDailyCoEnabledAction,
  createDailyCallAction,
  getDailyTokenAction,
  endDailyCallAction,
  removeParticipantAction,
} from "../../actions";
import type { DailyCall } from "@daily-co/daily-js";
import type { StudyRoom, ChatMessage, TimerPhase } from "@/lib/case-bank-types";
import { PHASE_DURATIONS, DEBRIEF_DURATION_SECONDS } from "@/lib/case-bank-types";
import { createRecordingLogger } from "@/lib/recording-logger";
import { uploadRecordingAudio } from "@/lib/upload-recording-audio";
import { useWakeLock } from "@/lib/use-wake-lock";
import {
  StudyRoomStatusProvider,
  StudyRoomTimerProvider,
  StudyRoomValueProvider,
  type Participant,
  type RecordingState,
  type StudyRoomStatusValue,
  type StudyRoomTimerValue,
  type StudyRoomValue,
} from "./context";

const { logStatus, logError, logDuration } = createRecordingLogger("study-room");

const DAILY_JOIN_TIMEOUT_MS = 5000;

/** Waits for a promise, but never longer than `ms` — used so a slow/failed
 * DailyCo join can delay the synced start briefly without ever blocking it. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | void> {
  return Promise.race([promise, new Promise<void>((resolve) => setTimeout(resolve, ms))]);
}

interface StudyRoomProviderProps {
  userId: string | null;
  displayName: string;
  initials: string;
  children: ReactNode;
}

/**
 * Owns the whole study-room session: the realtime channel, the DailyCo voice
 * call, participants, chat, recording, and the shared timer.
 *
 * It is mounted in app/case-bank/layout.tsx rather than in the station page
 * because layouts survive navigation ("On navigation, layouts preserve state,
 * remain interactive, and do not rerender" — Next.js docs). The station page
 * and the panel below it remount on every station change; this does not, so
 * the channel and the live call stay up while the case content swaps.
 */
export function StudyRoomProvider({
  userId,
  displayName,
  initials,
  children,
}: StudyRoomProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // The current station comes from the URL, not from props — the provider sits
  // above the dynamic segment, and usePathname is the documented way for a
  // client component to track it. null on /case-bank, /login, /register.
  const stationNumber = useMemo(() => {
    const m = /^\/case-bank\/(\d+)(?:\/|$)/.exec(pathname ?? "");
    return m ? parseInt(m[1], 10) : null;
  }, [pathname]);

  // The page registers the human-readable title for the station it rendered.
  // Stored with its number so a stale title can never be attached to a
  // recording started in the frame before the page caught up.
  const stationMetaRef = useRef<{ number: number; title: string } | null>(null);
  const registerStation = useCallback((number: number, title: string) => {
    stationMetaRef.current = { number, title };
  }, []);
  const stationTitle =
    stationMetaRef.current?.number === stationNumber ? stationMetaRef.current.title : undefined;

  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [joinError, setJoinError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hostNameState, setHostNameState] = useState<string | null>(null);
  // userIds currently connected to the realtime channel (presence) — used to
  // flag a doctor/patient who has dropped out as "(disconnected)".
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [rolesSaving, setRolesSaving] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentHostIdRef = useRef<string | null>(null);
  // One stable client for the life of the session — the channel cleanup calls
  // supabase.removeChannel(), so this must not be a fresh object each render.
  const [supabase] = useState(() => createSupabaseBrowserClient());

  // ── Recording state ──────────────────────────────────────────────────────────
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(null);
  const [myRecordingRole, setMyRecordingRole] = useState<"doctor" | "patient" | null>(null);
  const [recordingError, setRecordingError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingCutoffRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hostStopCutoffRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // True while startLocalRecording's async setup (getUserMedia → MediaRecorder)
  // is in flight — mediaRecorderRef.current is still null during this window.
  const recorderStartingRef = useRef(false);
  // True if stop was requested while the recorder wasn't ready yet — honored
  // the instant it becomes ready, instead of being silently dropped.
  const pendingStopRef = useRef(false);

  const iAmHost = room ? room.host_user_id === userId : false;
  const [recentReportId, setRecentReportId] = useState<string | null>(null);

  // ── Timer ──────────────────────────────────────────────────────────────────
  // Lifted here from the station page. It is room state (the host drives it and
  // guests follow), and keeping it above the remount boundary is what stops the
  // broadcast ref being orphaned every time the page re-renders a new station.
  const [timerPhase, setTimerPhase] = useState<TimerPhase>("PREREAD");
  const [timeLeft, setTimeLeft] = useState(PHASE_DURATIONS.PREREAD);
  const [timerRunning, setTimerRunning] = useState(false);
  const broadcastTimerRef = useRef<((phase: TimerPhase, timeLeft: number, running: boolean) => void) | null>(null);
  const timerStateRef = useRef<{ phase: TimerPhase; timeLeft: number; running: boolean }>({
    phase: "PREREAD",
    timeLeft: PHASE_DURATIONS.PREREAD,
    running: false,
  });
  useEffect(() => {
    timerStateRef.current = { phase: timerPhase, timeLeft, running: timerRunning };
  }, [timerPhase, timeLeft, timerRunning]);

  /**
   * The realtime channel is built once per room and its handlers would
   * otherwise close over the render that created them — freezing `iAmHost`,
   * `myRecordingRole`, `dailyRoomName` and every function they call for the
   * whole life of the room. Until now a station navigation remounted the panel
   * often enough to hide that; with the session persisting it would not.
   *
   * Every handler is therefore a one-line trampoline through this ref, which is
   * rewritten on every render, so they always run against current state.
   */
  const latest = useRef({} as {
    userId: string | null;
    iAmHost: boolean;
    myRecordingRole: "doctor" | "patient" | null;
    applyTimer: (phase: TimerPhase, timeLeft: number, running: boolean) => void;
    followStation: (target: number) => void;
    refreshParticipants: (roomId: string) => void;
    endDebrief: () => void;
    startDebrief: () => void;
    joinDailyCall: (roomName: string, roomUrl: string) => Promise<boolean>;
    leaveDailyCall: () => Promise<void>;
    startLocalRecording: (recordingId: string, role: "doctor" | "patient") => Promise<void>;
    stopLocalRecording: () => void;
    cancelRecordingDueToDailyFailure: (recordingId: string) => Promise<void>;
  });

  // Doctor and patient come straight from the synced room row. The doctor is
  // always the host.
  const doctorUserId = room?.doctor_user_id ?? null;
  const patientUserId = room?.patient_user_id ?? null;
  const rolesReady = !!doctorUserId && !!patientUserId;
  const myAssignedRole = doctorUserId === userId ? "doctor" : patientUserId === userId ? "patient" : null;

  // One-time tip (mobile only): when you're made doctor/patient, recommend a
  // long screen timeout so the phone doesn't sleep mid-consultation.
  const [showScreenTip, setShowScreenTip] = useState(false);
  const [dontShowScreenTip, setDontShowScreenTip] = useState(false);
  const prevAssignedRoleRef = useRef<string | null>(null);
  useEffect(() => {
    const prev = prevAssignedRoleRef.current;
    prevAssignedRoleRef.current = myAssignedRole;
    if (myAssignedRole && !prev && typeof window !== "undefined") {
      const dismissed = localStorage.getItem("sca_hide_screentime_tip") === "1";
      const isMobile = window.matchMedia?.("(pointer: coarse)")?.matches;
      if (!dismissed && isMobile) setShowScreenTip(true);
    }
  }, [myAssignedRole]);

  function dismissScreenTip() {
    if (dontShowScreenTip && typeof window !== "undefined") {
      localStorage.setItem("sca_hide_screentime_tip", "1");
    }
    setShowScreenTip(false);
  }

  // ── Post-recording debrief window ──────────────────────────────────────────
  // Recording stops sharp at 12 minutes, but the voice call stays open a bit
  // longer so the two candidates can talk through the station before the
  // room closes — this window is separate from (and outlives) the recording.
  const [debriefSecondsLeft, setDebriefSecondsLeft] = useState<number | null>(null);
  const debriefIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debriefTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the screen awake for the whole active session (recording + debrief),
  // so a phone doesn't idle out and suspend the mic mid-consultation.
  useWakeLock(
    recordingState === "starting" ||
      recordingState === "recording" ||
      recordingState === "uploading" ||
      debriefSecondsLeft !== null
  );

  // Roles can only be changed before a session starts — locked through
  // pre-read, the consultation, and the debrief. The pristine pre-start state
  // is: PREREAD, not running, full time on the clock, nothing recording, no
  // debrief in progress.
  const sessionIdle =
    timerPhase === "PREREAD" &&
    !timerRunning &&
    timeLeft >= PHASE_DURATIONS.PREREAD &&
    recordingState === "idle" &&
    debriefSecondsLeft === null;

  // ── Timer handlers ─────────────────────────────────────────────────────────
  // Only the host persists timer state; guests receive it by broadcast and by
  // the postgres_changes UPDATE handler.
  async function handleTimerStart() {
    setTimerRunning(true);
    broadcastTimerRef.current?.(timerPhase, timeLeft, true);
    if (room && iAmHost) {
      const startedAt = new Date(
        Date.now() - (PHASE_DURATIONS[timerPhase] - timeLeft) * 1000
      ).toISOString();
      await supabase
        .from("study_rooms")
        .update({ timer_started_at: startedAt, timer_paused_at: null, timer_paused_remaining: null })
        .eq("id", room.id);
    }
  }

  async function handleTimerPause() {
    setTimerRunning(false);
    broadcastTimerRef.current?.(timerPhase, timeLeft, false);
    if (room && iAmHost) {
      await supabase
        .from("study_rooms")
        .update({ timer_paused_at: new Date().toISOString(), timer_paused_remaining: timeLeft })
        .eq("id", room.id);
    }
  }

  async function handleSkipPreread() {
    setTimerPhase("CONSULT");
    setTimeLeft(PHASE_DURATIONS.CONSULT);
    setTimerRunning(true);
    broadcastTimerRef.current?.("CONSULT", PHASE_DURATIONS.CONSULT, true);
    if (room && iAmHost) {
      await supabase
        .from("study_rooms")
        .update({
          timer_phase: "CONSULT",
          timer_started_at: null,
          timer_paused_at: null,
          timer_paused_remaining: null,
          timer_skipped_preread: true,
        })
        .eq("id", room.id);
    }
  }

  /** Local reset + broadcast only — no DB write. Used on station change. */
  function resetTimerLocal() {
    setTimerPhase("PREREAD");
    setTimeLeft(PHASE_DURATIONS.PREREAD);
    setTimerRunning(false);
    broadcastTimerRef.current?.("PREREAD", PHASE_DURATIONS.PREREAD, false);
  }

  async function handleTimerReset() {
    resetTimerLocal();
    if (room && iAmHost) {
      await supabase
        .from("study_rooms")
        .update({
          timer_phase: "PREREAD",
          timer_started_at: null,
          timer_paused_at: null,
          timer_paused_remaining: null,
          timer_skipped_preread: false,
        })
        .eq("id", room.id);
    }
  }

  const handleTick = useCallback((newTime: number) => {
    setTimeLeft(newTime);
  }, []);

  async function handlePhaseComplete() {
    if (timerPhase === "PREREAD") {
      const startedAt = new Date().toISOString();
      setTimerPhase("CONSULT");
      setTimeLeft(PHASE_DURATIONS.CONSULT);
      setTimerRunning(true);
      broadcastTimerRef.current?.("CONSULT", PHASE_DURATIONS.CONSULT, true);
      if (room && iAmHost) {
        await supabase
          .from("study_rooms")
          .update({
            timer_phase: "CONSULT",
            timer_started_at: startedAt,
            timer_paused_at: null,
            timer_paused_remaining: null,
          })
          .eq("id", room.id);
      }
    } else {
      setTimerRunning(false);
    }
  }

  // Reset the timer whenever the station actually changes. The page used to do
  // this with a first-render guard, which only worked because it remounted;
  // now that this state persists, compare against the previous station instead.
  // Navigating to the list (stationNumber null) is not a station change, so it
  // returns before touching the ref — 5 → list → 5 correctly does not reset.
  const prevStationRef = useRef<number | null>(null);
  useEffect(() => {
    if (stationNumber === null) return;
    const prev = prevStationRef.current;
    prevStationRef.current = stationNumber;
    if (prev === null || prev === stationNumber) return;
    resetTimerLocal();
  }, [stationNumber]);

  async function handleSetRoles(nextDoctor: string, nextPatient: string | null) {
    if (!room || !sessionIdle) return;
    setRolesSaving(true);
    setRecordingError("");
    // Optimistic local update; realtime UPDATE will confirm for everyone.
    setRoom((prev) =>
      prev ? { ...prev, doctor_user_id: nextDoctor, patient_user_id: nextPatient, host_user_id: nextDoctor } : prev
    );
    currentHostIdRef.current = nextDoctor;
    const result = await setRoomRolesAction(room.id, nextDoctor, nextPatient);
    setRolesSaving(false);
    if (result.error) {
      setRecordingError(result.error);
      refreshParticipants(room.id);
    }
  }

  async function handleRemoveParticipant(targetUserId: string, targetName: string) {
    if (!room) return;
    if (!confirm(`Remove ${targetName} from the room?`)) return;
    const result = await removeParticipantAction(room.id, targetUserId);
    if (result.error) {
      setRecordingError(result.error);
      return;
    }
    refreshParticipants(room.id);
  }

  // ── DailyCo live audio (headless — no visible UI, audio plays in the background) ──
  const [dailyCoEnabled, setDailyCoEnabled] = useState(false);
  const [dailyRoomName, setDailyRoomName] = useState<string | null>(null);
  const [dailyConnecting, setDailyConnecting] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [dailyFailed, setDailyFailed] = useState(false);
  const dailyCallRef = useRef<DailyCall | null>(null);
  const dailyAudioElsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const dailyPrewarmingRef = useRef(false);

  useEffect(() => {
    getDailyCoEnabledAction().then(setDailyCoEnabled);
  }, []);

  // Warm up mic access as soon as you're in the room — before recording
  // starts — so the actual join later is instant instead of prompting for
  // permission (or showing DailyCo's own device-check screen) mid-consult.
  useEffect(() => {
    if (!room || !dailyCoEnabled || dailyPrewarmingRef.current) return;
    dailyPrewarmingRef.current = true;
    prewarmDailyCall();
  }, [room?.id, dailyCoEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // Best-effort cleanup if the panel unmounts mid-call (e.g. navigating away).
  // dailyCallRef is read fresh inside the closure since it's set lazily,
  // long after this effect's setup — only the Map itself is safe to capture
  // early since that reference never changes, just its contents.
  useEffect(() => {
    const audioEls = dailyAudioElsRef.current;
    return () => {
      audioEls.forEach((el) => el.remove());
      audioEls.clear();
      dailyCallRef.current?.destroy();
      if (debriefIntervalRef.current) clearInterval(debriefIntervalRef.current);
      if (debriefTimeoutRef.current) clearTimeout(debriefTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!room || stationNumber === null) return;
    getMostRecentRecordingForStation(stationNumber).then(setRecentReportId);
  }, [room?.id, stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ref so channel callbacks always read the latest stationNumber without
  // needing the channel effect to re-run.
  const stationNumberRef = useRef(stationNumber);
  useEffect(() => {
    stationNumberRef.current = stationNumber;
  }, [stationNumber]);

  // Guests follow the host. This provider is not remounted by the navigation
  // it triggers, so there is no stale re-read to defend against — the old
  // sessionStorage anti-bounce guard has been removed with the remount that
  // made it necessary. (It would also have become permanent: it was only ever
  // cleared on a room change, so a guest would stop following the host back to
  // any station they had previously left.)
  function followStation(target: number) {
    router.push(`/case-bank/${target}`);
  }

  const refreshParticipants = useCallback(async (roomId: string) => {
    const { data } = await supabase
      .from("room_participants")
      .select("user_id,joined_at,muted")
      .eq("room_id", roomId)
      .returns<{ user_id: string; joined_at: string; muted: boolean }[]>();

    if (!data) return;

    const profileIds = data.map((p) => p.user_id);
    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("id,display_name,initials,is_guest")
      .in("id", profileIds)
      .returns<{ id: string; display_name: string; initials: string; is_guest: boolean }[]>();

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );

    // Always read from ref — never from a potentially stale closure over `room`
    const hostId = currentHostIdRef.current;

    const plist: Participant[] = data.map((p) => {
      const prof = profileMap.get(p.user_id);
      return {
        userId: p.user_id,
        displayName: prof?.display_name ?? "Unknown",
        initials: prof?.initials ?? "?",
        isHost: hostId ? p.user_id === hostId : false,
        isSelf: p.user_id === userId,
        isGuest: prof?.is_guest ?? false,
        muted: p.muted,
        joinedAt: p.joined_at,
      };
    });

    // Order: host first, then others, self last
    plist.sort((a, b) => {
      if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
      if (a.isSelf !== b.isSelf) return a.isSelf ? 1 : -1;
      return 0;
    });

    setParticipants(plist);
    setHostNameState(plist.find((p) => p.isHost)?.displayName ?? null);
  }, [supabase, userId]);

  // On join/rejoin: seed currentHostIdRef, and send the guest to the host's
  // station if they aren't already there.
  // Timer is NOT restored from DB — it resets to PREREAD on every station change,
  // and live sync happens via broadcast only.
  useEffect(() => {
    if (!room) return;
    currentHostIdRef.current = room.host_user_id;
    if (!iAmHost && room.current_station_number && room.current_station_number !== stationNumberRef.current) {
      followStation(room.current_station_number);
    }
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!room || !userId) return;

    const channel = supabase.channel(`room:${room.id}`, {
      config: {
        broadcast: { ack: false },
        presence: { key: userId },
      },
    });
    channelRef.current = channel;

    // Room state changes (timer sync + navigate sync for guests)
    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "study_rooms", filter: `id=eq.${room.id}` },
      (payload) => {
        const updated = payload.new as StudyRoom;
        // Keep ref in sync with DB truth; refresh participants immediately on host change
        if (updated.host_user_id && updated.host_user_id !== currentHostIdRef.current) {
          currentHostIdRef.current = updated.host_user_id;
          refreshParticipants(room.id);
        }
        setRoom(updated);

        {
          const phase = updated.timer_phase as TimerPhase;
          let nextTimeLeft: number;
          let running: boolean;

          if (updated.timer_paused_at && updated.timer_paused_remaining !== null) {
            nextTimeLeft = updated.timer_paused_remaining;
            running = false;
          } else if (updated.timer_started_at && !updated.timer_paused_at) {
            const elapsed = Math.floor(
              (Date.now() - new Date(updated.timer_started_at).getTime()) / 1000
            );
            nextTimeLeft = Math.max(0, PHASE_DURATIONS[phase] - elapsed);
            running = true;
          } else {
            nextTimeLeft = PHASE_DURATIONS[phase];
            running = false;
          }

          latest.current.applyTimer(phase, nextTimeLeft, running);
        }

        // Station: guests follow host
        const isGuest = updated.host_user_id !== userId;
        if (isGuest && updated.current_station_number && updated.current_station_number !== stationNumberRef.current) {
          latest.current.followStation(updated.current_station_number);
        }
      }
    );

    // Participant changes
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "room_participants", filter: `room_id=eq.${room.id}` },
      () => { refreshParticipants(room.id); }
    );

    // Chat — new messages from other participants via postgres realtime
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "room_messages", filter: `room_id=eq.${room.id}` },
      (payload) => {
        const m = payload.new as { id: string; user_id: string; display_name: string; message: string; created_at: string };
        if (m.user_id === userId) return; // sender already added optimistically
        setMessages((prev) => [
          ...prev,
          {
            id: m.id,
            from: m.display_name,
            fromSelf: false,
            text: m.message,
            time: new Date(m.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    );

    // Guest receives timer state from host broadcasts
    channel.on("broadcast", { event: "timer" }, ({ payload }) => {
      const { phase, timeLeft, running } = payload as { phase: TimerPhase; timeLeft: number; running: boolean };
      if (!latest.current.iAmHost) {
        latest.current.applyTimer(phase, timeLeft, running);
      }
    });

    // Presence sync fires whenever anyone joins or leaves — refresh participant
    // list and recompute who is actually connected right now.
    channel.on("presence", { event: "sync" }, () => {
      setConnectedIds(new Set(Object.keys(channel.presenceState())));
      latest.current.refreshParticipants(room.id);
    });

    // Host re-announces station + timer whenever a new guest joins the channel
    channel.on("presence", { event: "join" }, () => {
      if (!latest.current.iAmHost) return;
      channel.send({ type: "broadcast", event: "navigate", payload: { stationNumber: stationNumberRef.current } });
      channel.send({ type: "broadcast", event: "timer", payload: timerStateRef.current });
    });

    // Host transfer — update ref immediately so refreshParticipants reads the new host
    channel.on("broadcast", { event: "host-change" }, ({ payload }) => {
      const { newHostUserId } = payload as { newHostUserId: string };
      currentHostIdRef.current = newHostUserId;
      setRoom((prev) => prev ? { ...prev, host_user_id: newHostUserId } : prev);
      latest.current.refreshParticipants(room.id);
    });

    // Recording: all participants receive start signal
    channel.on("broadcast", { event: "recording-start" }, ({ payload }) => {
      const { recordingId, doctorUserId, patientUserId, dailyRoomName, dailyRoomUrl } = payload as {
        recordingId: string;
        doctorUserId: string;
        patientUserId: string;
        dailyRoomName?: string;
        dailyRoomUrl?: string;
      };
      // A new recording always wins — force-end any debrief still counting
      // down from a previous take before joining the new call. Harmless
      // no-op if there was nothing to end.
      latest.current.endDebrief();
      setActiveRecordingId(recordingId);
      setRecordingState("starting");
      logStatus("recording-start received", { recordingId, iAmHost: latest.current.iAmHost, dailyRoom: dailyRoomName ?? null });
      // Non-host participants: join the shared live audio call first (or
      // time out) so the mic recorder starts in sync with it, then start
      // their own mic if they're doctor or patient.
      if (!latest.current.iAmHost) {
        (async () => {
          let dailyOk = true;
          if (dailyRoomName && dailyRoomUrl) {
            const t0 = Date.now();
            const joined = await withTimeout(latest.current.joinDailyCall(dailyRoomName, dailyRoomUrl), DAILY_JOIN_TIMEOUT_MS);
            dailyOk = joined === true;
            logDuration(dailyOk ? "guest DailyCo join succeeded" : "guest DailyCo join failed/timed out", t0);
            if (!dailyOk) setDailyFailed(true);
          }
          const amEssential = latest.current.userId === doctorUserId || latest.current.userId === patientUserId;
          if (!dailyOk && amEssential) {
            // Voice call is required for this room but failed to connect for
            // me — tell the host so they can cancel and refund, rather than
            // starting my mic recorder into a consult no one can hear.
            logStatus("broadcasting voice-call-failed", { recordingId });
            channelRef.current?.send({ type: "broadcast", event: "voice-call-failed", payload: { recordingId } });
            return;
          }
          setRecordingState("recording");
          logStatus("phase → recording (guest)", { role: latest.current.userId === doctorUserId ? "doctor" : latest.current.userId === patientUserId ? "patient" : "observer" });
          // Mute observers during the graded consult — only doctor/patient
          // should be audible. The debrief unmutes everyone again.
          dailyCallRef.current?.setLocalAudio(amEssential);
          if (latest.current.userId === doctorUserId) {
            setMyRecordingRole("doctor");
            await latest.current.startLocalRecording(recordingId, "doctor");
          } else if (latest.current.userId === patientUserId) {
            setMyRecordingRole("patient");
            await latest.current.startLocalRecording(recordingId, "patient");
          }
        })();
      }
    });

    // Recording: stop signal
    channel.on("broadcast", { event: "recording-stop" }, () => {
      logStatus("recording-stop received");
      latest.current.stopLocalRecording();
      latest.current.startDebrief();
      if (latest.current.myRecordingRole === null) setRecordingState("done");
    });

    // A doctor/patient participant's voice call failed to connect — only the
    // host (who holds the credit) acts on this, cancelling for everyone.
    channel.on("broadcast", { event: "voice-call-failed" }, ({ payload }) => {
      if (!latest.current.iAmHost) return;
      const { recordingId } = payload as { recordingId: string };
      logStatus("voice-call-failed received (host)", { recordingId });
      latest.current.cancelRecordingDueToDailyFailure(recordingId);
    });

    // Recording was cancelled (voice call failed for an essential
    // participant) — everyone unwinds back to idle.
    channel.on("broadcast", { event: "recording-cancelled" }, ({ payload }) => {
      const { reason } = payload as { reason?: string };
      logStatus("recording-cancelled received", { reason });
      latest.current.stopLocalRecording();
      latest.current.leaveDailyCall();
      setRecordingState("error");
      setRecordingError(reason ?? "Recording was cancelled — the voice call failed to connect.");
      setActiveRecordingId(null);
      setMyRecordingRole(null);
    });

    // Guest listens for host station changes
    channel.on("broadcast", { event: "navigate" }, ({ payload }) => {
      const { stationNumber: target } = payload as { stationNumber: number };
      if (!latest.current.iAmHost && target && target !== stationNumberRef.current) {
        latest.current.followStation(target);
      }
    });

    channel.subscribe(async (status) => {
      logStatus("realtime channel status", { status });
      if (status === "SUBSCRIBED") {
        await channel.track({ userId, displayName, initials });
        latest.current.refreshParticipants(room.id);
        if (latest.current.iAmHost) {
          if (stationNumberRef.current !== null) {
            channel.send({
              type: "broadcast",
              event: "navigate",
              payload: { stationNumber: stationNumberRef.current },
            });
          }
          // Announce current timer state (covers auto-start and late-joining guests)
          channel.send({ type: "broadcast", event: "timer", payload: timerStateRef.current });
        }
      }
    });

    return () => {
      broadcastTimerRef.current = null;
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wire or clear the timer broadcaster whenever the host role lands on or
  // leaves this user. Kept separate from the channel effect so a host handover
  // mid-session rewires it without tearing the channel down.
  useEffect(() => {
    if (iAmHost && channelRef.current) {
      const ch = channelRef.current;
      broadcastTimerRef.current = (phase, timeLeft, running) => {
        ch.send({ type: "broadcast", event: "timer", payload: { phase, timeLeft, running } });
      };
    } else if (!iAmHost) {
      broadcastTimerRef.current = null;
    }
  }, [iAmHost, room?.id]);

  // Host: write current station to DB whenever room loads or station changes.
  // Guests receive it via the postgres_changes UPDATE subscription below.
  // The result MUST be consumed — a Supabase query builder is lazy and never
  // issues the request unless it's awaited or .then()'d. Without this the row
  // stayed frozen at whatever station the room was created on, so every guest
  // remount re-read that stale value and navigated back to it mid-journey.
  useEffect(() => {
    if (!room || !iAmHost) return;
    supabase
      .from("study_rooms")
      .update({ current_station_number: stationNumber, last_activity_at: new Date().toISOString() })
      .eq("id", room.id)
      .then(({ error }) => {
        if (error) logError("update current_station_number", error, { stationNumber });
      });
  }, [room?.id, stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // Host: broadcast station change via the existing channel whenever stationNumber changes.
  // This handles App Router navigation which updates props in-place without remounting
  // the component, so the channel subscription effect (which only fires on room?.id
  // change) won't re-run. The SUBSCRIBED callback covers the initial broadcast on join.
  useEffect(() => {
    if (!room || !iAmHost || !channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "navigate",
      payload: { stationNumber },
    });
  }, [stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load persisted messages when room is joined
  useEffect(() => {
    if (!room) return;
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    supabase
      .from("room_messages")
      .select("id, user_id, display_name, message, created_at")
      .eq("room_id", room.id)
      .gt("created_at", cutoff)
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data }) => {
        if (!data) return;
        setMessages(
          data.map((m) => ({
            id: m.id,
            from: m.display_name,
            fromSelf: m.user_id === userId,
            text: m.message,
            time: new Date(m.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          }))
        );
      });
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-rejoin a saved room on mount. Also accepts the ?joinRoom= URL param,
  // which is how a fresh landing from a room invite link arrives — the server
  // redirect puts it there before any client code runs.
  useEffect(() => {
    if (!userId) return;
    const savedId =
      sessionStorage.getItem("studyRoomId") ??
      new URLSearchParams(window.location.search).get("joinRoom");
    if (!savedId || room) return;
    sessionStorage.setItem("studyRoomId", savedId);
    supabase
      .from("study_rooms")
      .select("*")
      .eq("id", savedId)
      .single<StudyRoom>()
      .then(({ data }) => {
        if (data) setRoom(data);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  /** Plays a remote participant's audio track through a hidden <audio> element — headless mode renders nothing itself. */
  function handleDailyTrackStarted(ev: { participant: { local: boolean; session_id: string } | null; track: MediaStreamTrack; type: string }) {
    if (ev.type !== "audio" || !ev.participant || ev.participant.local) return;
    const key = ev.participant.session_id;
    const existing = dailyAudioElsRef.current.get(key);
    if (existing) existing.remove();

    const audioEl = document.createElement("audio");
    audioEl.autoplay = true;
    audioEl.srcObject = new MediaStream([ev.track]);
    audioEl.style.display = "none";
    document.body.appendChild(audioEl);
    dailyAudioElsRef.current.set(key, audioEl);
  }

  function handleDailyTrackStopped(ev: { participant: { session_id: string } | null; type: string }) {
    if (ev.type !== "audio" || !ev.participant) return;
    const el = dailyAudioElsRef.current.get(ev.participant.session_id);
    if (el) {
      el.remove();
      dailyAudioElsRef.current.delete(ev.participant.session_id);
    }
  }

  // Recovery net: if a remote participant has a playable audio track that we're
  // not currently playing (e.g. their producer dropped and came back after a
  // network blip or the mic resumed), (re)attach it. Covers cases where a
  // clean "track-started" didn't fire — the situation behind the mid-call
  // "producer not found" audio drop.
  function attachRemoteAudio(participant: {
    local: boolean;
    session_id: string;
    tracks?: { audio?: { state?: string; persistentTrack?: MediaStreamTrack } };
  } | null) {
    if (!participant || participant.local) return;
    const audio = participant.tracks?.audio;
    if (audio?.state !== "playable" || !audio.persistentTrack) return;
    const key = participant.session_id;
    const existing = dailyAudioElsRef.current.get(key);
    const currentId = existing?.srcObject instanceof MediaStream ? existing.srcObject.getTracks()[0]?.id : null;
    if (existing && currentId === audio.persistentTrack.id) return; // already playing this track
    existing?.remove();
    const audioEl = document.createElement("audio");
    audioEl.autoplay = true;
    audioEl.srcObject = new MediaStream([audio.persistentTrack]);
    audioEl.style.display = "none";
    document.body.appendChild(audioEl);
    dailyAudioElsRef.current.set(key, audioEl);
    logStatus("re-attached remote audio", { session: key });
  }

  async function getOrCreateDailyCall(): Promise<DailyCall | null> {
    if (dailyCallRef.current) return dailyCallRef.current;
    const DailyIframe = (await import("@daily-co/daily-js")).default;
    const call = DailyIframe.createCallObject({ subscribeToTracksAutomatically: true });
    call.on("track-started", handleDailyTrackStarted as never);
    call.on("track-stopped", handleDailyTrackStopped as never);
    // Recovery + observability for mid-call audio drops.
    call.on("participant-updated", ((ev: { participant: Parameters<typeof attachRemoteAudio>[0] }) => attachRemoteAudio(ev.participant)) as never);
    call.on("error", ((e: unknown) => logError("DailyCo error", e)) as never);
    call.on("nonfatal-error", ((e: unknown) => logError("DailyCo nonfatal-error", e)) as never);
    call.on("network-connection", ((e: unknown) => logStatus("DailyCo network-connection", e as Record<string, unknown>)) as never);
    dailyCallRef.current = call;
    return call;
  }

  /** Warms up mic access well before recording starts, so the real join is instant. */
  async function prewarmDailyCall() {
    const t0 = Date.now();
    try {
      const call = await getOrCreateDailyCall();
      await call?.startCamera({ startVideoOff: true, startAudioOff: false });
      logDuration("DailyCo mic prewarm", t0);
    } catch (err) {
      // best-effort — worst case the permission prompt just happens at join time instead
      logError("DailyCo mic prewarm", err);
    }
  }

  async function joinDailyCall(roomName: string, roomUrl: string): Promise<boolean> {
    setDailyConnecting(true);
    setDailyFailed(false);
    const t0 = Date.now();
    try {
      const tokenResult = await getDailyTokenAction(roomName, displayName, iAmHost);
      if ("error" in tokenResult) {
        logError("getDailyTokenAction", tokenResult.error, { roomName });
        setDailyFailed(true);
        return false;
      }
      const call = await getOrCreateDailyCall();
      if (!call) {
        logError("getOrCreateDailyCall", "returned null", { roomName });
        setDailyFailed(true);
        return false;
      }
      setDailyRoomName(roomName);
      await call.join({ url: roomUrl, token: tokenResult.token });
      setCallConnected(true);
      logDuration("DailyCo join", t0);
      return true;
    } catch (err) {
      // best-effort — recording continues locally regardless of live audio
      logError("DailyCo join", err, { roomName });
      setCallConnected(false);
      setDailyFailed(true);
      return false;
    } finally {
      setDailyConnecting(false);
    }
  }

  async function leaveDailyCall() {
    const call = dailyCallRef.current;
    if (call) {
      try {
        await call.leave();
        logStatus("DailyCo call left");
      } catch (err) {
        // best-effort — recording/upload flow doesn't depend on this
        logError("DailyCo leave", err);
      }
    }
    dailyAudioElsRef.current.forEach((el) => el.remove());
    dailyAudioElsRef.current.clear();
    setDailyConnecting(false);
    setCallConnected(false);
    setDailyFailed(false);
    setDailyRoomName(null);
  }

  function clearDebriefTimers() {
    if (debriefIntervalRef.current) {
      clearInterval(debriefIntervalRef.current);
      debriefIntervalRef.current = null;
    }
    if (debriefTimeoutRef.current) {
      clearTimeout(debriefTimeoutRef.current);
      debriefTimeoutRef.current = null;
    }
  }

  // Recording has just stopped — start the debrief window instead of
  // closing the call immediately, so both candidates get a moment to talk
  // through the station before it ends.
  function startDebrief() {
    logStatus("debrief window started", { seconds: DEBRIEF_DURATION_SECONDS });
    // Everyone in the call — observers included — can talk freely during the
    // debrief, so make sure this participant's mic is live regardless of its
    // state during the recording.
    dailyCallRef.current?.setLocalAudio(true);
    clearDebriefTimers();
    setDebriefSecondsLeft(DEBRIEF_DURATION_SECONDS);
    debriefIntervalRef.current = setInterval(() => {
      setDebriefSecondsLeft((s) => (s !== null ? Math.max(0, s - 1) : s));
    }, 1000);
    debriefTimeoutRef.current = setTimeout(() => {
      logStatus("debrief window ended — closing call");
      endDebrief();
    }, DEBRIEF_DURATION_SECONDS * 1000);
  }

  // Actually closes the call, whether the debrief window ran out or someone
  // ended it early.
  function endDebrief() {
    clearDebriefTimers();
    setDebriefSecondsLeft(null);
    if (iAmHost && dailyRoomName) endDailyCallAction(dailyRoomName);
    leaveDailyCall();
  }

  /**
   * Host-only. Voice call failed to connect for an essential (doctor/patient)
   * participant — abort the whole attempt: refund the credit, delete the
   * never-recorded row, tell everyone to unwind, and clean up the DailyCo
   * room. Called either for the host's own failed join, or in response to a
   * guest's voice-call-failed broadcast.
   */
  async function cancelRecordingDueToDailyFailure(recordingId: string) {
    logStatus("cancelling recording — voice call failed", { recordingId });
    if (dailyRoomName) endDailyCallAction(dailyRoomName);
    const result = await cancelRecordingAction(recordingId);
    if (result.error) logError("cancelRecordingAction", result.error, { recordingId });
    const reason = result.error ?? "There was an issue connecting the voice call — please try again.";

    channelRef.current?.send({
      type: "broadcast",
      event: "recording-cancelled",
      payload: { reason },
    });

    stopLocalRecording();
    leaveDailyCall();
    setRecordingState("error");
    setRecordingError(reason);
    setActiveRecordingId(null);
    setMyRecordingRole(null);
  }

  async function startLocalRecording(recordingId: string, role: "doctor" | "patient") {
    recorderStartingRef.current = true;
    pendingStopRef.current = false; // fresh attempt — clear any stale flag
    const t0 = Date.now();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        logStatus("local recorder stopped", { role });
        stream.getTracks().forEach((t) => t.stop());
        uploadRecording(recordingId, role);
      };
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      recorderStartingRef.current = false;
      logDuration(`local recorder ready (${role})`, t0);

      // A stop signal arrived while we were still setting up — honor it now
      // instead of letting the recorder run with no way left to stop it.
      if (pendingStopRef.current) {
        pendingStopRef.current = false;
        logStatus("pending stop honored — recorder was mid-setup when stop arrived", { role });
        recorder.stop();
        return;
      }

      // Hard cutoff — recording never exceeds the 12-minute consult window,
      // regardless of whether the host remembers to stop it.
      recordingCutoffRef.current = setTimeout(() => {
        logStatus("12-minute auto-cutoff fired", { role });
        stopLocalRecording();
      }, PHASE_DURATIONS.CONSULT * 1000);
    } catch (err) {
      logError("getUserMedia (local recorder)", err, { role });
      recorderStartingRef.current = false;
      pendingStopRef.current = false;
      setRecordingState("error");
      setRecordingError("Microphone access denied. Please allow microphone access and try again.");
    }
  }

  function stopLocalRecording() {
    if (recordingCutoffRef.current) {
      clearTimeout(recordingCutoffRef.current);
      recordingCutoffRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      logStatus("stopping local recorder", { state: mediaRecorderRef.current.state });
      mediaRecorderRef.current.stop();
    } else if (recorderStartingRef.current) {
      // Recorder isn't ready yet — remember to stop it the moment it is.
      logStatus("stop requested before recorder was ready — queued as pending");
      pendingStopRef.current = true;
    } else {
      logStatus("stop requested but no recorder exists (observer or not yet started)");
    }
  }

  async function uploadRecording(recordingId: string, role: "doctor" | "patient") {
    setRecordingState("uploading");
    const t0 = Date.now();
    try {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      logStatus("upload starting", { role, sizeKB: Math.round(blob.size / 1024) });
      await uploadRecordingAudio(recordingId, role, blob);
      logDuration(`upload (${role})`, t0);
      setRecordingState("done");
    } catch (err) {
      logError("upload", err, { role });
      setRecordingState("error");
      setRecordingError("Upload failed. Please contact support.");
    }
  }

  async function handleConfirmRecord() {
    if (!room || !iAmHost || !doctorUserId || !patientUserId || stationNumber === null) return;
    if (doctorUserId === patientUserId) {
      setRecordingError("Doctor and patient must be different participants.");
      return;
    }
    // Starting a new recording always wins — any leftover debrief call from
    // a previous take is closed immediately, no grace period.
    if (debriefSecondsLeft !== null) {
      logStatus("new recording starting — ending previous debrief call immediately");
      endDebrief();
    }
    setRecordingState("starting");
    setRecordingError("");
    logStatus("host starting recording", { stationNumber, doctorId: doctorUserId, patientId: patientUserId });

    const doctorPart = participants.find((p) => p.userId === doctorUserId);
    const patientPart = participants.find((p) => p.userId === patientUserId);

    const result = await startRecordingAction({
      roomId: room.id,
      stationNumber,
      stationTitle: stationTitle ?? `Station ${stationNumber}`,
      doctorUserId: doctorUserId,
      patientUserId: patientUserId,
      doctorDisplayName: doctorPart?.displayName ?? "Doctor",
      patientDisplayName: patientPart?.displayName ?? "Patient",
    });

    if (result.error) {
      logError("startRecordingAction", result.error);
      setRecordingState("error");
      setRecordingError(result.error);
      return;
    }

    const recordingId = result.recordingId!;
    logStatus("recording row created", { recordingId });
    setActiveRecordingId(recordingId);
    // Stay in "starting" — not yet "recording" — until the synced start
    // below actually happens, so the UI doesn't claim REC prematurely.

    // Start the shared live audio call, if enabled — best-effort, never
    // blocks the recording itself if DailyCo is unavailable.
    let dailyRoom: { roomName: string; roomUrl: string } | null = null;
    if (dailyCoEnabled) {
      const dailyResult = await createDailyCallAction(recordingId);
      if (!("error" in dailyResult)) {
        dailyRoom = dailyResult;
        logStatus("DailyCo room created", { roomName: dailyResult.roomName });
      } else {
        logError("createDailyCallAction", dailyResult.error);
      }
    }

    // Notify all participants via broadcast
    channelRef.current?.send({
      type: "broadcast",
      event: "recording-start",
      payload: {
        recordingId,
        doctorUserId,
        patientUserId,
        dailyRoomName: dailyRoom?.roomName,
        dailyRoomUrl: dailyRoom?.roomUrl,
      },
    });
    logStatus("broadcast recording-start sent", { recordingId });

    // Wait for the live call to connect (or time out) before starting the
    // timer and the recorder, so all three begin in sync.
    if (dailyRoom) {
      const t0 = Date.now();
      const joined = await withTimeout(joinDailyCall(dailyRoom.roomName, dailyRoom.roomUrl), DAILY_JOIN_TIMEOUT_MS);
      logDuration(joined === true ? "host DailyCo join succeeded" : "host DailyCo join failed/timed out", t0);
      if (joined !== true) {
        setDailyFailed(true);
        const amEssential = userId === doctorUserId || userId === patientUserId;
        if (amEssential) {
          logStatus("host is essential participant — cancelling recording due to Daily failure");
          await cancelRecordingDueToDailyFailure(recordingId);
          return;
        }
      }
    }

    setRecordingState("recording");
    logStatus("phase → recording (host)");

    // Only the doctor and patient should be audible during the graded
    // consult — mute observers (the debrief unmutes everyone again).
    const hostEssential = userId === doctorUserId || userId === patientUserId;
    dailyCallRef.current?.setLocalAudio(hostEssential);

    // Reset the timer to start of consultation
    handleTimerReset();

    // Hard cutoff — host broadcasts stop to the whole room at 12 minutes,
    // regardless of whether anyone remembers to click Stop.
    hostStopCutoffRef.current = setTimeout(() => {
      logStatus("12-minute host cutoff fired — broadcasting stop");
      handleStopRecording();
    }, PHASE_DURATIONS.CONSULT * 1000);

    // Start this user's own microphone if they're doctor or patient
    if (userId === doctorUserId) {
      setMyRecordingRole("doctor");
      await startLocalRecording(recordingId, "doctor");
    } else if (userId === patientUserId) {
      setMyRecordingRole("patient");
      await startLocalRecording(recordingId, "patient");
    }
  }

  function handleStopRecording() {
    logStatus("host stopping recording");
    if (hostStopCutoffRef.current) {
      clearTimeout(hostStopCutoffRef.current);
      hostStopCutoffRef.current = null;
    }
    channelRef.current?.send({
      type: "broadcast",
      event: "recording-stop",
      payload: {},
    });
    stopLocalRecording();
    startDebrief();
    if (myRecordingRole === null) {
      // Host is observer — nothing to upload, just update state
      setRecordingState("done");
    }
  }

  async function handleShareReport() {
    if (!room || !recentReportId) return;
    const url = `${window.location.origin}/recordings/${recentReportId}`;
    window.open(url, "_blank");
    const text = `${displayName} shared their report for Station ${stationNumber} → ${url}`;
    const { data } = await supabase
      .from("room_messages")
      .insert({ room_id: room.id, user_id: userId, display_name: displayName, message: text })
      .select("id, created_at")
      .single();
    if (data) {
      setMessages((prev) => [...prev, {
        id: data.id,
        from: displayName,
        fromSelf: true,
        text,
        time: new Date(data.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      }]);
    }
  }

  async function handleCreate() {
    if (stationNumber === null) return;
    setLoading(true);
    const result = await createStudyRoomAction(stationNumber);
    if (result.error) {
      logError("createStudyRoomAction", result.error);
      setJoinError(result.error);
      setLoading(false);
      return;
    }
    logStatus("room created", { roomId: result.roomId });
    const { data } = await supabase
      .from("study_rooms")
      .select("*")
      .eq("id", result.roomId!)
      .single<StudyRoom>();
    if (data) {
      sessionStorage.setItem("studyRoomId", data.id);
      setRoom(data);
    }
    setLoading(false);
  }

  async function handleJoin(code: string) {
    if (!code.trim()) return;
    setLoading(true);
    setJoinError("");
    const result = await joinStudyRoomAction(code.trim());
    if (result.error) {
      logError("joinStudyRoomAction", result.error, { code: code.trim() });
      setJoinError(result.error);
      setLoading(false);
      return;
    }
    logStatus("joined room", { roomId: result.roomId });
    const { data } = await supabase
      .from("study_rooms")
      .select("*")
      .eq("id", result.roomId!)
      .single<StudyRoom>();
    if (data) {
      sessionStorage.setItem("studyRoomId", data.id);
      setRoom(data);
    }
    setLoading(false);
  }

  async function handleLeave() {
    if (!room) return;
    const others = participants.filter((p) => !p.isSelf);
    // Keep the doctor=host invariant when a role-holder leaves.
    if (iAmHost && others.length > 0) {
      // The leaver is the doctor (and therefore host) — hand the doctor/host
      // role to another participant so the room isn't left hostless.
      const newDoctor = others[Math.floor(Math.random() * others.length)].userId;
      const keepPatient = patientUserId && patientUserId !== newDoctor && patientUserId !== userId ? patientUserId : null;
      const result = await setRoomRolesAction(room.id, newDoctor, keepPatient);
      if (!result.error) {
        channelRef.current?.send({ type: "broadcast", event: "host-change", payload: { newHostUserId: newDoctor } });
      }
    } else if (patientUserId === userId && doctorUserId) {
      // The leaver is the patient — clear the patient slot.
      await setRoomRolesAction(room.id, doctorUserId, null);
    }
    await leaveStudyRoomAction(room.id);
    sessionStorage.removeItem("studyRoomId");

    // The session used to be wiped by the panel unmounting on navigation.
    // Now that it persists, leaving is the only reset point — anything left
    // behind here would leak into the next room joined in this tab.
    clearDebriefTimers();
    if (recordingCutoffRef.current) { clearTimeout(recordingCutoffRef.current); recordingCutoffRef.current = null; }
    if (hostStopCutoffRef.current) { clearTimeout(hostStopCutoffRef.current); hostStopCutoffRef.current = null; }
    await leaveDailyCall();
    dailyCallRef.current?.destroy();
    dailyCallRef.current = null;
    // Re-arm the mic prewarm, otherwise the next room joined in this tab gets
    // no warm mic and its permission prompt can outlast the join timeout.
    dailyPrewarmingRef.current = false;

    setRoom(null);
    setParticipants([]);
    setMessages([]);
    setConnectedIds(new Set());
    setHostNameState(null);
    setRecentReportId(null);
    setRecordingState("idle");
    setActiveRecordingId(null);
    setMyRecordingRole(null);
    setRecordingError("");
    setDebriefSecondsLeft(null);
  }

  async function sendChat(raw: string) {
    const text = raw.trim();
    if (!text || !room) return;
    const { data } = await supabase
      .from("room_messages")
      .insert({ room_id: room.id, user_id: userId, display_name: displayName, message: text })
      .select("id, created_at")
      .single();
    if (data) {
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          from: displayName,
          fromSelf: true,
          text,
          time: new Date(data.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }

  // Support/debug handle. Most of what can go wrong with a persistent session
  // (a stale prewarm guard, a cutoff timer left armed, a call object that
  // outlived its room) is invisible in the UI and obvious here.
  if (typeof window !== "undefined") {
    (window as unknown as { __studyRoom?: () => unknown }).__studyRoom = () => ({
      roomId: room?.id ?? null,
      iAmHost,
      stationNumber,
      recordingState,
      myRecordingRole,
      dailyRoomName,
      hasDailyCall: !!dailyCallRef.current,
      prewarmed: dailyPrewarmingRef.current,
      debriefSecondsLeft,
      armed: {
        recordingCutoff: !!recordingCutoffRef.current,
        hostStopCutoff: !!hostStopCutoffRef.current,
      },
      timer: timerStateRef.current,
      participants: participants.length,
    });
  }

  // Rewritten every render so the channel handlers registered once per room
  // always execute against current state rather than the render that built them.
  latest.current = {
    userId,
    iAmHost,
    myRecordingRole,
    applyTimer: (phase, nextTimeLeft, running) => {
      setTimerPhase(phase);
      setTimeLeft(nextTimeLeft);
      setTimerRunning(running);
    },
    followStation,
    refreshParticipants,
    endDebrief,
    startDebrief,
    joinDailyCall,
    leaveDailyCall,
    startLocalRecording,
    stopLocalRecording,
    cancelRecordingDueToDailyFailure,
  };

  const statusValue = useMemo<StudyRoomStatusValue>(
    () => ({
      inRoom: !!room,
      iAmHost,
      roomId: room?.id ?? null,
      hostName: hostNameState,
      isRecordingActive: recordingState === "recording",
      stationNumber,
      registerStation,
    }),
    [room, iAmHost, hostNameState, recordingState, stationNumber, registerStation]
  );

  const timerValue = useMemo<StudyRoomTimerValue>(
    () => ({
      phase: timerPhase,
      timeLeft,
      running: timerRunning,
      isTimerHost: !room || iAmHost,
      locked: recordingState === "recording",
      start: handleTimerStart,
      pause: handleTimerPause,
      skipPreread: handleSkipPreread,
      reset: handleTimerReset,
      tick: handleTick,
      phaseComplete: handlePhaseComplete,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timerPhase, timeLeft, timerRunning, room, iAmHost, recordingState, handleTick]
  );

  const roomValue = useMemo<StudyRoomValue>(
    () => ({
      userId,
      displayName,
      initials,
      room,
      participants,
      connectedIds,
      doctorUserId,
      patientUserId,
      myAssignedRole,
      rolesReady,
      sessionIdle,
      rolesSaving,
      iAmHost,
      loading,
      joinError,
      createRoom: handleCreate,
      joinRoom: handleJoin,
      leaveRoom: handleLeave,
      setRoles: handleSetRoles,
      removeParticipant: handleRemoveParticipant,
      messages,
      sendChat,
      recordingState,
      recordingError,
      setRecordingError,
      clearRecordingError: () => { setRecordingState("idle"); setRecordingError(""); },
      startRecording: handleConfirmRecord,
      stopRecording: handleStopRecording,
      myRecordingRole,
      activeRecordingId,
      dailyConnecting,
      callConnected,
      dailyFailed,
      debriefSecondsLeft,
      endDebrief,
      recentReportId,
      shareRecentReport: handleShareReport,
      showScreenTip,
      dontShowScreenTip,
      setDontShowScreenTip,
      dismissScreenTip,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      userId, displayName, initials, room, participants, connectedIds,
      doctorUserId, patientUserId, myAssignedRole, rolesReady, sessionIdle,
      rolesSaving, iAmHost, loading, joinError, messages, recordingState,
      recordingError, myRecordingRole, activeRecordingId, dailyConnecting,
      callConnected, dailyFailed, debriefSecondsLeft, recentReportId,
      showScreenTip, dontShowScreenTip,
    ]
  );

  return (
    <StudyRoomStatusProvider value={statusValue}>
      <StudyRoomTimerProvider value={timerValue}>
        <StudyRoomValueProvider value={roomValue}>{children}</StudyRoomValueProvider>
      </StudyRoomTimerProvider>
    </StudyRoomStatusProvider>
  );
}
