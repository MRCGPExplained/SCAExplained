"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStudyRoomStatus } from "@/app/case-bank/components/study-room/context";

const DARK = "#333333";

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

  /*
    What is underneath, so the bar can name it.

    A full-bleed opaque overlay reads as a page, which is what is wanted —
    but it cannot show you the room through itself the way a dimmed backdrop
    could. So it says so instead, in words, in a bar that is always on
    screen. Guessing is not needed: the room's own state is right here.
  */
  const { inRoom, hostStationNumber, stationNumber, isRecordingActive } = useStudyRoomStatus();
  const station = stationNumber ?? hostStationNumber;

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

    // Nothing in here is focusable until the report renders, so focus the
    // panel itself: a screen reader then starts inside the dialog rather
    // than wherever the link that opened it happened to be.
    panelRef.current?.focus();

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
        // Below the navbar, not over it. The navbar is part of what makes
        // this read as a page rather than a dialog, and it keeps the
        // envelope and Account reachable while a report is open.
        top: 56,
        left: 0,
        right: 0,
        bottom: 0,
        // The page's own background, opaque. It was a dimmed backdrop around
        // a rounded 1000px panel, which is what made it feel like a dialog
        // box — rounded corners, a shadow and a width cap all say "this is a
        // thing on top of the page" when what is wanted is the page.
        //
        // Nothing about the behaviour changes: Escape closes it, the
        // return bar closes it, Back closes it, the URL is still the
        // report's, and the room underneath is still mounted and running.
        background: "#F4F4F2",
        // Above the study room dock, which deliberately floats over
        // everything else.
        zIndex: 3000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full"
        style={{
          // No width cap, no radius, no shadow, no background of its own.
          // The report body already caps itself at 960px and centres, exactly
          // as it does on the real page, so this just gets out of its way.
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/*
          The return bar. This is the whole answer to "it looks like a page,
          so how do I know the room is still there".

          Dark, like the navbar directly above it, so the two read as one
          piece of chrome and the eye sees: site bar, you-are-one-level-deep
          bar, page. Outside the scrolling area, so it cannot leave the
          screen — it is the only way out now that the floating X is gone,
          and a way out you have to scroll to find is not one.
        */}
        <div
          className="flex items-center justify-between gap-3 px-4 sm:px-6"
          style={{ background: DARK, height: 44, flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            type="button"
            onClick={close}
            className="flex items-center gap-2 text-[12.5px] font-semibold rounded-md px-2.5 py-1.5 -ml-2.5"
            style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}
          >
            <span aria-hidden="true">←</span>
            {inRoom
              ? station
                ? `Back to the study room (Station ${station})`
                : "Back to the study room"
              : "Back"}
          </button>

          {/* Proof, not reassurance: this only shows when a room really is
              open, and it says what that room is doing. */}
          {inRoom && (
            <span
              className="flex items-center gap-1.5 text-[11.5px] shrink-0"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <span
                className="rounded-full shrink-0"
                style={{
                  width: 7,
                  height: 7,
                  background: isRecordingActive ? "#EF4444" : "#4ADE80",
                }}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                {isRecordingActive ? "Still recording" : "Still connected"}
              </span>
            </span>
          )}
        </div>

        <div style={{ overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch" }}>{children}</div>
      </div>
    </div>
  );
}
