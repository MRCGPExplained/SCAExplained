"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const DARK = "#333333";

/**
 * Why a take could not be marked, in words that say what to do about it.
 *
 * All the person got before was a chip reading "Marking failed", which is
 * the one thing they already knew. The pipeline records a real reason on the
 * row; this shows it, and turns the common one into instructions.
 *
 * The commonest by far is a transcript under fifteen words. That gets the
 * word count and nothing else: it is the fact someone needs, and a list of
 * microphone checks under it was a support article in a dialog.
 */
export function MarkingFailedModal({
  reason,
  onClose,
}: {
  reason: string | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const tooShort = !!reason && /too short to grade/i.test(reason);
  const words = reason?.match(/\((\d+) words?\)/)?.[1] ?? null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-[60] px-6"
      style={{ background: "rgba(51,51,51,0.6)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="marking-failed-heading"
        className="w-full max-w-[440px] rounded-2xl p-6"
        style={{ background: "white", boxShadow: "0 20px 60px rgba(51,51,51,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="marking-failed-heading"
          className="font-display font-extrabold text-[17px] mb-2"
          style={{ color: DARK }}
        >
          {tooShort ? "There was almost nothing to mark" : "This take could not be marked"}
        </h2>

        {tooShort ? (
          <p className="text-[13px] leading-[1.6] mb-5" style={{ color: "rgba(51,51,51,0.7)" }}>
            The recording transcribed to {words ? `only ${words} words` : "almost no words"}, which
            is too little to grade.
          </p>
        ) : (
          <>
            <p className="text-[13px] leading-[1.6] mb-3" style={{ color: "rgba(51,51,51,0.7)" }}>
              Marking did not finish. Nothing has been charged for this take.
            </p>
            {reason && (
              <p
                className="text-[12px] leading-[1.55] mb-5 rounded-lg px-3 py-2"
                style={{ background: "rgba(51,51,51,0.05)", color: "rgba(51,51,51,0.65)" }}
              >
                {reason}
              </p>
            )}
          </>
        )}

        {/* Close and nothing else. There is nothing to open: a take that
            could not be marked has no report, and it is not kept in My
            Reviews either. */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="w-full rounded-lg py-2.5 text-[13px] font-semibold"
          style={{ background: "#F4F4F2", border: "none", color: DARK, cursor: "pointer" }}
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
