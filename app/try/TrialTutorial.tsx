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
const STEPS = [
  {
    key: "group",
    title: "You get a study group",
    body: "A study group is a room for two. You take the doctor's seat, someone else plays the patient, and the case runs like the real thing — three minutes to read, twelve to consult.",
    caption: "We have already made yours.",
  },
  {
    key: "invite",
    title: "Invite whoever is around",
    body: "You get a link to send. Whoever opens it types a name and they are in — no account, no download, nothing to install. A partner, a flatmate or another registrar all work equally well.",
    caption: "They do not need to be a doctor.",
  },
  {
    key: "roles",
    title: "You are the doctor",
    body: "Your guest is the patient, and they get a short script telling them who they are and what to say. Today they are Karen Doyle, whose four-year-old has had a discharging ear for a week and who would quite like some antibiotics.",
    caption: "Nothing to set up — the seats are already assigned.",
  },
  {
    key: "start",
    title: "Then press start",
    body: "Three minutes to read the brief, then the consultation. When you hang up it is transcribed and marked against the same domains the RCGP examiners use, and your report is ready in a couple of minutes.",
    caption: "You will get a predicted score and written feedback on all three domains.",
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
        <div className="flex items-center gap-3">
          {["You", "?"].map((s, i) => (
            <div
              key={i}
              className="rounded-full flex items-center justify-center font-bold text-[13px]"
              style={{
                width: 54, height: 54,
                background: i === 0 ? YELLOW : "white",
                color: DARK,
                border: i === 0 ? "none" : `2px dashed rgba(51,51,51,0.3)`,
              }}
            >
              {s}
            </div>
          ))}
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
        <div className="flex items-center gap-6">
          {[
            { label: "Doctor", who: "You", fill: YELLOW },
            { label: "Patient", who: "Your guest", fill: "white" },
          ].map((r) => (
            <div key={r.label} className="text-center">
              <div
                className="rounded-full mx-auto mb-2"
                style={{ width: 40, height: 40, background: r.fill, border: r.fill === "white" ? `2px solid rgba(51,51,51,0.2)` : "none" }}
              />
              <div className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: DARK }}>{r.label}</div>
              <div className="text-[11px]" style={{ color: "rgba(51,51,51,0.55)" }}>{r.who}</div>
            </div>
          ))}
        </div>
      )}
      {step === 3 && (
        <div className="flex items-center gap-2">
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
