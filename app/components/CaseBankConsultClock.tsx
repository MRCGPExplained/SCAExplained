"use client";

import { useEffect, useRef, useState } from "react";

const NAVY = "#1F2937";

// Twelve minutes is the exam, and the panel opens part-way through one so
// the bar has somewhere to go in both directions.
const TOTAL_SECONDS = 12 * 60;
const START_SECONDS = 8 * 60 + 14;

function mmss(total: number) {
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/**
 * The consultation clock in the case bank panel, running.
 *
 * It lands on 00:00 and stays there rather than looping. A clock that resets
 * itself is a clock nobody is really being timed by, and the whole point of
 * this panel is that the twelve minutes are real — looping would undo the
 * thing it is there to show. Reaching zero takes eight and a quarter minutes
 * of unbroken on-screen time, so in practice it is the ticking that gets
 * seen; the resting state just needs to be honest when it arrives.
 *
 * Its own client component so the rest of the panel stays on the server, and
 * it only runs while on screen and while the tab is visible.
 */
export function CaseBankConsultClock() {
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Read in the effect, not in render: a media query answered on the client
    // but not the server is a hydration mismatch waiting to happen.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let id: ReturnType<typeof setInterval> | null = null;
    const remaining = { current: START_SECONDS };

    // Measured live, every time, rather than cached from an
    // IntersectionObserver callback. The first version kept an `onScreen`
    // flag that only the observer wrote: once it had gone false, a
    // visibilitychange could fire, find the flag still false and refuse to
    // restart, and the observer had no reason to fire again because the
    // intersection itself had not changed. The clock ticked once and
    // stopped for good. A flag that only one source may update is a flag
    // that can be wrong; the rectangle cannot.
    const onScreen = () => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    const stop = () => {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    };
    const sync = () => {
      if (remaining.current > 0 && !document.hidden && onScreen()) {
        if (id === null) {
          id = setInterval(() => {
            remaining.current = Math.max(0, remaining.current - 1);
            setSecondsLeft(remaining.current);
            // Stopping here rather than inside the state updater: updaters can
            // be called more than once for a render and must stay pure.
            if (remaining.current === 0) stop();
          }, 1000);
        }
      } else {
        stop();
      }
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    document.addEventListener("visibilitychange", sync);

    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 w-full">
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(26,27,82,0.45)" }}>
        Consultation
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: NAVY, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
        {mmss(secondsLeft)}
      </div>
      {/* Remaining, out of the twelve minutes the exam allows. */}
      <div className="rounded-full overflow-hidden" style={{ height: 3, width: "100%", background: "rgba(31,41,55,0.10)" }}>
        <div
          style={{
            width: `${(secondsLeft / TOTAL_SECONDS) * 100}%`,
            height: "100%",
            background: NAVY,
            borderRadius: 999,
            transition: "width 1s linear",
          }}
        />
      </div>
      <div style={{ fontSize: 10, color: "rgba(26,27,82,0.35)", textAlign: "center" }}>Stops itself at 12:00</div>
    </div>
  );
}
