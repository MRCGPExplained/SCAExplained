"use client";

import { useState } from "react";
import Link from "next/link";
import { StudyRoomPanel } from "../StudyRoom";
import { StudyRoomTimer } from "./StudyRoomTimer";
import { useStudyRoom, useStudyRoomTimer } from "./context";

const NAVY = "#1F2937";

/**
 * Its own component so that the once-a-second tick stops here. The dock renders
 * the whole study room panel — chat included — when open, and subscribing the
 * dock itself to the timer context would re-render all of it every second.
 */
function DockClock() {
  const { timeLeft, running } = useStudyRoomTimer();
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <span
      className="font-display font-extrabold text-[15px] tracking-[0.04em]"
      style={{ color: running ? "white" : "rgba(255,255,255,0.35)" }}
    >
      {mins}:{secs}
    </span>
  );
}

/**
 * The room, floated over whatever page you are on when that page is not a
 * station. The station page has the panel in its sidebar; everywhere else used
 * to show nothing at all, so a session you had not left looked exactly like one
 * you had — no clock, no participants, and no way to leave short of navigating
 * back to a case first.
 *
 * `StudyRoomTimer` stays mounted even while the dock is collapsed. The
 * one-second interval lives inside it, so unmounting it to save space would
 * stop the clock for everyone reading it, which is the bug this is here to
 * avoid.
 */
export function StudyRoomDock() {
  const [open, setOpen] = useState(false);
  const { room, participants, connectedIds, iAmHost } = useStudyRoom();

  if (!room) return null;

  const here = participants.filter((p) => connectedIds.has(p.userId)).length;
  const hostStation = room.current_station_number;

  return (
    <div
      className="fixed flex flex-col gap-2"
      style={{
        /*
          Above everything, including the report overlay.

          stationNumber comes from the pathname, so opening a report already
          made it null and this dock already rendered — it was simply painted
          under an opaque full-screen overlay at 3000. The session is the one
          thing that should never be covered: it is live, it is shared with
          other people, and it holds the only Leave button.
        */
        zIndex: 3100,
        right: 16,
        bottom: 16,
        width: 268,
        maxWidth: "calc(100vw - 32px)",
        // The panel grows with the chat, and this sits over pages of any
        // height — without a ceiling it runs off the top of a short viewport,
        // taking the collapse control with it.
        maxHeight: "calc(100vh - 32px)",
        overflowY: "auto",
      }}
    >
      {/* Timer above the panel, matching the station page. The clock is the
          thing being watched during a session and the dock grows downward as
          the chat fills, so with the panel first the timer drifted further
          from the top of the stack the longer the room was used.

          Hidden rather than unmounted while collapsed — see the note above. */}
      <div style={{ display: open ? "block" : "none" }}>
        <StudyRoomTimer />
      </div>

      {open && <StudyRoomPanel />}

      <div
        className="rounded-xl overflow-hidden shadow-lg shrink-0"
        style={{ background: NAVY, border: "1px solid rgba(255,255,255,0.10)" }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 text-left"
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
        >
          <span className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "white" }}>
              Study Group
            </span>
            <span className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
              {room.room_code} · {here} here
            </span>
          </span>
          <span className="flex items-center gap-2 shrink-0">
            <DockClock />
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              {open ? "▾" : "▴"}
            </span>
          </span>
        </button>

        {/* Where the case is. A guest who has stepped off a station is no longer
            dragged back to it, so this is how they find their way in again. */}
        {hostStation !== null && (
          <Link
            href={`/case-bank/${hostStation}`}
            className="block px-3.5 py-2 text-[10px]"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {iAmHost ? "Back to" : "Room is on"} Station {hostStation} →
          </Link>
        )}
      </div>
    </div>
  );
}
