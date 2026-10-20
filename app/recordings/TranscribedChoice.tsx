"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  requestAiGradingAction,
  requestGpReviewAction,
  discardRecordingAction,
} from "@/app/case-bank/actions";

const DARK = "#333333";
const YELLOW = "#F6D44B";
const WASH = "#F9F3D9";

type Choice = "ai" | "gp" | "discard";

/**
 * The decision a transcribed take waits on.
 *
 * Transcribing is free and happens to everything. Grading costs a credit and
 * a GP review costs twenty minutes of someone there is no more of, so neither
 * happens just because a recording finished. The choice is offered here,
 * which is the first moment the candidate can actually judge whether the take
 * was worth spending anything on.
 *
 * Discard is a real option rather than a tidy-up: a take nobody spoke in, or
 * one that went badly enough to redo, should cost nothing. Only the two that
 * spend something ask for confirmation.
 */
export function TranscribedChoice({
  recordingId,
  stationTitle,
  aiRemaining,
  gpRemaining,
}: {
  recordingId: string;
  stationTitle?: string | null;
  aiRemaining: number;
  gpRemaining: number;
}) {
  const [asking, setAsking] = useState<Choice | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!asking) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) setAsking(null);
    };
    window.addEventListener("keydown", onKey);
    confirmRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [asking, busy]);

  async function run(choice: Choice) {
    setBusy(true);
    setError("");
    try {
      const result =
        choice === "ai"
          ? await requestAiGradingAction(recordingId)
          : choice === "gp"
          ? await requestGpReviewAction(recordingId)
          : await discardRecordingAction(recordingId);
      if (result.error) {
        setError(result.error);
        setBusy(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  const what = stationTitle ? `“${stationTitle}”` : "this consultation";
  const noAi = aiRemaining < 1;
  const noGp = gpRemaining < 1;

  const copy: Record<Choice, { heading: string; body: string; note: string; cta: string }> = {
    ai: {
      heading: "Get AI feedback?",
      body: `${what} will be transcribed into provisional scores and written feedback across the three domains, usually within a couple of minutes.`,
      note: `This uses one of your AI gradings. You have ${aiRemaining} left.`,
      cta: "Grade it",
    },
    gp: {
      heading: "Send to a GP?",
      body: `${what} will be graded by AI and then read by an experienced GP, who verifies the scoring and writes feedback on what actually happened in yours. Usually back within 5 working days.`,
      note: `This uses one of your GP reviews, not an AI grading, and cannot be undone. You have ${gpRemaining} left.`,
      cta: "Send for review",
    },
    discard: {
      heading: "Discard this recording?",
      body: `The audio and transcript for ${what} will be deleted. Nothing has been charged for it and nothing will be.`,
      note: "This cannot be undone.",
      cta: "Discard",
    },
  };

  const btn = (label: string, choice: Choice, kind: "primary" | "ghost" | "quiet") => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setError("");
        setAsking(choice);
      }}
      className="text-[11px] font-bold px-3 py-1.5 rounded-full"
      style={{
        background: kind === "primary" ? YELLOW : kind === "ghost" ? "white" : "transparent",
        color: kind === "quiet" ? "rgba(51,51,51,0.5)" : DARK,
        border: kind === "ghost" ? "1px solid rgba(51,51,51,0.18)" : "none",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  const c = asking ? copy[asking] : null;
  const blocked = asking === "ai" ? noAi : asking === "gp" ? noGp : false;

  return (
    <div className="flex flex-col items-end gap-1.5" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-1.5 flex-wrap justify-end">
        {btn("Get AI feedback", "ai", "primary")}
        {btn("Send to a GP", "gp", "ghost")}
        {btn("Discard", "discard", "quiet")}
      </div>
      {error && !asking && (
        <span className="text-[11px]" style={{ color: "#B91C1C" }}>{error}</span>
      )}

      {asking && c && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-6"
          style={{ background: "rgba(51,51,51,0.55)" }}
          onClick={() => !busy && setAsking(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="choice-heading"
            className="w-full max-w-[420px] rounded-2xl p-6"
            style={{ background: "white", boxShadow: "0 20px 60px rgba(51,51,51,0.25)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="choice-heading" className="font-display font-extrabold text-[16px] mb-2" style={{ color: DARK }}>
              {blocked ? (asking === "ai" ? "No AI gradings left" : "No GP reviews left") : c.heading}
            </h2>

            <p className="text-[13px] leading-[1.6] mb-4" style={{ color: "rgba(51,51,51,0.65)" }}>
              {blocked
                ? asking === "ai"
                  ? "You have used all the AI gradings on your plan. The recording stays here until you top up, and it still costs nothing to discard."
                  : "You have used all the GP reviews on your plan. The recording stays here until you top up, and you can still grade it with AI in the meantime."
                : c.body}
            </p>

            {!blocked && (
              <div className="rounded-xl px-3.5 py-3 mb-5 text-[12.5px] leading-[1.55]" style={{ background: WASH, color: DARK }}>
                {c.note}
              </div>
            )}

            <div className="flex gap-2.5">
              <button
                ref={confirmRef}
                type="button"
                onClick={() => setAsking(null)}
                disabled={busy}
                className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
                style={{ background: "#F4F4F2", border: "none", color: DARK, cursor: busy ? "default" : "pointer" }}
              >
                {blocked ? "Close" : "Cancel"}
              </button>
              {blocked ? (
                <Link
                  href="/recordings#topups"
                  className="flex-1 rounded-lg py-2.5 text-[13px] font-bold no-underline text-center"
                  style={{ background: YELLOW, color: DARK }}
                >
                  Top up
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => run(asking)}
                  disabled={busy}
                  className="flex-1 rounded-lg py-2.5 text-[13px] font-bold"
                  style={{
                    background: asking === "discard" ? "#F4F4F2" : YELLOW,
                    border: asking === "discard" ? "1px solid rgba(185,28,28,0.3)" : "none",
                    color: asking === "discard" ? "#B91C1C" : DARK,
                    cursor: busy ? "default" : "pointer",
                    opacity: busy ? 0.7 : 1,
                  }}
                >
                  {busy ? "Working…" : c.cta}
                </button>
              )}
            </div>

            {error && (
              <p className="text-[12px] text-center mt-3" style={{ color: "#B91C1C" }}>{error}</p>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
