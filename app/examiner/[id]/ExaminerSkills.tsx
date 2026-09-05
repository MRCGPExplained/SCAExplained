"use client";

import { useState, useTransition } from "react";
import { saveExaminerSkillsAction } from "../actions";
import type { SkillAnswer, SkillRating } from "@/lib/skill-framework";

const NAVY = "#333333";

const RATINGS: { value: SkillRating; label: string; color: string; bg: string }[] = [
  { value: "good", label: "Good", color: "#166534", bg: "rgba(34,197,94,0.12)" },
  { value: "needs_improvement", label: "Needs Improvement", color: "#92400E", bg: "rgba(245,158,11,0.14)" },
  { value: "not_assessable", label: "Not Assessable", color: "rgba(51,51,51,0.55)", bg: "rgba(51,51,51,0.08)" },
];

export default function ExaminerSkills({
  recordingId,
  aiSkills,
  examinerSkills,
  labels,
  disabled,
}: {
  recordingId: string;
  aiSkills: SkillAnswer[];
  examinerSkills: SkillAnswer[] | null;
  labels: Record<string, string>;
  disabled: boolean;
}) {
  // The AI's answers are the starting point, not a separate thing to merge:
  // an examiner edits what is there rather than filling in a blank form.
  const [rows, setRows] = useState<SkillAnswer[]>(() => {
    if (!examinerSkills?.length) return aiSkills;
    const edited = new Map(examinerSkills.map((s) => [s.skill, s]));
    return aiSkills.map((s) => edited.get(s.skill) ?? s);
  });

  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  function update(i: number, patch: Partial<SkillAnswer>) {
    setRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)));
    setDirty(true);
    setSaved(false);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await saveExaminerSkillsAction(recordingId, rows);
      if (res.error) setError(res.error);
      else {
        setSaved(true);
        setDirty(false);
      }
    });
  }

  if (!aiSkills.length) return null;

  return (
    <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}>
      <div className="px-5 pt-5 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>
            Skills Assessment
          </div>
          <p className="text-[12px] m-0 mt-1" style={{ color: "rgba(51,51,51,0.45)" }}>
            {examinerSkills?.length
              ? "Edited by a GP. The candidate sees your version."
              : "As the AI answered them. Anything you change here replaces it on the report."}
          </p>
        </div>
        {!disabled && (
          <div className="flex items-center gap-3">
            {error && <span className="text-[12px]" style={{ color: "#B91C1C" }}>{error}</span>}
            {saved && !dirty && <span className="text-[12px]" style={{ color: "#166534" }}>Saved</span>}
            <button
              type="button"
              onClick={save}
              disabled={pending || !dirty}
              className="px-4 py-1.5 rounded-lg text-[12.5px] font-semibold text-white disabled:opacity-40"
              style={{ background: NAVY, border: "none", cursor: pending || !dirty ? "default" : "pointer" }}
            >
              {pending ? "Saving…" : "Save skills"}
            </button>
          </div>
        )}
      </div>

      <div className="px-5 pb-5 pt-4 flex flex-col gap-3">
        {rows.map((s, i) => {
          const original = aiSkills.find((a) => a.skill === s.skill);
          const changed =
            original &&
            (original.rating !== s.rating ||
              (original.comment ?? "") !== (s.comment ?? "") ||
              (original.improvement ?? "") !== (s.improvement ?? ""));

          return (
            <div
              key={s.skill}
              className="rounded-xl px-4 py-3"
              style={{
                background: "rgba(51,51,51,0.02)",
                border: `1px solid ${changed ? "rgba(99,102,241,0.35)" : "rgba(51,51,51,0.07)"}`,
              }}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                <span className="text-[13.5px] font-semibold" style={{ color: NAVY }}>
                  {labels[s.skill] ?? s.skill}
                  {changed && (
                    <span className="text-[10px] font-bold ml-2 px-2 py-0.5 rounded-full uppercase tracking-[0.04em]" style={{ background: "rgba(99,102,241,0.1)", color: "#4338CA" }}>
                      Changed
                    </span>
                  )}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {RATINGS.map((r) => {
                    const on = s.rating === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        disabled={disabled}
                        onClick={() => update(i, { rating: r.value })}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.04em] transition"
                        style={{
                          background: on ? r.bg : "transparent",
                          color: on ? r.color : "rgba(51,51,51,0.35)",
                          border: `1px solid ${on ? r.color : "rgba(51,51,51,0.15)"}`,
                          cursor: disabled ? "default" : "pointer",
                        }}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <textarea
                value={s.comment ?? ""}
                disabled={disabled}
                onChange={(e) => update(i, { comment: e.target.value })}
                rows={3}
                placeholder="Comment shown to the candidate…"
                className="w-full rounded-lg px-3 py-2 text-[13px] leading-relaxed outline-none focus:border-navy/50"
                style={{ border: "1px solid rgba(51,51,51,0.15)", background: "white" }}
              />

              {/* Only meaningful on a Needs Improvement, which is the only
                  rating the report renders a "Next time" line for. */}
              {s.rating === "needs_improvement" && (
                <textarea
                  value={s.improvement ?? ""}
                  disabled={disabled}
                  onChange={(e) => update(i, { improvement: e.target.value })}
                  rows={2}
                  placeholder="Next time: what to do differently…"
                  className="w-full rounded-lg px-3 py-2 text-[13px] leading-relaxed outline-none mt-2"
                  style={{ border: "1px solid rgba(51,51,51,0.15)", background: "white", borderLeft: "2px solid rgba(246,212,75,0.9)" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
