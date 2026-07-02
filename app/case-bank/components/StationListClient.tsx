"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { StationListRow } from "@/lib/case-bank-types";
import { SUBJECTS, SUBJECT_COLORS } from "@/lib/case-bank-types";

const NAVY = "#1A1B52";
const YELLOW = "#F6D44B";
const LIGHT_BG = "#F3F2FB";

function SubjectTag({
  subject,
  onClick,
  small,
}: {
  subject: string;
  onClick?: (e: React.MouseEvent) => void;
  small?: boolean;
}) {
  const colors = SUBJECT_COLORS[subject] ?? { bg: "rgba(26,27,82,0.07)", text: NAVY };
  return (
    <button
      onClick={onClick}
      style={{
        background: colors.bg,
        color: colors.text,
        border: "none",
        borderRadius: 20,
        padding: small ? "2px 8px" : "3px 10px",
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        cursor: onClick ? "pointer" : "default",
        whiteSpace: "nowrap",
        fontFamily: "inherit",
      }}
    >
      {subject}
    </button>
  );
}

export function StationListClient({
  stations,
  attemptedIds: initialAttemptedIds,
  starredIds: initialStarredIds,
}: {
  stations: StationListRow[];
  attemptedIds: string[];
  starredIds: string[];
}) {
  const [activeSubject, setActiveSubject] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showStarred, setShowStarred] = useState(false);
  const [showUnattempted, setShowUnattempted] = useState(false);

  const attemptedSet = useMemo(() => new Set(initialAttemptedIds), [initialAttemptedIds]);
  const starredSet = useMemo(() => new Set(initialStarredIds), [initialStarredIds]);

  const filtered = useMemo(() => {
    return stations.filter((s) => {
      if (activeSubject !== "All" && s.subject !== activeSubject) return false;
      if (showStarred && !starredSet.has(s.id)) return false;
      if (showUnattempted && attemptedSet.has(s.id)) return false;
      if (
        search &&
        !s.title.toLowerCase().includes(search.toLowerCase()) &&
        !s.subject.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [stations, activeSubject, showStarred, showUnattempted, search, attemptedSet, starredSet]);

  const attempted = stations.filter((s) => attemptedSet.has(s.id)).length;
  const progressPct = stations.length > 0 ? Math.round((attempted / stations.length) * 100) : 0;

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

        {/* Page header */}
        <div
          className="flex flex-wrap items-start justify-between gap-4 mb-7"
        >
          <div>
            <h1
              className="font-display font-extrabold text-[26px] mb-1.5"
              style={{ color: NAVY }}
            >
              SCA Case Bank
            </h1>
            <p className="text-[13.5px]" style={{ color: "rgba(26,27,82,0.55)" }}>
              {attempted} of {stations.length} stations attempted&nbsp;·&nbsp;
              <span style={{ color: NAVY, fontWeight: 600 }}>{stations.length} total</span>
            </p>
          </div>

          {/* Progress */}
          <div style={{ minWidth: 200 }}>
            <div className="flex justify-between mb-1.5">
              <span
                className="text-[11px] font-bold uppercase tracking-[0.06em]"
                style={{ color: "rgba(26,27,82,0.5)" }}
              >
                Progress
              </span>
              <span className="text-[11px] font-bold" style={{ color: NAVY }}>
                {progressPct}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(26,27,82,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: YELLOW }}
              />
            </div>
          </div>
        </div>

        {/* Search + filters */}
        <div
          className="rounded-xl p-4 mb-4"
          style={{ background: "white", border: "1px solid rgba(26,27,82,0.09)" }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stations by title or subject…"
            className="w-full rounded-lg px-4 py-2.5 text-[13.5px] mb-3.5"
            style={{
              border: "1px solid rgba(26,27,82,0.12)",
              color: NAVY,
              background: LIGHT_BG,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowStarred((v) => !v)}
              className="rounded-lg px-3.5 py-1.5 text-[12px] font-semibold transition-all"
              style={{
                background: showStarred ? YELLOW : LIGHT_BG,
                border: `1.5px solid ${showStarred ? YELLOW : "rgba(26,27,82,0.10)"}`,
                color: showStarred ? NAVY : "rgba(26,27,82,0.6)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ★ Starred only
            </button>
            <button
              onClick={() => setShowUnattempted((v) => !v)}
              className="rounded-lg px-3.5 py-1.5 text-[12px] font-semibold transition-all"
              style={{
                background: showUnattempted ? NAVY : LIGHT_BG,
                border: `1.5px solid ${showUnattempted ? NAVY : "rgba(26,27,82,0.10)"}`,
                color: showUnattempted ? "white" : "rgba(26,27,82,0.6)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Not yet attempted
            </button>
          </div>
        </div>

        {/* Subject tabs */}
        <div
          className="flex gap-1.5 overflow-x-auto pb-1 mb-5"
          style={{ scrollbarWidth: "none" }}
        >
          {(SUBJECTS as readonly string[]).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all"
              style={{
                background: activeSubject === s ? NAVY : "white",
                border: `1.5px solid ${activeSubject === s ? NAVY : "rgba(26,27,82,0.12)"}`,
                color: activeSubject === s ? "white" : "rgba(26,27,82,0.65)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {s}
              {s !== "All" && subjectCounts[s] !== undefined && (
                <span className="ml-1 opacity-60 text-[10px]">
                  {subjectCounts[s]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-[12px] mb-3" style={{ color: "rgba(26,27,82,0.45)" }}>
          {filtered.length} station{filtered.length !== 1 ? "s" : ""}
          {activeSubject !== "All" ? ` in ${activeSubject}` : ""}
        </p>

        {/* Station list */}
        <div className="flex flex-col gap-1.5">
          {filtered.length === 0 && (
            <div
              className="text-center py-12 text-[14px]"
              style={{ color: "rgba(26,27,82,0.4)" }}
            >
              No stations match your filters.
            </div>
          )}
          {filtered.map((station) => {
            const isAttempted = attemptedSet.has(station.id);
            const isStarred = starredSet.has(station.id);
            return (
              <Link
                key={station.id}
                href={`/case-bank/${station.number}`}
                className="flex items-center gap-4 rounded-[10px] px-4 py-3.5 no-underline transition-all hover:shadow-md"
                style={{
                  background: LIGHT_BG,
                  border: "1px solid rgba(26,27,82,0.07)",
                }}
              >
                {/* Number / check */}
                <div
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[12px] font-bold"
                  style={{
                    background: isAttempted ? NAVY : "rgba(26,27,82,0.08)",
                    color: isAttempted ? "white" : "rgba(26,27,82,0.4)",
                  }}
                >
                  {isAttempted ? "✓" : station.number}
                </div>

                {/* Title + subject */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[14px] font-semibold truncate mb-1"
                    style={{ color: NAVY }}
                  >
                    {station.title}
                  </div>
                  <SubjectTag
                    subject={station.subject}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSubject(station.subject);
                    }}
                    small
                  />
                </div>

                {isStarred && (
                  <span className="shrink-0 text-[15px]" style={{ color: YELLOW }}>★</span>
                )}

                <span className="shrink-0 text-[14px]" style={{ color: "rgba(26,27,82,0.25)" }}>
                  →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
