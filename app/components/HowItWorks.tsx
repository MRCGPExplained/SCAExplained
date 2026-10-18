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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    description: "Every consultation is read by an experienced GP — one of the educators who wrote the cases — who verifies the scoring and writes feedback on what actually happened in yours.",
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
 * and absent once someone takes control — at that point nothing is counting
 * down and a ring would be describing something that is not happening.
 *
 * It lives on the large icon only. It was on the small chips first, and two
 * rings drawing the same countdown in the same card was one too many: the
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

// The chips shrank when the large icon arrived. They are now a progress
// strip rather than the subject of the card, and at the old 56px they were
// competing with the thing they are meant to be indexing.
const CHIP_CIRCLE = 46;
const CHIP_ICON = 19;
const MOBILE_CIRCLE = 60;
const MOBILE_ICON = 26;

// The whole point of the left column. 156 against a 46px chip is a ratio of
// roughly three and a half, which is the smallest gap that still reads as
// "this is the step you are on" from across the page rather than as two
// sizes of the same thing.
const BIG_CIRCLE = 156;
const BIG_ICON = 62;

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  // Auto-cycles through the steps until the user does anything with the
  // component — click, hover, or tab into it. Interaction wins permanently;
  // we never resume auto-play once a person has taken control.
  useEffect(() => {
    if (!autoPlaying || reduceMotion) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % STEPS.length);
    }, AUTO_CYCLE_MS);
    return () => clearInterval(id);
  }, [autoPlaying, reduceMotion]);

  function stopAutoPlay() {
    setAutoPlaying(false);
  }

  function selectStep(i: number) {
    stopAutoPlay();
    setActive(i);
  }

  // Only while something is actually counting down. Once a reader takes
  // control the component stops advancing, and a ring would then be drawing
  // toward an event that is never going to happen.
  const showCountdown = autoPlaying && !reduceMotion && inView;

  const ActiveIcon = STEPS[active].icon;

  return (
    <div
      ref={sectionRef}
      onMouseEnter={stopAutoPlay}
      onFocusCapture={stopAutoPlay}
      className="rounded-[28px] p-7 sm:p-10"
      style={{ background: "white", boxShadow: "0 8px 40px rgba(51,51,51,0.07)", border: "1px solid rgba(51,51,51,0.04)" }}
    >
      {/*
        Two columns: the step you are on, large, on the left; the route
        through all four and what this one involves on the right. The card
        used to be the timeline with a caption under it, which made the
        four chips the subject — and the four chips are the least
        interesting thing here, because they are the same four chips on
        every step. Side by side splits the work properly: the right column
        answers "where am I", the left answers "in what".

        Stacked below md, where the right column would be too narrow for
        the horizontal strip to breathe.
      */}
      <div className="grid grid-cols-1 md:grid-cols-[176px_minmax(0,1fr)] gap-8 md:gap-9 items-center">

        {/* LEFT — the active step, large */}
        <div className="flex flex-col items-center text-center">
          <div
            aria-hidden="true"
            className="relative flex items-center justify-center rounded-full shrink-0"
            style={{
              width: BIG_CIRCLE,
              height: BIG_CIRCLE,
              background: YELLOW,
              boxShadow: "0 18px 44px rgba(246,212,75,0.45), 0 4px 12px rgba(51,51,51,0.06)",
            }}
          >
            {/*
              Keyed remount rather than an AnimatePresence cross-fade. With
              mode="wait" the outgoing step has to finish fading before the
              incoming one mounts, so the icon, the title and the paragraph
              all sat blank together for a fifth of a second on every step
              — on a four-and-a-half second cycle that is a visible gap, and
              this card changes often enough to notice it. Swapping on the
              key and fading the new one in reads as the same animation with
              nothing missing in the middle.
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
              <ProgressRing key={active} size={BIG_CIRCLE + 16} durationMs={AUTO_CYCLE_MS} stroke={3.5} />
            )}
          </div>

          {/*
            The step's full name, not the chip's short label. It is the only
            place the title appears now — the description panel used to
            repeat it under its own copy of the icon, which was the same
            words twice within 200px.
          */}
          <motion.h3
            key={STEPS[active].id}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            // Two of the four titles wrap to a second line and two do not,
            // so without a floor the whole card grew and shrank by 21px as
            // the cycle came round. Held at two lines, the left column is a
            // fixed 218px and the card stops breathing.
            className="font-display font-extrabold text-[17px] leading-[1.25] mt-5 min-h-[43px]"
            style={{ color: DARK }}
          >
            {STEPS[active].title}
          </motion.h3>
        </div>

        {/* RIGHT — the route, and what this step involves */}
        <div className="min-w-0">
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
                  aria-label={step.title}
                  className="flex flex-col items-center gap-2 shrink-0 rounded-2xl px-1 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{ background: "none", border: "none", cursor: "pointer", outlineColor: YELLOW }}
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
                    className="font-display font-bold whitespace-nowrap text-[11px] leading-none"
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
                  style={{ width: 16, height: CHIP_CIRCLE }}
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
                      aria-label={step.title}
                      className="flex items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        width: MOBILE_CIRCLE,
                        height: MOBILE_CIRCLE,
                        background: isActive ? YELLOW : "white",
                        border: `2px solid ${isActive ? YELLOW : "rgba(51,51,51,0.15)"}`,
                        boxShadow: isActive ? "0 8px 20px rgba(246,212,75,0.4)" : "none",
                        cursor: "pointer",
                        outlineColor: YELLOW,
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
            What this step involves. The floor is set only from xl, where
            this column is a fixed 383px and the longest of the four runs
            to exactly four lines. Below xl the column is anywhere from
            400px to 860px wide, so a reserve tight enough to matter at one
            width is dead space at another — and it is not needed there,
            because the left column is the taller of the two.
          */}
          <div className="mt-7 pt-6 xl:min-h-[120px]" style={{ borderTop: "1px solid rgba(51,51,51,0.08)" }}>
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
