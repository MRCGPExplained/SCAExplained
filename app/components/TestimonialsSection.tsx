"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar } from "./Avatar";

const DARK = "#333333";
const YELLOW = "#F6D44B";
const AUTO_ADVANCE_MS = 6000;
const VISIBLE = 3;

type Testimonial = { id: string; quote: string; name: string; vts: string | null; sca_date: string | null; photo_url: string | null; initials: string | null };

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke={DARK}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const n = testimonials.length;
  const canCycle = n > VISIBLE;
  const [start, setStart] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    if (!canCycle) return;
    const id = setInterval(() => {
      setDirection(1);
      setStart((s) => (s + 1) % n);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [canCycle, n, start]);

  if (n === 0) return null;

  const visible = canCycle
    ? Array.from({ length: VISIBLE }, (_, i) => testimonials[(start + i) % n])
    : testimonials;

  const goTo = (delta: 1 | -1) => {
    setDirection(delta);
    setStart((s) => (s + delta + n) % n);
  };

  return (
    <section className="px-10 pb-16 max-md:px-6">
      <div className="max-w-[1250px] mx-auto">
        <h2 className="font-display font-extrabold text-[22px] mb-6" style={{ color: DARK }}>
          Testimonials
        </h2>
        <div className="flex items-center gap-4">
          {canCycle && (
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label="Previous testimonials"
              className="shrink-0 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
              style={{ width: 36, height: 36, border: "1px solid rgba(51,51,51,0.15)", background: "white" }}
            >
              <ArrowIcon direction="left" />
            </button>
          )}

          <div className="grow overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={start}
                custom={direction}
                initial={{ x: direction * 36, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -direction * 36, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {visible.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-[20px] p-6 flex flex-col items-center text-center bg-white"
                    style={{ border: "1px solid rgba(51,51,51,0.08)" }}
                  >
                    <Avatar name={t.name} photoUrl={t.photo_url} initials={t.initials} size={56} />
                    <p className="font-display font-bold text-[13.5px] mt-3" style={{ color: DARK }}>{t.name}</p>
                    {(t.vts || t.sca_date) && (
                      <p className="text-[12px] mt-0.5" style={{ color: "rgba(51,51,51,0.45)" }}>
                        {[t.vts, t.sca_date].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <span className="font-display font-extrabold text-[28px] leading-none mt-4 mb-1" style={{ color: YELLOW }}>&ldquo;</span>
                    <p className="text-[14px] leading-[1.65] grow" style={{ color: "rgba(51,51,51,0.75)" }}>
                      {t.quote}
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {canCycle && (
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label="Next testimonials"
              className="shrink-0 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
              style={{ width: 36, height: 36, border: "1px solid rgba(51,51,51,0.15)", background: "white" }}
            >
              <ArrowIcon direction="right" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
