"use client";

import { useState, useActionState, useTransition } from "react";
import { upsertCaseRuleAction, setCaseRuleActiveAction } from "../actions";
import { DOMAIN_LABEL, type CaseRule } from "@/lib/case-rules";

const NAVY = "#333333";
const GRADES = ["CF", "F", "P", "CP"] as const;
const GRADE_LABEL: Record<string, string> = {
  CF: "Clear Fail", F: "Fail", P: "Pass", CP: "Clear Pass",
};
const DOMAINS = ["data_gathering", "clinical_management", "relating_to_others"] as const;

const inputCls =
  "w-full border border-navy/20 rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-navy/50";
const labelCls = "block text-[11px] font-bold uppercase tracking-wide text-navy/50 mb-1";

function summarise(r: CaseRule): string {
  const verb = r.bound === "ceiling" ? "capped at" : "lifted to";
  return `${DOMAIN_LABEL[r.domain]} ${verb} ${GRADE_LABEL[r.grade]}`;
}

function RuleForm({ stationId, rule, onDone }: { stationId: string; rule?: CaseRule; onDone: () => void }) {
  const [state, action, pending] = useActionState(upsertCaseRuleAction, {});
  if ("success" in state && state.success) onDone();

  return (
    <form action={action} className="rounded-xl border border-navy/15 bg-white p-4 flex flex-col gap-3">
      <input type="hidden" name="station_id" value={stationId} />
      {rule && <input type="hidden" name="id" value={rule.id} />}

      {state.error && (
        <p className="text-[12.5px] text-red-600 m-0 rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.07)" }}>
          {state.error}
        </p>
      )}

      <div>
        <label className={labelCls}>Name</label>
        <input name="name" defaultValue={rule?.name} required placeholder="Deferred antibiotics" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Trigger — must be answerable Yes or No from the transcript</label>
        <textarea
          name="trigger_question"
          defaultValue={rule?.trigger_question}
          required
          rows={2}
          placeholder="Did the doctor defer giving antibiotics until after examination?"
          className={inputCls}
        />
        <p className="text-[11px] text-navy/40 mt-1 mb-0">
          One condition per rule. Two conditions in one question get answered inconsistently.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className={labelCls}>Fires when</label>
          <select name="fires_when" defaultValue={rule?.fires_when ?? "yes"} className={inputCls}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Domain</label>
          <select name="domain" defaultValue={rule?.domain ?? "clinical_management"} className={inputCls}>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>{DOMAIN_LABEL[d]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Effect</label>
          <select name="bound" defaultValue={rule?.bound ?? "ceiling"} className={inputCls}>
            <option value="ceiling">Cap at</option>
            <option value="floor">Lift to</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Grade</label>
          <select name="grade" defaultValue={rule?.grade ?? "F"} className={inputCls}>
            {GRADES.map((g) => (
              <option key={g} value={g}>{GRADE_LABEL[g]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Comment basis — only used when the rule fires</label>
        <textarea
          name="comment_basis"
          defaultValue={rule?.comment_basis}
          required
          rows={6}
          placeholder="Why this matters, and what the SCA expects here. Anything you say about the exam is passed on to the candidate; the model is not allowed to invent its own."
          className={inputCls}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
          style={{ background: NAVY, border: "none", cursor: "pointer" }}
        >
          {pending ? "Saving…" : rule ? "Save changes" : "Add rule"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-5 py-2 rounded-lg text-[13px] font-semibold"
          style={{ background: "rgba(51,51,51,0.07)", color: NAVY, border: "none", cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function CaseRules({ stationId, rules }: { stationId: string; rules: CaseRule[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();

  // A ceiling and a floor on one domain contradict each other. The ceiling wins
  // at grading time, but that is almost always an authoring slip rather than an
  // intention, so it is worth saying out loud here.
  const conflicts = DOMAINS.filter((d) => {
    const live = rules.filter((r) => r.active && r.domain === d);
    return live.some((r) => r.bound === "ceiling") && live.some((r) => r.bound === "floor");
  });

  return (
    <section className="bg-white rounded-xl border border-navy/10 p-6 mb-6">
      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-[15px] text-navy mb-1">Case Rules</h2>
          <p className="text-[12px] text-navy/45 m-0 max-w-[62ch]">
            The last word on grading for this station, applied after the AI&apos;s own grade and
            after the skill modulation. The model only answers the trigger; the effect is applied
            in code, so it cannot be talked out of.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setAdding(true); setEditing(null); }}
          className="px-4 py-1.5 rounded-lg text-[12.5px] font-semibold text-white shrink-0"
          style={{ background: NAVY, border: "none", cursor: "pointer" }}
        >
          + Add rule
        </button>
      </div>

      {conflicts.length > 0 && (
        <p
          className="text-[12px] mt-3 mb-0 rounded-lg px-3 py-2"
          style={{ background: "rgba(245,158,11,0.09)", color: "#92400E" }}
        >
          {conflicts.map((d) => DOMAIN_LABEL[d]).join(" and ")} has both a cap and a lift. If both
          fire the cap wins, which is usually not what was meant.
        </p>
      )}

      <div className="flex flex-col gap-2.5 mt-4">
        {adding && <RuleForm stationId={stationId} onDone={() => setAdding(false)} />}

        {rules.length === 0 && !adding && (
          <p className="text-[13px] text-navy/40 m-0">
            No rules yet. Stations without any are graded exactly as before.
          </p>
        )}

        {rules.map((r) =>
          editing === r.id ? (
            <RuleForm key={r.id} stationId={stationId} rule={r} onDone={() => setEditing(null)} />
          ) : (
            <div
              key={r.id}
              className="rounded-xl border border-navy/10 px-5 py-4"
              style={{ opacity: r.active ? 1 : 0.5 }}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-semibold text-navy">{r.name}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.04em]"
                      style={
                        r.bound === "ceiling"
                          ? { background: "rgba(239,68,68,0.09)", color: "#B91C1C" }
                          : { background: "rgba(34,197,94,0.10)", color: "#166534" }
                      }
                    >
                      {summarise(r)}
                    </span>
                    {!r.active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ background: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.45)" }}>
                        Retired
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-navy/60 mt-1 mb-0">
                    <span className="font-semibold text-navy/45">If {r.fires_when}: </span>
                    {r.trigger_question}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setEditing(r.id); setAdding(false); }}
                    className="text-[12px] font-semibold text-navy/50 hover:text-navy transition"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => startTransition(async () => { await setCaseRuleActiveAction(r.id, !r.active); })}
                    className="text-[12px] font-semibold transition"
                    style={{ background: "none", border: "none", cursor: "pointer", color: r.active ? "rgba(185,28,28,0.7)" : "#166534" }}
                  >
                    {r.active ? "Retire" : "Restore"}
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
