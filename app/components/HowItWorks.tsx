"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";

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

const STEPS = [
  {
    id: "record",
    label: "Record",
    title: "Record Consultation",
    description: "Record directly on SCA Explained with your study partner. No downloads. No Zoom. No third-party software.",
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
    description: "An experienced GP reviews every consultation, verifies the scoring and provides personalised feedback before your report is finalised.",
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

const DESKTOP_CIRCLE = 120;
const DESKTOP_ICON = 44;
const MOBILE_CIRCLE = 76;
const MOBILE_ICON = 32;

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

  const ActiveIcon = STEPS[active].icon;

  return (
    <div
      ref={sectionRef}
      onMouseEnter={stopAutoPlay}
      onFocusCapture={stopAutoPlay}
      className="rounded-[28px] p-7 sm:p-10"
      style={{ background: "white", boxShadow: "0 8px 40px rgba(51,51,51,0.07)", border: "1px solid rgba(51,51,51,0.04)" }}
    >
      {/* Desktop / tablet: horizontal timeline */}
      <div className="hidden sm:flex items-start">
        {STEPS.map((step, i) => {
          const isActive = active === i;
          const Icon = step.icon;
          const connectorHighlighted = i < STEPS.length - 1 && (active === i || active === i + 1);
          return (
            <div key={step.id} className={i < STEPS.length - 1 ? "flex items-start flex-1" : "flex items-start"}>
              <button
                type="button"
                onClick={() => selectStep(i)}
                aria-current={isActive ? "step" : undefined}
                aria-label={step.title}
                className="flex flex-col items-center gap-4 shrink-0 rounded-2xl px-1 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
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
                      width: DESKTOP_CIRCLE,
                      height: DESKTOP_CIRCLE,
                      background: isActive ? YELLOW : "white",
                      border: `2px solid ${isActive ? YELLOW : "rgba(51,51,51,0.15)"}`,
                      boxShadow: isActive ? "0 14px 32px rgba(246,212,75,0.4), 0 3px 8px rgba(51,51,51,0.08)" : "none",
                      transition: "background 0.25s ease-out, border-color 0.25s ease-out, box-shadow 0.25s ease-out",
                    }}
                  >
                    <Icon size={DESKTOP_ICON} />
                  </motion.div>
                </motion.div>
                <motion.span
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.15 + 0.1 }}
                  className="font-display font-bold whitespace-nowrap text-[30px] leading-none"
                  style={{ color: isActive ? DARK : "rgba(51,51,51,0.4)" }}
                >
                  {step.label}
                </motion.span>
              </button>

              {i < STEPS.length - 1 && (
                <div className="relative flex-1 mx-2" style={{ marginTop: DESKTOP_CIRCLE / 2 - 2 }}>
                  <div className="absolute inset-0 rounded-full" style={{ height: 4, background: "rgba(51,51,51,0.12)" }} />
                  <motion.div
                    className="absolute inset-0 origin-left rounded-full"
                    style={{ height: 4, background: YELLOW }}
                    initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
                    animate={{
                      scaleX: inView ? 1 : 0,
                      opacity: connectorHighlighted ? 1 : 0.55,
                    }}
                    transition={{
                      scaleX: { duration: 0.5, delay: reduceMotion ? 0 : i * 0.15 + 0.35, ease: "easeOut" },
                      opacity: { duration: 0.3, ease: "easeOut" },
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical timeline */}
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
                  <div className="relative w-1 flex-1 my-1.5 rounded-full" style={{ minHeight: 36 }}>
                    <div className="absolute inset-0 rounded-full" style={{ background: "rgba(51,51,51,0.12)" }} />
                    <motion.div
                      className="absolute inset-0 top-0 origin-top rounded-full"
                      style={{ background: YELLOW }}
                      initial={reduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                      animate={{
                        scaleY: inView ? 1 : 0,
                        opacity: connectorHighlighted ? 1 : 0.55,
                      }}
                      transition={{
                        scaleY: { duration: 0.4, delay: reduceMotion ? 0 : i * 0.15 + 0.3, ease: "easeOut" },
                        opacity: { duration: 0.3, ease: "easeOut" },
                      }}
                    />
                  </div>
                )}
              </div>
              <p className="font-display font-bold text-[19px] pt-4 pb-8" style={{ color: isActive ? DARK : "rgba(51,51,51,0.4)" }}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Single description panel — updates on step selection */}
      <div className="mt-9 pt-7" style={{ borderTop: "1px solid rgba(51,51,51,0.08)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={STEPS[active].id}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <ActiveIcon size={24} />
              <h3 className="font-display font-extrabold text-[19px]" style={{ color: DARK }}>
                {STEPS[active].title}
              </h3>
            </div>
            <p className="text-[14.5px] leading-[1.65]" style={{ color: "rgba(51,51,51,0.65)" }}>
              {STEPS[active].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
