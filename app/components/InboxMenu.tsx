"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { fetchInboxAction } from "./inbox-actions";
import { inboxLine, type Inbox, type InboxMessage } from "@/lib/inbox";

/**
 * The envelope in the navbar, and the list behind it.
 *
 * Only GP reviews land here. It is not a second copy of /recordings — that
 * page is still where you browse your consultations. This is the thing that
 * comes and finds you when a GP has finished with one, days after you
 * recorded it and left.
 *
 * NavbarWrapper already hides the whole navbar inside a station and a video
 * course, so a badge cannot appear over a running twelve-minute consultation.
 * That is worth keeping if this component ever moves.
 *
 * No grade in the list. The line says a review has arrived and nothing about
 * how it went: a number visible from the navbar is a result someone can read
 * over your shoulder, and it would make opening the report pointless anyway.
 *
 * The panel is PORTALLED to the body and positioned from the button's real
 * rectangle. Rendered in place it was trapped in the sticky header's stacking
 * context, where its z-index could not lift it above anything outside the
 * header (the study room dock, for one, painted straight over it) — and
 * `right: 0` anchored it to a button sitting well short of the screen edge,
 * so on a phone the 340px panel ran off the LEFT side and most of it, the
 * messages included, could not be reached.
 */

const YELLOW = "#F6D44B";
const NAVY = "#333333";
const PANEL_WIDTH = 340;
const GUTTER = 12;

function EnvelopeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="1.75" y="3.75" width="16.5" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 5.5L10 11L17.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function when(iso: string): string {
  const then = new Date(iso);
  const days = Math.floor((Date.now() - then.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return then.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function InboxMenu({ initialUnread }: { initialUnread: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [unread, setUnread] = useState(initialUnread);
  const [loading, setLoading] = useState(false);
  const [box, setBox] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Only the newest fetch may write state. Open, close, open again and the
  // first request can still land after the second and overwrite it with a
  // count taken before the candidate opened anything.
  const requestRef = useRef(0);

  useEffect(() => setMounted(true), []);

  /** Place the panel against the button, clamped inside the viewport. */
  const place = useCallback(() => {
    const el = buttonRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(PANEL_WIDTH, window.innerWidth - GUTTER * 2);
    // Right-aligned to the button, then pulled back inside both edges.
    const left = Math.min(
      Math.max(GUTTER, r.right - width),
      window.innerWidth - width - GUTTER
    );
    setBox({ top: r.bottom + 8, left, width });
  }, []);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    // Closing unmounts whatever had focus, which otherwise drops to <body> and
    // strands anyone on a keyboard at the top of the document.
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  async function toggle() {
    if (open) {
      close(true);
      return;
    }

    place();
    setOpen(true);
    setLoading(true);

    const ticket = ++requestRef.current;
    try {
      const next = await fetchInboxAction();
      if (ticket !== requestRef.current) return;
      setInbox(next);
      // A failed read must not zero a badge that was right a moment ago.
      if (!next.failed) setUnread(next.unread);
    } catch (err) {
      console.error("[InboxMenu] could not load the inbox", err);
      if (ticket === requestRef.current) setInbox({ messages: [], unread: 0, failed: true });
    } finally {
      if (ticket === requestRef.current) setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || buttonRef.current?.contains(t)) return;
      close(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close(true);
    }

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, close, place]);

  function openReport(m: InboxMessage) {
    close(false);
    // Opening the report is what marks it read, server-side, on the page
    // itself. Dropping the badge here as well keeps the navbar honest without
    // waiting for a navigation to finish; the next fetch re-reads the truth.
    if (m.unread) setUnread((n) => Math.max(0, n - 1));
    router.push(`/recordings/${m.recordingId}`);
  }

  const panel = open && box && (
    <div
      ref={panelRef}
      role="menu"
      aria-label="Inbox"
      className="rounded-xl overflow-hidden"
      style={{
        position: "fixed",
        top: box.top,
        left: box.left,
        width: box.width,
        background: "white",
        boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
        border: "1px solid rgba(26,27,82,0.08)",
        // Portalled to the body, so this is measured against the page and not
        // against the header it used to be locked inside.
        zIndex: 2000,
      }}
    >
      <div
        className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em]"
        style={{ color: "rgba(26,27,82,0.5)", borderBottom: "1px solid rgba(26,27,82,0.07)" }}
      >
        Inbox
      </div>

      <div style={{ maxHeight: "min(380px, 60vh)", overflowY: "auto" }}>
        {loading && inbox === null ? (
          <p className="px-4 py-5 m-0 text-[13px]" style={{ color: "rgba(26,27,82,0.45)" }}>
            Loading…
          </p>
        ) : inbox?.failed ? (
          /* Not the empty state. An inbox that could not be read says so,
             because "nothing yet" is indistinguishable from the truth. */
          <p className="px-4 py-5 m-0 text-[13px] leading-[1.6]" style={{ color: "#92400e" }}>
            Could not load your inbox just now. Your reports are safe. Try
            again in a moment, or open{" "}
            <span style={{ fontWeight: 600 }}>My Reviews</span> from the
            dashboard.
          </p>
        ) : !inbox || inbox.messages.length === 0 ? (
          /* Said plainly. A Starter customer has no GP reviews at all and will
             see this every time, so it must not read as an error. */
          <p className="px-4 py-5 m-0 text-[13px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.45)" }}>
            Nothing yet. When a GP finishes reviewing one of your
            consultations, it will appear here.
          </p>
        ) : (
          inbox.messages.map((m) => (
            <button
              key={m.recordingId}
              type="button"
              role="menuitem"
              onClick={() => openReport(m)}
              className="w-full text-left px-4 py-3 transition-colors"
              style={{
                background: m.unread ? "rgba(246,212,75,0.10)" : "white",
                border: "none",
                borderBottom: "1px solid rgba(26,27,82,0.06)",
                cursor: "pointer",
                display: "block",
              }}
            >
              <span className="flex items-start gap-2">
                <span
                  className="shrink-0 rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    marginTop: 6,
                    background: m.unread ? YELLOW : "transparent",
                  }}
                  aria-hidden="true"
                />
                <span className="flex-1">
                  <span
                    className="block text-[13px] leading-[1.5]"
                    style={{ color: "rgba(26,27,82,0.88)", fontWeight: m.unread ? 600 : 400 }}
                  >
                    {inboxLine(m)}
                  </span>
                  <span className="flex items-center gap-1.5 mt-1">
                    <span className="text-[11.5px] font-semibold" style={{ color: "#1A1B52" }}>
                      Click to view report
                    </span>
                    <span className="text-[11px]" style={{ color: "rgba(26,27,82,0.35)" }}>
                      · {when(m.sentAt)}
                    </span>
                  </span>
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="relative flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label={unread > 0 ? `Inbox, ${unread} unread` : "Inbox"}
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative flex items-center justify-center rounded-lg transition-colors"
        style={{
          width: 32,
          height: 32,
          background: open ? "rgba(255,255,255,0.18)" : "transparent",
          border: "none",
          color: open || unread > 0 ? "white" : "rgba(255,255,255,0.60)",
          cursor: "pointer",
        }}
      >
        <EnvelopeIcon />
        {unread > 0 && (
          <span
            className="absolute flex items-center justify-center font-bold tabular-nums"
            style={{
              top: -1,
              right: -2,
              minWidth: 15,
              height: 15,
              padding: "0 4px",
              borderRadius: 999,
              background: YELLOW,
              color: NAVY,
              fontSize: 9.5,
              lineHeight: 1,
              border: "1.5px solid #333333",
            }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {mounted && panel ? createPortal(panel, document.body) : null}
    </div>
  );
}
