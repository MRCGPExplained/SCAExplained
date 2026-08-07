"use client";

import { useState, useEffect, useRef, useCallback, type MutableRefObject } from "react";
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
} from "../actions";
import type { DailyCall } from "@daily-co/daily-js";
import type { StudyRoom, ChatMessage, TimerPhase } from "@/lib/case-bank-types";
import { PHASE_DURATIONS } from "@/lib/case-bank-types";
import { createRecordingLogger } from "@/lib/recording-logger";
import { uploadRecordingAudio } from "@/lib/upload-recording-audio";

const { logStatus, logError, logDuration } = createRecordingLogger("study-room");

const NAVY = "#1F2937";
const YELLOW = "#F6D44B";
const LIGHT_BG = "#F3F2FB";

function PhoneIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const DAILY_JOIN_TIMEOUT_MS = 5000;

/** Waits for a promise, but never longer than `ms` — used so a slow/failed
 * DailyCo join can delay the synced start briefly without ever blocking it. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | void> {
  return Promise.race([promise, new Promise<void>((resolve) => setTimeout(resolve, ms))]);
}

interface Participant {
  userId: string;
  displayName: string;
  initials: string;
  isHost: boolean;
  isSelf: boolean;
  muted: boolean;
  joinedAt: string;
}

interface StudyRoomProps {
  stationId: string;
  stationNumber: number;
  stationTitle?: string;
  userId: string;
  displayName: string;
  initials: string;
  onTimerSync?: (phase: TimerPhase, timeLeft: number, running: boolean) => void;
  onStationChange?: (stationNumber: number) => void;
  onRoomStatusChange?: (inRoom: boolean, iAmHost: boolean, roomId: string | null, hostName: string | null) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  /** Live timer state, used to lock the doctor/patient dropdowns once a session begins */
  timerPhase?: TimerPhase;
  timerRunning?: boolean;
  timeLeft?: number;
  /** Ref the parent fills so it can call broadcastTimer(phase, timeLeft, running) */
  broadcastTimerRef?: MutableRefObject<((phase: TimerPhase, timeLeft: number, running: boolean) => void) | null>;
  /** Read-only ref the panel reads to re-announce timer state to late-joining guests */
  timerStateRef?: MutableRefObject<{ phase: TimerPhase; timeLeft: number; running: boolean }>;
  onTimerReset?: () => void;
}

export function StudyRoomPanel({
  stationId,
  stationNumber,
  stationTitle,
  userId,
  displayName,
  initials,
  onTimerSync,
  onStationChange,
  onRoomStatusChange,
  onRecordingStateChange,
  broadcastTimerRef,
  timerStateRef,
  onTimerReset,
  timerPhase = "PREREAD",
  timerRunning = false,
  timeLeft = PHASE_DURATIONS.PREREAD,
}: StudyRoomProps) {
  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hostNameState, setHostNameState] = useState<string | null>(null);
  const [hostStation, setHostStation] = useState<number | null>(null);
  // userIds currently connected to the realtime channel (presence) — used to
  // flag a doctor/patient who has dropped out as "(disconnected)".
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [rolesSaving, setRolesSaving] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentHostIdRef = useRef<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  // ── Recording state ──────────────────────────────────────────────────────────
  type RecordingState = "idle" | "starting" | "recording" | "uploading" | "done" | "error";
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
  const [showStartWarning, setShowStartWarning] = useState(false);
  const [stopConfirmMode, setStopConfirmMode] = useState<"stop" | "leave" | null>(null);

  // Doctor and patient come straight from the synced room row. The doctor is
  // always the host.
  const doctorUserId = room?.doctor_user_id ?? null;
  const patientUserId = room?.patient_user_id ?? null;
  const rolesReady = !!doctorUserId && !!patientUserId;

  // ── Post-recording debrief window ──────────────────────────────────────────
  // Recording stops sharp at 12 minutes, but the voice call stays open a bit
  // longer so the two candidates can talk through the station before the
  // room closes — this window is separate from (and outlives) the recording.
  const DEBRIEF_DURATION_SECONDS = 3 * 60;
  const [debriefSecondsLeft, setDebriefSecondsLeft] = useState<number | null>(null);
  const debriefIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debriefTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    onRecordingStateChange?.(recordingState === "recording");
  }, [recordingState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!room) return;
    getMostRecentRecordingForStation(stationNumber).then(setRecentReportId);
  }, [room?.id, stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ref so channel callbacks always read the latest stationNumber without
  // needing the channel effect to re-run (App Router updates props in place)
  const stationNumberRef = useRef(stationNumber);
  useEffect(() => {
    stationNumberRef.current = stationNumber;
  }, [stationNumber]);

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
      .select("id,display_name,initials")
      .in("id", profileIds)
      .returns<{ id: string; display_name: string; initials: string }[]>();

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
  }, [supabase, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // On join/rejoin: seed hostStation, currentHostIdRef, and redirect guest if needed.
  // Timer is NOT restored from DB — it resets to PREREAD on every station change,
  // and live sync happens via broadcast only.
  useEffect(() => {
    if (!room) return;
    currentHostIdRef.current = room.host_user_id;
    if (room.current_station_number) setHostStation(room.current_station_number);
    if (!iAmHost && room.current_station_number && room.current_station_number !== stationNumberRef.current) {
      onStationChange?.(room.current_station_number);
    }
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!room) return;

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

        if (onTimerSync) {
          const phase = updated.timer_phase as TimerPhase;
          let timeLeft: number;
          let running: boolean;

          if (updated.timer_paused_at && updated.timer_paused_remaining !== null) {
            timeLeft = updated.timer_paused_remaining;
            running = false;
          } else if (updated.timer_started_at && !updated.timer_paused_at) {
            const elapsed = Math.floor(
              (Date.now() - new Date(updated.timer_started_at).getTime()) / 1000
            );
            timeLeft = Math.max(0, PHASE_DURATIONS[phase] - elapsed);
            running = true;
          } else {
            timeLeft = PHASE_DURATIONS[phase];
            running = false;
          }

          onTimerSync(phase, timeLeft, running);
        }

        // Station: guests follow host
        const isGuest = updated.host_user_id !== userId;
        if (isGuest && updated.current_station_number && updated.current_station_number !== stationNumberRef.current) {
          onStationChange?.(updated.current_station_number);
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
      if (!iAmHost) {
        onTimerSync?.(phase, timeLeft, running);
      }
    });

    // Presence sync fires whenever anyone joins or leaves — refresh participant
    // list and recompute who is actually connected right now.
    channel.on("presence", { event: "sync" }, () => {
      setConnectedIds(new Set(Object.keys(channel.presenceState())));
      refreshParticipants(room.id);
    });

    // Host re-announces station + timer whenever a new guest joins the channel
    channel.on("presence", { event: "join" }, () => {
      if (!iAmHost) return;
      channel.send({ type: "broadcast", event: "navigate", payload: { stationNumber: stationNumberRef.current } });
      if (timerStateRef?.current) {
        channel.send({ type: "broadcast", event: "timer", payload: timerStateRef.current });
      }
    });

    // Host transfer — update ref immediately so refreshParticipants reads the new host
    channel.on("broadcast", { event: "host-change" }, ({ payload }) => {
      const { newHostUserId } = payload as { newHostUserId: string };
      currentHostIdRef.current = newHostUserId;
      setRoom((prev) => prev ? { ...prev, host_user_id: newHostUserId } : prev);
      refreshParticipants(room.id);
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
      endDebrief();
      setActiveRecordingId(recordingId);
      setRecordingState("starting");
      logStatus("recording-start received", { recordingId, iAmHost, dailyRoom: dailyRoomName ?? null });
      // Non-host participants: join the shared live audio call first (or
      // time out) so the mic recorder starts in sync with it, then start
      // their own mic if they're doctor or patient.
      if (!iAmHost) {
        (async () => {
          let dailyOk = true;
          if (dailyRoomName && dailyRoomUrl) {
            const t0 = Date.now();
            const joined = await withTimeout(joinDailyCall(dailyRoomName, dailyRoomUrl), DAILY_JOIN_TIMEOUT_MS);
            dailyOk = joined === true;
            logDuration(dailyOk ? "guest DailyCo join succeeded" : "guest DailyCo join failed/timed out", t0);
            if (!dailyOk) setDailyFailed(true);
          }
          const amEssential = userId === doctorUserId || userId === patientUserId;
          if (!dailyOk && amEssential) {
            // Voice call is required for this room but failed to connect for
            // me — tell the host so they can cancel and refund, rather than
            // starting my mic recorder into a consult no one can hear.
            logStatus("broadcasting voice-call-failed", { recordingId });
            channelRef.current?.send({ type: "broadcast", event: "voice-call-failed", payload: { recordingId } });
            return;
          }
          setRecordingState("recording");
          logStatus("phase → recording (guest)", { role: userId === doctorUserId ? "doctor" : userId === patientUserId ? "patient" : "observer" });
          // Mute observers during the graded consult — only doctor/patient
          // should be audible. The debrief unmutes everyone again.
          dailyCallRef.current?.setLocalAudio(amEssential);
          if (userId === doctorUserId) {
            setMyRecordingRole("doctor");
            await startLocalRecording(recordingId, "doctor");
          } else if (userId === patientUserId) {
            setMyRecordingRole("patient");
            await startLocalRecording(recordingId, "patient");
          }
        })();
      }
    });

    // Recording: stop signal
    channel.on("broadcast", { event: "recording-stop" }, () => {
      logStatus("recording-stop received");
      stopLocalRecording();
      startDebrief();
      if (myRecordingRole === null) setRecordingState("done");
    });

    // A doctor/patient participant's voice call failed to connect — only the
    // host (who holds the credit) acts on this, cancelling for everyone.
    channel.on("broadcast", { event: "voice-call-failed" }, ({ payload }) => {
      if (!iAmHost) return;
      const { recordingId } = payload as { recordingId: string };
      logStatus("voice-call-failed received (host)", { recordingId });
      cancelRecordingDueToDailyFailure(recordingId);
    });

    // Recording was cancelled (voice call failed for an essential
    // participant) — everyone unwinds back to idle.
    channel.on("broadcast", { event: "recording-cancelled" }, ({ payload }) => {
      const { reason } = payload as { reason?: string };
      logStatus("recording-cancelled received", { reason });
      stopLocalRecording();
      leaveDailyCall();
      setRecordingState("error");
      setRecordingError(reason ?? "Recording was cancelled — the voice call failed to connect.");
      setActiveRecordingId(null);
      setMyRecordingRole(null);
    });

    // Guest listens for host station changes
    channel.on("broadcast", { event: "navigate" }, ({ payload }) => {
      const { stationNumber: target } = payload as { stationNumber: number };
      if (target) setHostStation(target);
      if (!iAmHost && target && target !== stationNumberRef.current) {
        onStationChange?.(target);
      }
    });

    channel.subscribe(async (status) => {
      logStatus("realtime channel status", { status });
      if (status === "SUBSCRIBED") {
        await channel.track({ userId, displayName, initials });
        refreshParticipants(room.id);
        if (iAmHost) {
          channel.send({
            type: "broadcast",
            event: "navigate",
            payload: { stationNumber: stationNumberRef.current },
          });
          // Fill the ref so the parent can trigger timer broadcasts
          if (broadcastTimerRef) {
            broadcastTimerRef.current = (phase, timeLeft, running) => {
              channel.send({ type: "broadcast", event: "timer", payload: { phase, timeLeft, running } });
            };
          }
          // Announce current timer state (covers auto-start and late-joining guests)
          if (timerStateRef?.current) {
            channel.send({ type: "broadcast", event: "timer", payload: timerStateRef.current });
          }
        }
      }
    });

    return () => {
      if (broadcastTimerRef) broadcastTimerRef.current = null;
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify parent when room / host status changes
  useEffect(() => {
    onRoomStatusChange?.(!!room, iAmHost, room?.id ?? null, hostNameState);
  }, [room?.id, iAmHost, hostNameState]); // eslint-disable-line react-hooks/exhaustive-deps

  // When host role transfers to/from this user, wire or clear broadcastTimerRef
  useEffect(() => {
    if (!broadcastTimerRef) return;
    if (iAmHost && channelRef.current) {
      const ch = channelRef.current;
      broadcastTimerRef.current = (phase, timeLeft, running) => {
        ch.send({ type: "broadcast", event: "timer", payload: { phase, timeLeft, running } });
      };
    } else if (!iAmHost) {
      broadcastTimerRef.current = null;
    }
  }, [iAmHost]); // eslint-disable-line react-hooks/exhaustive-deps

  // Host: write current station to DB whenever room loads or station changes.
  // Guests receive it via the postgres_changes UPDATE subscription below.
  useEffect(() => {
    if (!room || !iAmHost) return;
    supabase
      .from("study_rooms")
      .update({ current_station_number: stationNumber })
      .eq("id", room.id);
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-rejoin saved room on mount (survives navigation and panel toggle)
  useEffect(() => {
    const savedId = sessionStorage.getItem("studyRoomId");
    if (!savedId || room) return;
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

  async function getOrCreateDailyCall(): Promise<DailyCall | null> {
    if (dailyCallRef.current) return dailyCallRef.current;
    const DailyIframe = (await import("@daily-co/daily-js")).default;
    const call = DailyIframe.createCallObject({ subscribeToTracksAutomatically: true });
    call.on("track-started", handleDailyTrackStarted as never);
    call.on("track-stopped", handleDailyTrackStopped as never);
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
    if (!room || !iAmHost || !doctorUserId || !patientUserId) return;
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
    setShowStartWarning(false);
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
        logStatus("DailyCo room created", { roomName: dailyRoom.roomName });
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
    onTimerReset?.();

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
    setLoading(true);
    const result = await createStudyRoomAction();
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

  async function handleJoin() {
    if (!joinCode.trim()) return;
    setLoading(true);
    setJoinError("");
    const result = await joinStudyRoomAction(joinCode.trim());
    if (result.error) {
      logError("joinStudyRoomAction", result.error, { code: joinCode.trim() });
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
    setRoom(null);
    setParticipants([]);
    setMessages([]);
  }

  async function sendChat() {
    if (!chatInput.trim() || !room) return;
    const text = chatInput.trim();
    setChatInput("");
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

  const hostName = participants.find((p) => p.isHost)?.displayName ?? "host";

  // ── Not in a room ──────────────────────────────────────────────────────────
  if (!room) {
    return (
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)" }}
      >
        <div className="px-4 py-3" style={{ background: NAVY }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "white" }}>
            Study Room
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            Practice with friends in real time
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {joinError && (
            <div className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.07)", color: "#B91C1C" }}>
              {joinError}
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full rounded-lg py-2.5 text-[13px] font-bold"
            style={{ background: NAVY, border: "none", color: "white", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
          >
            Create Room
          </button>

          <div className="flex gap-1.5">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="Room code"
              maxLength={8}
              className="flex-1 rounded-md px-2.5 py-1.5 text-[12px]"
              style={{ border: "1px solid rgba(31,41,55,0.15)", color: NAVY, background: LIGHT_BG, outline: "none", fontFamily: "monospace" }}
            />
            <button
              onClick={handleJoin}
              disabled={loading || !joinCode.trim()}
              className="rounded-md px-3 py-1.5 text-[12px] font-bold"
              style={{ background: YELLOW, border: "none", color: NAVY, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── In a room ──────────────────────────────────────────────────────────────
  return (
    <>
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(26,27,82,0.10)" }}>
      {/* Header */}
      <div
        className="px-3.5 py-3 flex items-center justify-between"
        style={{ background: NAVY }}
      >
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "white" }}>
            Study Room
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {iAmHost ? "You are navigating" : `${hostName} is navigating`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Recording controls */}
          {recordingState === "idle" && iAmHost && (
            <button
              onClick={() => {
                if (!rolesReady) {
                  setRecordingError("Set both a doctor and a patient before recording.");
                  return;
                }
                setRecordingError("");
                setShowStartWarning(true);
              }}
              disabled={!rolesReady}
              title={rolesReady ? "Record — free AI review, GP review is a separate step afterwards" : "Set a doctor and a patient first"}
              className="text-[10px] px-2 py-1 rounded flex items-center gap-1"
              style={{
                background: "rgba(239,68,68,0.2)",
                color: "#FCA5A5",
                border: "none",
                cursor: rolesReady ? "pointer" : "not-allowed",
                opacity: rolesReady ? 1 : 0.5,
              }}
            >
              ⏺ Record
            </button>
          )}
          {(recordingState === "recording" || recordingState === "starting") && (
            <div className="flex items-center gap-1.5">
              {recordingState === "starting" ? (
                <span className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.4)", animation: "pulse 1.2s infinite" }} />
                  Starting…
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px]" style={{ color: "#FCA5A5" }}>
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.2s infinite" }} />
                  REC
                </span>
              )}
              {dailyConnecting && (
                <span className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <PhoneIcon color="rgba(255,255,255,0.5)" /> Connecting…
                </span>
              )}
              {callConnected && (
                <span className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(134,239,172,0.9)" }}>
                  <PhoneIcon color="rgba(134,239,172,0.9)" /> Call Connected
                </span>
              )}
              {dailyFailed && !callConnected && (
                <span className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <PhoneIcon color="rgba(255,255,255,0.4)" /> Voice call off — connection failed
                </span>
              )}
              {iAmHost && recordingState === "recording" && (
                <button
                  onClick={() => setStopConfirmMode("stop")}
                  className="text-[10px] px-2 py-1 rounded"
                  style={{ background: "rgba(239,68,68,0.25)", color: "#FCA5A5", border: "none", cursor: "pointer" }}
                >
                  Stop
                </button>
              )}
            </div>
          )}
          {recordingState === "uploading" && (
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>Uploading…</span>
          )}
          {recordingState === "done" && (
            <span className="text-[10px]" style={{ color: "rgba(134,239,172,0.8)" }}>✓ Sent for review</span>
          )}
          {debriefSecondsLeft !== null && (
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(96,165,250,0.9)" }}>
                <PhoneIcon color="rgba(96,165,250,0.9)" /> Debrief — call closes in {Math.floor(debriefSecondsLeft / 60)}:{String(debriefSecondsLeft % 60).padStart(2, "0")}
              </span>
              <button
                onClick={endDebrief}
                className="text-[10px] px-2 py-1 rounded"
                style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5", border: "none", cursor: "pointer" }}
              >
                End Call Now
              </button>
            </div>
          )}
          <button
            onClick={() => {
              if (recordingState === "recording" || recordingState === "starting") {
                setStopConfirmMode("leave");
              } else {
                handleLeave();
              }
            }}
            className="text-[10px] px-2 py-1 rounded"
            style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5", border: "none", cursor: "pointer" }}
          >
            Leave
          </button>
        </div>
      </div>
      {recordingError && (
        <div className="px-3.5 py-2 text-[11px] flex items-center justify-between gap-3" style={{ background: "rgba(239,68,68,0.12)", color: "#FCA5A5" }}>
          <span>{recordingError}</span>
          {recordingState === "error" && iAmHost && (
            <button
              onClick={() => { setRecordingState("idle"); setRecordingError(""); }}
              className="shrink-0 font-semibold"
              style={{ background: "none", border: "none", color: "#FCA5A5", textDecoration: "underline", cursor: "pointer" }}
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Roles — anyone can set these while idle; locked once a session starts */}
      <div className="px-3.5 py-3 flex flex-col gap-2.5" style={{ background: "white", borderBottom: "1px solid rgba(26,27,82,0.07)" }}>
        {(["doctor", "patient"] as const).map((role) => {
          const currentId = role === "doctor" ? doctorUserId : patientUserId;
          const disconnected = !!currentId && connectedIds.size > 0 && !connectedIds.has(currentId);
          return (
            <div key={role} className="flex items-center gap-2.5">
              <label className="text-[11px] font-bold uppercase tracking-[0.06em] w-[58px] shrink-0" style={{ color: "rgba(26,27,82,0.5)" }}>
                {role === "doctor" ? "Doctor" : "Patient"}
              </label>
              <select
                value={currentId ?? ""}
                disabled={!sessionIdle || rolesSaving}
                onChange={(e) => {
                  const val = e.target.value || null;
                  if (role === "doctor") {
                    if (!val) return; // doctor is required (and is the host)
                    handleSetRoles(val, patientUserId === val ? null : patientUserId);
                  } else {
                    handleSetRoles(doctorUserId ?? userId, val);
                  }
                }}
                className="flex-1 rounded-lg px-2.5 py-1.5 text-[12.5px]"
                style={{
                  border: "1.5px solid rgba(26,27,82,0.15)",
                  color: NAVY,
                  background: !sessionIdle ? "rgba(26,27,82,0.04)" : LIGHT_BG,
                  outline: "none",
                  fontFamily: "inherit",
                  cursor: !sessionIdle || rolesSaving ? "not-allowed" : "pointer",
                  opacity: !sessionIdle ? 0.7 : 1,
                }}
              >
                <option value="">— None —</option>
                {participants.map((p) => (
                  <option key={p.userId} value={p.userId}>
                    {p.isSelf ? `You (${p.displayName})` : p.displayName}
                  </option>
                ))}
              </select>
              {disconnected && (
                <span className="text-[10px] font-semibold shrink-0" style={{ color: "#B91C1C" }}>
                  disconnected
                </span>
              )}
            </div>
          );
        })}
        {!sessionIdle && (
          <p className="text-[10px]" style={{ color: "rgba(26,27,82,0.4)" }}>
            Roles are locked once the session starts. Reset the timer to change them.
          </p>
        )}
      </div>

      {/* Participants */}
      <div className="py-1.5 px-1.5" style={{ background: "white", borderBottom: "1px solid rgba(26,27,82,0.07)" }}>
        {participants.map((p) => {
          const role =
            p.userId === doctorUserId ? "Doctor" : p.userId === patientUserId ? "Patient" : null;
          const disconnected = connectedIds.size > 0 && !connectedIds.has(p.userId);
          return (
            <div
              key={p.userId}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
              style={{
                background: p.isHost
                  ? "rgba(246,212,75,0.15)"
                  : p.isSelf
                  ? "rgba(59,130,246,0.08)"
                  : "transparent",
              }}
            >
              <div className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: NAVY }}>
                {p.isSelf ? "You" : p.displayName}
                {role && (
                  <span className="text-[9px] px-1 py-0.5 rounded" style={{ background: "rgba(31,41,55,0.12)", color: "rgba(31,41,55,0.5)", fontWeight: 600 }}>
                    {role.toUpperCase()}
                  </span>
                )}
                {disconnected && (
                  <span className="text-[9px] font-semibold" style={{ color: "#B91C1C" }}>(disconnected)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat */}
      <div className="p-3" style={{ background: LIGHT_BG }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "rgba(26,27,82,0.4)" }}>
          Chat
        </div>
        <div className="max-h-[130px] overflow-y-auto flex flex-col gap-2 mb-2.5">
          {messages.map((msg) =>
            msg.from === "System" ? (
              <div key={msg.id} className="text-center py-0.5">
                <span className="text-[10.5px] italic" style={{ color: "rgba(26,27,82,0.38)" }}>
                  {msg.text}
                </span>
              </div>
            ) : (
              <div key={msg.id}>
                <div className="text-[10px] mb-0.5" style={{ color: "rgba(26,27,82,0.4)" }}>
                  <strong style={{ color: msg.fromSelf ? NAVY : "rgba(26,27,82,0.7)" }}>
                    {msg.fromSelf ? "You" : msg.from}
                  </strong>{" "}
                  · {msg.time}
                </div>
                <div className="text-[12px] leading-snug break-words" style={{ color: "rgba(26,27,82,0.8)" }}>
                  {msg.text.split(/(https?:\/\/\S+)/g).map((part, i) =>
                    /^https?:\/\//.test(part) ? (
                      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#2563EB", wordBreak: "break-all" }}>
                        {part}
                      </a>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              </div>
            )
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="flex gap-1.5">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
            placeholder="Message or paste a link…"
            className="flex-1 rounded-lg px-3 py-1.5 text-[12px]"
            style={{ border: "1px solid rgba(26,27,82,0.15)", color: NAVY, background: "white", outline: "none", fontFamily: "inherit" }}
          />
          <button
            onClick={sendChat}
            className="rounded-lg px-3 py-1.5 text-[12px] font-bold"
            style={{ background: NAVY, border: "none", color: "white", cursor: "pointer" }}
          >
            →
          </button>
        </div>
      </div>

      {/* Room code */}
      <div
        className="flex items-center justify-between px-3.5 py-2.5"
        style={{ background: "white", borderTop: "1px solid rgba(26,27,82,0.07)" }}
      >
        <span className="text-[11px]" style={{ color: "rgba(26,27,82,0.4)" }}>Room code</span>
        <span className="font-mono font-bold text-[12px] tracking-[0.08em]" style={{ color: NAVY }}>
          {room.room_code}
        </span>
      </div>

    </div>

    {showStartWarning && (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 px-6"
        style={{ background: "rgba(26,27,82,0.55)" }}
      >
        <div
          className="w-full max-w-[400px] rounded-2xl p-6"
          style={{ background: "white", boxShadow: "0 20px 60px rgba(26,27,82,0.25)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: 20 }}>⚠️</span>
            <h2 className="font-display font-bold text-[15px]" style={{ color: NAVY }}>
              Before you start
            </h2>
          </div>
          <ul className="flex flex-col gap-2.5 mb-6 text-[13px]" style={{ color: "rgba(26,27,82,0.7)" }}>
            <li>• AI review is free and starts immediately — no credit is used yet.</li>
            <li>• The consultation runs for a fixed <strong>12 minutes</strong> and cannot be paused or reset.</li>
            <li>• Recording stops automatically at the 12-minute mark.</li>
            <li>• You can choose to submit for GP review afterwards, which uses 1 credit.</li>
          </ul>

          <div className="flex gap-2.5">
            <button
              onClick={() => setShowStartWarning(false)}
              className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
              style={{ background: LIGHT_BG, border: "none", color: NAVY, cursor: "pointer" }}
            >
              Back
            </button>
            <button
              onClick={() => {
                setShowStartWarning(false);
                handleConfirmRecord();
              }}
              className="flex-1 rounded-lg py-2.5 text-[13px] font-bold"
              style={{ background: "#B91C1C", border: "none", color: "white", cursor: "pointer" }}
            >
              I Understand, Start
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Stop / leave-during-recording confirmation */}
    {stopConfirmMode && (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 px-6"
        style={{ background: "rgba(26,27,82,0.55)" }}
      >
        <div
          className="w-full max-w-[400px] rounded-2xl p-6"
          style={{ background: "white", boxShadow: "0 20px 60px rgba(26,27,82,0.25)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: 20 }}>⚠️</span>
            <h2 className="font-display font-bold text-[15px]" style={{ color: NAVY }}>
              {stopConfirmMode === "leave" ? "Leave and stop recording now?" : "Stop recording now?"}
            </h2>
          </div>
          <p className="text-[13px] mb-6 leading-snug" style={{ color: "rgba(26,27,82,0.7)" }}>
            {stopConfirmMode === "leave"
              ? "Leaving now ends the consultation early for everyone in the room — only what's been recorded so far will be transcribed and AI-reviewed."
              : "If you stop now, the consultation ends early and only what's been recorded so far will be transcribed and AI-reviewed."}
          </p>

          <div className="flex gap-2.5">
            <button
              onClick={() => setStopConfirmMode(null)}
              className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
              style={{ background: LIGHT_BG, border: "none", color: NAVY, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const mode = stopConfirmMode;
                setStopConfirmMode(null);
                handleStopRecording();
                if (mode === "leave") handleLeave();
              }}
              className="flex-1 rounded-lg py-2.5 text-[13px] font-bold"
              style={{ background: "#B91C1C", border: "none", color: "white", cursor: "pointer" }}
            >
              {stopConfirmMode === "leave" ? "Leave & Stop Recording" : "Stop Recording"}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Share Most Recent Report */}
    {recentReportId && (
      <div className="flex justify-center pt-1">
        <button
          onClick={handleShareReport}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 10,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "rgba(26,27,82,0.28)",
            fontFamily: "inherit",
            fontWeight: 600,
            padding: 0,
          }}
        >
          Share Most Recent Report
        </button>
      </div>
    )}

    </>
  );
}
