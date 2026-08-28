"use client";

import { useState, useActionState, useTransition, useEffect } from "react";
import {
  saveAiPromptAction, clearAiPromptAction,
  toggleDeepgramAction, setVercelPlanAction, toggleResendAction, toggleDailyCoAction,
  toggleSkillGradingAction, setGradingModelAction,
} from "../actions";

const NAVY = "#333333";

type Tab = "ai_prompt" | "transcription" | "resend";

interface Props {
  aiPrompt: string;
  defaultPrompt: string;
  deepgramEnabled: boolean;
  vercelPlan: "hobby" | "pro";
  skillGradingEnabled: boolean;
  gradingModel: string;
  resendEnabled: boolean;
  dailyCoEnabled: boolean;
}

export default function ApiSettingsClient({ aiPrompt, defaultPrompt, deepgramEnabled: initialDeepgram, vercelPlan: initialVercelPlan, resendEnabled: initialResend, dailyCoEnabled: initialDailyCo, skillGradingEnabled: initialSkillGrading, gradingModel: initialGradingModel }: Props) {
  const [tab, setTab] = useState<Tab>("ai_prompt");

  // AI prompt
  const [promptText, setPromptText] = useState(aiPrompt || defaultPrompt);
  const [promptState, promptAction, promptPending] = useActionState(saveAiPromptAction, {});
  const [showPromptSaved, setShowPromptSaved] = useState(false);
  const [clearPending, startClearTransition] = useTransition();

  // Deepgram toggle
  const [deepgramOn, setDeepgramOn] = useState(initialDeepgram);
  const [deepgramPending, startDeepgramTransition] = useTransition();
  const [deepgramErr, setDeepgramErr] = useState("");

  // Vercel plan
  const [vercelPlan, setVercelPlan] = useState<"hobby" | "pro">(initialVercelPlan);
  const [vercelPlanPending, startVercelPlanTransition] = useTransition();

  // Resend toggle
  const [resendOn, setResendOn] = useState(initialResend);
  const [resendPending, startResendTransition] = useTransition();
  const [resendErr, setResendErr] = useState("");

  // Skill grading — off unless explicitly enabled
  const [skillGrading, setSkillGrading] = useState(initialSkillGrading);
  const [skillGradingPending, startSkillGrading] = useTransition();
  const [gradingModel, setGradingModel] = useState(initialGradingModel);
  const [gradingModelPending, startGradingModel] = useTransition();

  // DailyCo toggle
  const [dailyCoOn, setDailyCoOn] = useState(initialDailyCo);
  const [dailyCoPending, startDailyCoTransition] = useTransition();
  const [dailyCoErr, setDailyCoErr] = useState("");

  useEffect(() => {
    if ("success" in promptState && promptState.success) {
      setShowPromptSaved(true);
      const t = setTimeout(() => setShowPromptSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [promptState]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "ai_prompt", label: "AI Prompt" },
    { id: "transcription", label: "Transcription" },
    { id: "resend", label: "Resend" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="font-display font-bold text-[22px] text-navy">API Settings</h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-navy/10 p-1.5" style={{ width: "fit-content" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-1.5 rounded-lg text-[13px] font-semibold transition"
            style={{
              background: tab === t.id ? NAVY : "transparent",
              color: tab === t.id ? "white" : "rgba(51,51,51,0.45)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Transcription tab ────────────────────────────────────────────────── */}
      {tab === "transcription" && (
        <div className="bg-white rounded-xl border border-navy/10 p-6">
          <h2 className="text-[15px] font-bold text-navy mb-1">Deepgram Transcription</h2>
          <p className="text-[12px] text-navy/45 mb-6">
            When enabled, consultation audio is transcribed by Deepgram and graded by AI before reaching the examiner queue.
            When disabled, recordings skip transcription and go straight to the examiner queue with audio only.
          </p>

          <div className="flex flex-col gap-5">
            {/* Deepgram on/off */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                disabled={deepgramPending}
                onClick={() => {
                  const next = !deepgramOn;
                  setDeepgramOn(next);
                  setDeepgramErr("");
                  startDeepgramTransition(async () => {
                    const res = await toggleDeepgramAction(next);
                    if (res.error) { setDeepgramOn(!next); setDeepgramErr(res.error); }
                  });
                }}
                className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition disabled:opacity-50"
                style={{
                  background: deepgramOn ? "rgba(34,197,94,0.12)" : "rgba(51,51,51,0.07)",
                  border: `1.5px solid ${deepgramOn ? "rgba(34,197,94,0.3)" : "rgba(51,51,51,0.12)"}`,
                  color: deepgramOn ? "#166534" : "rgba(51,51,51,0.45)",
                  cursor: "pointer",
                }}
              >
                {deepgramPending ? "Saving…" : deepgramOn ? "Deepgram: ON" : "Deepgram: OFF"}
              </button>
              <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>
                {deepgramOn
                  ? "Recordings will be transcribed and AI-graded."
                  : "Recordings skip transcription — examiner gets audio only."}
              </span>
              {deepgramErr && <span className="text-[12px] text-red-600">{deepgramErr}</span>}
            </div>

            {/* Vercel plan */}
            {deepgramOn && (
              <div style={{ paddingTop: 16, borderTop: "1px solid rgba(51,51,51,0.07)" }}>
                <div className="text-[12px] font-semibold mb-1" style={{ color: NAVY }}>Vercel Plan</div>
                <p className="text-[12px] mb-3" style={{ color: "rgba(51,51,51,0.45)" }}>
                  Hobby has a 60s function limit — real Deepgram transcription will time out. Set to Hobby to use a hardcoded transcript instead (AI grading still runs).
                </p>
                <div className="flex gap-2">
                  {(["pro", "hobby"] as const).map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      disabled={vercelPlanPending}
                      onClick={() => {
                        setVercelPlan(plan);
                        startVercelPlanTransition(async () => { await setVercelPlanAction(plan); });
                      }}
                      className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition disabled:opacity-50 capitalize"
                      style={{
                        background: vercelPlan === plan ? NAVY : "rgba(51,51,51,0.07)",
                        border: "1.5px solid transparent",
                        color: vercelPlan === plan ? "white" : "rgba(51,51,51,0.45)",
                        cursor: "pointer",
                      }}
                    >
                      {plan === "pro" ? "Pro / Enterprise" : "Hobby"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Skill grading */}
            {deepgramOn && (
              <div style={{ paddingTop: 16, borderTop: "1px solid rgba(51,51,51,0.07)" }}>
                <div className="text-[12px] font-semibold mb-1" style={{ color: NAVY }}>Skill Grading</div>
                <p className="text-[12px] mb-3" style={{ color: "rgba(51,51,51,0.45)" }}>
                  Adds a consultation-skills layer (history structure, cue recognition, safety
                  netting and so on) that can nudge a borderline domain grade by up to one band.
                  Off means grading behaves exactly as it does today.
                </p>
                <div className="flex gap-2 items-center flex-wrap">
                  {([true, false] as const).map((on) => (
                    <button
                      key={String(on)}
                      type="button"
                      disabled={skillGradingPending}
                      onClick={() => {
                        setSkillGrading(on);
                        startSkillGrading(async () => { await toggleSkillGradingAction(on); });
                      }}
                      className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition disabled:opacity-50"
                      style={{
                        background: skillGrading === on ? NAVY : "rgba(51,51,51,0.07)",
                        border: "1.5px solid transparent",
                        color: skillGrading === on ? "white" : "rgba(51,51,51,0.45)",
                        cursor: "pointer",
                      }}
                    >
                      {on ? "On" : "Off"}
                    </button>
                  ))}
                  {skillGrading && (
                    <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>
                      Applies to consultations graded from now on.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Grading model */}
            {deepgramOn && (
              <div style={{ paddingTop: 16, borderTop: "1px solid rgba(51,51,51,0.07)" }}>
                <div className="text-[12px] font-semibold mb-1" style={{ color: NAVY }}>Grading Model</div>
                <p className="text-[12px] mb-3" style={{ color: "rgba(51,51,51,0.45)" }}>
                  Haiku is fast and cheap and is fine for straightforward grading. Sonnet reasons
                  better about the skill layer&apos;s aggregation rules, at roughly 3–5x the cost per
                  consultation — still pennies. Cost per run is recorded under Economics.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {([
                    { id: "claude-haiku-4-5-20251001", label: "Haiku 4.5" },
                    { id: "claude-sonnet-4-6", label: "Sonnet 4.6" },
                  ] as const).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      disabled={gradingModelPending}
                      onClick={() => {
                        setGradingModel(m.id);
                        startGradingModel(async () => { await setGradingModelAction(m.id); });
                      }}
                      className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition disabled:opacity-50"
                      style={{
                        background: gradingModel === m.id ? NAVY : "rgba(51,51,51,0.07)",
                        border: "1.5px solid transparent",
                        color: gradingModel === m.id ? "white" : "rgba(51,51,51,0.45)",
                        cursor: "pointer",
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DailyCo on/off */}
            <div style={{ paddingTop: 16, borderTop: "1px solid rgba(51,51,51,0.07)" }}>
              <div className="text-[12px] font-semibold mb-1" style={{ color: NAVY }}>DailyCo Live Audio</div>
              <p className="text-[12px] mb-3" style={{ color: "rgba(51,51,51,0.45)" }}>
                When enabled, study room participants get a live audio call for the 12-minute consultation. When disabled, the call feature is hidden — participants only record locally as before.
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={dailyCoPending}
                  onClick={() => {
                    const next = !dailyCoOn;
                    setDailyCoOn(next);
                    setDailyCoErr("");
                    startDailyCoTransition(async () => {
                      const res = await toggleDailyCoAction(next);
                      if (res.error) { setDailyCoOn(!next); setDailyCoErr(res.error); }
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition disabled:opacity-50"
                  style={{
                    background: dailyCoOn ? "rgba(34,197,94,0.12)" : "rgba(51,51,51,0.07)",
                    border: `1.5px solid ${dailyCoOn ? "rgba(34,197,94,0.3)" : "rgba(51,51,51,0.12)"}`,
                    color: dailyCoOn ? "#166534" : "rgba(51,51,51,0.45)",
                    cursor: "pointer",
                  }}
                >
                  {dailyCoPending ? "Saving…" : dailyCoOn ? "DailyCo: ON" : "DailyCo: OFF"}
                </button>
                <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>
                  {dailyCoOn
                    ? "Live audio call is available in study rooms."
                    : "Live audio call is disabled."}
                </span>
                {dailyCoErr && <span className="text-[12px] text-red-600">{dailyCoErr}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Resend tab ───────────────────────────────────────────────────────── */}
      {tab === "resend" && (
        <div className="bg-white rounded-xl border border-navy/10 p-6">
          <h2 className="text-[15px] font-bold text-navy mb-1">Resend Emails</h2>
          <p className="text-[12px] text-navy/45 mb-6">
            When disabled, all outbound emails are silently skipped. Useful during testing to avoid burning Resend quota.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={resendPending}
              onClick={() => {
                const next = !resendOn;
                setResendOn(next);
                setResendErr("");
                startResendTransition(async () => {
                  const res = await toggleResendAction(next);
                  if (res.error) { setResendOn(!next); setResendErr(res.error); }
                });
              }}
              className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition disabled:opacity-50"
              style={{
                background: resendOn ? "rgba(34,197,94,0.12)" : "rgba(51,51,51,0.07)",
                border: `1.5px solid ${resendOn ? "rgba(34,197,94,0.3)" : "rgba(51,51,51,0.12)"}`,
                color: resendOn ? "#166534" : "rgba(51,51,51,0.45)",
                cursor: "pointer",
              }}
            >
              {resendPending ? "Saving…" : resendOn ? "Resend: ON" : "Resend: OFF"}
            </button>
            <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>
              {resendOn ? "Emails are being sent normally." : "All emails are disabled — nothing will be sent."}
            </span>
            {resendErr && <span className="text-[12px] text-red-600">{resendErr}</span>}
          </div>
        </div>
      )}

      {/* ── AI Prompt tab ─────────────────────────────────────────────────────── */}
      {tab === "ai_prompt" && (
        <div className="bg-white rounded-xl border border-navy/10 p-6">
          <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
            <div>
              <h2 className="text-[15px] font-bold text-navy">AI Marking Instructions</h2>
              <p className="text-[12px] text-navy/45 mt-0.5">
                Sent to Claude as the grading system prompt for every consultation. Changes apply to new recordings only.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {showPromptSaved && <span className="text-[12px] font-semibold" style={{ color: "#166534" }}>✓ Saved</span>}
            </div>
          </div>

          <div className="mt-1 mb-3 flex gap-2 text-[11px]">
            <span
              className="px-2 py-0.5 rounded font-semibold"
              style={{
                background: promptText === defaultPrompt ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                color: promptText === defaultPrompt ? "#166534" : "#92400E",
              }}
            >
              {promptText === defaultPrompt ? "Using default" : "Custom prompt active"}
            </span>
          </div>

          <form action={promptAction} className="flex flex-col gap-3">
            <textarea
              name="ai_prompt"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={16}
              className="w-full px-3 py-2.5 rounded-lg border border-navy/15 text-[12.5px] font-mono resize-y"
              style={{ color: NAVY, background: "#F9F9FC", outline: "none", lineHeight: 1.6 }}
            />
            {"error" in promptState && promptState.error && (
              <p className="text-[12px] text-red-600">{String(promptState.error)}</p>
            )}
            <div className="flex gap-2 flex-wrap">
              <button
                type="submit"
                disabled={promptPending}
                className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white"
                style={{ background: NAVY, border: "none", cursor: "pointer", opacity: promptPending ? 0.6 : 1 }}
              >
                {promptPending ? "Saving…" : "Set as Default"}
              </button>
              <button
                type="button"
                disabled={clearPending}
                onClick={() => {
                  startClearTransition(async () => {
                    await clearAiPromptAction();
                    setPromptText(defaultPrompt);
                    setShowPromptSaved(true);
                    setTimeout(() => setShowPromptSaved(false), 3000);
                  });
                }}
                className="px-5 py-2 rounded-lg text-[13px]"
                style={{ background: "none", border: "1px solid rgba(51,51,51,0.15)", color: "rgba(51,51,51,0.5)", cursor: "pointer", opacity: clearPending ? 0.6 : 1 }}
              >
                Return to Default
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
