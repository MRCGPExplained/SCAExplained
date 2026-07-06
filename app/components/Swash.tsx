import type { ReactNode } from "react";

/**
 * The signature hand-drawn yellow highlighter swash behind a key word —
 * rotated slightly with an irregular border-radius for a hand-marked feel.
 * Used ONCE per page maximum, by design. Don't reach for this to "highlight
 * important words" generally; that's what cheapens it.
 */
export function Swash({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block px-1.5">
      <span
        aria-hidden
        className="absolute left-[-4px] right-[-4px] top-[12%] bottom-[8%] bg-yellow -rotate-1 z-0"
        style={{ borderRadius: "3px 6px 4px 7px / 6px 3px 7px 4px", transformOrigin: "left", animation: "highlight 0.6s ease-out 0.3s both" }}
      />
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}
