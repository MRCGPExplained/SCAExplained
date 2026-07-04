"use client";

import { useState } from "react";
import { requestVideoLessonAction } from "../actions";

const NAVY = "#1A1B52";
const LIGHT_BG = "#F3F2FB";

export function VideoRequestModal({
  stationNumber,
  stationTitle,
  stationSubject,
  onClose,
}: {
  stationNumber: number;
  stationTitle: string;
  stationSubject: string;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    const result = await requestVideoLessonAction(stationNumber, stationTitle, stationSubject, text);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setSent(true);
    setTimeout(onClose, 2500);
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-6"
      style={{ background: "rgba(26,27,82,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[460px] rounded-2xl p-7"
        style={{ background: "white", boxShadow: "0 20px 60px rgba(26,27,82,0.25)" }}
      >
        {sent ? (
          <div className="text-center py-5">
            <div className="text-[32px] mb-3">✓</div>
            <div className="font-display font-bold text-[15px] mb-1" style={{ color: NAVY }}>
              Request sent
            </div>
            <div className="text-[13px]" style={{ color: "rgba(26,27,82,0.55)" }}>
              Thanks — this will help me prioritise what to record next.
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-display font-bold text-[16px] mb-1" style={{ color: NAVY }}>
              Request a Video Lesson
            </h2>
            <p className="text-[12.5px] mb-4" style={{ color: "rgba(26,27,82,0.55)" }}>
              Station {stationNumber} — {stationTitle}
            </p>

            {error && (
              <div
                className="rounded-lg px-3 py-2.5 mb-3 text-[13px]"
                style={{ background: "rgba(239,68,68,0.07)", color: "#B91C1C" }}
              >
                {error}
              </div>
            )}

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What are you struggling with? What would you like the video to cover? The more detail, the better."
              className="w-full rounded-lg px-4 py-3 text-[13px] leading-relaxed resize-y min-h-[130px]"
              style={{
                border: "1px solid rgba(26,27,82,0.15)",
                color: NAVY,
                outline: "none",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            />

            <div className="flex gap-2.5 mt-4">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
                style={{ background: LIGHT_BG, border: "none", color: NAVY, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={loading || !text.trim()}
                className="flex-1 rounded-lg py-2.5 text-[13px] font-bold transition-opacity"
                style={{
                  background: NAVY,
                  border: "none",
                  color: "white",
                  cursor: loading || !text.trim() ? "not-allowed" : "pointer",
                  opacity: loading || !text.trim() ? 0.6 : 1,
                }}
              >
                {loading ? "Sending…" : "Send Request"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
