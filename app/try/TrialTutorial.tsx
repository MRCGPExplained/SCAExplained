"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { startTrialAction } from "./actions";

const DARK = "#333333";
const YELLOW = "#F6D44B";
const WASH = "#F9F3D9";

/**
 * The four things somebody has to understand before a study group makes
 * sense, in the order they will meet them.
 *
 * It explains rather than simulates. An interactive tour would have to track
 * the real panel's state and would break every time that panel changed; this
 * is four pictures and four sentences, and the room it describes is already
 * made by the time they read screen two. "Open a study group" is therefore
 * past tense by the time they arrive — which is why that screen says "here
 * is yours" rather than "click here".
 */
/**
 * Four screens about the panel they are about to use, in the order they will
 * use it.
 *
 * The first version of this was abstract — "a study group is a room for two"
 * over cartoon circles — and it was wrong twice. It never named the Study
 * Group panel or any control in it, so it prepared nobody for the screen
 * they landed on; and a room is not for two, it is for two to four.
 */
const STEPS = [
  {
    key: "panel",
    title: "The Study Group panel",
    body: "Down the right of the case you will find a panel headed STUDY GROUP. Everything happens there: who is in the room, who is playing which part, a chat box, and the room code for inviting people. Yours is already open.",
    caption: "Two to four people: a doctor, a patient, and up to two others who just watch.",
  },
  {
    key: "invite",
    title: "Copy link, at the bottom of the panel",
    body: "Under the room code there is a Copy link. Send it to whoever is around. They open it, type a name, and they are in the room — no account, no download, nothing to install. They do not need to be a doctor.",
    caption: "Observers are worth having. Watching someone else get marked is how most people learn fastest.",
  },
  {
    key: "seats",
    title: "Doctor and Patient, from the dropdowns",
    body: "You are already in the Doctor box. Once your partner appears in the room, pick them from the Patient box underneath. They get a short script telling them who they are — today, Karen Doyle, whose four-year-old has had a discharging ear for a week and who would quite like some antibiotics.",
    caption: "The timer will not start until both seats are filled.",
  },
  {
    key: "start",
    title: "Preparation, then Start",
    body: "Top of the panel is a PREPARATION clock at 03:00 — your reading time, with Start, Skip and Reset. Skip it if you are ready. Then the consultation runs, and when you finish it is transcribed and marked against the same domains the RCGP examiners use.",
    caption: "Your report lands a couple of minutes later, with a predicted score and written feedback on all three domains.",
  },
] as const;

function StepArt({ step }: { step: number }) {
  // Small, flat illustrations rather than screenshots: a screenshot of the
  // panel goes stale the first time the panel changes, and these only have to
  // carry the idea.
  return (
    <div
      className="rounded-2xl flex items-center justify-center mb-6"
      style={{ background: WASH, height: 150 }}
      aria-hidden="true"
    >
      {step === 0 && (
        <div className="rounded-lg px-4 py-3 w-[230px]" style={{ background: "#232B3A" }}>
          <div className="text-[11px] font-bold tracking-[0.08em] mb-1" style={{ color: "white" }}>
            STUDY GROUP
          </div>
          <div className="text-[10.5px] mb-2.5" style={{ color: "rgba(255,255,255,0.55)" }}>
            2–4 people
          </div>
          <div className="flex items-center gap-1.5">
            {["D", "P", "+", "+"].map((s, i) => (
              <div
                key={i}
                className="rounded-full flex items-center justify-center font-bold text-[10px]"
                style={{
                  width: 26, height: 26,
                  background: i === 0 ? YELLOW : "rgba(255,255,255,0.14)",
                  color: i === 0 ? DARK : "rgba(255,255,255,0.7)",
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
      {step === 1 && (
        <div
          className="rounded-lg px-4 py-3 font-mono text-[13px] flex items-center gap-3"
          style={{ background: "white", color: DARK, border: `1.5px solid rgba(51,51,51,0.18)` }}
        >
          <span style={{ opacity: 0.55 }}>scafocus.com/room/</span>
          <strong style={{ letterSpacing: "0.12em" }}>K4PX7M</strong>
        </div>
      )}
      {step === 2 && (
        <div className="w-[260px]">
          {[
            { label: "DOCTOR", value: "You", filled: true },
            { label: "PATIENT", value: "None", filled: false },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-3 mb-2 last:mb-0">
              <span className="text-[10.5px] font-bold tracking-[0.07em] w-[58px]" style={{ color: "rgba(51,51,51,0.5)" }}>
                {r.label}
              </span>
              <span
                className="flex-1 rounded-md px-2.5 py-1.5 text-[12px] flex items-center justify-between"
                style={{
                  background: "white",
                  color: r.filled ? DARK : "rgba(51,51,51,0.4)",
                  border: `1px solid rgba(51,51,51,0.15)`,
                }}
              >
                {r.value}
                <span style={{ opacity: 0.35 }}>⌄</span>
              </span>
            </div>
          ))}
        </div>
      )}
      {step === 3 && (
        <div className="flex items-center gap-2">
          <div className="rounded-lg px-3 py-2 text-center mr-1" style={{ background: "white", border: `1.5px solid rgba(51,51,51,0.15)` }}>
            <div className="text-[9px] font-bold tracking-[0.07em]" style={{ color: "rgba(51,51,51,0.45)" }}>PREPARATION</div>
            <div className="font-display font-extrabold text-[17px]" style={{ color: DARK }}>03:00</div>
          </div>
          {[
            { t: "3 min", s: "read" },
            { t: "12 min", s: "consult" },
            { t: "~2 min", s: "marked" },
          ].map((b, i) => (
            <div key={b.t} className="flex items-center gap-2">
              <div className="rounded-lg px-3 py-2 text-center" style={{ background: "white", border: `1.5px solid rgba(51,51,51,0.15)` }}>
                <div className="font-bold text-[13px]" style={{ color: DARK }}>{b.t}</div>
                <div className="text-[10px] uppercase tracking-[0.05em]" style={{ color: "rgba(51,51,51,0.5)" }}>{b.s}</div>
              </div>
              {i < 2 && <span style={{ color: "rgba(51,51,51,0.3)" }}>→</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TrialTutorial() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  const last = step === STEPS.length - 1;

  async function start() {
    if (!name.trim()) { setError("Please enter your name first."); return; }
    setStarting(true);
    setError("");

    const result = await startTrialAction(name);
    if (result.error || !result.roomId) {
      setError(result.error ?? "Could not start. Please try again.");
      setStarting(false);
      return;
    }

    // joinRoom is how the provider in the root layout adopts an existing room
    // after a navigation; it is the same path the invite link uses.
    router.push(`/case-bank/3?joinRoom=${result.roomId}`);
  }

  return (
    <div className="max-w-[560px] mx-auto">
      <div className="flex items-center gap-1.5 mb-6" aria-hidden="true">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ background: i <= step ? YELLOW : "rgba(51,51,51,0.12)" }}
          />
        ))}
      </div>

      <StepArt step={step} />

      <p className="text-[11px] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: "rgba(51,51,51,0.45)" }}>
        Step {step + 1} of {STEPS.length}
      </p>
      <h2 className="font-display font-extrabold text-[26px] leading-[1.2] mb-3" style={{ color: DARK }}>
        {STEPS[step].title}
      </h2>
      <p className="text-[15px] leading-[1.65] mb-2" style={{ color: "rgba(51,51,51,0.72)" }}>
        {STEPS[step].body}
      </p>
      <p className="text-[13px] mb-7" style={{ color: "rgba(51,51,51,0.5)" }}>
        {STEPS[step].caption}
      </p>

      {last && (
        <div className="mb-6">
          <label htmlFor="trial-name" className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.5)" }}>
            Your name
          </label>
          <input
            id="trial-name"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !starting) start(); }}
            placeholder="So your guest knows who they are talking to"
            maxLength={60}
            className="w-full rounded-xl px-4 py-3 text-[15px] outline-none focus:border-navy/50"
            style={{ border: `1.5px solid rgba(51,51,51,0.2)`, color: DARK }}
          />
        </div>
      )}

      {error && (
        <p className="rounded-xl px-4 py-3 text-[13.5px] leading-[1.6] mb-5" style={{ background: "rgba(239,68,68,0.08)", color: "#B91C1C" }}>
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => { setStep(step - 1); setError(""); }}
            disabled={starting}
            className="font-bold text-[14px] px-5 py-3 rounded-xl transition-opacity hover:opacity-70 disabled:opacity-40"
            style={{ background: "transparent", color: "rgba(51,51,51,0.6)" }}
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={() => (last ? start() : setStep(step + 1))}
          disabled={starting}
          className="font-bold text-[15px] px-7 py-3.5 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: YELLOW, color: DARK }}
        >
          {last ? (starting ? "Setting up…" : "Start my case") : "Next"}
        </button>
      </div>

      <p className="text-[12.5px] mt-7 mb-0" style={{ color: "rgba(51,51,51,0.45)" }}>
        Already have an account?{" "}
        <Link href="/login" className="underline" style={{ color: "rgba(51,51,51,0.6)" }}>Sign in</Link>
        {" "}instead — the free case is for people who have not tried us yet.
      </p>
    </div>
  );
}
