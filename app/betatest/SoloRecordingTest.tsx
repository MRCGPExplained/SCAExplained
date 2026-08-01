"use client";

import { useState, useRef } from "react";
import { startSoloRecordingAction } from "@/app/case-bank/actions";

type Station = { id: string; number: number; title: string; subject: string };

type Phase =
  | { kind: "idle" }
  | { kind: "recording" }
  | { kind: "uploading"; recordingId: string }
  | { kind: "processing"; recordingId: string }
  | { kind: "done"; recordingId: string }
  | { kind: "error"; message: string };

const DARK = "#333333";
const YELLOW = "#F6D44B";

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
    } catch {
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

    timerRef.current = setInterval(() => {
      setElapsed((n) => n + 1);
    }, 1000);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  async function uploadAndSubmit(blob: Blob) {
    if (!selected) return;

    const result = await startSoloRecordingAction({
      stationNumber: selected.number,
      stationTitle: selected.title,
    });

    if (result.error || !result.recordingId) {
      setPhase({ kind: "error", message: result.error ?? "Failed to create recording." });
      return;
    }

    const { recordingId } = result;
    setPhase({ kind: "uploading", recordingId });

    // Upload same blob as both roles
    const uploadRole = async (role: "doctor" | "patient") => {
      const fd = new FormData();
      fd.append("audio", blob, `${role}.webm`);
      const res = await fetch(`/api/recordings/${recordingId}/upload?role=${role}`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(error ?? "Upload failed");
      }
    };

    try {
      // Upload doctor first, then patient (second upload triggers processing)
      await uploadRole("doctor");
      await uploadRole("patient");
    } catch (e: unknown) {
      setPhase({ kind: "error", message: e instanceof Error ? e.message : "Upload failed" });
      return;
    }

    setPhase({ kind: "processing", recordingId });

    // Poll for completion (hobby plan: 60s max, Pro: 5 min)
    poll(recordingId);
  }

  async function poll(recordingId: string) {
    const deadline = Date.now() + 5 * 60 * 1000; // 5 min max
    while (Date.now() < deadline) {
      await sleep(4000);
      try {
        const res = await fetch(`/api/recordings/${recordingId}/status`);
        if (res.ok) {
          const { status } = await res.json();
          if (status === "pending_examiner" || status === "reviewed") {
            setPhase({ kind: "done", recordingId });
            return;
          }
          if (status === "failed") {
            setPhase({ kind: "error", message: "Pipeline failed — check logs." });
            return;
          }
        }
      } catch {
        // transient — keep polling
      }
    }
    // Timed out polling, but recording may still finish
    setPhase({ kind: "done", recordingId });
  }

  function reset() {
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setPhase({ kind: "idle" });
    setElapsed(0);
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
    <div>
      <div className="mb-5">
        <h2 className="font-display font-extrabold text-[20px] mb-1" style={{ color: DARK }}>
          Recording Pipeline Test
        </h2>
        <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.5)" }}>
          Solo test — your audio is uploaded as both doctor and patient, then processed through Deepgram + AI marking.{" "}
          <span style={{ color: "rgba(51,51,51,0.38)" }}>Note: Vercel hobby plan has a 60s processing limit.</span>
        </p>
      </div>

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
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition"
              style={{ background: "rgba(239,68,68,0.12)", color: "#B91C1C", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
              Start Recording
            </button>
          )}

          {phase.kind === "recording" && (
            <>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition"
                style={{ background: "rgba(239,68,68,0.18)", color: "#991B1B", border: "1px solid rgba(239,68,68,0.3)" }}
              >
                <span
                  style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#EF4444" }}
                />
                Stop Recording
              </button>
              <span className="font-mono text-[15px] font-bold" style={{ color: "#EF4444" }}>
                {fmtTime(elapsed)}
              </span>
              <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>
                Speak as both doctor and patient
              </span>
            </>
          )}

          {(phase.kind === "uploading" || phase.kind === "processing") && (
            <div className="flex items-center gap-3">
              <Spinner />
              <span className="text-[13px] font-semibold" style={{ color: "rgba(51,51,51,0.65)" }}>
                {phase.kind === "uploading" ? "Uploading audio…" : "Processing (Deepgram + AI)…"}
              </span>
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
                Error: {phase.message}
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
        <div className="flex items-center gap-3 flex-wrap pt-1">
          {(
            [
              { id: "idle", label: "Record" },
              { id: "uploading", label: "Upload" },
              { id: "processing", label: "AI marking" },
              { id: "done", label: "Done" },
            ] as const
          ).map((step, i, arr) => {
            const active =
              step.id === "idle"
                ? phase.kind === "idle" || phase.kind === "recording"
                : step.id === "done"
                ? phase.kind === "done" || phase.kind === "error"
                : phase.kind === step.id;
            const past =
              step.id === "idle"
                ? false
                : step.id === "uploading"
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
                    color: past
                      ? "#15803d"
                      : active
                      ? "#92400e"
                      : "rgba(51,51,51,0.35)",
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
      </div>
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
