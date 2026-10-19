"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
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

  // No mounted flag is needed for the portal below: it is guarded by
  // `asking`, which is false on the server and on the first client render
  // and only becomes true from a click, so `document.body` is never
  // evaluated during SSR and the two renders agree.

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

  const [toppingUp, setToppingUp] = useState(false);
  const [topUpError, setTopUpError] = useState("");

  async function topUp() {
    setToppingUp(true);
    setTopUpError("");
    try {
      const res = await fetch("/api/review-credits/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setTopUpError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setToppingUp(false);
    }
  }

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
      {asking && createPortal(
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
            {/*
              Out of reviews is its own dialog, not the asking dialog with a
              dead button in it. There is nothing to confirm — the server
              would refuse this — so it answers the question the state
              actually raises, which is how to get another one.
            */}
            {noneLeft ? (
              <>
                <h2
                  id="submit-review-heading"
                  className="font-display font-extrabold text-[16px] mb-2"
                  style={{ color: DARK }}
                >
                  No GP reviews left
                </h2>

                <p className="text-[13px] leading-[1.6] mb-4" style={{ color: "rgba(51,51,51,0.65)" }}>
                  You have used all the GP reviews in your programme, so {what} cannot be sent
                  for a GP to read just yet.
                </p>

                <div
                  className="rounded-xl px-3.5 py-3 mb-5 text-[12.5px] leading-[1.55]"
                  style={{ background: "#F9F3D9", color: DARK }}
                >
                  <strong>AI grading carries on as normal.</strong> It is unlimited, so you can
                  keep recording and scoring consultations while you decide.
                </div>

                <div className="flex gap-2.5">
                  {/* Takes the focus in this branch, since there is no
                      confirm button to put it on. */}
                  <button
                    ref={confirmRef}
                    type="button"
                    onClick={() => setAsking(false)}
                    className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
                    style={{ background: "#F4F4F2", border: "none", color: DARK, cursor: "pointer" }}
                  >
                    Close
                  </button>
                  {/* A top-up, not a renewal: it adds reviews and leaves
                      access and its expiry alone. Renewing the whole
                      programme is still offered on the page itself, beside
                      the credit count. */}
                  <button
                    type="button"
                    onClick={topUp}
                    disabled={toppingUp}
                    className="flex-1 rounded-lg py-2.5 text-[13px] font-bold"
                    style={{
                      background: YELLOW,
                      border: "none",
                      color: DARK,
                      cursor: toppingUp ? "default" : "pointer",
                      opacity: toppingUp ? 0.7 : 1,
                    }}
                  >
                    {toppingUp ? "Redirecting…" : "Top up 20 — £50"}
                  </button>
                </div>

                {topUpError && (
                  <p className="text-[12px] text-center mt-3" style={{ color: "#B91C1C" }}>{topUpError}</p>
                )}

                <p className="text-[12px] text-center mt-3.5" style={{ color: "rgba(51,51,51,0.5)" }}>
                  Have a webinar code?{" "}
                  <Link href="/redeem" className="font-semibold no-underline" style={{ color: DARK }}>
                    Redeem it
                  </Link>{" "}
                  for bonus reviews.
                </p>
              </>
            ) : (
              <>
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
                    style={{ background: YELLOW, border: "none", color: DARK, cursor: "pointer" }}
                  >
                    Submit for review
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
