import type { ReactNode } from "react";

/**
 * A hand-drawn yellow circle that animates itself around a key word, like
 * it's being circled with a marker. Used ONCE per page maximum, by design —
 * same rule as Swash. Don't reach for this to "highlight important words"
 * generally; that's what cheapens it.
 */
export function CircleHighlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block px-1">
      <svg
        aria-hidden
        viewBox="0 0 120 60"
        preserveAspectRatio="none"
        className="absolute pointer-events-none"
        style={{ left: -10, right: -10, top: -10, bottom: -10, width: "calc(100% + 20px)", height: "calc(100% + 20px)", overflow: "visible" }}
      >
        <path
          d="M18 8 C 44 1, 90 2, 108 13 C 119 21, 116 41, 99 49 C 76 57, 30 56, 12 45 C -1 36, 2 15, 18 8 Z"
          fill="none"
          stroke="#F6D44B"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: 1, animation: "draw-circle 0.7s ease-out 0.4s forwards" }}
        />
      </svg>
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}
