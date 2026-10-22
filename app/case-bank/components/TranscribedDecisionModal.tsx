"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  requestAiGradingAction,
  requestGpReviewAction,
  discardRecordingAction,
} from "@/app/case-bank/actions";

import { TopUpButton } from "@/app/recordings/TopUpButton";

const DARK = "#333333";

type Choice = "ai" | "gp" | "discard";

/**
 * The question a finished consultation asks, in the study room, the moment
 * it has something to ask about.
 *
 * One dialog rather than two. Each option states its own price, so the
 * dialog is the confirmation: a second "are you sure" after choosing
 * between three clearly-costed buttons is a step that teaches nobody
 * anything. Discard is deliberately plain and free; it is the right answer
 * for a take nobody spoke in or one that went badly enough to redo, and
 * neither of those should cost a thing.
 *
 * Only the doctor sees it. They own the recording and the credits, and the
 * server refuses anyone else anyway; the partner sees the stage chip.
 */
export function TranscribedDecisionModal({
  recordingId,
  onClose,
}: {
  recordingId: string;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState<Choice | null>(null);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState<{ aiRemaining: number; gpRemaining: number } | null>(null);
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/me/credits")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d) setCredits(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) onClose(); };
    window.addEventListener("keydown", onKey);
    firstRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  async function run(choice: Choice) {
    setBusy(choice);
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
        setBusy(null);
        return;
      }
      // The poller picks the new status up on its next tick and moves the
      // chip on by itself, so there is nothing to reload.
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(null);
    }
  }

  const ai = credits?.aiRemaining;
  const gp = credits?.gpRemaining;
  const anyBusy = busy !== null;

  /**
   * One row per choice. Colour says whether it can be picked, not which one
   * we would prefer: white when it is available, grey when the balance is
   * empty, and a red wash on discard because that one destroys something.
   * The highlight used to sit on "Get AI feedback", which recommended a
   * choice the person is being asked to make.
   */
  const option = (
    choice: Choice,
    title: string,
    detail: string,
    cost: string | null,
    destructive: boolean,
    disabled: boolean,
    ref?: React.Ref<HTMLButtonElement>
  ) => (
    <button
      ref={ref}
      type="button"
      onClick={() => run(choice)}
      disabled={anyBusy || disabled}
      className="w-full text-left rounded-xl px-4 py-3 transition-opacity"
      style={{
        background: destructive ? "rgba(239,68,68,0.07)" : "white",
        border: `1px solid ${destructive ? "rgba(239,68,68,0.25)" : "rgba(51,51,51,0.12)"}`,
        cursor: anyBusy || disabled ? "default" : "pointer",
        opacity: anyBusy && busy !== choice ? 0.5 : 1,
      }}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-display font-bold text-[14px]" style={{ color: DARK }}>
          {busy === choice ? "Working…" : title}
        </span>
        {cost !== null && (
          <span className="text-[11px] font-semibold shrink-0" style={{ color: "rgba(51,51,51,0.5)" }}>
            {cost}
          </span>
        )}
      </span>
      <span className="block text-[12px] leading-[1.5] mt-1" style={{ color: "rgba(51,51,51,0.6)" }}>
        {detail}
      </span>
    </button>
  );

  /**
   * The same row for a meter that has run out, as a div rather than a button.
   *
   * It used to be the button, greyed and inert, with the way out of the
   * situation printed as a footnote under all three rows. The row knows what
   * is wrong with it, so it carries the fix: an empty balance is the one
   * moment the price list is worth seeing. A div because the trigger is
   * itself a button, and a button inside a button is invalid and swallows
   * the click.
   */
  const emptyOption = (title: string, cost: string) => (
    <div
      className="w-full text-left rounded-xl px-4 py-3"
      style={{ background: "white", border: "1px solid rgba(51,51,51,0.12)" }}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-display font-bold text-[14px]" style={{ color: DARK }}>
          {title}
        </span>
        <span className="text-[11px] font-semibold shrink-0" style={{ color: "rgba(51,51,51,0.5)" }}>
          {cost}
        </span>
      </span>
      <span className="block text-[12px] leading-[1.5] mt-1" style={{ color: "rgba(51,51,51,0.6)" }}>
        None left on this plan. Please <TopUpButton variant="link" label="top up" />.
      </span>
    </div>
  );

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-[60] px-6"
      style={{ background: "rgba(51,51,51,0.6)" }}
      onClick={() => !anyBusy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="decide-heading"
        className="w-full max-w-[440px] rounded-2xl p-6"
        style={{ background: "white", boxShadow: "0 20px 60px rgba(51,51,51,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="decide-heading" className="font-display font-extrabold text-[17px] mb-1.5" style={{ color: DARK }}>
          Consultation recorded
        </h2>
        <div className="flex flex-col gap-2.5">
          {ai === 0
            ? emptyOption("Get AI feedback", "1 of 0")
            : option(
                "ai",
                "Get AI feedback",
                "Provisional scores and written feedback across the three domains, usually within a couple of minutes.",
                ai === undefined ? "1 grading" : `1 of ${ai}`,
                false,
                false,
                firstRef
              )}
          {gp === 0
            ? emptyOption("Send to a GP", "1 of 0")
            : option(
                "gp",
                "Send to a GP",
                "Graded by AI, then read by an experienced GP who verifies the scoring and writes back. Usually within 5 working days.",
                gp === undefined ? "1 review" : `1 of ${gp}`,
                false,
                false
              )}
          {option(
            "discard",
            "Discard it",
            "Deletes this audio and transcript.",
            null,
            true,
            false
          )}
        </div>

        {/*
          A link, not a sentence. This used to read "top up from My Reviews"
          inside the disabled option, where it could not be a link at all: an
          anchor nested in a button is invalid, and the button swallows the
          click anyway. So it named a place and left the reader to find it.
        */}
        {error && (
          <p className="text-[12px] text-center mt-3" style={{ color: "#B91C1C" }}>{error}</p>
        )}

        <button
          type="button"
          onClick={onClose}
          disabled={anyBusy}
          className="w-full text-[12px] mt-4"
          style={{ background: "none", border: "none", color: "rgba(51,51,51,0.5)", cursor: anyBusy ? "default" : "pointer" }}
        >
          Decide later, it will be waiting in My Reviews
        </button>
      </div>
    </div>,
    document.body
  );
}
