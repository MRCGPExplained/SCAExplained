"use client";

import { useState } from "react";
import { retryAiPipelineAction, checkRetryStatusAction } from "./actions";
import { createRecordingLogger } from "@/lib/recording-logger";

const { logStatus, logError, logDuration } = createRecordingLogger("examiner-retry");

function RepeatIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2.1l4 4-4 4" />
      <path d="M3 12.7V12a9 9 0 0 1 15-6.7l3 2.8" />
      <path d="M7 21.9l-4-4 4-4" />
      <path d="M21 11.3V12a9 9 0 0 1-15 6.7l-3-2.8" />
    </svg>
  );
}

// Keeps the console readable for at least this long after success before
// reloading — a reload clears the console, so an instant reload meant the
// final log lines (and everything before them) vanished before anyone could
// read them.
const RELOAD_DELAY_MS = 60_000;

export default function RetryPipelineButton({ recordingId }: { recordingId: string }) {
  const [phase, setPhase] = useState<"idle" | "retrying" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleRetry(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPhase("retrying");
    setError("");
    logStatus("retry requested", { recordingId });
    const t0 = Date.now();

    const result = await retryAiPipelineAction(recordingId);
    if (result.error) {
      logError("retryAiPipelineAction", result.error, { recordingId });
      setPhase("error");
      setError(result.error);
      return;
    }
    logStatus("status reset to processing — triggering pipeline", { recordingId });

    fetch(`/api/recordings/${recordingId}/process`, { method: "POST" }).catch((err) =>
      logError("process trigger (fire-and-forget)", err, { recordingId })
    );

    const deadline = Date.now() + 300_000; // 5 min
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 4000));
      const { status } = await checkRetryStatusAction(recordingId);
      logStatus("poll tick", { recordingId, status });
      if (status === "pending_examiner" || status === "reviewing" || status === "sent") {
        logDuration("retry completed", t0);
        logStatus(`reloading in ${RELOAD_DELAY_MS / 1000}s — leaving the console up to read first`);
        setPhase("done");
        setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
        return;
      }
      if (status === "failed") {
        logError("pipeline status", "failed", { recordingId });
        setPhase("error");
        setError("Pipeline failed — check Vercel logs.");
        return;
      }
    }
    logStatus("retry poll gave up — still processing on the server", { recordingId, waitedSeconds: 300 });
    setPhase("error");
    setError("Timed out. Try refreshing.");
  }

  if (phase === "retrying") {
    return (
      <span className="text-[10px] font-semibold flex items-center gap-1.5" style={{ color: "rgba(51,51,51,0.5)" }}>
        <span style={{ animation: "spin 1.1s linear infinite", display: "inline-flex" }}>
          <RepeatIcon />
        </span>
        Retrying…
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </span>
    );
  }

  if (phase === "done") {
    return (
      <span className="text-[10px] font-semibold" style={{ color: "#166534" }}>
        Done — refreshing shortly…
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleRetry}
        className="text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1.5"
        style={{ background: "rgba(51,51,51,0.08)", color: "#333333", border: "none", cursor: "pointer" }}
      >
        <RepeatIcon />
        Retry AI
      </button>
      {phase === "error" && (
        <span className="text-[10px]" style={{ color: "#B91C1C" }}>{error}</span>
      )}
    </div>
  );
}
