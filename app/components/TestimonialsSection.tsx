"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Avatar } from "./Avatar";

const DARK = "#333333";
const YELLOW = "#F6D44B";
const AUTO_ADVANCE_MS = 6000;
const GAP = 24;

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

function TestimonialCard({ t, widthPx }: { t: Testimonial; widthPx: number }) {
  return (
    <div
      className="rounded-[20px] p-6 flex flex-col items-center text-center bg-white min-h-[280px] shrink-0"
      style={{ border: "1px solid rgba(51,51,51,0.08)", width: widthPx || undefined, flexBasis: widthPx || undefined }}
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
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const n = testimonials.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [pos, setPos] = useState(0);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setContainerWidth(el.offsetWidth);
      setVisibleCount(window.innerWidth < 768 ? 1 : 3);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, []);

  const canCycle = n > visibleCount;

  useEffect(() => {
    if (!canCycle) return;
    const id = setInterval(() => setPos((p) => p + 1), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [canCycle, pos]);

  useEffect(() => {
    if (instant) {
      const id = requestAnimationFrame(() => setInstant(false));
      return () => cancelAnimationFrame(id);
    }
  }, [instant]);

  if (n === 0) return null;

  const cardWidth = containerWidth > 0 && visibleCount > 0
    ? (containerWidth - (visibleCount - 1) * GAP) / visibleCount
    : 0;
  const step = cardWidth + GAP;

  // Three copies laid end to end so the window can slide continuously in
  // either direction; landing on a copy boundary snaps back by n (identical
  // content, so it's invisible) instead of ever hitting the array edge.
  const extended = canCycle ? [...testimonials, ...testimonials, ...testimonials] : testimonials;
  const trackX = canCycle ? -(n + pos) * step : 0;

  function handleAnimationComplete() {
    if (Math.abs(pos) >= n) {
      setInstant(true);
      setPos((p) => p - Math.sign(p) * n);
    }
  }

  const goTo = (delta: 1 | -1) => setPos((p) => p + delta);

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

          <div ref={containerRef} className="grow overflow-hidden">
            {canCycle ? (
              <motion.div
                className="flex"
                style={{ gap: GAP }}
                animate={{ x: trackX }}
                transition={{ duration: instant ? 0 : 0.4, ease: "easeInOut" }}
                onAnimationComplete={handleAnimationComplete}
              >
                {extended.map((t, i) => (
                  <TestimonialCard key={`${t.id}-${i}`} t={t} widthPx={cardWidth} />
                ))}
              </motion.div>
            ) : (
              <div className="flex" style={{ gap: GAP }}>
                {testimonials.map((t) => (
                  <TestimonialCard key={t.id} t={t} widthPx={cardWidth} />
                ))}
              </div>
            )}
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
