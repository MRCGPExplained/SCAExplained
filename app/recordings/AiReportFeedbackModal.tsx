"use client";

import { useState } from "react";
import { submitAiReportFeedbackAction } from "@/app/case-bank/actions";

const NAVY = "#333333";

export function AiReportFeedbackLink({
  recordingId,
  alreadySubmitted,
}: {
  recordingId: string;
  alreadySubmitted: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(alreadySubmitted);

  if (submitted) {
    return (
      <span className="text-[11.5px]" style={{ color: "#1D4ED8" }}>
        Thanks for your feedback.
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[11.5px] font-semibold underline"
        style={{ background: "none", border: "none", color: "#1D4ED8", cursor: "pointer", padding: 0 }}
      >
        Give feedback on this report
      </button>
      {open && (
        <AiReportFeedbackModal
          recordingId={recordingId}
          onClose={() => setOpen(false)}
          onSubmitted={() => {
            setSubmitted(true);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function AiReportFeedbackModal({
  recordingId,
  onClose,
  onSubmitted,
}: {
  recordingId: string;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [agrees, setAgrees] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (agrees === null) return;
    if (!agrees && !comment.trim()) {
      setError("Please add a comment explaining what you disagree with.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await submitAiReportFeedbackAction(recordingId, agrees, comment);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    onSubmitted();
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-6"
      style={{ background: "rgba(51,51,51,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[440px] rounded-2xl p-7"
        style={{ background: "white", boxShadow: "0 20px 60px rgba(51,51,51,0.25)" }}
      >
        <h2 className="font-bold text-[16px] mb-1" style={{ color: NAVY }}>
          Do you agree with this report?
        </h2>
        <p className="text-[12.5px] mb-4" style={{ color: "rgba(51,51,51,0.55)" }}>
          Your feedback helps us keep the AI grading accurate.
        </p>

        {error && (
          <div
            className="rounded-lg px-3 py-2.5 mb-3 text-[13px]"
            style={{ background: "rgba(239,68,68,0.07)", color: "#B91C1C" }}
          >
            {error}
          </div>
        )}

        <div className="flex gap-2.5 mb-4">
          <button
            type="button"
            onClick={() => setAgrees(true)}
            className="flex-1 rounded-lg py-2.5 text-[13px] font-bold"
            style={{
              background: agrees === true ? "#166534" : "rgba(51,51,51,0.06)",
              color: agrees === true ? "white" : NAVY,
              border: "none",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setAgrees(false)}
            className="flex-1 rounded-lg py-2.5 text-[13px] font-bold"
            style={{
              background: agrees === false ? "#B91C1C" : "rgba(51,51,51,0.06)",
              color: agrees === false ? "white" : NAVY,
              border: "none",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>

        {agrees === false && (
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What do you disagree with? (required)"
            className="w-full rounded-lg px-4 py-3 text-[13px] leading-relaxed resize-y min-h-[100px] mb-4"
            style={{
              border: "1px solid rgba(51,51,51,0.15)",
              color: NAVY,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        )}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
            style={{ background: "rgba(51,51,51,0.06)", border: "none", color: NAVY, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={loading || agrees === null || (agrees === false && !comment.trim())}
            className="flex-1 rounded-lg py-2.5 text-[13px] font-bold transition-opacity"
            style={{
              background: NAVY,
              border: "none",
              color: "white",
              cursor: loading ? "default" : "pointer",
              opacity: loading || agrees === null || (agrees === false && !comment.trim()) ? 0.5 : 1,
            }}
          >
            {loading ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
