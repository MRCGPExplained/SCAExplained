"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { retryAiPipelineAction, checkRetryStatusAction } from "./actions";
import { createRecordingLogger } from "@/lib/recording-logger";
import { isPipelineRunning } from "@/lib/recording-state";

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

const POLL_MS = 4000;
const GIVE_UP_MS = 300_000;
/** Long enough to read the result, short enough to re-run without a reload. */
const DONE_LINGER_MS = 8000;

/**
 * What the server's status means to the person watching it.
 *
 * "Running…" for up to five minutes said nothing about whether anything was
 * actually happening, which is the complaint: a re-grade takes a couple of
 * minutes and looked identical to a run that had died. These are the live
 * statuses from lib/recording-state, named in the order they happen in.
 */
function stageLabel(status: string | null | undefined): string {
  switch (status) {
    case "uploading":
      return "Waiting for the audio";
    case "processing":
      return "Transcribing";
    case "grading":
      return "Grading";
    default:
      return "Starting";
  }
}

function elapsedLabel(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}

export default function RetryPipelineButton({
  recordingId,
  hasExistingMark = false,
}: {
  recordingId: string;
  /** Already AI-marked, so re-running replaces the existing grades. Confirm first. */
  hasExistingMark?: boolean;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "running" | "done" | "error">("idle");
  const [stage, setStage] = useState("Starting");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const running = phase === "running";
  const startedAt = useRef(0);

  /*
    The clock ticks on its own interval rather than being read inside the
    poll, so the number moves every second instead of jumping in four-second
    steps. Cleared on unmount, because a refresh re-renders the rows it sits
    in and a stray interval would go on setting state on a component that has
    gone.
  */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(
      () => setSeconds(Math.round((Date.now() - startedAt.current) / 1000)),
      1000
    );
    return () => clearInterval(id);
  }, [running]);

  /*
    Hand the button back after the result has been read.

    The old flow reloaded the page, which reset this on its way past. Nothing
    reloads now, so without this the button stays "Done" until the examiner
    navigates, and a second run is impossible from a page that is otherwise
    perfectly up to date.
  */
  useEffect(() => {
    if (phase !== "done") return;
    const id = setTimeout(() => setPhase("idle"), DONE_LINGER_MS);
    return () => clearTimeout(id);
  }, [phase]);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (hasExistingMark) {
      setConfirming(true);
      return;
    }
    void runPipeline();
  }

  async function runPipeline() {
    setConfirming(false);
    startedAt.current = Date.now();
    setSeconds(0);
    setStage("Starting");
    setPhase("running");
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
    logStatus("pipeline started, polling", { recordingId });

    const deadline = Date.now() + GIVE_UP_MS;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      const { status, hasGrades, aiError } = await checkRetryStatusAction(recordingId);
      logStatus("poll tick", { recordingId, status, hasGrades });

      if (isPipelineRunning(status)) {
        setStage(stageLabel(status));
        continue;
      }
      if (!status) continue;

      /*
        Stopped. Status reads the same on success and on failure, and on a
        re-mark the previous run's grades survive a failed one, so neither
        status nor hasGrades decides this alone. A successful run clears
        ai_error and a failed one sets it, and that pair holds either way.
      */
      if (status === "transcribed") {
        // Only reachable for a take that had no transcript to start with.
        // The pipeline stops here by design and waits for the candidate to
        // spend a grading on it, so this is an outcome rather than a failure.
        logStatus("transcribed, awaiting the candidate's decision", { recordingId });
        setStage("Transcribed");
        setPhase("done");
        router.refresh();
        return;
      }

      if (hasGrades && !aiError) {
        logDuration("retry completed", t0);
        setStage("Done");
        setPhase("done");
        /*
          router.refresh(), not window.location.reload().

          The reload threw the whole page away, which is why it was held back
          a full minute first so the logs could be read, and it cost the
          examiner their scroll position and anything typed into the marking
          form. refresh() re-renders the server components in place: the new
          AI grades appear in the panels above, the form keeps what is in it,
          and nobody is moved anywhere.
        */
        router.refresh();
        return;
      }

      logError("pipeline finished without grades", aiError ?? "no reason recorded", { recordingId });
      setPhase("error");
      setError(aiError ? `Grading failed: ${aiError.slice(0, 160)}` : "Finished but produced no grades.");
      return;
    }

    logStatus("retry poll gave up", { recordingId, waitedSeconds: GIVE_UP_MS / 1000 });
    setPhase("error");
    // Deliberately not "it failed". The run may well still be going; what has
    // run out is this page's patience, and saying so is the honest version.
    setError("Still going after 5 minutes. It may yet finish, so check back shortly.");
  }

  if (phase === "running") {
    return (
      <span className="text-[10px] font-semibold flex items-center gap-1.5" style={{ color: "rgba(51,51,51,0.55)" }}>
        <span style={{ animation: "spin 1.1s linear infinite", display: "inline-flex" }}>
          <RepeatIcon />
        </span>
        {stage}
        <span style={{ color: "rgba(51,51,51,0.35)" }}>{elapsedLabel(seconds)}</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </span>
    );
  }

  if (phase === "done") {
    return (
      <span className="text-[10px] font-semibold" style={{ color: "#166534" }}>
        {stage === "Transcribed"
          ? "Transcribed, awaiting the candidate"
          : `Done in ${elapsedLabel(seconds)}`}
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
        <span className="text-[10px] text-right max-w-[220px] leading-[1.45]" style={{ color: "#B91C1C" }}>
          {error}
        </span>
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
              with a fresh set. Any examiner grades you have entered are not affected, and
              you stay on this page while it runs.
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
                onClick={() => void runPipeline()}
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
