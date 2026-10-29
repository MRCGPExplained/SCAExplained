"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * A navbar icon with a count, and a panel of things behind it.
 *
 * Extracted from the envelope once there were three of these. The hard parts
 * are the same for all of them and none of them are obvious, so they live
 * here once rather than being copied twice and drifting:
 *
 *   - The panel is PORTALLED to the body. Rendered in place it is trapped in
 *     the sticky header's stacking context, where its z-index cannot lift it
 *     above anything outside the header — the study room dock painted
 *     straight over it.
 *   - It is positioned from the button's real rectangle and clamped to the
 *     viewport. `right: 0` anchored it to a button sitting well short of the
 *     screen edge, so on a phone a 340px panel ran off the LEFT side and most
 *     of it could not be reached.
 *   - Only the newest fetch may write. Open, close, open again and the first
 *     request can still land after the second and overwrite it with state
 *     taken before anything was read.
 *   - Closing returns focus to the button, or it drops to <body> and strands
 *     anyone on a keyboard at the top of the document.
 *
 * `count === null` means the viewer is not entitled to this and nothing
 * renders at all. Zero renders the icon with no badge — "you can see this,
 * there is nothing waiting" — which is a different statement and has to look
 * different.
 */

const YELLOW = "#F6D44B";
const DARK = "#333333";
const PANEL_WIDTH = 340;
const GUTTER = 12;

export interface NavDropdownRenderProps {
  /**
   * Dismiss the panel, for a row that navigates away.
   *
   * Deliberately does NOT return focus to the button, unlike Escape: the row
   * is taking you to another page, and pulling focus back to a navbar icon on
   * the way out is worse than leaving it. It is also why this is a plain
   * setState that touches no ref — a callback handed out through a render
   * prop is read during render, and a ref must not be.
   */
  close: () => void;
}

export function NavDropdown({
  label,
  title,
  icon,
  count,
  onOpen,
  children,
}: {
  /** For the aria-label, e.g. "Inbox". */
  label: string;
  /** Heading inside the panel. */
  title: string;
  icon: React.ReactNode;
  count: number | null;
  /** Called each time the panel opens. The ticket guards against stale writes. */
  onOpen?: () => void | Promise<void>;
  children: (p: NavDropdownRenderProps) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<{ top: number; left: number; width: number } | null>(null);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // No mounted guard. The panel only exists once open is true, and open can
  // only be set by a click, so createPortal is never reached during server
  // rendering and there is nothing to guard against.

  /** Place the panel against the button, clamped inside the viewport. */
  const place = useCallback(() => {
    const el = buttonRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(PANEL_WIDTH, window.innerWidth - GUTTER * 2);
    const left = Math.min(Math.max(GUTTER, r.right - width), window.innerWidth - width - GUTTER);
    setBox({ top: r.bottom + 8, left, width });
  }, []);

  /** For a row that navigates. No focus handling — see NavDropdownRenderProps. */
  const dismiss = useCallback(() => setOpen(false), []);

  /** For Escape and the toggle, where focus would otherwise drop to <body>
   *  and strand anyone on a keyboard at the top of the document. */
  const closeAndFocus = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  function toggle() {
    if (open) {
      closeAndFocus();
      return;
    }
    place();
    setOpen(true);
    void onOpen?.();
  }

  useEffect(() => {
    if (!open) return;

    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || buttonRef.current?.contains(t)) return;
      dismiss();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAndFocus();
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
  }, [open, dismiss, closeAndFocus, place]);

  if (count === null) return null;

  const panel = open && box && (
    <div
      ref={panelRef}
      role="menu"
      aria-label={label}
      className="rounded-xl overflow-hidden"
      style={{
        position: "fixed",
        top: box.top,
        left: box.left,
        width: box.width,
        background: "white",
        boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
        border: "1px solid rgba(26,27,82,0.08)",
        zIndex: 2000,
      }}
    >
      <div
        className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em]"
        style={{ color: "rgba(26,27,82,0.5)", borderBottom: "1px solid rgba(26,27,82,0.07)" }}
      >
        {title}
      </div>
      <div style={{ maxHeight: "min(380px, 60vh)", overflowY: "auto" }}>{children({ close: dismiss })}</div>
    </div>
  );

  return (
    <div className="relative flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label={count > 0 ? `${label}, ${count} waiting` : label}
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative flex items-center justify-center rounded-lg transition-colors"
        style={{
          width: 32,
          height: 32,
          background: open ? "rgba(255,255,255,0.18)" : "transparent",
          border: "none",
          color: open || count > 0 ? "white" : "rgba(255,255,255,0.60)",
          cursor: "pointer",
        }}
      >
        {icon}
        {count > 0 && (
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
              color: DARK,
              fontSize: 9.5,
              lineHeight: 1,
              border: `1.5px solid ${DARK}`,
            }}
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {panel ? createPortal(panel, document.body) : null}
    </div>
  );
}

/** Shared by all three panels so the rows cannot drift apart. */
export function navDropdownRowStyle(unread: boolean): React.CSSProperties {
  return {
    background: unread ? "rgba(246,212,75,0.10)" : "white",
    border: "none",
    cursor: "pointer",
    display: "block",
  };
}

export function when(iso: string): string {
  const then = new Date(iso);
  const days = Math.floor((Date.now() - then.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return then.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
