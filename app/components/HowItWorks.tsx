"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const AUTO_CYCLE_MS = 4500;

const DARK = "#333333";
const YELLOW = "#F6D44B";

function MicOutline({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="2" width="8" height="13" rx="4" stroke={DARK} strokeWidth="1.6" />
      <path d="M5 11a7 7 0 0 0 14 0" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="22" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="9" y1="22" x2="15" y2="22" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SparklesOutline({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l2.1 6.9L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1L12 3z"
        fill={DARK}
      />
      <path
        d="M18.5 2.2l0.95 2.75 2.75 0.95-2.75 0.95-0.95 2.75-0.95-2.75-2.75-0.95 2.75-0.95 0.95-2.75z"
        fill={DARK}
      />
    </svg>
  );
}

function StethoscopeOutline({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 2.5v5.2a3 3 0 0 0 6 0V2.5" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 10.6v2.7a5.3 5.3 0 0 0 10.6 0v-1.3" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="20.6" cy="12" r="1.7" stroke={DARK} strokeWidth="1.6" />
    </svg>
  );
}

function FileTextOutline({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5.5" y="2.5" width="13" height="19" rx="2" stroke={DARK} strokeWidth="1.6" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke={DARK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ highlighted }: { highlighted: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12h15M13 6l6 6-6 6"
        stroke={highlighted ? YELLOW : "rgba(51,51,51,0.28)"}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "stroke 0.25s ease-out" }}
      />
    </svg>
  );
}

const STEPS = [
  {
    id: "record",
    label: "Record",
    title: "Record Consultation",
    description: "Record directly on SCA Focus with your study partner. No downloads. No Zoom. No third-party software.",
    icon: MicOutline,
  },
  {
    id: "ai",
    label: "AI Review",
    title: "Instant AI Feedback",
    description: "Your consultation is securely transcribed and analysed immediately to generate provisional scores and feedback.",
    icon: SparklesOutline,
  },
  {
    id: "gp",
    label: "GP Review",
    title: "GP Review",
    description: "Send a consultation to an experienced GP (one of the educators who wrote the cases) who verifies the scoring and writes feedback on what actually happened in yours. Twenty reviews are included.",
    icon: StethoscopeOutline,
  },
  {
    id: "report",
    label: "Report",
    title: "Receive Your Report",
    description: "Your finalised report lands in your account with clear scores and examiner comments, so you know exactly what to improve before exam day.",
    icon: FileTextOutline,
  },
] as const;

/**
 * The countdown to the next step, drawn around the one that is current.
 *
 * The timeline already advanced on its own; nothing showed that it was about
 * to, so the change arrived unannounced and a reader part-way through the
 * description lost it with no idea why. A ring closing over the same 4.5
 * seconds makes the thing predictable: you can see how long you have, and
 * that the movement is the component working rather than a misclick.
 *
 * Keyed on the active step so it remounts and redraws from zero each time,
 * Keyed on the pick as well as the step: clicking the chip that is already
 * active leaves the step unchanged, and without that the interval would
 * restart while the ring carried on from where it was.
 *
 * It lives on the large icon only. It was on the small chips first, and two
 * rings drawing the same countdown in the same band was one too many: the
 * chips say which step, the big one says how long.
 */
function ProgressRing({ size, durationMs, stroke = 2.5 }: { size: number; durationMs: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="absolute pointer-events-none"
      // Rotated so the stroke starts at twelve o'clock rather than three.
      style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%) rotate(-90deg)" }}
    >
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={DARK}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: durationMs / 1000, ease: "linear" }}
      />
    </svg>
  );
}

// The chips are a progress strip, not the subject of the band. They index
// the four steps; the large icon is the one you are meant to look at.
const CHIP_CIRCLE = 54;
const CHIP_ICON = 22;
const MOBILE_CIRCLE = 60;
const MOBILE_ICON = 26;

// The subject. It took over the whole left column of the band when the
// heading that used to live there moved above the card, so it is no longer
// boxed in by a 176px gutter and can be the size it wants to be.
const BIG_CIRCLE = 220;
const BIG_ICON = 88;

export function HowItWorks() {
  const [active, setActive] = useState(0);
  // Bumped when a reader picks a step, purely to restart the interval from
  // that moment. Without it the step they chose inherits whatever was left
  // of the tick already running and can flip away a few hundred
  // milliseconds after they clicked it.
  const [pickedAt, setPickedAt] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  // Auto-cycles through the steps, but only once the band is on screen.
  // Started at mount it ran the whole sequence below the fold: a reader who
  // spent five seconds on the hero arrived at step two, one who spent ten
  // arrived at step three, and "Record Consultation" — the step this exists
  // to put first — was never the one they saw. Gating on the same inView the
  // ring uses also puts the two in phase, so the first ring anyone sees
  // draws a whole 4.5 seconds instead of whatever was left of a tick that
  // started while they were somewhere else on the page.
  // `active` is deliberately not a dependency: the interval keeps its own
  // steady cadence as it advances, and only a deliberate pick restarts it.
  useEffect(() => {
    if (reduceMotion || !inView) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % STEPS.length);
    }, AUTO_CYCLE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, inView, pickedAt]);

  // Nothing stops the cycle. Hovering used to, and it was worse than it
  // sounds: a card sliding under a stationary cursor fires the same events
  // as a reader moving onto it, and on a wheel scroll the cursor is usually
  // parked mid-viewport, right where this band passes — so the cycle died
  // for most desktop readers before they had touched anything. Clicking a
  // chip jumps to that step and the cycle carries on from there.
  //
  // Readers who do not want it have prefers-reduced-motion, which stops the
  // interval outright and leaves the card on step one.
  function selectStep(i: number) {
    setActive(i);
    setPickedAt((n) => n + 1);
  }

  const showCountdown = !reduceMotion && inView;

  const ActiveIcon = STEPS[active].icon;

  return (
    /*
      The whole band, not just the card: the large icon takes the left
      column where the heading and its sub-paragraph used to sit, and the
      heading moved to the top of the right column in place of the "How it
      works" eyebrow. The icon is the better use of that half — it is the
      thing that moves, and a heading plus a sentence restating the heading
      was the page explaining itself twice before showing anything.
    */
    <div
      ref={sectionRef}
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-x-14 gap-y-8 lg:items-center"
    >
      {/*
        First in the DOM, placed into the right column from lg. Stacked,
        that puts the heading above the icon, where a section heading
        belongs — reading a 220px icon and a step name before being told
        what the section is about is backwards. It also keeps the h2 ahead
        of the step name underneath the icon.
      */}
      <h2
        className="lg:col-start-2 lg:row-start-1 font-display font-extrabold text-[32px] leading-[1.2] max-sm:text-[26px]"
        style={{ color: DARK }}
      >
        Every step is designed to help you improve.
      </h2>

      {/* LEFT — the step you are on */}
      <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 flex flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="relative flex items-center justify-center rounded-full shrink-0"
          style={{
            width: BIG_CIRCLE,
            height: BIG_CIRCLE,
            background: YELLOW,
            boxShadow: "0 24px 60px rgba(246,212,75,0.45), 0 6px 16px rgba(51,51,51,0.06)",
          }}
        >
          {/*
            Keyed remount rather than an AnimatePresence cross-fade. With
            mode="wait" the outgoing step has to finish fading before the
            incoming one mounts, so the icon and the name below it sat blank
            together for a fifth of a second on every step — on a four-and-
            a-half second cycle that is a visible gap.
          */}
          <motion.div
            key={STEPS[active].id}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <ActiveIcon size={BIG_ICON} />
          </motion.div>
          {showCountdown && (
            <ProgressRing key={`${active}-${pickedAt}`} size={BIG_CIRCLE + 20} durationMs={AUTO_CYCLE_MS} stroke={4} />
          )}
        </div>

        {/*
          A paragraph, not a heading. It names a piece of UI state that
          changes every few seconds, which is not a document section, and
          the chips already carry which-of-four through aria-current. It is
          still read out as text.

          The floor holds two lines: two of the four titles wrap and two do
          not, and without it the column grew and shrank as the cycle came
          round.
        */}
        <motion.p
          key={STEPS[active].id}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="font-display font-extrabold text-[20px] leading-[1.25] mt-6 min-h-[50px]"
          style={{ color: DARK }}
        >
          {STEPS[active].title}
        </motion.p>
      </div>

      {/* RIGHT — the route, and what this step involves */}
      <div className="lg:col-start-2 lg:row-start-2 min-w-0">
        <div
          className="rounded-[28px] p-7 sm:p-9"
          style={{ background: "white", boxShadow: "0 8px 40px rgba(51,51,51,0.07)", border: "1px solid rgba(51,51,51,0.04)" }}
        >
          {/* Horizontal strip, tablet and up */}
          <div className="hidden sm:flex items-start justify-between">
            {STEPS.flatMap((step, i) => {
              const isActive = active === i;
              const Icon = step.icon;
              const connectorHighlighted = i < STEPS.length - 1 && active === i + 1;

              const buttonEl = (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => selectStep(i)}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={step.label}
                  className="flex flex-col items-center gap-2 shrink-0 rounded-2xl px-1 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{ background: "none", border: "none", cursor: "pointer", outlineColor: DARK }}
                >
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: reduceMotion ? 0 : i * 0.15, ease: "easeOut" }}
                  >
                    <motion.div
                      animate={{ scale: isActive ? 1.04 : 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: CHIP_CIRCLE,
                        height: CHIP_CIRCLE,
                        background: isActive ? YELLOW : "white",
                        border: `2px solid ${isActive ? YELLOW : "rgba(51,51,51,0.15)"}`,
                        boxShadow: isActive ? "0 10px 24px rgba(246,212,75,0.4), 0 3px 8px rgba(51,51,51,0.08)" : "none",
                        transition: "background 0.25s ease-out, border-color 0.25s ease-out, box-shadow 0.25s ease-out",
                      }}
                    >
                      <Icon size={CHIP_ICON} />
                    </motion.div>
                  </motion.div>
                  <motion.span
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.15 + 0.1 }}
                    className="font-display font-bold whitespace-nowrap text-[11.5px] leading-none"
                    style={{ color: isActive ? DARK : "rgba(51,51,51,0.4)" }}
                  >
                    {step.label}
                  </motion.span>
                </button>
              );

              if (i === STEPS.length - 1) return [buttonEl];

              const arrowEl = (
                <motion.div
                  key={`${step.id}-arrow`}
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 18, height: CHIP_CIRCLE }}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: connectorHighlighted ? 1 : inView ? 0.6 : 0 }}
                  transition={{ duration: 0.3, delay: reduceMotion ? 0 : i * 0.15 + 0.35, ease: "easeOut" }}
                >
                  <ArrowIcon highlighted={connectorHighlighted} />
                </motion.div>
              );

              return [buttonEl, arrowEl];
            })}
          </div>

          {/* Vertical strip, phones */}
          <div className="flex sm:hidden flex-col">
            {STEPS.map((step, i) => {
              const isActive = active === i;
              const Icon = step.icon;
              const connectorHighlighted = i < STEPS.length - 1 && (active === i || active === i + 1);
              return (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <button
                      type="button"
                      onClick={() => selectStep(i)}
                      aria-current={isActive ? "step" : undefined}
                      aria-label={step.label}
                      className="flex items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        width: MOBILE_CIRCLE,
                        height: MOBILE_CIRCLE,
                        background: isActive ? YELLOW : "white",
                        border: `2px solid ${isActive ? YELLOW : "rgba(51,51,51,0.15)"}`,
                        boxShadow: isActive ? "0 8px 20px rgba(246,212,75,0.4)" : "none",
                        cursor: "pointer",
                        outlineColor: DARK,
                      }}
                    >
                      <Icon size={MOBILE_ICON} />
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className="relative w-1 flex-1 my-1.5 rounded-full" style={{ minHeight: 28 }}>
                        <div className="absolute inset-0 rounded-full" style={{ background: "rgba(51,51,51,0.22)" }} />
                        <motion.div
                          className="absolute inset-0 top-0 origin-top rounded-full"
                          style={{ background: YELLOW }}
                          initial={reduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                          animate={{
                            scaleY: inView ? 1 : 0,
                            opacity: connectorHighlighted ? 1 : 0.7,
                          }}
                          transition={{
                            scaleY: { duration: 0.4, delay: reduceMotion ? 0 : i * 0.15 + 0.3, ease: "easeOut" },
                            opacity: { duration: 0.3, ease: "easeOut" },
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <p className="font-display font-bold text-[16px] pt-3.5 pb-6" style={{ color: isActive ? DARK : "rgba(51,51,51,0.4)" }}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/*
            What this step involves. The floor is measured against the
            narrowest this column gets, so the card does not change height
            as the cycle reaches a longer description and goes back to a
            shorter one.
          */}
          <div className="mt-7 pt-6 min-h-[168px] min-[500px]:min-h-[120px] sm:min-h-[96px]" style={{ borderTop: "1px solid rgba(51,51,51,0.08)" }}>
            <motion.p
              key={STEPS[active].id}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="text-[14.5px] leading-[1.65]"
              style={{ color: "rgba(51,51,51,0.65)" }}
            >
              {STEPS[active].description}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
