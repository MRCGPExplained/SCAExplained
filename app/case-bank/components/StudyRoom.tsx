"use client";

import { useState, useEffect, useRef, useCallback, type MutableRefObject } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  createStudyRoomAction,
  joinStudyRoomAction,
  leaveStudyRoomAction,
  transferHostAction,
  claimHostAction,
  startRecordingAction,
  getRecordingCreditsAction,
  getRecordingBypassAction,
  getMostRecentRecordingForStation,
  getDailyCoEnabledAction,
  createDailyCallAction,
  getDailyTokenAction,
  endDailyCallAction,
} from "../actions";
import type { DailyCall } from "@daily-co/daily-js";
import type { StudyRoom, ChatMessage, TimerPhase } from "@/lib/case-bank-types";
import { PHASE_DURATIONS } from "@/lib/case-bank-types";

const NAVY = "#1F2937";
const YELLOW = "#F6D44B";
const LIGHT_BG = "#F3F2FB";

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
}: StudyRoomProps) {
  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hostNameState, setHostNameState] = useState<string | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [hostStation, setHostStation] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; userId: string; displayName: string } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentHostIdRef = useRef<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  // ── Recording state ──────────────────────────────────────────────────────────
  type RecordingState = "idle" | "starting" | "recording" | "uploading" | "done" | "error";
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(null);
  const [myRecordingRole, setMyRecordingRole] = useState<"doctor" | "patient" | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [recordingCredits, setRecordingCredits] = useState(0);
  const [recordingBypassed, setRecordingBypassed] = useState(false);
  const [recordingError, setRecordingError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingCutoffRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hostStopCutoffRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const iAmHost = room ? room.host_user_id === userId : false;
  const [recentReportId, setRecentReportId] = useState<string | null>(null);
  const [showStartWarning, setShowStartWarning] = useState(false);
  const [stopConfirmMode, setStopConfirmMode] = useState<"stop" | "leave" | null>(null);

  // ── DailyCo live audio (headless — no visible UI, audio plays in the background) ──
  const [dailyCoEnabled, setDailyCoEnabled] = useState(false);
  const [dailyRoomName, setDailyRoomName] = useState<string | null>(null);
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

  // Close context menu when clicking anywhere outside it
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [contextMenu]);

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

  async function handleTransferHost(targetUserId: string) {
    if (!room) return;
    setContextMenu(null);
    const result = await transferHostAction(room.id, targetUserId);
    if (result.error) return;
    // Update ref first so refreshParticipants reads the new host immediately
    currentHostIdRef.current = targetUserId;
    setRoom((prev) => prev ? { ...prev, host_user_id: targetUserId } : prev);
    channelRef.current?.send({
      type: "broadcast",
      event: "host-change",
      payload: { newHostUserId: targetUserId },
    });
    refreshParticipants(room.id);
  }

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

    // Presence sync fires whenever anyone joins or leaves — refresh participant list immediately
    channel.on("presence", { event: "sync" }, () => {
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
      setActiveRecordingId(recordingId);
      setRecordingState("recording");
      // Non-host participants start their own mic if they're doctor or patient
      if (!iAmHost) {
        if (userId === doctorUserId) {
          setMyRecordingRole("doctor");
          startLocalRecording(recordingId, "doctor");
        } else if (userId === patientUserId) {
          setMyRecordingRole("patient");
          startLocalRecording(recordingId, "patient");
        }
        // Everyone (including observers) joins the shared live audio call
        if (dailyRoomName && dailyRoomUrl) {
          joinDailyCall(dailyRoomName, dailyRoomUrl);
        }
      }
    });

    // Recording: stop signal
    channel.on("broadcast", { event: "recording-stop" }, () => {
      stopLocalRecording();
      leaveDailyCall();
      if (myRecordingRole === null) setRecordingState("done");
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

  // Fetch credits + bypass when joining a room
  useEffect(() => {
    if (!room) return;
    getRecordingCreditsAction().then(setRecordingCredits);
    getRecordingBypassAction().then(setRecordingBypassed);
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

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
    try {
      const call = await getOrCreateDailyCall();
      await call?.startCamera({ startVideoOff: true, startAudioOff: false });
    } catch {
      // best-effort — worst case the permission prompt just happens at join time instead
    }
  }

  async function joinDailyCall(roomName: string, roomUrl: string) {
    try {
      const tokenResult = await getDailyTokenAction(roomName, displayName, iAmHost);
      if ("error" in tokenResult) return;
      const call = await getOrCreateDailyCall();
      if (!call) return;
      setDailyRoomName(roomName);
      await call.join({ url: roomUrl, token: tokenResult.token });
    } catch {
      // best-effort — recording continues locally regardless of live audio
    }
  }

  async function leaveDailyCall() {
    const call = dailyCallRef.current;
    if (call) {
      try {
        await call.leave();
      } catch {
        // best-effort — recording/upload flow doesn't depend on this
      }
    }
    dailyAudioElsRef.current.forEach((el) => el.remove());
    dailyAudioElsRef.current.clear();
    setDailyRoomName(null);
  }

  async function startLocalRecording(recordingId: string, role: "doctor" | "patient") {
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
        stream.getTracks().forEach((t) => t.stop());
        uploadRecording(recordingId, role);
      };
      recorder.start(1000);
      mediaRecorderRef.current = recorder;

      // Hard cutoff — recording never exceeds the 12-minute consult window,
      // regardless of whether the host remembers to stop it.
      recordingCutoffRef.current = setTimeout(() => {
        stopLocalRecording();
      }, PHASE_DURATIONS.CONSULT * 1000);
    } catch {
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
      mediaRecorderRef.current.stop();
    }
  }

  async function uploadRecording(recordingId: string, role: "doctor" | "patient") {
    setRecordingState("uploading");
    try {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("audio", blob, `${role}.webm`);
      const res = await fetch(`/api/recordings/${recordingId}/upload?role=${role}`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      setRecordingState("done");
    } catch {
      setRecordingState("error");
      setRecordingError("Upload failed. Please contact support.");
    }
  }

  async function handleConfirmRecord() {
    if (!room || !iAmHost || !selectedDoctor || !selectedPatient) return;
    if (selectedDoctor === selectedPatient) {
      setRecordingError("Doctor and patient must be different participants.");
      return;
    }
    setShowRoleSelector(false);
    setRecordingState("starting");
    setRecordingError("");

    const doctorPart = participants.find((p) => p.userId === selectedDoctor);
    const patientPart = participants.find((p) => p.userId === selectedPatient);

    const result = await startRecordingAction({
      roomId: room.id,
      stationNumber,
      stationTitle: stationTitle ?? `Station ${stationNumber}`,
      doctorUserId: selectedDoctor,
      patientUserId: selectedPatient,
      doctorDisplayName: doctorPart?.displayName ?? "Doctor",
      patientDisplayName: patientPart?.displayName ?? "Patient",
    });

    if (result.error) {
      setRecordingState("error");
      setRecordingError(result.error);
      return;
    }

    const recordingId = result.recordingId!;
    setActiveRecordingId(recordingId);
    setRecordingState("recording");

    // Start the shared live audio call, if enabled — best-effort, never
    // blocks the recording itself if DailyCo is unavailable.
    let dailyRoom: { roomName: string; roomUrl: string } | null = null;
    if (dailyCoEnabled) {
      const dailyResult = await createDailyCallAction(recordingId);
      if (!("error" in dailyResult)) dailyRoom = dailyResult;
    }

    // Notify all participants via broadcast
    channelRef.current?.send({
      type: "broadcast",
      event: "recording-start",
      payload: {
        recordingId,
        doctorUserId: selectedDoctor,
        patientUserId: selectedPatient,
        dailyRoomName: dailyRoom?.roomName,
        dailyRoomUrl: dailyRoom?.roomUrl,
      },
    });

    if (dailyRoom) joinDailyCall(dailyRoom.roomName, dailyRoom.roomUrl);

    // Reset the timer to start of consultation
    onTimerReset?.();

    // Hard cutoff — host broadcasts stop to the whole room at 12 minutes,
    // regardless of whether anyone remembers to click Stop.
    hostStopCutoffRef.current = setTimeout(() => {
      handleStopRecording();
    }, PHASE_DURATIONS.CONSULT * 1000);

    // Start this user's own microphone if they're doctor or patient
    if (userId === selectedDoctor) {
      setMyRecordingRole("doctor");
      await startLocalRecording(recordingId, "doctor");
    } else if (userId === selectedPatient) {
      setMyRecordingRole("patient");
      await startLocalRecording(recordingId, "patient");
    }

    // Refresh credits + bypass
    getRecordingCreditsAction().then(setRecordingCredits);
    getRecordingBypassAction().then(setRecordingBypassed);
  }

  function handleStopRecording() {
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
    if (iAmHost && dailyRoomName) endDailyCallAction(dailyRoomName);
    leaveDailyCall();
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
      setJoinError(result.error);
      setLoading(false);
      return;
    }
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
      setJoinError(result.error);
      setLoading(false);
      return;
    }
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

  async function handleClaimHost() {
    if (!room) return;
    setShowClaimModal(false);
    const result = await claimHostAction(room.id);
    if (result.error) return;
    currentHostIdRef.current = userId;
    setRoom((prev) => prev ? { ...prev, host_user_id: userId } : prev);
    channelRef.current?.send({
      type: "broadcast",
      event: "host-change",
      payload: { newHostUserId: userId },
    });
    refreshParticipants(room.id);
    // Post system message so everyone sees the change
    const systemText = `${displayName} has taken over as host.`;
    const { data } = await supabase
      .from("room_messages")
      .insert({ room_id: room.id, user_id: userId, display_name: "System", message: systemText })
      .select("id, created_at")
      .single();
    if (data) {
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          from: "System",
          fromSelf: false,
          text: systemText,
          time: new Date(data.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }

  async function handleLeave() {
    if (!room) return;
    // If we're the host and others are present, hand off before leaving
    if (iAmHost) {
      const others = participants.filter(p => !p.isSelf);
      if (others.length > 0) {
        const newHost = others[Math.floor(Math.random() * others.length)];
        const result = await transferHostAction(room.id, newHost.userId);
        if (!result.error) {
          channelRef.current?.send({
            type: "broadcast",
            event: "host-change",
            payload: { newHostUserId: newHost.userId },
          });
        }
      }
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
                setSelectedDoctor(userId);
                setSelectedPatient(participants.find((p) => !p.isSelf)?.userId ?? "");
                setRecordingError("");
                setShowStartWarning(false);
                setShowRoleSelector(true);
              }}
              title={
                recordingBypassed
                  ? "Record (free)"
                  : recordingCredits === 0
                  ? "No recording credits"
                  : `Record (${recordingCredits} credit${recordingCredits !== 1 ? "s" : ""} left)`
              }
              disabled={!recordingBypassed && recordingCredits === 0}
              className="text-[10px] px-2 py-1 rounded flex items-center gap-1"
              style={{
                background: !recordingBypassed && recordingCredits === 0 ? "rgba(255,255,255,0.08)" : "rgba(239,68,68,0.2)",
                color: !recordingBypassed && recordingCredits === 0 ? "rgba(255,255,255,0.3)" : "#FCA5A5",
                border: "none",
                cursor: !recordingBypassed && recordingCredits === 0 ? "not-allowed" : "pointer",
              }}
            >
              ⏺ Record
            </button>
          )}
          {(recordingState === "recording" || recordingState === "starting") && (
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[10px]" style={{ color: "#FCA5A5" }}>
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.2s infinite" }} />
                REC
              </span>
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
        <div className="px-3.5 py-2 text-[11px]" style={{ background: "rgba(239,68,68,0.12)", color: "#FCA5A5" }}>
          {recordingError}
        </div>
      )}

      {/* Participants */}
      <div className="py-1.5 px-1.5" style={{ background: "white", borderBottom: "1px solid rgba(26,27,82,0.07)" }}>
        {participants.map((p) => (
          <div
            key={p.userId}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
            style={{
              background: p.isHost
                ? "rgba(246,212,75,0.15)"
                : p.isSelf
                ? "rgba(59,130,246,0.08)"
                : "transparent",
              cursor: iAmHost && !p.isSelf ? "context-menu" : "default",
            }}
            onContextMenu={iAmHost && !p.isSelf ? (e) => {
              e.preventDefault();
              setContextMenu({ x: e.clientX, y: e.clientY, userId: p.userId, displayName: p.displayName });
            } : undefined}
          >
            <div className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: NAVY }}>
              {p.isSelf ? "You" : p.displayName}
              {p.isHost && (
                <span className="text-[9px] px-1 py-0.5 rounded" style={{ background: "rgba(31,41,55,0.12)", color: "rgba(31,41,55,0.5)", fontWeight: 600 }}>
                  HOST
                </span>
              )}
            </div>
          </div>
        ))}
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

    {/* Role selector modal — host assigns doctor/patient before recording */}
    {showRoleSelector && !showStartWarning && (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 px-6"
        style={{ background: "rgba(26,27,82,0.55)" }}
        onClick={(e) => e.target === e.currentTarget && setShowRoleSelector(false)}
      >
        <div
          className="w-full max-w-[400px] rounded-2xl p-6"
          style={{ background: "white", boxShadow: "0 20px 60px rgba(26,27,82,0.25)" }}
        >
          <h2 className="font-display font-bold text-[15px] mb-1" style={{ color: NAVY }}>
            Start Recording
          </h2>
          <p className="text-[12.5px] mb-5 leading-snug" style={{ color: "rgba(26,27,82,0.55)" }}>
            Assign roles. The consultation timer will reset. 1 credit will be deducted.
          </p>

          <div className="flex flex-col gap-3 mb-5">
            {(["doctor", "patient"] as const).map((role) => (
              <div key={role} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(26,27,82,0.5)" }}>
                  {role === "doctor" ? "Doctor (candidate)" : "Patient (role-player)"}
                </label>
                <select
                  value={role === "doctor" ? selectedDoctor : selectedPatient}
                  onChange={(e) =>
                    role === "doctor"
                      ? setSelectedDoctor(e.target.value)
                      : setSelectedPatient(e.target.value)
                  }
                  className="rounded-lg px-3 py-2 text-[13px]"
                  style={{ border: "1.5px solid rgba(26,27,82,0.15)", color: NAVY, background: LIGHT_BG, outline: "none", fontFamily: "inherit" }}
                >
                  <option value="">— Select —</option>
                  {participants.map((p) => (
                    <option key={p.userId} value={p.userId}>
                      {p.isSelf ? `You (${p.displayName})` : p.displayName}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {recordingError && (
            <p className="text-[12px] text-red-600 mb-3">{recordingError}</p>
          )}

          <div className="flex gap-2.5">
            <button
              onClick={() => setShowRoleSelector(false)}
              className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
              style={{ background: LIGHT_BG, border: "none", color: NAVY, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedDoctor === selectedPatient) {
                  setRecordingError("Doctor and patient must be different participants.");
                  return;
                }
                setRecordingError("");
                setShowStartWarning(true);
              }}
              disabled={!selectedDoctor || !selectedPatient}
              className="flex-1 rounded-lg py-2.5 text-[13px] font-bold"
              style={{
                background: NAVY,
                border: "none",
                color: "white",
                cursor: !selectedDoctor || !selectedPatient ? "not-allowed" : "pointer",
                opacity: !selectedDoctor || !selectedPatient ? 0.5 : 1,
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )}

    {showRoleSelector && showStartWarning && (
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
            <li>• This will use <strong>1 recording credit</strong>{recordingBypassed ? " (waived for you)" : ""} immediately.</li>
            <li>• The consultation runs for a fixed <strong>12 minutes</strong> and cannot be paused or reset.</li>
            <li>• If stopped early, the credit used is not recoverable.</li>
            <li>• Recording stops automatically at the 12-minute mark.</li>
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
              ? "A credit has already been used. Leaving now ends the consultation early for everyone in the room — only what's been recorded so far will be transcribed and graded."
              : "A credit has already been used. If you stop now, the consultation ends early and only what's been recorded so far will be transcribed and graded."}
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

    {/* Claim Host — guests only, sits below the room panel */}
    {!iAmHost && (
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setShowClaimModal(true)}
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
          Claim Host
        </button>
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

    {/* Claim Host modal */}
    {showClaimModal && (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 px-6"
        style={{ background: "rgba(26,27,82,0.5)" }}
        onClick={(e) => e.target === e.currentTarget && setShowClaimModal(false)}
      >
        <div
          className="w-full max-w-[380px] rounded-2xl p-6"
          style={{ background: "white", boxShadow: "0 20px 60px rgba(26,27,82,0.25)" }}
        >
          <h2 className="font-display font-bold text-[15px] mb-2" style={{ color: NAVY }}>
            Claim Host
          </h2>
          <p className="text-[13.5px] leading-[1.7] mb-5" style={{ color: "rgba(26,27,82,0.65)" }}>
            <strong style={{ color: NAVY }}>{hostName}</strong> is the current host. Would you like to assume the role?
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowClaimModal(false)}
              className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
              style={{ background: LIGHT_BG, border: "none", color: NAVY, cursor: "pointer" }}
            >
              Go Back
            </button>
            <button
              onClick={handleClaimHost}
              className="flex-1 rounded-lg py-2.5 text-[13px] font-bold"
              style={{ background: NAVY, border: "none", color: "white", cursor: "pointer" }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Right-click context menu for host transfer */}
    {contextMenu && (
      <div
        style={{
          position: "fixed",
          top: contextMenu.y,
          left: contextMenu.x,
          zIndex: 1000,
          background: "white",
          border: "1px solid rgba(26,27,82,0.12)",
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          padding: 4,
          minWidth: 160,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => handleTransferHost(contextMenu.userId)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "7px 12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            color: NAVY,
            borderRadius: 6,
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,27,82,0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          Make {contextMenu.displayName} host
        </button>
      </div>
    )}
    </>
  );
}
