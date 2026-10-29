"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NavDropdown, navDropdownRowStyle, when } from "./NavDropdown";
import { fetchReviewQueueAction, fetchFeedbackQueueAction } from "./staff-actions";
import type { ReviewWaiting, FeedbackWaiting } from "@/lib/staff-nav";

/**
 * The two staff icons, as previews rather than plain links.
 *
 * Both used to navigate straight to their page. A preview answers "is there
 * anything here, and is it urgent" without leaving whatever you were doing —
 * which for an examiner mid-review, or an admin mid-anything, is the whole
 * question. Clicking a row still goes to the page, because that is where the
 * work happens.
 *
 * Unlike the envelope, nothing here expands in place: a consultation is a
 * report to read and a feedback item is a thread to answer, and neither fits
 * in a 340px panel. The rows say so before they are clicked.
 */

const ROW_BORDER = "1px solid rgba(26,27,82,0.06)";

function DocumentIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

/**
 * A lifebuoy, not the speech bubble the station's Feedback button uses — that
 * glyph is already the wordmark at the other end of this same bar.
 */
function LifebuoyIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" />
      <circle cx="12" cy="12" r="3.75" />
      <line x1="5.46" y1="5.46" x2="9.35" y2="9.35" />
      <line x1="14.65" y1="14.65" x2="18.54" y2="18.54" />
      <line x1="14.65" y1="9.35" x2="18.54" y2="5.46" />
      <line x1="5.46" y1="18.54" x2="9.35" y2="14.65" />
    </svg>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 py-5 m-0 text-[13px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.45)" }}>
      {children}
    </p>
  );
}

function Failed() {
  // Not the empty state. "Nothing waiting" is indistinguishable from the
  // truth, and for a GP it reads as being up to date.
  return (
    <p className="px-4 py-5 m-0 text-[13px] leading-[1.6]" style={{ color: "#92400e" }}>
      Could not load this just now. Try again in a moment.
    </p>
  );
}

export function ReviewQueueMenu({ initialCount }: { initialCount: number | null }) {
  const router = useRouter();
  const [rows, setRows] = useState<ReviewWaiting[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const ticket = useRef(0);

  async function load() {
    const mine = ++ticket.current;
    setLoading(true);
    setFailed(false);
    try {
      const next = await fetchReviewQueueAction();
      if (mine !== ticket.current) return;
      if (next === null) setFailed(true);
      else setRows(next);
    } catch (err) {
      console.error("[ReviewQueueMenu] load failed", err);
      if (mine === ticket.current) setFailed(true);
    } finally {
      if (mine === ticket.current) setLoading(false);
    }
  }

  return (
    <NavDropdown label="Reviews waiting" title="Waiting for a GP" icon={<DocumentIcon />} count={initialCount} onOpen={load}>
      {({ close }) =>
        loading && rows === null && !failed ? (
          <Empty>Loading…</Empty>
        ) : failed ? (
          <Failed />
        ) : !rows || rows.length === 0 ? (
          <Empty>Nothing waiting. Every consultation has been reviewed.</Empty>
        ) : (
          rows.map((r) => (
            <button
              key={r.id}
              type="button"
              role="menuitem"
              onClick={() => {
                close();
                router.push(`/examiner/${r.id}`);
              }}
              className="w-full text-left px-4 py-3 transition-colors"
              style={{ ...navDropdownRowStyle(!r.started), borderBottom: ROW_BORDER }}
            >
              <span className="block text-[13px] leading-[1.5]" style={{ color: "rgba(26,27,82,0.88)", fontWeight: r.started ? 400 : 600 }}>
                Station {r.stationNumber}: {r.stationTitle}
              </span>
              <span className="flex items-center gap-1.5 mt-1">
                <span className="text-[11.5px] font-semibold" style={{ color: "#1A1B52" }}>
                  {r.started ? "In progress" : "Review"}
                </span>
                <span className="text-[11px] truncate" style={{ color: "rgba(26,27,82,0.35)" }}>
                  · {r.candidate} · {when(r.waitingSince)}
                </span>
              </span>
            </button>
          ))
        )
      }
    </NavDropdown>
  );
}

export function FeedbackQueueMenu({ initialCount }: { initialCount: number | null }) {
  const router = useRouter();
  const [rows, setRows] = useState<FeedbackWaiting[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const ticket = useRef(0);

  async function load() {
    const mine = ++ticket.current;
    setLoading(true);
    setFailed(false);
    try {
      const next = await fetchFeedbackQueueAction();
      if (mine !== ticket.current) return;
      if (next === null) setFailed(true);
      else setRows(next);
    } catch (err) {
      console.error("[FeedbackQueueMenu] load failed", err);
      if (mine === ticket.current) setFailed(true);
    } finally {
      if (mine === ticket.current) setLoading(false);
    }
  }

  return (
    <NavDropdown label="Feedback" title="Unanswered" icon={<LifebuoyIcon />} count={initialCount} onOpen={load}>
      {({ close }) =>
        loading && rows === null && !failed ? (
          <Empty>Loading…</Empty>
        ) : failed ? (
          <Failed />
        ) : !rows || rows.length === 0 ? (
          <Empty>Nothing unanswered.</Empty>
        ) : (
          rows.map((r) => (
            <button
              key={r.id}
              type="button"
              role="menuitem"
              onClick={() => {
                close();
                // Anchored, so the page opens on the one that was clicked
                // rather than at the top of a list it has to be found in.
                router.push(`/admin/feedback#report-${r.id}`);
              }}
              className="w-full text-left px-4 py-3 transition-colors"
              style={{ ...navDropdownRowStyle(true), borderBottom: ROW_BORDER }}
            >
              <span className="block text-[13px] leading-[1.5]" style={{ color: "rgba(26,27,82,0.88)", fontWeight: 600 }}>
                {r.from ?? "Someone"}
                {r.stationNumber !== null ? ` · Station ${r.stationNumber}` : ""}
              </span>
              {/* Two lines of what they said. Enough to tell a typo report
                  from someone who is stuck, which is the triage this panel
                  exists to make possible without opening the page. */}
              <span
                className="block text-[12px] leading-[1.55] mt-0.5"
                style={{
                  color: "rgba(26,27,82,0.55)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {r.content}
              </span>
              <span className="flex items-center gap-1.5 mt-1">
                <span className="text-[11.5px] font-semibold" style={{ color: "#1A1B52" }}>
                  {r.topic === "help" ? "Help request" : "Feedback"}
                </span>
                <span className="text-[11px]" style={{ color: "rgba(26,27,82,0.35)" }}>
                  · {when(r.sentAt)}
                </span>
              </span>
            </button>
          ))
        )
      }
    </NavDropdown>
  );
}
