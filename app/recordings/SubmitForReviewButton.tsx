"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { submitForReviewAction } from "@/app/case-bank/actions";

const DARK = "#333333";
const YELLOW = "#F6D44B";

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
  const [asking, setAsking] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // createPortal needs a document, which the server render does not have.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Escape closes it, the same as clicking Cancel. Nothing has happened at
  // this point, so backing out is always the safe default.
  useEffect(() => {
    if (!asking) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAsking(false);
    };
    window.addEventListener("keydown", onKey);
    confirmRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [asking]);

  async function submit() {
    setAsking(false);
    setPhase("submitting");
    setError("");
    try {
      const result = await submitForReviewAction(recordingId);
      if (result.error) {
        setPhase("error");
        setError(result.error);
        return;
      }
      window.location.reload();
    } catch {
      setPhase("error");
      setError("Could not submit. Please try again.");
    }
  }

  const what = stationTitle ? `“${stationTitle}”` : "this consultation";
  const noneLeft = creditsRemaining === 0;

  return (
    <div className="flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => {
          // Spending a review is one-way, and this button sits directly
          // beside a card you were probably only trying to open.
          e.preventDefault();
          e.stopPropagation();
          setAsking(true);
        }}
        disabled={phase === "submitting"}
        className="text-[11px] font-bold px-3 py-1.5 rounded-full"
        style={{
          background: YELLOW,
          color: DARK,
          border: "none",
          cursor: phase === "submitting" ? "default" : "pointer",
          opacity: phase === "submitting" ? 0.7 : 1,
        }}
      >
        {phase === "submitting" ? "Submitting…" : "Submit for GP Review"}
      </button>
      {phase === "error" && (
        <span className="text-[11px]" style={{ color: "#B91C1C" }}>{error}</span>
      )}

      {/*
        Through a portal: this button lives inside the <Link> that wraps the
        whole recording card, and a dialog nested in a link is one stray
        click away from navigating instead of answering. Out at the body it
        also cannot be clipped or out-stacked by the card.

        The shape is the house dialog — the same backdrop, radius, width and
        button row as the "Before you start" confirm in the study group
        panel — in this page's own #333333 rather than the panel's navy.
      */}
      {mounted && asking && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-6"
          style={{ background: "rgba(51,51,51,0.55)" }}
          onClick={() => setAsking(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-review-heading"
            className="w-full max-w-[400px] rounded-2xl p-6"
            style={{ background: "white", boxShadow: "0 20px 60px rgba(51,51,51,0.25)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="submit-review-heading"
              className="font-display font-extrabold text-[16px] mb-2"
              style={{ color: DARK }}
            >
              Submit for GP review?
            </h2>

            <p className="text-[13px] leading-[1.6] mb-4" style={{ color: "rgba(51,51,51,0.65)" }}>
              {what} will be sent to an experienced GP, who verifies the scoring and writes
              feedback on what actually happened in yours. Usually back within 5 working days.
            </p>

            <div
              className="rounded-xl px-3.5 py-3 mb-5 text-[12.5px] leading-[1.55]"
              style={{ background: "#F9F3D9", color: DARK }}
            >
              This uses <strong>one of your GP reviews</strong> and cannot be undone.
              {typeof creditsRemaining === "number" && (
                <>
                  {" "}
                  You have{" "}
                  <strong>
                    {creditsRemaining} review{creditsRemaining === 1 ? "" : "s"}
                  </strong>{" "}
                  left.
                </>
              )}
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setAsking(false)}
                className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
                style={{ background: "#F4F4F2", border: "none", color: DARK, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={submit}
                className="flex-1 rounded-lg py-2.5 text-[13px] font-bold"
                style={{
                  background: noneLeft ? "rgba(51,51,51,0.12)" : YELLOW,
                  border: "none",
                  color: noneLeft ? "rgba(51,51,51,0.45)" : DARK,
                  cursor: noneLeft ? "not-allowed" : "pointer",
                }}
                disabled={noneLeft}
              >
                {noneLeft ? "No reviews left" : "Submit for review"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
