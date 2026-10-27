"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * The shell a report sits in when it is opened from inside the app.
 *
 * Reports used to open in a new tab. That kept the study room alive, because
 * the room lives in the original tab, but it was confusing: you ended up with
 * two tabs, one of them a dead room, and no obvious way back to the live one.
 *
 * This is an intercepting route, so the URL still changes to the report and
 * the history entry is real. Closing is router.back(), which pops that entry
 * and returns to the station — the same thing the browser's own Back button
 * does, so the two cannot disagree. A refresh or a shared link skips the
 * interception entirely and renders the full page.
 *
 * The room, the call and the recorder are untouched throughout: this is a
 * soft navigation inside one document, and StudyRoomProvider sits above it
 * in the root layout.
 */
export function ReportModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => router.back(), [router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);

    // The page behind must not scroll while this is over it, or a flick on a
    // phone moves the station list under the report instead of the report.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [close]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Consultation report"
      onMouseDown={(e) => {
        // Only a press that both starts and ends on the backdrop closes it.
        // Selecting text inside the report and releasing outside it used to
        // count as a click on the backdrop and threw the report away.
        if (e.target === e.currentTarget) close();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(16,16,20,0.55)",
        // Above the study room dock, which is the one thing on this site that
        // deliberately floats over everything else.
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Full-bleed on a phone. A 95% box with a sliver of backdrop around it
        // is just a worse full screen, and it costs the report its margins.
        padding: "clamp(0px, calc((100vw - 640px) * 1000), 2.5vh) clamp(0px, calc((100vw - 640px) * 1000), 1.5vw)",
      }}
    >
      <div
        ref={panelRef}
        className="relative w-full"
        style={{
          // The report body is capped at 960px and centres itself, so a panel
          // wider than that is grey band either side of it and nothing else.
          // 1000 leaves room for the body plus its own px-4.
          maxWidth: 1000,
          height: "100%",
          maxHeight: "100%",
          background: "#F4F4F2",
          borderRadius: "clamp(0px, calc((100vw - 640px) * 1000), 16px)",
          boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close report"
          className="absolute flex items-center justify-center rounded-full transition-colors"
          style={{
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            // Sits over a scrolling report, so it carries its own background
            // rather than relying on whatever happens to be beneath it.
            background: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(51,51,51,0.14)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
            color: "#333333",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div style={{ overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch" }}>{children}</div>
      </div>
    </div>
  );
}
