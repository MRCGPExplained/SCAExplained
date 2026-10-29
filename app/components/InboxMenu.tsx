"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NavDropdown, navDropdownRowStyle, when } from "./NavDropdown";
import { fetchInboxAction, markReplyReadAction } from "./inbox-actions";
import { inboxLine, type Inbox, type InboxMessage } from "@/lib/inbox";

/**
 * The envelope, and the two kinds of thing behind it.
 *
 * A GP review and a reply to feedback. Both arrive after the candidate has
 * gone, which is the whole test for being here. An AI report does not: it
 * lands about a minute after the recording stops, while they are still in the
 * room looking at it.
 *
 * The panel, its placement and its dismissal live in NavDropdown, shared with
 * the two staff icons beside it. What is specific to the envelope is only
 * what a row does: a review opens its report, a reply expands in place.
 *
 * No grade in the list. A number visible from the navbar is a result someone
 * can read over your shoulder, and it would make opening the report pointless
 * anyway.
 *
 * NavbarWrapper hides the whole navbar inside a station and a video course,
 * so a badge cannot appear over a running twelve-minute consultation. Worth
 * keeping if this ever moves.
 */

const YELLOW = "#F6D44B";

function EnvelopeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="1.75" y="3.75" width="16.5" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 5.5L10 11L17.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InboxMenu({ initialUnread }: { initialUnread: number }) {
  const router = useRouter();
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [unread, setUnread] = useState(initialUnread);
  const [loading, setLoading] = useState(false);
  /** Which reply is open. One at a time — the panel is 340px wide. */
  const [expanded, setExpanded] = useState<string | null>(null);
  // Only the newest fetch may write. Open, close, open again and the first
  // request can still land after the second and overwrite it with a count
  // taken before anything was read.
  const ticket = useRef(0);

  async function load() {
    const mine = ++ticket.current;
    setLoading(true);
    try {
      const next = await fetchInboxAction();
      if (mine !== ticket.current) return;
      setInbox(next);
      // A failed read must not zero a badge that was right a moment ago.
      if (!next.failed) setUnread(next.unread);
    } catch (err) {
      console.error("[InboxMenu] could not load the inbox", err);
      if (mine === ticket.current) setInbox({ messages: [], unread: 0, failed: true });
    } finally {
      if (mine === ticket.current) setLoading(false);
    }
  }

  function openReport(m: InboxMessage, close: () => void) {
    if (m.kind !== "review") return;
    close();
    // Opening the report is what marks it read, server-side, on the page
    // itself. Dropping the badge here keeps the navbar honest without waiting
    // for a navigation; the next fetch re-reads the truth.
    if (m.unread) setUnread((n) => Math.max(0, n - 1));
    router.push(`/recordings/${m.recordingId}`);
  }

  /** A reply has no page to open, so expanding it is what counts as reading. */
  function toggleReply(m: InboxMessage) {
    if (m.kind !== "reply") return;
    const wasOpen = expanded === m.id;
    setExpanded(wasOpen ? null : m.id);
    if (wasOpen || !m.unread) return;

    setUnread((n) => Math.max(0, n - 1));
    setInbox((prev) =>
      prev ? { ...prev, messages: prev.messages.map((x) => (x.id === m.id ? { ...x, unread: false } : x)) } : prev
    );
    void markReplyReadAction(m.id);
  }

  return (
    <NavDropdown label="Inbox" title="Inbox" icon={<EnvelopeIcon />} count={unread} onOpen={load}>
      {({ close }) =>
        loading && inbox === null ? (
          <p className="px-4 py-5 m-0 text-[13px]" style={{ color: "rgba(26,27,82,0.45)" }}>
            Loading…
          </p>
        ) : inbox?.failed ? (
          /* Not the empty state. An inbox that could not be read says so,
             because "nothing yet" is indistinguishable from the truth. */
          <p className="px-4 py-5 m-0 text-[13px] leading-[1.6]" style={{ color: "#92400e" }}>
            Could not load your inbox just now. Your reports are safe. Try again in a moment, or open{" "}
            <span style={{ fontWeight: 600 }}>My Reviews</span> from the dashboard.
          </p>
        ) : !inbox || inbox.messages.length === 0 ? (
          /* A Starter customer has no GP reviews at all and will see this
             every time, so it must not read as an error. */
          <p className="px-4 py-5 m-0 text-[13px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.45)" }}>
            Nothing yet. When a GP reviews one of your consultations, or we answer something you asked, it will appear here.
          </p>
        ) : (
          inbox.messages.map((m) => {
            const isOpen = m.kind === "reply" && expanded === m.id;
            return (
              <div key={m.id} style={{ borderBottom: "1px solid rgba(26,27,82,0.06)" }}>
                <button
                  type="button"
                  role="menuitem"
                  aria-expanded={m.kind === "reply" ? isOpen : undefined}
                  onClick={() => (m.kind === "review" ? openReport(m, close) : toggleReply(m))}
                  className="w-full text-left px-4 py-3 transition-colors"
                  style={navDropdownRowStyle(m.unread)}
                >
                  <span className="flex items-start gap-2">
                    <span
                      className="shrink-0 rounded-full"
                      style={{ width: 6, height: 6, marginTop: 6, background: m.unread ? YELLOW : "transparent" }}
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
                        {/* Says which kind it is before it is clicked. One
                            leaves the envelope and one does not, and finding
                            that out by clicking is the worst way to learn it. */}
                        <span className="text-[11.5px] font-semibold" style={{ color: "#1A1B52" }}>
                          {m.kind === "review" ? "Click to view report" : isOpen ? "Hide reply" : "Click to read"}
                        </span>
                        <span className="text-[11px]" style={{ color: "rgba(26,27,82,0.35)" }}>
                          · {when(m.sentAt)}
                        </span>
                      </span>
                    </span>
                  </span>
                </button>

                {/* The reply, in place. There is no page for a trainee to see
                    their own submissions, and a two-line answer does not earn
                    one — but the answer needs its question beside it, or it
                    arrives days later with nothing to attach to. */}
                {isOpen && m.kind === "reply" && (
                  <div className="px-4 pb-3.5" style={{ background: "white" }}>
                    <div className="rounded-lg px-3 py-2 mb-2" style={{ background: "rgba(26,27,82,0.04)" }}>
                      <span
                        className="block text-[10px] font-bold uppercase tracking-[0.06em] mb-1"
                        style={{ color: "rgba(26,27,82,0.4)" }}
                      >
                        You wrote
                      </span>
                      <span
                        className="block text-[12.5px] leading-[1.6] whitespace-pre-wrap"
                        style={{ color: "rgba(26,27,82,0.6)" }}
                      >
                        {m.question}
                      </span>
                    </div>
                    <span
                      className="block text-[13px] leading-[1.65] whitespace-pre-wrap"
                      style={{ color: "rgba(26,27,82,0.88)" }}
                    >
                      {m.reply}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )
      }
    </NavDropdown>
  );
}
