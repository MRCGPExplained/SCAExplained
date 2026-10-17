"use client";

import { useEffect, useRef, useState } from "react";

const NAVY = "#1F2937";

// A consultation is twelve minutes, the same as the exam. The panel opens
// part-way through one so the bar has somewhere to go in both directions —
// a full bar reads as "not started" and an empty one as "over".
const TOTAL_SECONDS = 12 * 60;
const START_SECONDS = 8 * 60 + 14;

function mmss(total: number) {
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/**
 * The consultation clock from the study room, running.
 *
 * It was a painted-on 08:14, and a still of a timer is a slightly odd thing
 * to put on a page selling a timed exam — the one detail a reader might
 * actually watch was the one detail holding still. So it counts, and loops
 * back to the top rather than sitting at zero, because the panel is a
 * illustration of the room in use and not a take anybody is waiting on.
 *
 * Its own client component so the rest of the mockup stays on the server:
 * the markup around it is static and there is no reason to ship it twice.
 *
 * Only ticks while on screen and while the page is visible. The homepage
 * renders this below the fold, and a 1 Hz re-render on a backgrounded tab is
 * a thing phones notice.
 */
export function StudyRoomClock() {
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Read in the effect rather than in render: a media query answered on the
    // client but not the server is a hydration mismatch waiting to happen.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let id: ReturnType<typeof setInterval> | null = null;
    let onScreen = false;

    const stop = () => {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    };
    const sync = () => {
      if (onScreen && !document.hidden) {
        if (id === null) {
          id = setInterval(() => {
            setSecondsLeft((s) => (s <= 1 ? START_SECONDS : s - 1));
          }, 1000);
        }
      } else {
        stop();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-xl px-4 py-3 text-center"
      style={{ background: "white", border: `2px solid ${NAVY}` }}
    >
      <div className="font-bold uppercase" style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(31,41,55,0.4)" }}>
        Consultation
      </div>
      <div
        className="font-extrabold"
        style={{ fontSize: 26, color: NAVY, fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" }}
      >
        {mmss(secondsLeft)}
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: 3, background: "rgba(31,41,55,0.08)", marginTop: 6 }}>
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
    </div>
  );
}
