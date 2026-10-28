"use client";

import { useState } from "react";
import Link from "next/link";
import { StudyRoomPanel } from "../StudyRoom";
import { StudyRoomTimer } from "./StudyRoomTimer";
import { useStudyRoom, useStudyRoomStatus, useStudyRoomTimer } from "./context";

/** Matches the navbar exactly. The bar sits opposite it at the bottom of the
 *  page, so the two frame the content as one piece of chrome — and a near-miss
 *  (this was #1F2937 while the navbar is #333333) is visible once they face
 *  each other. */
const DARK = "#333333";
const YELLOW = "#F6D44B";
const BAR_HEIGHT = 44;

/**
 * Its own component so that the once-a-second tick stops here. The bar renders
 * the whole study room panel — chat included — when open, and subscribing the
 * bar itself to the timer context would re-render all of it every second.
 *
 * It shows the PHASE as well as the clock. The old collapsed dock had room for
 * a bare mm:ss and nothing else, so the number was ambiguous: three minutes of
 * pre-read and twelve of consultation look identical halfway through.
 */
function BarClock() {
  const { phase, timeLeft, running } = useStudyRoomTimer();
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <span className="flex items-baseline gap-1.5 shrink-0">
      <span className="text-[11px] hidden sm:inline" style={{ color: "rgba(255,255,255,0.5)" }}>
        {phase === "PREREAD" ? "Pre-read" : "Consultation"}
      </span>
      <span
        className="font-display font-extrabold text-[14px] tracking-[0.04em] tabular-nums"
        style={{ color: running ? "white" : "rgba(255,255,255,0.35)" }}
      >
        {mins}:{secs}
      </span>
    </span>
  );
}

/**
 * The room, as a bar along the bottom of every page that is not a station.
 *
 * It was a card floating at bottom-right. That covered the right-hand end of
 * the text column — 268px wide at right:16 against a 960px centred column
 * overlaps by 764 − vw/2, so about 124px at 1280 and more on anything smaller,
 * at every scroll position, since it is fixed. Shrinking it would have made
 * that smaller; a bar removes it. The page is padded by exactly the bar's
 * height, so nothing is ever underneath it at any width.
 *
 * Opening it raises the panel from the bar rather than growing a card
 * downward. That is the one case where something does cover the page, and it
 * is the case where the person asked for it.
 *
 * `StudyRoomTimer` stays mounted even while collapsed. The one-second interval
 * lives inside it, so unmounting it to save space would stop the clock for
 * everyone reading it, which is the bug this is here to avoid.
 */
export function StudyRoomDock() {
  const [open, setOpen] = useState(false);
  const { room, participants, connectedIds } = useStudyRoom();
  const { isRecordingActive } = useStudyRoomStatus();

  if (!room) return null;

  const here = participants.filter((p) => connectedIds.has(p.userId)).length;
  const hostStation = room.current_station_number;

  return (
    <>
      {/*
        The whole point. A fixed bar covers whatever is under it forever; this
        spacer is a normal flex child of <body>, so the page simply ends that
        much higher and there is nothing to cover. Rendered beside the bar so
        the two cannot get out of step — if one is on screen, so is the other.
      */}
      <div style={{ height: BAR_HEIGHT, flexShrink: 0 }} aria-hidden="true" />

      {/* The panel, raised from the bar. Right-aligned rather than full width:
          it is a chat column, and a chat stretched across a desktop is worse
          than one that stays a column. */}
      {open && (
        <div
          className="fixed flex flex-col gap-2"
          style={{
            right: 16,
            bottom: BAR_HEIGHT + 12,
            width: 268,
            maxWidth: "calc(100vw - 32px)",
            maxHeight: `calc(100vh - ${BAR_HEIGHT + 24}px)`,
            overflowY: "auto",
            zIndex: 50,
          }}
        >
          <StudyRoomTimer />
          <StudyRoomPanel />
        </div>
      )}

      {/* Mounted but not shown while collapsed — see the note above. */}
      {!open && (
        <div style={{ display: "none" }}>
          <StudyRoomTimer />
        </div>
      )}

      <div
        className="fixed left-0 right-0 bottom-0 flex items-center gap-3 px-4 sm:px-6"
        style={{
          height: BAR_HEIGHT,
          background: DARK,
          borderTop: "1px solid rgba(255,255,255,0.10)",
          zIndex: 50,
        }}
      >
        {/* Live, and what it is doing. Not the whole bar: a 44px strip in a
            signal colour shouts permanently and stops meaning anything. */}
        <span
          className="shrink-0 rounded-full"
          style={{ width: 7, height: 7, background: isRecordingActive ? "#EF4444" : "#4ADE80" }}
          aria-hidden="true"
        />

        <BarClock />

        <span className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
          <span className="hidden sm:inline">{room.room_code} · </span>
          {here} here
        </span>

        <span className="flex-1" />

        {/* Where the case is. A guest who has stepped off a station is no
            longer dragged back to it, so this is how they find their way in
            again. Yellow because it is the one thing here meant to be
            pressed — the bar around it stays quiet so this still reads as an
            action rather than as more furniture. */}
        {hostStation !== null && (
          <Link
            href={`/case-bank/${hostStation}`}
            className="shrink-0 text-[11.5px] font-bold px-3 py-1.5 rounded-md no-underline"
            style={{ background: YELLOW, color: DARK }}
          >
            <span className="hidden sm:inline">Return to station </span>
            <span className="sm:hidden">Station </span>
            {hostStation} →
          </Link>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="shrink-0 text-[11.5px] font-semibold px-3 py-1.5 rounded-md"
          style={{
            background: open ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          <span className="hidden sm:inline">Study group </span>
          {open ? "▾" : "▴"}
        </button>
      </div>
    </>
  );
}
