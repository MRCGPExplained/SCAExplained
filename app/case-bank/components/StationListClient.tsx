"use client";

import { useState, useEffect, useMemo } from "react";
import { gradeDisplay } from "@/lib/grade-display";
import { MAX_SCORE, scoreColour } from "@/lib/report-score";
import Link from "next/link";
import type { StationListRow } from "@/lib/case-bank-types";
import { SUBJECTS } from "@/lib/case-bank-types";
import { useStudyRoomStatus } from "./study-room/context";

const NAVY = "#333333";
const YELLOW = "#F6D44B";
const LIGHT_BG = "#F3F2FB";


function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className="inline-flex items-center gap-2 text-[12px] font-semibold"
      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: "rgba(51,51,51,0.6)", padding: 0 }}
    >
      <div style={{
        width: 32, height: 18, borderRadius: 9,
        background: checked ? NAVY : "rgba(51,51,51,0.2)",
        position: "relative", transition: "background 0.15s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 2, left: checked ? 16 : 2,
          width: 14, height: 14, borderRadius: "50%",
          background: "white", transition: "left 0.15s",
        }} />
      </div>
      {label}
    </button>
  );
}

/**
 * Shown to guests only, and only on this page. Arriving at the list while your
 * group is mid-case is the one moment you are most likely to be lost, and the
 * floating dock — fine as an ambient reminder everywhere else — is a small pill
 * in the corner that is easy to miss against a full page of stations. Guests
 * are no longer dragged to the host's case automatically, so this is how they
 * get back: one click, their choice.
 *
 * The host is deliberately excluded. They are the one choosing the case; being
 * told where they already are is noise.
 */
function GroupCaseBanner() {
  const { inRoom, iAmHost, hostStationNumber, hostName } = useStudyRoomStatus();
  if (!inRoom || iAmHost || hostStationNumber === null) return null;

  return (
    <Link
      href={`/case-bank/${hostStationNumber}`}
      className="flex items-center justify-between gap-3 mb-5 rounded-xl px-4 py-3 no-underline"
      style={{ background: NAVY, border: "1px solid rgba(51,51,51,0.1)" }}
    >
      <span className="flex flex-col min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "white" }}>
          Your group is on Station {hostStationNumber}
        </span>
        <span className="text-[12px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
          {hostName ? `${hostName} is navigating` : "Browsing here will not move anyone else"}
        </span>
      </span>
      <span
        className="shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-bold"
        style={{ background: YELLOW, color: NAVY }}
      >
        Join them →
      </span>
    </Link>
  );
}

export interface StationAttempt {
  id: string;
  at: string;
  /** Out of 10.5, or null if any domain is ungraded. */
  total: number | null;
  /** Data Gathering, Clinical Management, Relating to Others. */
  grades: [string | null, string | null, string | null];
  /** A GP has ruled on it. Decides which vocabulary the grades are shown in. */
  gp: boolean;
}

export interface LastAttempt {
  /** Which chair they were in. Anything but "doctor" has no mark of their own. */
  role: "doctor" | "patient" | "observer";
  /** Their own most recent report for this station, or null if it is not theirs. */
  reportId: string | null;
  /** Their own attempts, newest first. Empty when they only played the patient. */
  history: StationAttempt[];
  at: string;
  /** Out of 10.5. Null when they played the patient — the mark was not theirs. */
  total: number | null;
  count: number;
}

/** "12 Oct", or "12 Oct 2025" once it is not this year. */
function shortDate(iso: string): string {
  const d = new Date(iso);
  const thisYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(thisYear ? {} : { year: "numeric" }),
  });
}

function AttemptNote({ a, onOpen }: { a: LastAttempt; onOpen: () => void }) {
  // Shown even at one. "×1" reads as a deliberate count of a thing that
  // has happened once; showing it only from two leaves the reader wondering
  // whether a bare date means once or means nobody bothered to say.
  const times = <span style={{ opacity: 0.6 }}> ×{a.count}</span>;

  if (a.role !== "doctor") {
    const patientBody = (
      <>
        As {a.role} · {shortDate(a.at)}
        {times}
      </>
    );
    // No mark of their own, but the consultation is theirs to revisit: they
    // sat through it, and a report opens for whoever holds its link.
    return a.reportId ? (
      <Link
        href={`/recordings/${a.reportId}`}
        onClick={(e) => e.stopPropagation()}
        title="Open this report"
        className="shrink-0 text-[11.5px] hidden sm:block no-underline relative z-10 rounded px-1.5 py-0.5 -mx-1.5 hover:bg-[rgba(51,51,51,0.06)]"
        style={{ color: "rgba(51,51,51,0.38)" }}
      >
        {patientBody}
      </Link>
    ) : (
      <span className="shrink-0 text-[11.5px] hidden sm:block" style={{ color: "rgba(51,51,51,0.38)" }}>
        {patientBody}
      </span>
    );
  }

  const body = (
    <>
      {shortDate(a.at)}
      {a.total !== null && (
        <>
          {" · "}
          <strong style={{ color: scoreColour(a.total) }}>
            {a.total}/{MAX_SCORE}
          </strong>
        </>
      )}
      {times}
    </>
  );

  if (!a.reportId) {
    return (
      <span className="shrink-0 text-[11.5px] hidden sm:block" style={{ color: "rgba(51,51,51,0.45)" }}>
        {body}
      </span>
    );
  }

  const shared =
    "shrink-0 text-[11.5px] hidden sm:block no-underline relative z-10 rounded px-1.5 py-0.5 -mx-1.5 hover:bg-[rgba(51,51,51,0.06)]";

  /*
    More than one attempt, so the click owes them all of them.

    Opening the latest and quietly dropping the rest would make a liar of the
    count beside it: printing "×3" and then showing one is advertising three
    things and handing over one.
  */
  if (a.history.length > 1) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        }}
        title={`See all ${a.history.length} attempts`}
        className={shared + " cursor-pointer border-0 bg-transparent text-left"}
        style={{ color: "rgba(51,51,51,0.45)" }}
      >
        {body}
      </button>
    );
  }

  /*
    One attempt, so go straight to it. A dialog holding a single row is a
    worse version of a link.

    New tab because the list is 246 rows long and someone checking a mark
    wants to glance and come back, not lose their place and scroll for it
    again. z-10 because the row's link is an overlay stretched across the
    whole card, and without it this would be underneath and unclickable.
  */
  return (
    <Link
      href={`/recordings/${a.reportId}`}
      onClick={(e) => e.stopPropagation()}
      title="Open this report"
      className={shared}
      style={{ color: "rgba(51,51,51,0.45)" }}
    >
      {body}
    </Link>
  );
}

/**
 * Every attempt at one station, newest first.
 *
 * The domain letters are the point of it. Across different stations they
 * would be comparing a rash with a breaking-bad-news case; down one station
 * the case is fixed, so CF/F/P becoming P/P/CP is a better consultation and
 * not an easier draw. It is the only before-and-after this product can
 * honestly draw, and it belongs here rather than on a page of averages.
 */
function AttemptsDialog({
  station,
  attempts,
  onClose,
}: {
  station: { number: number; title: string };
  attempts: StationAttempt[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(26,27,82,0.35)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Attempts at station ${station.number}`}
    >
      <div
        className="w-full max-w-[440px] rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "0 24px 70px rgba(26,27,82,0.28)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.07em]" style={{ color: "rgba(51,51,51,0.4)" }}>
            Station {station.number} · {attempts.length} attempts
          </p>
          <p className="font-display font-bold text-[16px] mt-1" style={{ color: NAVY }}>
            {station.title}
          </p>
        </div>

        <div className="pb-2">
          {attempts.map((att) => (
            <Link
              key={att.id}
              href={`/recordings/${att.id}`}
              className="flex items-baseline gap-3 px-5 py-2.5 no-underline hover:bg-[rgba(51,51,51,0.04)]"
              style={{ borderTop: "1px solid rgba(51,51,51,0.07)" }}
            >
              <span className="text-[12.5px] w-[76px] shrink-0" style={{ color: NAVY }}>
                {shortDate(att.at)}
              </span>
              <span className="text-[12.5px] font-bold w-[66px] shrink-0" style={{ color: att.total === null ? "rgba(51,51,51,0.4)" : scoreColour(att.total) }}>
                {att.total === null ? "—" : `${att.total}/${MAX_SCORE}`}
              </span>
              {/* The vocabulary the report uses for this attempt. An AI
                  attempt reads G / N / G and a reviewed one CP / F / P, so
                  this list and the report it opens cannot disagree. */}
              <span className="text-[12.5px] flex-1" style={{ color: "rgba(51,51,51,0.5)" }}>
                {att.grades.map((g) => gradeDisplay(g, !att.gp)?.short ?? "—").join(" / ")}
              </span>
            </Link>
          ))}
        </div>

        <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(51,51,51,0.07)" }}>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg py-2 text-[13px] font-bold cursor-pointer"
            style={{ background: "rgba(51,51,51,0.06)", color: NAVY, border: "none" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function StationListClient({
  stations,
  starredIds: initialStarredIds,
  lastStation: initialLastStation,
  attempts,
}: {
  stations: StationListRow[];
  starredIds: string[];
  lastStation: number | null;
  attempts: Record<number, LastAttempt>;
}) {
  const [activeSubject, setActiveSubject] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showStarred, setShowStarred] = useState(false);
  const [showTitles, setShowTitles] = useState(true);
  const [lastStation, setLastStation] = useState<number | null>(initialLastStation);
  const [openAttempts, setOpenAttempts] = useState<number | null>(null);

  useEffect(() => {
    if (lastStation === null) {
      const n = parseInt(localStorage.getItem("lastCaseBankStation") ?? "", 10);
      if (!isNaN(n)) setLastStation(n);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const starredSet = useMemo(() => new Set(initialStarredIds), [initialStarredIds]);

  const filtered = useMemo(() => {
    return stations.filter((s) => {
      if (activeSubject !== "All" && s.subject !== activeSubject) return false;
      if (showStarred && !starredSet.has(s.id)) return false;
      if (
        search &&
        !s.title.toLowerCase().includes(search.toLowerCase()) &&
        !s.subject.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [stations, activeSubject, showStarred, search, starredSet]);

  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stations.forEach((s) => {
      counts[s.subject] = (counts[s.subject] ?? 0) + 1;
    });
    return counts;
  }, [stations]);

  return (
    <main style={{ minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        <GroupCaseBanner />

        {/* Back to dashboard */}
        <div className="mb-5">
          <a href="/dashboard" className="inline-flex items-center gap-1.5 text-[12px] font-semibold no-underline" style={{ color: "rgba(51,51,51,0.45)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Dashboard
          </a>
        </div>

        {/* Page header */}
        <div className="mb-7">
          <h1
            className="font-display font-extrabold text-[26px] mb-1.5"
            style={{ color: NAVY }}
          >
            Case Bank
          </h1>
          <p className="text-[13.5px]" style={{ color: "rgba(51,51,51,0.55)" }}>
            <span style={{ color: NAVY, fontWeight: 600 }}>{stations.length}</span> practice stations
          </p>
        </div>

        {/* Search + filters */}
        <div
          className="rounded-xl p-4 mb-4"
          style={{ background: "white", border: "1px solid rgba(51,51,51,0.09)" }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stations by title or subject…"
            className="w-full rounded-lg px-4 py-2.5 text-[13.5px] mb-3.5"
            style={{
              border: "1px solid rgba(51,51,51,0.12)",
              color: NAVY,
              background: LIGHT_BG,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject dropdown — leftmost */}
            <select
              value={activeSubject}
              onChange={(e) => setActiveSubject(e.target.value)}
              className="rounded-lg px-3.5 py-1.5 text-[12px] font-semibold"
              style={{
                border: "1.5px solid rgba(51,51,51,0.12)",
                background: "white",
                color: NAVY,
                cursor: "pointer",
                fontFamily: "inherit",
                outline: "none",
              }}
            >
              {(SUBJECTS as readonly string[]).map((s) => (
                <option key={s} value={s} style={{ background: "white", color: NAVY }}>
                  {s === "All"
                    ? `All subjects (${stations.length})`
                    : `${s} (${subjectCounts[s] ?? 0})`}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowStarred((v) => !v)}
              className="rounded-lg px-3.5 py-1.5 text-[12px] font-semibold transition-all"
              style={{
                background: showStarred ? "rgba(246,212,75,0.18)" : LIGHT_BG,
                border: `1.5px solid ${showStarred ? YELLOW : "rgba(51,51,51,0.10)"}`,
                color: showStarred ? NAVY : "rgba(51,51,51,0.6)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span style={{ color: showStarred ? "#B8960A" : "inherit" }}>★</span> Starred
            </button>

            {/* Show Titles toggle — pushed to the right */}
            <div className="ml-auto">
              <Toggle
                checked={showTitles}
                onChange={() => setShowTitles((v) => !v)}
                label="Show Titles"
              />
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="text-[12px] mb-3" style={{ color: "rgba(51,51,51,0.45)" }}>
          {filtered.length} station{filtered.length !== 1 ? "s" : ""}
          {activeSubject !== "All" ? ` in ${activeSubject}` : ""}
        </p>

        {/* Station list */}
        <div className="flex flex-col gap-1.5">
          {filtered.length === 0 && (
            <div
              className="text-center py-12 text-[14px]"
              style={{ color: "rgba(51,51,51,0.4)" }}
            >
              No stations match your filters.
            </div>
          )}
          {filtered.map((station) => {
            const isStarred = starredSet.has(station.id);
            const isLast = station.number === lastStation;
            return (
              <div
                key={station.id}
                className="relative flex items-center gap-4 rounded-[10px] px-4 py-3 transition-all hover:shadow-md"
                style={{
                  background: LIGHT_BG,
                  border: "1px solid rgba(51,51,51,0.07)",
                  borderLeft: isLast ? `3px solid rgba(51,51,51,0.35)` : "1px solid rgba(51,51,51,0.07)",
                }}
              >
                {/* The whole card still opens the station. Stretched across it
                    rather than wrapping it, so the mark on the right can be a
                    link of its own without nesting one anchor inside another. */}
                <Link
                  href={`/case-bank/${station.number}`}
                  className="absolute inset-0 rounded-[10px]"
                  aria-label={`Station ${station.number}: ${station.title}`}
                />
                {/* Number */}
                <div
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold"
                  style={{
                    background: "rgba(51,51,51,0.08)",
                    color: "rgba(51,51,51,0.4)",
                  }}
                >
                  {station.number}
                </div>

                {/* Title · Subject inline, or plain Station N */}
                {showTitles ? (
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[13.5px] font-semibold truncate block"
                      style={{ color: NAVY }}
                    >
                      {station.title}
                    </span>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <span className="text-[13.5px] font-semibold" style={{ color: NAVY }}>
                      Station {station.number}
                    </span>
                  </div>
                )}

                {attempts[station.number] && (
                  <AttemptNote
                    a={attempts[station.number]}
                    onOpen={() => setOpenAttempts(station.number)}
                  />
                )}

                {isStarred && (
                  <span className="shrink-0 text-[14px]" style={{ color: YELLOW }}>★</span>
                )}

                <span className="shrink-0 text-[14px]" style={{ color: "rgba(51,51,51,0.25)" }}>
                  →
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {openAttempts !== null && (() => {
        const station = stations.find((st) => st.number === openAttempts);
        const a = attempts[openAttempts];
        if (!station || !a || a.history.length < 2) return null;
        return (
          <AttemptsDialog
            station={{ number: station.number, title: station.title }}
            attempts={a.history}
            onClose={() => setOpenAttempts(null)}
          />
        );
      })()}
    </main>
  );
}
