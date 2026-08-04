"use client";

import { useState } from "react";
import { retryAiPipelineAction, checkRetryStatusAction } from "./actions";

export default function RetryPipelineButton({ recordingId }: { recordingId: string }) {
  const [phase, setPhase] = useState<"idle" | "retrying" | "error">("idle");
  const [error, setError] = useState("");

  async function handleRetry(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPhase("retrying");
    setError("");
    const result = await retryAiPipelineAction(recordingId);
    if (result.error) {
      setPhase("error");
      setError(result.error);
      return;
    }
    fetch(`/api/recordings/${recordingId}/process`, { method: "POST" }).catch(() => {});
    const deadline = Date.now() + 300_000; // 5 min
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 4000));
      const { status } = await checkRetryStatusAction(recordingId);
      if (status === "pending_examiner" || status === "reviewing" || status === "sent") {
        window.location.reload();
        return;
      }
      if (status === "failed") {
        setPhase("error");
        setError("Pipeline failed — check Vercel logs.");
        return;
      }
    }
    setPhase("error");
    setError("Timed out. Try refreshing.");
  }

  if (phase === "retrying") {
    return (
      <span className="text-[10px] font-semibold" style={{ color: "rgba(51,51,51,0.5)" }}>
        Running pipeline…
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleRetry}
        className="text-[10px] font-bold px-2 py-1 rounded"
        style={{ background: "rgba(51,51,51,0.08)", color: "#333333", border: "none", cursor: "pointer" }}
      >
        Run Pipeline Now
      </button>
      {phase === "error" && (
        <span className="text-[10px]" style={{ color: "#B91C1C" }}>{error}</span>
      )}
    </div>
  );
}
