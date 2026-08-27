"use client";

import { useState, useEffect, useRef } from "react";
import { useStudyRoom } from "./study-room/context";

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

/**
 * Presentational only. Every piece of session state lives in StudyRoomProvider,
 * which is mounted in the case-bank layout and therefore survives station
 * navigation. This panel remounts freely with the page; that is cheap now,
 * because it holds nothing but its own transient UI state.
 */
export function StudyRoomPanel() {
  const {
    userId,
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
    createRoom,
    joinRoom,
    leaveRoom,
    setRoles,
    removeParticipant,
    messages,
    sendChat: sendChatMessage,
    recordingState,
    recordingError,
    setRecordingError,
    clearRecordingError,
    startRecording,
    stopRecording,
    dailyConnecting,
    callConnected,
    dailyFailed,
    debriefSecondsLeft,
    endDebrief,
    recentReportId,
    shareRecentReport,
    showScreenTip,
    dontShowScreenTip,
    setDontShowScreenTip,
    dismissScreenTip,
  } = useStudyRoom();

  // Transient UI state — safe to lose on navigation, so it stays local.
  const [chatInput, setChatInput] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [showStartWarning, setShowStartWarning] = useState(false);
  const [stopConfirmMode, setStopConfirmMode] = useState<"stop" | "leave" | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll only the chat pane itself — scrollIntoView would also drag the
    // whole page down to reveal it, since the panel usually sits below the fold.
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Thin wrappers so the markup below reads the same as before the split.
  const handleCreate = createRoom;
  const handleLeave = leaveRoom;
  const handleSetRoles = setRoles;
  const handleRemoveParticipant = removeParticipant;
  const handleStopRecording = stopRecording;
  const handleShareReport = shareRecentReport;
  const handleJoin = () => joinRoom(joinCode);
  const sendChat = () => { const t = chatInput; setChatInput(""); return sendChatMessage(t); };
  const handleConfirmRecord = () => { setShowStartWarning(false); return startRecording(); };

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
              onClick={clearRecordingError}
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
                    const nextDoctor = doctorUserId ?? userId;
                    if (!nextDoctor) return;
                    handleSetRoles(nextDoctor, val);
                  }
                }}
                className="flex-1 min-w-0 rounded-lg px-2.5 py-1.5 text-[12.5px]"
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
                  <option key={p.userId} value={p.userId} disabled={role === "doctor" && p.isGuest}>
                    {p.isSelf ? `You (${p.displayName})` : p.displayName}
                    {role === "doctor" && p.isGuest ? " (guest — can't be doctor)" : ""}
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
          const removable = iAmHost && !p.isSelf;
          return (
            <div
              key={p.userId}
              onContextMenu={
                removable
                  ? (e) => {
                      e.preventDefault();
                      handleRemoveParticipant(p.userId, p.displayName);
                    }
                  : undefined
              }
              title={removable ? "Right-click to remove from room" : undefined}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
              style={{
                background: p.isHost
                  ? "rgba(246,212,75,0.15)"
                  : p.isSelf
                  ? "rgba(59,130,246,0.08)"
                  : "transparent",
                cursor: removable ? "context-menu" : undefined,
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
        <div ref={chatContainerRef} className="max-h-[130px] overflow-y-auto flex flex-col gap-2 mb-2.5">
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

      {/* Room code / invite link */}
      <div
        className="flex items-center justify-between gap-2 flex-wrap px-3.5 py-2.5"
        style={{ background: "white", borderTop: "1px solid rgba(26,27,82,0.07)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] shrink-0" style={{ color: "rgba(26,27,82,0.4)" }}>Room code</span>
          <span className="font-mono font-bold text-[12px] tracking-[0.08em]" style={{ color: NAVY }}>
            {room.room_code}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/room/${room.room_code}`);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
          }}
          className="text-[11px] font-medium shrink-0"
          style={{ background: "none", border: "none", color: linkCopied ? "#166534" : "rgba(26,27,82,0.45)", cursor: "pointer", textDecoration: linkCopied ? "none" : "underline" }}
        >
          {linkCopied ? "Copied!" : "Copy link"}
        </button>
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

    {/* Screen-timeout tip — shown once to the assigned doctor/patient on mobile */}
    {showScreenTip && (
      <div className="fixed inset-0 flex items-center justify-center z-50 px-6" style={{ background: "rgba(26,27,82,0.55)" }}>
        <div className="w-full max-w-[400px] rounded-2xl p-6" style={{ background: "white", boxShadow: "0 20px 60px rgba(26,27,82,0.25)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: 20 }}>📱</span>
            <h2 className="font-display font-bold text-[15px]" style={{ color: NAVY }}>
              You&apos;re the {myAssignedRole === "doctor" ? "Doctor" : "Patient"} for this consultation
            </h2>
          </div>
          <p className="text-[13px] mb-4 leading-snug" style={{ color: "rgba(26,27,82,0.7)" }}>
            Set your device&apos;s screen timeout to <strong>20 minutes or more</strong> so it doesn&apos;t
            lock or go to sleep during the consultation. If the screen sleeps, the recording and timer can
            be interrupted.
          </p>
          <label className="flex items-center gap-2 mb-5 text-[12.5px]" style={{ color: "rgba(26,27,82,0.6)", cursor: "pointer" }}>
            <input type="checkbox" checked={dontShowScreenTip} onChange={(e) => setDontShowScreenTip(e.target.checked)} />
            Don&apos;t show me this message again
          </label>
          <button
            onClick={dismissScreenTip}
            className="w-full rounded-lg py-2.5 text-[13px] font-bold"
            style={{ background: NAVY, border: "none", color: "white", cursor: "pointer" }}
          >
            Got it
          </button>
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
