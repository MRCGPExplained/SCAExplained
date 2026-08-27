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

export default function RetryPipelineButton({
  recordingId,
  hasExistingMark = false,
}: {
  recordingId: string;
  /** Already AI-marked — re-running replaces the existing grades, so confirm first. */
  hasExistingMark?: boolean;
}) {
  const [phase, setPhase] = useState<"idle" | "retrying" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (hasExistingMark) {
      setConfirming(true);
      return;
    }
    runPipeline();
  }

  async function runPipeline() {
    setConfirming(false);
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
    // The action itself starts the pipeline server-side (it holds the internal
    // key); nothing to trigger from here.
    logStatus("pipeline started — polling for grades", { recordingId });

    const deadline = Date.now() + 300_000; // 5 min
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 4000));
      const { status, hasGrades, aiError } = await checkRetryStatusAction(recordingId);
      logStatus("poll tick", { recordingId, status, hasGrades });

      // Wait for the run to leave "processing", then judge it. Status is
      // "ai_graded" on success and on failure alike, so it can't be the signal
      // on its own — and on a re-mark the previous grades survive a failed run,
      // so `hasGrades` can't be either. A successful run clears ai_error; a
      // failed one sets it. That combination is reliable in both cases.
      if (status && status !== "processing") {
        if (hasGrades && !aiError) {
          logDuration("retry completed", t0);
          logStatus(`reloading in ${RELOAD_DELAY_MS / 1000}s — leaving the console up to read first`);
          setPhase("done");
          setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
          return;
        }
        logError("pipeline finished without grades", aiError ?? "no reason recorded", { recordingId });
        setPhase("error");
        setError(aiError ? `Grading failed: ${aiError.slice(0, 160)}` : "Finished but produced no grades.");
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
        Running…
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
        onClick={handleClick}
        className="text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1.5"
        style={{ background: "rgba(51,51,51,0.08)", color: "#333333", border: "none", cursor: "pointer" }}
      >
        <RepeatIcon />
        Run AI Pipeline
      </button>
      {phase === "error" && (
        <span className="text-[10px]" style={{ color: "#B91C1C" }}>{error}</span>
      )}

      {confirming && (
        <div
          className="fixed inset-0 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.45)", zIndex: 100 }}
          onClick={() => setConfirming(false)}
        >
          <div
            className="rounded-2xl p-6 max-w-[420px] w-full text-left"
            style={{ background: "white", boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display font-extrabold text-[17px] mb-2" style={{ color: "#333333" }}>
              This attempt already has an AI mark
            </h2>
            <p className="text-[13px] leading-[1.6] mb-5" style={{ color: "rgba(51,51,51,0.6)" }}>
              Running the pipeline again will replace the existing AI grades and comments
              with a fresh set. Any examiner grades you have entered are not affected.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-[13px] font-semibold px-4 py-2 rounded-lg"
                style={{ background: "rgba(51,51,51,0.07)", color: "#333333", border: "none", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={runPipeline}
                className="text-[13px] font-bold px-4 py-2 rounded-lg"
                style={{ background: "#333333", color: "white", border: "none", cursor: "pointer" }}
              >
                Re-mark it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
