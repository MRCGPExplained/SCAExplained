"use client";

import { useState, useRef, useActionState, useTransition } from "react";
import {
  upsertGradingSkillAction,
  setGradingSkillActiveAction,
  saveSkillThresholdsAction,
  bumpSkillFrameworkVersionAction,
  reorderGradingSkillsAction,
  saveSkillPromptAction,
  resetSkillPromptAction,
} from "../actions";
import { DOMAIN_LABEL, SKILLS_TOKEN, type SkillDomain } from "@/lib/skill-framework";

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
      <div className="w-1/2 pr-1.5">
        <label className="block text-[11px] font-bold uppercase tracking-wide text-navy/50 mb-1">Affects</label>
        <select name="domain" defaultValue={skill?.domain ?? "relating_to_others"} className={inputCls}>
          {DOMAINS.map((d) => (
            <option key={d} value={d}>{DOMAIN_LABEL[d]}</option>
          ))}
        </select>
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
  capRto,
  skillPrompt,
  usingDefaultPrompt,
}: {
  skills: SkillRow[];
  thresholdUp: string;
  thresholdDown: string;
  minAssessable: string;
  frameworkVersion: string;
  skillGradingEnabled: boolean;
  capRto: boolean;
  skillPrompt: string;
  usingDefaultPrompt: boolean;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [thresholdState, thresholdAction, thresholdPending] = useActionState(saveSkillThresholdsAction, {});
  const [promptState, promptAction, promptPending] = useActionState(saveSkillPromptAction, {});
  const [pending, startTransition] = useTransition();

  // Remounts the textarea after a reset so it picks up the restored default,
  // which a defaultValue alone would not do.
  const [promptKey, setPromptKey] = useState(0);
  const [promptOpen, setPromptOpen] = useState(false);

  // The list is held locally so a drag lands instantly instead of waiting on a
  // round trip. The server stays the authority: whenever it reports a different
  // order, that wins. Compared during render rather than in an effect, so a
  // reordered row never flashes back to where it came from.
  const [order, setOrder] = useState<SkillRow[]>(skills);
  const serverIds = skills.map((s) => s.id).join(",");
  const [syncedIds, setSyncedIds] = useState(serverIds);
  if (serverIds !== syncedIds) {
    setSyncedIds(serverIds);
    setOrder(skills);
  }

  // Which row is being dragged is held in a ref as well as state. State drives
  // the highlight, but a ref is what the dragover handler reads: state has not
  // committed yet when the first dragover arrives, and a handler that missed it
  // would refuse the drop.
  const dragRef = useRef<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  function endDrag() {
    dragRef.current = null;
    setDragId(null);
    setOverId(null);
  }

  function move(from: number, to: number) {
    if (from === to || to < 0 || to >= order.length) return;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrder(next);
    startTransition(async () => {
      await reorderGradingSkillsAction(next.map((s) => s.id));
    });
  }

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

        <label className="flex items-start gap-2.5 mt-4 pt-4 border-t border-navy/10 cursor-pointer">
          <input
            type="checkbox"
            name="cap_rto"
            defaultChecked={capRto}
            className="mt-0.5 w-4 h-4 accent-navy shrink-0 cursor-pointer"
          />
          <span>
            <span className="block text-[13.5px] font-semibold text-navy">
              Clear Pass in Relating to Others must be earned on the questions
            </span>
            <span className="block text-[12px] text-navy/50 mt-0.5 leading-relaxed">
              The model can grade Relating to Others no higher than Pass. Clear Pass is then reached
              only by clearing the promote threshold. Pass versus Clear Pass is the least stable call
              the model makes here, so this hands the top band to the count instead. The model&apos;s
              own grade is still recorded on every report, so you can see how often the two disagreed.
              Withheld automatically while Relating to Others has too few questions to move a grade.
            </span>
          </span>
        </label>

        <button
          type="submit"
          disabled={thresholdPending}
          className="mt-4 px-5 py-2 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
          style={{ background: NAVY, border: "none", cursor: "pointer" }}
        >
          {thresholdPending ? "Saving…" : "Save"}
        </button>
      </form>

      {/* Prompt */}
      <details
        className="rounded-2xl border border-navy/10 bg-white mb-6"
        open={promptOpen}
        onToggle={(e) => setPromptOpen((e.currentTarget as HTMLDetailsElement).open)}
      >
        <summary className="px-6 py-4 cursor-pointer select-none flex items-center justify-between gap-3" style={{ listStyle: "none" }}>
          <span>
            <span className="font-display font-bold text-[15px] text-navy">Prompt</span>
            <span className="text-[12.5px] text-navy/45 ml-2">
              how the questions are put to the model
            </span>
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.04em] shrink-0"
            style={
              usingDefaultPrompt
                ? { background: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.5)" }
                : { background: "rgba(99,102,241,0.1)", color: "#4338CA" }
            }
          >
            {usingDefaultPrompt ? "Default" : "Edited"}
          </span>
        </summary>

        <form action={promptAction} className="px-6 pb-6 pt-1 border-t border-navy/10">
          <p className="text-[12.5px] text-navy/50 mt-4 mb-3">
            This is the half of the grading prompt that asks the skill questions. The questions
            themselves come from the list below and are inserted at{" "}
            <code className="font-mono text-[12px] px-1 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.1)", color: "#4338CA" }}>
              {SKILLS_TOKEN}
            </code>
            , so leave that in. How the answers are read and what they do to a grade is not set
            here, and cannot be changed from this page.
          </p>

          {promptState.error && (
            <p className="text-[12.5px] text-red-600 mb-3 rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.07)" }}>
              {promptState.error}
            </p>
          )}
          {"success" in promptState && promptState.success && (
            <p className="text-[12.5px] text-green-700 mb-3">Saved. Applies to consultations graded from now on.</p>
          )}

          <textarea
            key={promptKey}
            name="skill_prompt"
            defaultValue={skillPrompt}
            rows={20}
            spellCheck={false}
            className="w-full border border-navy/20 rounded-lg px-3 py-2 text-[12.5px] font-mono leading-relaxed outline-none focus:border-navy/50"
          />

          <div className="flex items-center gap-3 mt-3">
            <button
              type="submit"
              disabled={promptPending}
              className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
              style={{ background: NAVY, border: "none", cursor: "pointer" }}
            >
              {promptPending ? "Saving…" : "Save prompt"}
            </button>
            <button
              type="button"
              disabled={pending || usingDefaultPrompt}
              onClick={() =>
                startTransition(async () => {
                  await resetSkillPromptAction();
                  setPromptKey((k) => k + 1);
                })
              }
              className="text-[12.5px] font-semibold text-navy/50 hover:text-navy transition disabled:opacity-40"
              style={{ background: "none", border: "none", cursor: usingDefaultPrompt ? "default" : "pointer" }}
              title={
                usingDefaultPrompt
                  ? "Already on the default"
                  : "Discard the edit and follow the built-in prompt again, including any later improvements to it"
              }
            >
              Restore default
            </button>
          </div>
        </form>
      </details>

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
        {capRto && (counts.find((c) => c.domain === "relating_to_others")?.count ?? 0) < min && (
          <p className="text-[12px] mt-3 mb-0 rounded-lg px-3 py-2" style={{ background: "rgba(245,158,11,0.09)", color: "#92400E" }}>
            The Clear Pass ceiling is switched on but not in force: Relating to Others has too few
            questions to move a grade, so capping it would put Clear Pass out of reach with no way to
            earn it back.
          </p>
        )}
      </div>

      {/* Skills */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-display font-bold text-[15px] text-navy mb-0.5">
            Questions <span className="font-normal text-navy/40">· framework version {frameworkVersion}</span>
          </h2>
          <p className="text-[12px] text-navy/40 m-0">
            Drag to reorder. This is the order they are asked in and the order they appear on a report.
          </p>
        </div>
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

      <div className="flex flex-col gap-2.5" onDragEnd={endDrag}>
        {order.map((s, idx) =>
          editing === s.id ? (
            <SkillForm key={s.id} skill={s} onDone={() => setEditing(null)} />
          ) : (
            <div
              key={s.id}
              onDragOver={(e) => { if (dragRef.current) { e.preventDefault(); setOverId(s.id); } }}
              onDrop={(e) => {
                const from = dragRef.current;
                if (!from) return;
                e.preventDefault();
                move(order.findIndex((o) => o.id === from), idx);
                endDrag();
              }}
              className="rounded-xl border bg-white px-4 py-4 transition-colors"
              style={{
                opacity: dragId === s.id ? 0.4 : s.active ? 1 : 0.5,
                borderColor: overId === s.id && dragId !== s.id ? "rgba(51,51,51,0.55)" : "rgba(51,51,51,0.1)",
              }}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex items-start gap-2.5">
                  {/* A button, not a bare handle, so the order is reachable
                      without a mouse — the arrow keys move the focused row. */}
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => { dragRef.current = s.id; setDragId(s.id); e.dataTransfer.effectAllowed = "move"; }}
                    onKeyDown={(e) => {
                      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
                      e.preventDefault();
                      move(idx, e.key === "ArrowUp" ? idx - 1 : idx + 1);
                    }}
                    aria-label={`Reorder ${s.label}. Position ${idx + 1} of ${order.length}. Drag, or use the arrow keys.`}
                    title="Drag to reorder, or focus and use the arrow keys"
                    className="mt-0.5 shrink-0 rounded-md px-1 py-1 text-navy/25 hover:text-navy/60 hover:bg-navy/[0.05] transition"
                    style={{ background: "none", border: "none", cursor: "grab" }}
                  >
                    <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">
                      <circle cx="3.5" cy="4" r="1.4" /><circle cx="8.5" cy="4" r="1.4" />
                      <circle cx="3.5" cy="8" r="1.4" /><circle cx="8.5" cy="8" r="1.4" />
                      <circle cx="3.5" cy="12" r="1.4" /><circle cx="8.5" cy="12" r="1.4" />
                    </svg>
                  </button>
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
