"use client";

import { useRouter } from "next/navigation";

/**
 * Sits where the real page puts "← My Recordings", and closes the overlay.
 *
 * Two reasons it exists rather than the slot being left empty. The header is
 * justify-between with three children, so an empty left slot drags the
 * station title off centre and the page stops looking like the page. And
 * when a report is open over a study room, "back" must not mean "leave" —
 * this pops the history entry the overlay added and puts you back exactly
 * where you were, room still running.
 */
export function CloseReportButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold shrink-0"
      style={{
        border: "1px solid rgba(51,51,51,0.12)",
        color: "rgba(51,51,51,0.6)",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      ← Close
    </button>
  );
}
