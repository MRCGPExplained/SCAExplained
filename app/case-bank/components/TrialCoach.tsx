"use client";

import { useEffect, useRef, useState } from "react";
import { useStudyRoom } from "./study-room/context";

const DARK = "#333333";
const YELLOW = "#F6D44B";

/**
 * Three prompts for somebody whose first case is also their first time in
 * the product: where the panel is, how to start, and what happens after.
 *
 * THE FIRST ONE SPOTLIGHTS THE REAL PANEL rather than drawing a copy of it.
 * A replica with their names in it would look exactly right on the day it
 * was written and drift the first time the panel changes — and the panel is
 * the thing in this product most likely to change. Cutting a hole over the
 * live component is exact by construction and has nothing to keep in sync.
 *
 * TRIAL ONLY. The test is the same one the server uses: a guest-flagged
 * account in the host's seat, which no paid room can produce because
 * setRoomRolesAction refuses a guest the doctor slot.
 */

type Step = "panel" | "start" | "marking" | null;

const SEEN_KEY = "sca_trial_coach_seen";

function spotlightRect(): DOMRect | null {
  const el = document.querySelector("[data-study-panel]");
  return el ? el.getBoundingClientRect() : null;
}

export function TrialCoach() {
  const { room, participants, recordingState } = useStudyRoom();

  const [step, setStep] = useState<Step>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const seen = useRef<Set<string>>(new Set());
  const wasRecording = useRef(false);

  // A trial room is one whose host is a guest.
  const host = participants.find((p) => p.isHost);
  const isTrial = !!room && !!host?.isGuest;

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(SEEN_KEY);
      if (raw) seen.current = new Set(JSON.parse(raw) as string[]);
    } catch { /* a blocked sessionStorage just means they see it again */ }
  }, []);

  const show = (s: Exclude<Step, null>) => {
    if (seen.current.has(s)) return;
    seen.current.add(s);
    try {
      window.sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen.current]));
    } catch { /* ignore */ }
    setStep(s);
  };

  // First prompt, once the panel is on screen and measurable.
  useEffect(() => {
    if (!isTrial) return;
    const t = window.setTimeout(() => {
      setRect(spotlightRect());
      show("panel");
    }, 700);
    return () => window.clearTimeout(t);
  }, [isTrial]);

  // Keep the hole over the panel if the page moves under it.
  useEffect(() => {
    if (step !== "panel") return;
    const update = () => setRect(spotlightRect());
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step]);

  // Third prompt: the moment recording stops, not when the report arrives.
  useEffect(() => {
    if (!isTrial) return;
    const recording = recordingState === "recording";
    if (wasRecording.current && !recording) show("marking");
    wasRecording.current = recording;
  }, [recordingState, isTrial]);

  useEffect(() => {
    if (!step) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setStep(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  if (!isTrial || !step) return null;

  const copy = {
    panel: {
      title: "This is your study panel",
      body: "Who is in the room, and who is playing which part. You can change the roles here.",
      next: "start" as const,
      cta: "Got it",
    },
    start: {
      title: "Starting the case",
      body: "Press Start on the preparation clock for three minutes of reading time, or Skip to go straight into the consultation.",
      next: null,
      cta: "Start the case",
    },
    marking: {
      title: "Marking your consultation",
      body: "This takes about two minutes. Your report opens on its own when it is ready.",
      next: null,
      cta: "OK",
    },
  }[step];

  const highlight = step === "panel" && rect;

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-coach-title"
      onClick={() => (copy.next ? show(copy.next) : setStep(null))}
    >
      {highlight ? (
        /* The hole: a transparent box over the panel, with a shadow big
           enough to darken the rest of the page. */
        <div
          className="absolute rounded-xl pointer-events-none"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: "0 0 0 9999px rgba(51,51,51,0.55)",
          }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: "rgba(51,51,51,0.55)" }} />
      )}

      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-10 rounded-2xl px-6 py-5 max-w-[420px] w-[calc(100%-40px)]"
        style={{ background: "#FAFAF8" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="trial-coach-title" className="font-display font-extrabold text-[18px] mb-2" style={{ color: DARK }}>
          {copy.title}
        </h3>
        <p className="text-[14px] leading-[1.6] mb-4" style={{ color: "rgba(51,51,51,0.7)" }}>
          {copy.body}
        </p>
        <button
          type="button"
          onClick={() => (copy.next ? show(copy.next) : setStep(null))}
          className="font-bold text-[14px] px-5 py-2.5 rounded-xl"
          style={{ background: YELLOW, color: DARK }}
        >
          {copy.cta}
        </button>
      </div>
    </div>
  );
}
