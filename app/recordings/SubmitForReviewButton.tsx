"use client";

import { useState } from "react";
import { submitForReviewAction } from "@/app/case-bank/actions";

export function SubmitForReviewButton({ recordingId }: { recordingId: string }) {
  const [phase, setPhase] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPhase("submitting");
    setError("");
    const result = await submitForReviewAction(recordingId);
    if (result.error) {
      setPhase("error");
      setError(result.error);
      return;
    }
    window.location.reload();
  }

  return (
    <div className="flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleClick}
        disabled={phase === "submitting"}
        className="text-[11px] font-bold px-3 py-1.5 rounded-full"
        style={{ background: "#F6D44B", color: "#333333", border: "none", cursor: phase === "submitting" ? "default" : "pointer", opacity: phase === "submitting" ? 0.7 : 1 }}
      >
        {phase === "submitting" ? "Submitting…" : "Submit for GP Review"}
      </button>
      {phase === "error" && (
        <span className="text-[11px]" style={{ color: "#B91C1C" }}>{error}</span>
      )}
    </div>
  );
}
