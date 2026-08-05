"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";

const DARK = "#333333";
const YELLOW = "#F6D44B";

function MicOutline() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="2" width="8" height="13" rx="4" stroke={DARK} strokeWidth="1.6" />
      <path d="M5 11a7 7 0 0 0 14 0" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="22" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="9" y1="22" x2="15" y2="22" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ScanOutline() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={DARK} strokeWidth="1.6" />
      <line x1="15.2" y1="15.2" x2="20" y2="20" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10.5 7.8v5.4M7.8 10.5h5.4" stroke={DARK} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function DoctorOutline() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="7" r="3.2" stroke={DARK} strokeWidth="1.6" />
      <path d="M4.5 20c0-3.9 3.4-6 7.5-6s7.5 2.1 7.5 6" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 15.2l2 2.3 2-2.3" stroke={DARK} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentOutline() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    icon: ScanOutline,
  },
  {
    id: "gp",
    label: "GP Review",
    title: "GP Review",
    description: "An experienced GP reviews every consultation, verifies the scoring and provides personalised feedback before your report is finalised.",
    icon: DoctorOutline,
  },
  {
    id: "report",
    label: "Report",
    title: "Receive Your Report",
    description: "Your finalised report lands in your account with clear scores and examiner comments, so you know exactly what to improve before exam day.",
    icon: DocumentOutline,
  },
] as const;

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  const ActiveIcon = STEPS[active].icon;

  return (
    <div ref={sectionRef}>
      {/* Desktop / tablet: horizontal timeline */}
      <div className="hidden sm:flex items-start">
        {STEPS.map((step, i) => {
          const isActive = active === i;
          const Icon = step.icon;
          return (
            <div key={step.id} className={i < STEPS.length - 1 ? "flex items-start flex-1" : "flex items-start"}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={isActive ? "step" : undefined}
                aria-label={step.title}
                className="flex flex-col items-center gap-2.5 shrink-0 rounded-lg px-1 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ background: "none", border: "none", cursor: "pointer", outlineColor: YELLOW }}
              >
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: reduceMotion ? 0 : i * 0.15, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{ scale: isActive ? 1.12 : 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 56,
                      height: 56,
                      background: isActive ? YELLOW : "white",
                      border: `1.5px solid ${isActive ? YELLOW : "rgba(51,51,51,0.15)"}`,
                      transition: "background 0.25s ease-out, border-color 0.25s ease-out",
                    }}
                  >
                    <Icon />
                  </motion.div>
                </motion.div>
                <motion.span
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.15 + 0.1 }}
                  className="text-[13px] font-bold whitespace-nowrap"
                  style={{ color: isActive ? DARK : "rgba(51,51,51,0.45)" }}
                >
                  {step.label}
                </motion.span>
              </button>

              {i < STEPS.length - 1 && (
                <div className="relative flex-1 mt-[27px] mx-1.5 h-[1.5px]">
                  <div className="absolute inset-0" style={{ background: "rgba(51,51,51,0.12)" }} />
                  <motion.div
                    className="absolute inset-0 origin-left"
                    style={{ background: YELLOW }}
                    initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.5, delay: reduceMotion ? 0 : i * 0.15 + 0.35, ease: "easeOut" }}
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
          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={step.title}
                  className="flex items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    width: 48,
                    height: 48,
                    background: isActive ? YELLOW : "white",
                    border: `1.5px solid ${isActive ? YELLOW : "rgba(51,51,51,0.15)"}`,
                    cursor: "pointer",
                    outlineColor: YELLOW,
                  }}
                >
                  <Icon />
                </button>
                {i < STEPS.length - 1 && (
                  <div className="relative w-[1.5px] flex-1 my-1" style={{ minHeight: 32 }}>
                    <div className="absolute inset-0" style={{ background: "rgba(51,51,51,0.12)" }} />
                    <motion.div
                      className="absolute inset-0 top-0 origin-top"
                      style={{ background: YELLOW }}
                      initial={reduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                      animate={inView ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.15 + 0.3, ease: "easeOut" }}
                    />
                  </div>
                )}
              </div>
              <p className="text-[13.5px] font-bold pt-3 pb-6" style={{ color: isActive ? DARK : "rgba(51,51,51,0.45)" }}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Single description panel — updates on step selection */}
      <div className="mt-6 rounded-2xl p-6" style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={STEPS[active].id}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <ActiveIcon />
              <h3 className="font-display font-extrabold text-[17px]" style={{ color: DARK }}>
                {STEPS[active].title}
              </h3>
            </div>
            <p className="text-[14px] leading-[1.65]" style={{ color: "rgba(51,51,51,0.65)" }}>
              {STEPS[active].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
