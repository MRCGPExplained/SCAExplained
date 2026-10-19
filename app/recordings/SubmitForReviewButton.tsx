"use client";

import { useState } from "react";
import { submitForReviewAction } from "@/app/case-bank/actions";

export function SubmitForReviewButton({
  recordingId,
  stationTitle,
  creditsRemaining,
}: {
  recordingId: string;
  stationTitle?: string | null;
  // Optional: the list page has the balance loaded already, the single
  // recording page does not and says the cost in its own words instead.
  // Worth saying when we know it, not worth a query when we don't.
  creditsRemaining?: number;
}) {
  const [phase, setPhase] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Spending a review is one-way: there is nothing in the product that
    // gives the credit back, and the button sits directly beside the card
    // you were probably only trying to open. Every other one-way action in
    // this app asks first, with the same native confirm.
    //
    // It names the station because this list can be long and several takes
    // of the same case look alike, and it says what is left so the decision
    // is made with the number in view rather than from memory.
    const what = stationTitle ? `"${stationTitle}"` : "this consultation";
    const left = creditsRemaining === 1 ? "1 review" : `${creditsRemaining} reviews`;
    const ok = window.confirm(
      `Submit ${what} for GP review?\n\n` +
        `This uses one of your GP reviews — you have ${left} left — and cannot be undone.`
    );
    if (!ok) return;

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
