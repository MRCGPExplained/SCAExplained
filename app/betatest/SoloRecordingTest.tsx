"use client";

import { useState, useRef } from "react";
import { startSoloRecordingAction } from "@/app/case-bank/actions";
import { runMarkingSpikeAction } from "@/app/betatest/actions";
import { uploadRecordingAudio } from "@/lib/upload-recording-audio";
import { logStatus, logError, logDuration } from "./testLogger";

type Station = { id: string; number: number; title: string; subject: string };

type Phase =
  | { kind: "idle" }
  | { kind: "recording" }
  | { kind: "uploading"; recordingId: string }
  | { kind: "processing"; recordingId: string }
  | { kind: "timedout"; recordingId: string }
  | { kind: "done"; recordingId: string }
  | { kind: "error"; message: string };

const DARK = "#333333";
const YELLOW = "#F6D44B";

// Hobby plan kills at 60s; give it 90s then declare timeout
const POLL_TIMEOUT_MS = 90_000;
const POLL_INTERVAL_MS = 4_000;

export default function SoloRecordingTest({ stations }: { stations: Station[] }) {
  const [selectedId, setSelectedId] = useState<string>(stations[0]?.id ?? "");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [elapsed, setElapsed] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const selected = stations.find((s) => s.id === selectedId);

  async function startRecording() {
    if (!selected) return;

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      logError("getUserMedia", err);
      setPhase({ kind: "error", message: "Microphone access denied." });
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];
    setElapsed(0);

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";

    const mr = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      const blob = new Blob(chunksRef.current, { type: mimeType });
      await uploadAndSubmit(blob);
    };

    mr.start(1000);
    setPhase({ kind: "recording" });
    logStatus("recording started");

    timerRef.current = setInterval(() => setElapsed((n) => n + 1), 1000);
  }

  function stopRecording() {
    logStatus("stop requested");
    mediaRecorderRef.current?.stop();
  }

  async function uploadAndSubmit(blob: Blob) {
    if (!selected) return;

    const result = await startSoloRecordingAction({
      stationNumber: selected.number,
      stationTitle: selected.title,
    });

    if (result.error || !result.recordingId) {
      logError("startSoloRecordingAction", result.error);
      setPhase({ kind: "error", message: result.error ?? "Failed to create recording." });
      return;
    }

    const { recordingId } = result;
    logStatus("recording row created", { recordingId });
    setPhase({ kind: "uploading", recordingId });
    const uploadT0 = Date.now();

    const uploadRole = (role: "doctor" | "patient") => uploadRecordingAudio(recordingId, role, blob);

    try {
      await uploadRole("doctor");
      await uploadRole("patient");
      logDuration("upload (doctor + patient tracks)", uploadT0);
    } catch (e: unknown) {
      logError("upload", e, { recordingId });
      setPhase({ kind: "error", message: e instanceof Error ? e.message : "Upload failed" });
      return;
    }

    setPhase({ kind: "processing", recordingId });
    // Fire from the browser — server-side fire-and-forget in the upload route is
    // unreliable on Vercel Hobby (function may be killed before the outbound fetch starts).
    fetch(`/api/recordings/${recordingId}/process`, { method: "POST" }).catch((err) =>
      logError("process trigger (fire-and-forget)", err, { recordingId })
    );
    poll(recordingId);
  }

  async function poll(recordingId: string) {
    const pollStart = Date.now();
    logStatus("polling for grading status", { recordingId });
    const deadline = pollStart + POLL_TIMEOUT_MS;
    while (Date.now() < deadline) {
      await sleep(POLL_INTERVAL_MS);
      try {
        const res = await fetch(`/api/recordings/${recordingId}/status`);
        if (res.ok) {
          const { status } = await res.json();
          logStatus("poll tick", { status });
          if (status === "pending_examiner" || status === "reviewed") {
            logDuration("total processing (upload end → graded)", pollStart);
            setPhase({ kind: "done", recordingId });
            return;
          }
          if (status === "failed") {
            logError("pipeline status", "failed", { recordingId });
            setPhase({ kind: "error", message: "Pipeline failed — check Vercel logs." });
            return;
          }
        } else {
          logStatus("poll request not ok", { httpStatus: res.status });
        }
      } catch (err) {
        // transient network error — keep polling
        logError("poll request (transient, retrying)", err);
      }
    }
    // 90s elapsed and still processing — almost certainly hit the 60s hobby limit
    logStatus("poll gave up — still processing on the server", { waitedSeconds: POLL_TIMEOUT_MS / 1000 });
    setPhase({ kind: "timedout", recordingId });
  }

  function reset() {
    logStatus("session reset");
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setPhase({ kind: "idle" });
    setElapsed(0);
  }

  async function runSpikeMarking() {
    if (!selected) return;
    setPhase({ kind: "processing", recordingId: "pending" });
    logStatus("marking spike starting", { stationId: selected.id });

    const result = await runMarkingSpikeAction({
      stationNumber: selected.number,
      stationTitle: selected.title,
    });

    if (result.error || !result.recordingId) {
      logError("runMarkingSpikeAction", result.error);
      setPhase({ kind: "error", message: result.error ?? "Failed to start spike." });
      return;
    }

    const { recordingId } = result;
    logStatus("spike recording row created", { recordingId });
    setPhase({ kind: "processing", recordingId });

    // Fire the process call from the browser — server-side fire-and-forget is
    // unreliable on Vercel (function may be killed before the outbound fetch runs).
    fetch(`/api/recordings/${recordingId}/process?spike=1`, { method: "POST" }).catch(
      (err) => logError("process trigger (spike, fire-and-forget)", err, { recordingId })
    );

    poll(recordingId);
  }

  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (stations.length === 0) {
    return (
      <div className="rounded-2xl border px-6 py-8 text-center" style={{ borderColor: "rgba(51,51,51,0.1)", background: "white" }}>
        <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.45)" }}>
          No published stations found. Publish at least one station first.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 flex flex-col gap-5" style={{ borderColor: "rgba(51,51,51,0.1)" }}>
      {/* Station picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.45)" }}>
          Station
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={phase.kind !== "idle"}
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

      {/* Control row */}
      <div className="flex items-center gap-4 flex-wrap">
        {phase.kind === "idle" && (
          <>
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition"
              style={{ background: "rgba(239,68,68,0.12)", color: "#B91C1C", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
              Start Recording
            </button>
            <button
              onClick={runSpikeMarking}
              className="px-5 py-2.5 rounded-xl text-[14px] font-bold transition"
              style={{ background: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.6)", border: "1px solid rgba(51,51,51,0.1)" }}
            >
              Test AI marking only →
            </button>
          </>
        )}

        {phase.kind === "recording" && (
          <>
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition"
              style={{ background: "rgba(239,68,68,0.18)", color: "#991B1B", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#EF4444" }} />
              Stop Recording
            </button>
            <span className="font-mono text-[15px] font-bold" style={{ color: "#EF4444" }}>
              {fmtTime(elapsed)}
            </span>
          </>
        )}

        {(phase.kind === "uploading" || phase.kind === "processing") && (
          <div className="flex items-center gap-3">
            <Spinner />
            <span className="text-[13px] font-semibold" style={{ color: "rgba(51,51,51,0.65)" }}>
              {phase.kind === "uploading" ? "Uploading audio…" : "Processing…"}
            </span>
          </div>
        )}

        {phase.kind === "timedout" && (
          <div className="flex flex-col gap-2 w-full">
            <div className="rounded-lg px-4 py-3 text-[13px]" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: "#92400e" }}>
              <strong>Still processing.</strong> AI marking for a full consultation can take a few minutes — your recording was submitted successfully. Check your recordings in a few minutes.
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="/recordings"
                className="px-4 py-2 rounded-xl text-[13px] font-bold no-underline transition"
                style={{ background: "rgba(51,51,51,0.08)", color: DARK }}
              >
                View all recordings
              </a>
              <button
                onClick={reset}
                className="text-[12px] font-semibold"
                style={{ color: "rgba(51,51,51,0.4)", background: "none", border: "none", cursor: "pointer" }}
              >
                Test again
              </button>
            </div>
          </div>
        )}

        {phase.kind === "done" && (
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[13px] font-semibold" style={{ color: "#15803d" }}>
              Pipeline complete.
            </span>
            <a
              href={`/recordings/${phase.recordingId}`}
              className="px-4 py-2 rounded-xl text-[13px] font-bold no-underline transition"
              style={{ background: YELLOW, color: DARK }}
            >
              View Report →
            </a>
            <button
              onClick={reset}
              className="text-[12px] font-semibold"
              style={{ color: "rgba(51,51,51,0.4)", background: "none", border: "none", cursor: "pointer" }}
            >
              Test again
            </button>
          </div>
        )}

        {phase.kind === "error" && (
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[13px] font-semibold" style={{ color: "#B91C1C" }}>
              {phase.message}
            </span>
            <button
              onClick={reset}
              className="text-[12px] font-semibold"
              style={{ color: "rgba(51,51,51,0.5)", background: "none", border: "none", cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Progress steps */}
      {phase.kind !== "timedout" && (
        <div className="flex items-center gap-3 flex-wrap">
          {(
            [
              { id: "idle", label: "Record" },
              { id: "uploading", label: "Upload" },
              { id: "processing", label: "Processing" },
              { id: "done", label: "Done" },
            ] as const
          ).map((step, i, arr) => {
            const active =
              step.id === "idle"
                ? phase.kind === "idle" || phase.kind === "recording"
                : step.id === "done"
                ? phase.kind === "done"
                : phase.kind === step.id;
            const past =
              step.id === "uploading"
                ? phase.kind === "processing" || phase.kind === "done"
                : step.id === "processing"
                ? phase.kind === "done"
                : false;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: past
                      ? "rgba(34,197,94,0.12)"
                      : active
                      ? "rgba(246,212,75,0.25)"
                      : "rgba(51,51,51,0.06)",
                    color: past ? "#15803d" : active ? "#92400e" : "rgba(51,51,51,0.35)",
                  }}
                >
                  {step.label}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ color: "rgba(51,51,51,0.2)", fontSize: 12 }}>→</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="9" cy="9" r="7" stroke="rgba(51,51,51,0.15)" strokeWidth="2" />
      <path d="M9 2a7 7 0 0 1 7 7" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
