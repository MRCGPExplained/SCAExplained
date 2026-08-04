"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { PHASE_DURATIONS } from "@/lib/case-bank-types";
import {
  createStudyRoomAction,
  joinStudyRoomAction,
  startRecordingAction,
} from "@/app/case-bank/actions";

type Station = { id: string; number: number; title: string; subject: string };
type Participant = { user_id: string; display_name: string | null };

type Phase =
  | "setup"
  | "lobby"
  | "recording"
  | "uploading"
  | "processing"
  | "timedout"
  | "done"
  | "error";

const DARK = "#333333";
const YELLOW = "#F6D44B";
const POLL_TIMEOUT_MS = 90_000;
const POLL_INTERVAL_MS = 4_000;

export default function GroupRecordingTest({ stations }: { stations: Station[] }) {
  const supabase = createSupabaseBrowserClient();

  // Auth
  const [userId, setUserId] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);

  // Phase
  const [phase, setPhase] = useState<Phase>("setup");
  const [errMsg, setErrMsg] = useState("");

  // Room
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [joinErr, setJoinErr] = useState("");
  const [busy, setBusy] = useState(false);

  // Participants & assignment
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stationId, setStationId] = useState(stations[0]?.id ?? "");
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [startErr, setStartErr] = useState("");
  const [starting, setStarting] = useState(false);
  const [showStartWarning, setShowStartWarning] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  // Recording
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [myRole, setMyRole] = useState<"doctor" | "patient" | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Refs for use inside async/closure callbacks
  const channelRef = useRef<RealtimeChannel | null>(null);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const roleRef = useRef<"doctor" | "patient" | null>(null);
  const isHostRef = useRef(false);
  const recordingCutoffRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hostStopCutoffRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer via effect so it starts/stops with phase
  useEffect(() => {
    if (phase !== "recording") return;
    setElapsed(0);
    const id = setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Pre-warm mic permission for everyone as soon as they enter the lobby.
  // Stops the tracks immediately — we only need the browser to cache the grant
  // so that launchMediaRecorder can call getUserMedia outside a user gesture.
  useEffect(() => {
    if (phase !== "lobby") return;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => stream.getTracks().forEach((t) => t.stop()))
      .catch(() => {});
  }, [phase]);

  // Load current user once
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); userIdRef.current = user.id; }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh participants list from DB
  const refreshParticipants = useCallback(async (rid: string) => {
    const { data: rows } = await supabase
      .from("room_participants")
      .select("user_id")
      .eq("room_id", rid)
      .returns<{ user_id: string }[]>();

    if (!rows) return;
    const ids = rows.map((r) => r.user_id);

    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("id,display_name")
      .in("id", ids)
      .returns<{ id: string; display_name: string | null }[]>();

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
    setParticipants(ids.map((id) => ({ user_id: id, display_name: profileMap.get(id) ?? null })));
  }, [supabase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Subscribe to room channel whenever roomId is set
  useEffect(() => {
    if (!roomId) return;

    refreshParticipants(roomId);

    const channel = supabase
      .channel(`group-test:${roomId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_participants", filter: `room_id=eq.${roomId}` },
        () => refreshParticipants(roomId),
      )
      .on("broadcast", { event: "recording-start" }, ({ payload }) => {
        const { recordingId: rid, doctorUserId: dId, patientUserId: pId } = payload as {
          recordingId: string;
          doctorUserId: string;
          patientUserId: string;
        };
        const myId = userIdRef.current;
        const role: "doctor" | "patient" | null =
          myId === dId ? "doctor" : myId === pId ? "patient" : null;

        roleRef.current = role;
        setRecordingId(rid);
        setMyRole(role);
        setPhase("recording");

        if (role) launchMediaRecorder(rid, role);
      })
      .on("broadcast", { event: "recording-stop" }, () => {
        if (mrRef.current?.state === "recording") {
          mrRef.current.stop();
          // mr.onstop handles upload → processing
        } else if (!roleRef.current) {
          setPhase("done");
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  function launchMediaRecorder(rid: string, role: "doctor" | "patient") {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        chunksRef.current = [];

        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm";

        const mr = new MediaRecorder(stream, { mimeType });
        mrRef.current = mr;

        mr.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mr.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunksRef.current, { type: mimeType });
          await handleUpload(blob, rid, role);
        };

        mr.start(1000);

        // Hard cutoff — recording never exceeds the 12-minute consult window,
        // regardless of whether the host remembers to stop it.
        recordingCutoffRef.current = setTimeout(() => {
          if (mrRef.current?.state === "recording") mrRef.current.stop();
        }, PHASE_DURATIONS.CONSULT * 1000);
      })
      .catch(() => {
        setPhase("error");
        setErrMsg("Microphone access denied.");
      });
  }

  async function handleUpload(blob: Blob, rid: string, role: "doctor" | "patient") {
    setPhase("uploading");

    const fd = new FormData();
    fd.append("audio", blob, `${role}.webm`);

    try {
      const res = await fetch(`/api/recordings/${rid}/upload?role=${role}`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(body.error ?? "Upload failed");
      }
    } catch (e: unknown) {
      setPhase("error");
      setErrMsg(e instanceof Error ? e.message : "Upload failed");
      return;
    }

    setPhase("processing");

    // Only the doctor fires the process route to avoid double-processing
    if (role === "doctor") {
      fetch(`/api/recordings/${rid}/process`, { method: "POST" }).catch(() => {});
    }

    pollStatus(rid);
  }

  async function pollStatus(rid: string) {
    const deadline = Date.now() + POLL_TIMEOUT_MS;
    while (Date.now() < deadline) {
      await sleep(POLL_INTERVAL_MS);
      try {
        const res = await fetch(`/api/recordings/${rid}/status`);
        if (res.ok) {
          const { status } = await res.json();
          if (status === "pending_examiner" || status === "reviewed") {
            setPhase("done");
            return;
          }
          if (status === "failed") {
            setPhase("error");
            setErrMsg("Pipeline failed — check Vercel logs.");
            return;
          }
        }
      } catch {
        // transient — keep polling
      }
    }
    setPhase("timedout");
  }

  async function handleCreate() {
    setBusy(true);
    setJoinErr("");
    const result = await createStudyRoomAction();
    setBusy(false);
    if (result.error || !result.roomId) {
      setJoinErr(result.error ?? "Failed to create room.");
      return;
    }
    setRoomId(result.roomId);
    setRoomCode(result.roomCode ?? null);
    setIsHost(true);
    isHostRef.current = true;
    setDoctorId("");
    setPatientId("");
    setParticipants([]);
    setPhase("lobby");
  }

  async function handleJoin() {
    if (!joinInput.trim()) return;
    setBusy(true);
    setJoinErr("");
    const result = await joinStudyRoomAction(joinInput.trim());
    setBusy(false);
    if (result.error || !result.roomId) {
      setJoinErr(result.error ?? "Room not found.");
      return;
    }
    setRoomId(result.roomId);
    setIsHost(false);
    isHostRef.current = false;
    setPhase("lobby");
  }

  async function handleStartRecording() {
    const station = stations.find((s) => s.id === stationId);
    if (!station || !roomId) return;
    if (!doctorId || !patientId) {
      setStartErr("Assign both roles before starting.");
      return;
    }
    if (doctorId === patientId) {
      setStartErr("Doctor and patient must be different participants.");
      return;
    }

    setStartErr("");
    setStarting(true);

    const dName = participants.find((p) => p.user_id === doctorId)?.display_name ?? "Doctor";
    const pName = participants.find((p) => p.user_id === patientId)?.display_name ?? "Patient";

    const result = await startRecordingAction({
      roomId,
      stationNumber: station.number,
      stationTitle: station.title,
      doctorUserId: doctorId,
      patientUserId: patientId,
      doctorDisplayName: dName,
      patientDisplayName: pName,
    });

    if (result.error || !result.recordingId) {
      setStartErr(result.error ?? "Failed to start recording.");
      setStarting(false);
      return;
    }

    const rid = result.recordingId;

    // Broadcast to all other participants (host won't receive own broadcast)
    channelRef.current?.send({
      type: "broadcast",
      event: "recording-start",
      payload: { recordingId: rid, doctorUserId: doctorId, patientUserId: patientId },
    });

    // Host transitions manually (doesn't receive own broadcast)
    const role: "doctor" | "patient" | null =
      userId === doctorId ? "doctor" : userId === patientId ? "patient" : null;

    roleRef.current = role;
    setRecordingId(rid);
    setMyRole(role);
    setStarting(false);
    setPhase("recording");

    // Hard cutoff — host broadcasts stop to the whole room at 12 minutes,
    // regardless of whether anyone remembers to click Stop.
    hostStopCutoffRef.current = setTimeout(() => {
      handleStop();
    }, PHASE_DURATIONS.CONSULT * 1000);

    if (role) launchMediaRecorder(rid, role);
  }

  function handleStop() {
    if (hostStopCutoffRef.current) {
      clearTimeout(hostStopCutoffRef.current);
      hostStopCutoffRef.current = null;
    }
    if (recordingCutoffRef.current) {
      clearTimeout(recordingCutoffRef.current);
      recordingCutoffRef.current = null;
    }

    // Broadcast stop to other participants
    channelRef.current?.send({
      type: "broadcast",
      event: "recording-stop",
      payload: {},
    });

    // Stop host's own recorder (if assigned a role)
    if (mrRef.current?.state === "recording") {
      mrRef.current.stop();
    } else {
      // Host is observer — no recorder
      setPhase("done");
    }
  }

  function reset() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    channelRef.current?.unsubscribe();
    channelRef.current = null;
    mrRef.current = null;
    roleRef.current = null;
    isHostRef.current = false;
    setPhase("setup");
    setRoomId(null);
    setRoomCode(null);
    setIsHost(false);
    setParticipants([]);
    setDoctorId("");
    setPatientId("");
    setRecordingId(null);
    setMyRole(null);
    setElapsed(0);
    setJoinInput("");
    setJoinErr("");
    setStartErr("");
    setErrMsg("");
  }

  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── Setup ──────────────────────────────────────────────────────────────────

  if (phase === "setup") {
    return (
      <div
        className="rounded-2xl border bg-white p-6 flex flex-col gap-6"
        style={{ borderColor: "rgba(51,51,51,0.1)" }}
      >
        <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.5)" }}>
          Create a room and share the code with your partner, or enter a code to join an existing room.
        </p>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* Create */}
          <div className="flex-1 flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>
              Host
            </p>
            <button
              onClick={handleCreate}
              disabled={busy}
              className="px-5 py-2.5 rounded-xl text-[14px] font-bold transition self-start"
              style={{
                background: DARK,
                color: "white",
                border: "none",
                cursor: busy ? "default" : "pointer",
                opacity: busy ? 0.6 : 1,
              }}
            >
              {busy ? "Creating…" : "Create Room"}
            </button>
          </div>

          <div
            style={{
              width: 1,
              background: "rgba(51,51,51,0.1)",
              alignSelf: "stretch",
            }}
          />

          {/* Join */}
          <div className="flex-1 flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>
              Participant
            </p>
            <div className="flex gap-2">
              <input
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="ABCD12"
                maxLength={6}
                className="field"
                style={{
                  width: 120,
                  fontFamily: "monospace",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              />
              <button
                onClick={handleJoin}
                disabled={busy || !joinInput.trim()}
                className="px-4 py-2 rounded-xl text-[13px] font-bold transition"
                style={{
                  background: "rgba(51,51,51,0.08)",
                  color: DARK,
                  border: "1px solid rgba(51,51,51,0.12)",
                  cursor: busy || !joinInput.trim() ? "default" : "pointer",
                  opacity: busy || !joinInput.trim() ? 0.5 : 1,
                }}
              >
                {busy ? "Joining…" : "Join"}
              </button>
            </div>
            {joinErr && (
              <p className="text-[12px]" style={{ color: "#B91C1C" }}>
                {joinErr}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Lobby ──────────────────────────────────────────────────────────────────

  if (phase === "lobby") {
    return (
      <>
      <div
        className="rounded-2xl border bg-white p-6 flex flex-col gap-5"
        style={{ borderColor: "rgba(51,51,51,0.1)" }}
      >
        {/* Mic permission notice */}
        <div
          className="rounded-lg px-3.5 py-2.5 text-[12px]"
          style={{ background: "rgba(51,51,51,0.04)", color: "rgba(51,51,51,0.5)", border: "1px solid rgba(51,51,51,0.07)" }}
        >
          🎙 Your browser may ask for microphone access — we&apos;re just prepping permissions in advance so recording starts instantly if you choose to record. Nothing is captured until the host clicks Start.
        </div>

        {/* Room code + leave */}
        <div className="flex items-start gap-4">
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.06em] mb-1"
              style={{ color: "rgba(51,51,51,0.4)" }}
            >
              Room Code — share with your partner
            </p>
            <p
              className="font-mono text-[30px] font-bold tracking-[0.12em]"
              style={{ color: DARK }}
            >
              {roomCode ?? "—"}
            </p>
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={reset}
            className="text-[12px] font-semibold mt-1"
            style={{ color: "rgba(51,51,51,0.4)", background: "none", border: "none", cursor: "pointer" }}
          >
            Leave
          </button>
        </div>

        {/* Participants */}
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.06em] mb-2"
            style={{ color: "rgba(51,51,51,0.4)" }}
          >
            In Room ({participants.length})
          </p>
          {participants.length === 0 ? (
            <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.4)" }}>
              Waiting for participants…
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => (
                <div
                  key={p.user_id}
                  className="px-3 py-1.5 rounded-lg text-[13px] font-semibold"
                  style={{ background: "rgba(51,51,51,0.06)", color: DARK }}
                >
                  {p.display_name ?? p.user_id.slice(0, 8)}
                  {p.user_id === userId && (
                    <span style={{ color: "rgba(51,51,51,0.35)", marginLeft: 4 }}>
                      (you{isHost ? " · host" : ""})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Host controls */}
        {isHost ? (
          <div className="flex flex-col gap-4">
            <div style={{ height: 1, background: "rgba(51,51,51,0.07)" }} />

            {/* Station */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[11px] font-bold uppercase tracking-[0.06em]"
                style={{ color: "rgba(51,51,51,0.45)" }}
              >
                Station
              </label>
              <select
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                className="field"
                style={{ maxWidth: 420 }}
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.number}. {s.title} — {s.subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Role assignment */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] font-bold uppercase tracking-[0.06em]"
                  style={{ color: "rgba(51,51,51,0.45)" }}
                >
                  Doctor (GP Registrar)
                </label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="field"
                  style={{ minWidth: 190 }}
                >
                  <option value="">— select —</option>
                  {participants.map((p) => (
                    <option key={p.user_id} value={p.user_id}>
                      {p.display_name ?? p.user_id.slice(0, 8)}
                      {p.user_id === userId ? " (you)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] font-bold uppercase tracking-[0.06em]"
                  style={{ color: "rgba(51,51,51,0.45)" }}
                >
                  Patient (Simulated)
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="field"
                  style={{ minWidth: 190 }}
                >
                  <option value="">— select —</option>
                  {participants.map((p) => (
                    <option key={p.user_id} value={p.user_id}>
                      {p.display_name ?? p.user_id.slice(0, 8)}
                      {p.user_id === userId ? " (you)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {startErr && (
              <p className="text-[12px]" style={{ color: "#B91C1C" }}>
                {startErr}
              </p>
            )}

            <button
              onClick={() => {
                if (doctorId === patientId) {
                  setStartErr("Doctor and patient must be different participants.");
                  return;
                }
                setStartErr("");
                setShowStartWarning(true);
              }}
              disabled={starting || participants.length < 2 || !doctorId || !patientId}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition self-start"
              style={{
                background: "rgba(239,68,68,0.12)",
                color: "#B91C1C",
                border: "1px solid rgba(239,68,68,0.2)",
                cursor:
                  starting || participants.length < 2 || !doctorId || !patientId
                    ? "default"
                    : "pointer",
                opacity:
                  starting || participants.length < 2 || !doctorId || !patientId ? 0.5 : 1,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#EF4444",
                }}
              />
              {starting ? "Starting…" : "Start Recording"}
            </button>

            {participants.length < 2 && (
              <p className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>
                Need at least 2 participants to start.
              </p>
            )}
          </div>
        ) : (
          <div
            className="rounded-lg px-4 py-3 text-[13px]"
            style={{ background: "rgba(51,51,51,0.04)", color: "rgba(51,51,51,0.5)" }}
          >
            Waiting for the host to assign roles and start the recording…
          </div>
        )}
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
              <h2 className="font-display font-bold text-[15px]" style={{ color: DARK }}>
                Before you start
              </h2>
            </div>
            <ul className="flex flex-col gap-2.5 mb-6 text-[13px]" style={{ color: "rgba(51,51,51,0.7)" }}>
              <li>• This will use <strong>1 recording credit</strong> immediately.</li>
              <li>• The consultation runs for a fixed <strong>12 minutes</strong> and cannot be paused or reset.</li>
              <li>• If stopped early, the credit used is not recoverable.</li>
              <li>• Recording stops automatically at the 12-minute mark.</li>
            </ul>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowStartWarning(false)}
                className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
                style={{ background: "rgba(51,51,51,0.06)", border: "none", color: DARK, cursor: "pointer" }}
              >
                Back
              </button>
              <button
                onClick={() => {
                  setShowStartWarning(false);
                  handleStartRecording();
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
      </>
    );
  }

  // ── Recording ──────────────────────────────────────────────────────────────

  if (phase === "recording") {
    return (
      <>
      <div
        className="rounded-2xl border bg-white p-6 flex flex-col gap-5"
        style={{ borderColor: "rgba(51,51,51,0.1)" }}
      >
        <style>{`@keyframes rec-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#EF4444",
                animation: "rec-pulse 1.5s ease-in-out infinite",
              }}
            />
            <span className="text-[14px] font-bold" style={{ color: "#B91C1C" }}>
              Recording
            </span>
            <span className="font-mono text-[15px] font-bold" style={{ color: "#EF4444" }}>
              {fmtTime(elapsed)}
            </span>
          </div>

          {myRole ? (
            <span
              className="text-[12px] font-bold px-2.5 py-0.5 rounded-md"
              style={{ background: "rgba(51,51,51,0.07)", color: DARK }}
            >
              You: {myRole === "doctor" ? "Doctor (GP Registrar)" : "Patient (Simulated)"}
            </span>
          ) : (
            <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>
              Observer
            </span>
          )}
        </div>

        {isHost && (
          <button
            onClick={() => setShowStopConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition self-start"
            style={{
              background: "rgba(239,68,68,0.18)",
              color: "#991B1B",
              border: "1px solid rgba(239,68,68,0.3)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 2,
                background: "#EF4444",
              }}
            />
            Stop Recording
          </button>
        )}
      </div>

      {showStopConfirm && (
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
              <h2 className="font-display font-bold text-[15px]" style={{ color: DARK }}>
                Stop recording now?
              </h2>
            </div>
            <p className="text-[13px] mb-6 leading-snug" style={{ color: "rgba(51,51,51,0.7)" }}>
              A credit has already been used. If you stop now, the consultation ends early and only what&apos;s been recorded so far will be transcribed and graded.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowStopConfirm(false)}
                className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
                style={{ background: "rgba(51,51,51,0.06)", border: "none", color: DARK, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowStopConfirm(false);
                  handleStop();
                }}
                className="flex-1 rounded-lg py-2.5 text-[13px] font-bold"
                style={{ background: "#B91C1C", border: "none", color: "white", cursor: "pointer" }}
              >
                Stop Recording
              </button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  // ── Uploading / Processing / Timedout / Done / Error ───────────────────────

  return (
    <div
      className="rounded-2xl border bg-white p-6 flex flex-col gap-5"
      style={{ borderColor: "rgba(51,51,51,0.1)" }}
    >
      {(phase === "uploading" || phase === "processing") && (
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="text-[13px] font-semibold" style={{ color: "rgba(51,51,51,0.65)" }}>
            {phase === "uploading" ? "Uploading audio…" : "Processing…"}
          </span>
        </div>
      )}

      {phase === "timedout" && (
        <div className="flex flex-col gap-3">
          <div
            className="rounded-lg px-4 py-3 text-[13px]"
            style={{
              background: "rgba(251,191,36,0.1)",
              border: "1px solid rgba(251,191,36,0.3)",
              color: "#92400e",
            }}
          >
            <strong>Processing timed out.</strong> Recording submitted but AI marking didn&apos;t finish in time.
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {recordingId && (
              <a
                href={`/recordings/${recordingId}`}
                className="px-4 py-2 rounded-xl text-[13px] font-bold no-underline"
                style={{ background: "rgba(51,51,51,0.08)", color: DARK }}
              >
                View Recording →
              </a>
            )}
            <button
              onClick={reset}
              className="text-[12px] font-semibold"
              style={{ color: "rgba(51,51,51,0.4)", background: "none", border: "none", cursor: "pointer" }}
            >
              Test Again
            </button>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[13px] font-semibold" style={{ color: "#15803d" }}>
            Pipeline complete.
          </span>
          {recordingId && (
            <a
              href={`/recordings/${recordingId}`}
              className="px-4 py-2 rounded-xl text-[13px] font-bold no-underline"
              style={{ background: YELLOW, color: DARK }}
            >
              View Report →
            </a>
          )}
          <button
            onClick={reset}
            className="text-[12px] font-semibold"
            style={{ color: "rgba(51,51,51,0.4)", background: "none", border: "none", cursor: "pointer" }}
          >
            Test Again
          </button>
        </div>
      )}

      {phase === "error" && (
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[13px] font-semibold" style={{ color: "#B91C1C" }}>
            {errMsg}
          </span>
          <button
            onClick={reset}
            className="text-[12px] font-semibold"
            style={{ color: "rgba(51,51,51,0.5)", background: "none", border: "none", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="9" cy="9" r="7" stroke="rgba(51,51,51,0.15)" strokeWidth="2" />
      <path d="M9 2a7 7 0 0 1 7 7" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
