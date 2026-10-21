"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  requestAiGradingAction,
  requestGpReviewAction,
  discardRecordingAction,
} from "@/app/case-bank/actions";

const DARK = "#333333";
const WASH = "#F9F3D9";

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

  const option = (
    choice: Choice,
    title: string,
    detail: string,
    cost: string,
    primary: boolean,
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
        background: primary ? WASH : "white",
        border: `1px solid ${primary ? "rgba(246,212,75,0.55)" : "rgba(51,51,51,0.12)"}`,
        cursor: anyBusy || disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : anyBusy && busy !== choice ? 0.5 : 1,
      }}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-display font-bold text-[14px]" style={{ color: DARK }}>
          {busy === choice ? "Working…" : title}
        </span>
        <span className="text-[11px] font-semibold shrink-0" style={{ color: "rgba(51,51,51,0.5)" }}>
          {cost}
        </span>
      </span>
      <span className="block text-[12px] leading-[1.5] mt-1" style={{ color: "rgba(51,51,51,0.6)" }}>
        {disabled ? "None left on your plan." : detail}
      </span>
    </button>
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
        <p className="text-[13px] leading-[1.6] mb-4" style={{ color: "rgba(51,51,51,0.65)" }}>
          It has been transcribed, which costs you nothing. What happens to it next is up to you.
        </p>

        <div className="flex flex-col gap-2.5">
          {option(
            "ai",
            "Get AI feedback",
            "Provisional scores and written feedback across the three domains, usually within a couple of minutes.",
            ai === undefined ? "1 grading" : `1 of ${ai}`,
            true,
            ai === 0,
            firstRef
          )}
          {option(
            "gp",
            "Send to a GP",
            "Graded by AI, then read by an experienced GP who verifies the scoring and writes back. Usually within 5 working days.",
            gp === undefined ? "1 review" : `1 of ${gp}`,
            false,
            gp === 0
          )}
          {option(
            "discard",
            "Discard it",
            "Deletes the audio and transcript. Nothing has been charged for this take and nothing will be.",
            "Free",
            false,
            false
          )}
        </div>

        {/*
          A link, not a sentence. This used to read "top up from My Reviews"
          inside the disabled option, where it could not be a link at all: an
          anchor nested in a button is invalid, and the button swallows the
          click anyway. So it named a place and left the reader to find it.
        */}
        {(ai === 0 || gp === 0) && (
          <p className="text-[12px] mt-3" style={{ color: "rgba(51,51,51,0.6)" }}>
            Out of {ai === 0 && gp === 0 ? "both" : ai === 0 ? "AI gradings" : "GP reviews"}?{" "}
            <a href="/recordings?topup=1" className="font-semibold underline" style={{ color: DARK }}>
              Top up from My Reviews
            </a>
            .
          </p>
        )}

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
