"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { joinStudyRoomAction } from "../case-bank/actions";

const DARK = "#333333";

/**
 * Joining a room used to mean finding the panel, which only exists once you are
 * already inside a case — open the case bank, pick a station you did not want,
 * find the sidebar, type the code, then get moved to wherever the host actually
 * is. Four steps, three of them noise, and the reason no room in this app has
 * ever had a second person in it who did not arrive by invite link.
 *
 * Here it is one step, and it lands you on the host's case rather than a
 * station you picked at random on the way past.
 */
export function JoinStudyRoomCard() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function join() {
    const trimmed = code.trim();
    if (!trimmed) return;
    setError("");
    startTransition(async () => {
      const result = await joinStudyRoomAction(trimmed);
      if (result.error || !result.roomId) {
        // Includes "this room's host isn't in it anymore", which is the common
        // one — a code outlives the session it was shared for.
        setError(result.error ?? "Could not join that room.");
        return;
      }
      // Straight to the case the room is on. The joinRoom param is what tells
      // the study room to adopt this room once the page loads, the same way an
      // invite link does.
      const station = result.stationNumber;
      router.push(
        station ? `/case-bank/${station}?joinRoom=${result.roomId}` : `/case-bank?joinRoom=${result.roomId}`
      );
    });
  }

  return (
    <div
      className="bg-white rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-[rgba(246,212,75,0.07)]"
      style={{ border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 2px 12px rgba(51,51,51,0.05)" }}
    >
      <div className="flex items-center gap-5">
        <div className="shrink-0 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
            <circle cx="8" cy="7.5" r="3" stroke={DARK} strokeWidth="1.5" />
            <path d="M2.5 18c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke={DARK} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M15 8.5h5M17.5 6v5" stroke={DARK} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-[17px]" style={{ color: DARK }}>Join a study group</p>
          <p className="text-[13px] mt-0.5" style={{ color: "rgba(51,51,51,0.50)" }}>
            Got a code from a friend? Go straight to the case they are on.
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && join()}
          placeholder="Room code"
          maxLength={8}
          aria-label="Room code"
          className="flex-1 min-w-0 rounded-lg px-3 py-2.5 text-[14px]"
          style={{
            border: "1.5px solid rgba(51,51,51,0.15)",
            color: DARK,
            background: "#F3F2FB",
            outline: "none",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
          }}
        />
        <button
          onClick={join}
          disabled={pending || !code.trim()}
          className="shrink-0 rounded-lg px-5 py-2.5 text-[14px] font-bold"
          style={{
            background: DARK,
            border: "none",
            color: "white",
            cursor: pending || !code.trim() ? "not-allowed" : "pointer",
            opacity: pending || !code.trim() ? 0.5 : 1,
          }}
        >
          {pending ? "Joining…" : "Join"}
        </button>
      </div>

      {error && (
        <p className="text-[12.5px] mt-2.5" style={{ color: "#B91C1C" }}>
          {error}
        </p>
      )}
    </div>
  );
}
