"use client";

import { useState, useEffect, useMemo } from "react";
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

function PlayIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M2 1.5L9 5L2 8.5V1.5Z" />
    </svg>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className="inline-flex items-center gap-2 text-[12px] font-semibold"
      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: "rgba(26,27,82,0.6)", padding: 0 }}
    >
      <div style={{
        width: 32, height: 18, borderRadius: 9,
        background: checked ? NAVY : "rgba(26,27,82,0.2)",
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

export function StationListClient({
  stations,
  starredIds: initialStarredIds,
  lastStation: initialLastStation,
}: {
  stations: StationListRow[];
  starredIds: string[];
  lastStation: number | null;
}) {
  const [activeSubject, setActiveSubject] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showStarred, setShowStarred] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showTitles, setShowTitles] = useState(true);
  const [lastStation, setLastStation] = useState<number | null>(initialLastStation);

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
      if (showVideo && !s.editor_video_url) return false;
      if (
        search &&
        !s.title.toLowerCase().includes(search.toLowerCase()) &&
        !s.subject.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [stations, activeSubject, showStarred, showVideo, search, starredSet]);

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

        {/* Dashboard back link */}
        <div className="mb-5">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-[13px] font-medium no-underline"
            style={{ color: "rgba(26,27,82,0.45)" }}
          >
            ← Dashboard
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-7">
          <h1
            className="font-display font-extrabold text-[26px] mb-1.5"
            style={{ color: NAVY }}
          >
            SCA Explained Case Bank
          </h1>
          <p className="text-[13.5px]" style={{ color: "rgba(26,27,82,0.55)" }}>
            <span style={{ color: NAVY, fontWeight: 600 }}>{stations.length}</span> practice stations
          </p>
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
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject dropdown — leftmost */}
            <select
              value={activeSubject}
              onChange={(e) => setActiveSubject(e.target.value)}
              className="rounded-lg px-3.5 py-1.5 text-[12px] font-semibold"
              style={{
                border: "1.5px solid rgba(26,27,82,0.12)",
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
              onClick={() => setShowVideo((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[12px] font-semibold transition-all"
              style={{
                background: showVideo ? "rgba(59,130,246,0.12)" : LIGHT_BG,
                border: `1.5px solid ${showVideo ? "rgba(59,130,246,0.4)" : "rgba(26,27,82,0.10)"}`,
                color: showVideo ? "#1D4ED8" : "rgba(26,27,82,0.6)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <PlayIcon />
              Video lesson
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
            const isStarred = starredSet.has(station.id);
            const isLast = station.number === lastStation;
            return (
              <Link
                key={station.id}
                href={`/case-bank/${station.number}`}
                className="flex items-center gap-4 rounded-[10px] px-4 py-3.5 no-underline transition-all hover:shadow-md"
                style={{
                  background: isLast ? `rgba(246,212,75,0.09)` : LIGHT_BG,
                  border: "1px solid rgba(26,27,82,0.07)",
                }}
              >
                {/* Number */}
                <div
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[12px] font-bold"
                  style={{
                    background: "rgba(26,27,82,0.08)",
                    color: "rgba(26,27,82,0.4)",
                  }}
                >
                  {station.number}
                </div>

                {/* Title + subject — hidden when showTitles is off */}
                {showTitles && (
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
                )}

                {!showTitles && (
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold" style={{ color: "rgba(26,27,82,0.35)" }}>
                      Station {station.number}
                    </div>
                  </div>
                )}

                {station.editor_video_url && (
                  <span
                    className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(59,130,246,0.09)", color: "#1D4ED8" }}
                  >
                    <PlayIcon /> Video
                  </span>
                )}

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
