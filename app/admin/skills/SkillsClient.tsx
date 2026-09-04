"use client";

import { useState, useActionState, useTransition } from "react";
import {
  upsertGradingSkillAction,
  setGradingSkillActiveAction,
  saveSkillThresholdsAction,
  bumpSkillFrameworkVersionAction,
} from "../actions";
import { DOMAIN_LABEL, type SkillDomain } from "@/lib/skill-framework";

const NAVY = "#333333";

type SkillRow = {
  id: string;
  skill_key: string;
  label: string;
  question: string;
  domain: SkillDomain;
  sort_order: number;
  active: boolean;
};

const DOMAINS: SkillDomain[] = ["relating_to_others", "data_gathering", "clinical_management", "none"];

const inputCls =
  "w-full border border-navy/20 rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-navy/50";

function SkillForm({ skill, onDone }: { skill?: SkillRow; onDone: () => void }) {
  const [state, action, pending] = useActionState(upsertGradingSkillAction, {});
  if ("success" in state && state.success) onDone();

  return (
    <form action={action} className="rounded-xl border border-navy/15 bg-white p-4 flex flex-col gap-3">
      {skill && <input type="hidden" name="id" value={skill.id} />}
      {state.error && (
        <p className="text-[12.5px] text-red-600 m-0 rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.07)" }}>
          {state.error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-navy/50 mb-1">Name</label>
          <input name="label" defaultValue={skill?.label} required placeholder="Cue Recognition" className={inputCls} />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-navy/50 mb-1">
            Key {skill && <span className="font-medium normal-case text-navy/35">— changing this orphans past results</span>}
          </label>
          <input
            name="skill_key"
            defaultValue={skill?.skill_key}
            required
            placeholder="cue_recognition"
            pattern="[a-z0-9_]+"
            className={`${inputCls} font-mono text-[12.5px]`}
          />
        </div>
      </div>
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wide text-navy/50 mb-1">
          Question — must be answerable Yes or No from the transcript
        </label>
        <textarea
          name="question"
          defaultValue={skill?.question}
          required
          rows={3}
          placeholder="Does the doctor acknowledge and empathise with the patient?"
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-navy/50 mb-1">Affects</label>
          <select name="domain" defaultValue={skill?.domain ?? "relating_to_others"} className={inputCls}>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>{DOMAIN_LABEL[d]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-navy/50 mb-1">Order</label>
          <input name="sort_order" type="number" defaultValue={skill?.sort_order ?? 0} className={inputCls} />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
          style={{ background: NAVY, border: "none", cursor: "pointer" }}
        >
          {pending ? "Saving…" : skill ? "Save changes" : "Add skill"}
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

export default function SkillsClient({
  skills,
  thresholdUp,
  thresholdDown,
  minAssessable,
  frameworkVersion,
  skillGradingEnabled,
}: {
  skills: SkillRow[];
  thresholdUp: string;
  thresholdDown: string;
  minAssessable: string;
  frameworkVersion: string;
  skillGradingEnabled: boolean;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [thresholdState, thresholdAction, thresholdPending] = useActionState(saveSkillThresholdsAction, {});
  const [pending, startTransition] = useTransition();

  const min = Number(minAssessable) || 4;

  // A domain can only move a grade once enough of its questions can be
  // answered. Surfaced so a domain that looks configured but is dormant does
  // not quietly puzzle someone months from now.
  const counts = DOMAINS.filter((d) => d !== "none").map((d) => ({
    domain: d,
    count: skills.filter((s) => s.active && s.domain === d).length,
  }));

  return (
    <div>
      <h1 className="font-display font-bold text-[22px] text-navy mb-1">Skill Grading</h1>
      <p className="text-[13px] text-navy/50 mb-6">
        Each skill is one Yes/No question answered from the transcript. Yes counts as Good, No as
        Needs Improvement. Changes apply to consultations graded from now on; existing reports keep
        the questions they were graded against.
      </p>

      {!skillGradingEnabled && (
        <div
          className="rounded-xl px-4 py-3 mb-5 text-[12.5px]"
          style={{ background: "rgba(245,158,11,0.09)", border: "1px solid rgba(245,158,11,0.3)", color: "#92400E" }}
        >
          Skill Grading is currently <strong>off</strong>, so none of this affects grading yet. Turn it on
          under API Settings.
        </div>
      )}

      {/* Thresholds */}
      <form action={thresholdAction} className="rounded-2xl border border-navy/10 bg-white p-6 mb-6">
        <h2 className="font-display font-bold text-[15px] text-navy mb-1">Grade adjustment</h2>
        <p className="text-[12.5px] text-navy/50 mb-4">
          Answers of &quot;not assessable&quot; are left out of the count entirely. A domain moves by at most
          one band, and never past Clear Pass or Clear Fail.
        </p>

        {thresholdState.error && (
          <p className="text-[12.5px] text-red-600 mb-3 rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.07)" }}>
            {thresholdState.error}
          </p>
        )}
        {"success" in thresholdState && thresholdState.success && (
          <p className="text-[12.5px] text-green-700 mb-3">Saved.</p>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wide text-navy/50 mb-1">
              Promote at
            </label>
            <input name="threshold_up" defaultValue={thresholdUp} className={inputCls} />
            <p className="text-[11px] text-navy/40 mt-1">% Good to push a grade up one band</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wide text-navy/50 mb-1">
              Demote at
            </label>
            <input name="threshold_down" defaultValue={thresholdDown} className={inputCls} />
            <p className="text-[11px] text-navy/40 mt-1">% Needs Improvement to push a grade down</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wide text-navy/50 mb-1">
              Minimum answered
            </label>
            <input name="min_assessable" defaultValue={minAssessable} className={inputCls} />
            <p className="text-[11px] text-navy/40 mt-1">Questions needed before a domain can move</p>
          </div>
        </div>

        <p className="text-[11.5px] text-navy/40 mt-3">
          Both thresholds must be above 50%. At 50 or below, an even split would satisfy the promote
          and demote rules at the same time.
        </p>

        <button
          type="submit"
          disabled={thresholdPending}
          className="mt-4 px-5 py-2 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
          style={{ background: NAVY, border: "none", cursor: "pointer" }}
        >
          {thresholdPending ? "Saving…" : "Save"}
        </button>
      </form>

      {/* Dormancy */}
      <div className="rounded-2xl border border-navy/10 bg-white p-6 mb-6">
        <h2 className="font-display font-bold text-[15px] text-navy mb-3">What can currently move</h2>
        <div className="flex flex-col gap-1.5">
          {counts.map(({ domain, count }) => (
            <div key={domain} className="flex items-center justify-between text-[13px]">
              <span className="text-navy/70">{DOMAIN_LABEL[domain]}</span>
              <span className={count >= min ? "text-green-700" : "text-navy/40"}>
                {count} question{count === 1 ? "" : "s"} ·{" "}
                {count >= min ? "can move this grade" : `needs ${min}, not affecting grades`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-[15px] text-navy">
          Questions <span className="font-normal text-navy/40">· framework version {frameworkVersion}</span>
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(async () => { await bumpSkillFrameworkVersionAction(); })}
            className="text-[12.5px] font-semibold text-navy/50 hover:text-navy transition"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            title="Bump after changing questions, so past results stay traceable to the set that produced them"
          >
            Bump version
          </button>
          <button
            type="button"
            onClick={() => { setAdding(true); setEditing(null); }}
            className="px-4 py-1.5 rounded-lg text-[12.5px] font-semibold text-white"
            style={{ background: NAVY, border: "none", cursor: "pointer" }}
          >
            + Add skill
          </button>
        </div>
      </div>

      {adding && (
        <div className="mb-3">
          <SkillForm onDone={() => setAdding(false)} />
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {skills.map((s) =>
          editing === s.id ? (
            <SkillForm key={s.id} skill={s} onDone={() => setEditing(null)} />
          ) : (
            <div
              key={s.id}
              className="rounded-xl border border-navy/10 bg-white px-5 py-4"
              style={{ opacity: s.active ? 1 : 0.5 }}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-semibold text-navy">{s.label}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.04em]"
                      style={
                        s.domain === "none"
                          ? { background: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.5)" }
                          : { background: "rgba(99,102,241,0.1)", color: "#4338CA" }
                      }
                    >
                      {DOMAIN_LABEL[s.domain]}
                    </span>
                    {!s.active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ background: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.45)" }}>
                        Retired
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-navy/60 mt-1 mb-0">{s.question}</p>
                  <p className="text-[11px] font-mono text-navy/30 mt-1 mb-0">{s.skill_key}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setEditing(s.id); setAdding(false); }}
                    className="text-[12px] font-semibold text-navy/50 hover:text-navy transition"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => startTransition(async () => { await setGradingSkillActiveAction(s.id, !s.active); })}
                    className="text-[12px] font-semibold transition"
                    style={{ background: "none", border: "none", cursor: "pointer", color: s.active ? "rgba(185,28,28,0.7)" : "#166534" }}
                  >
                    {s.active ? "Retire" : "Restore"}
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
