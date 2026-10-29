"use client";

import Link from "next/link";
import { InboxMenu } from "./InboxMenu";

const DARK = "#333333";
const YELLOW = "#F6D44B";

function SpeechIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="white">
      <path d="M2 3.5A1.5 1.5 0 013.5 2h13A1.5 1.5 0 0118 3.5v9A1.5 1.5 0 0116.5 14H7l-5 4V3.5z" />
    </svg>
  );
}

/** The GP review queue. A document, because that is what is waiting. */
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
 * Feedback and help requests.
 *
 * A lifebuoy, not the speech bubble the Feedback button on a station uses —
 * that glyph is already the wordmark at the other end of this same bar, and
 * the same shape twice in one navbar reads as a mistake.
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

/**
 * A navbar icon that links somewhere and carries a count.
 *
 * `count === null` means the viewer is not entitled to this at all and the
 * icon does not render. Zero renders the icon with no badge — "you can see
 * this, there is nothing waiting" — which is a different statement and has to
 * look different.
 */
function NavCountLink({
  href,
  label,
  count,
  children,
}: {
  href: string;
  label: string;
  count: number | null;
  children: React.ReactNode;
}) {
  if (count === null) return null;
  return (
    <Link
      href={href}
      aria-label={count > 0 ? `${label}, ${count} waiting` : label}
      title={count > 0 ? `${label}: ${count} waiting` : label}
      className="relative flex items-center justify-center rounded-lg transition-colors no-underline"
      style={{ width: 32, height: 32, color: count > 0 ? "white" : "rgba(255,255,255,0.60)" }}
    >
      {children}
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
    </Link>
  );
}

export function Navbar({
  isLoggedIn,
  displayName,
  unreadReports = 0,
  reviewsWaiting = null,
  feedbackWaiting = null,
}: {
  isLoggedIn: boolean;
  displayName?: string | null;
  /** GP reviews sent and not yet opened. Rendered with the page, so it is
   *  correct as of this load; the envelope re-asks when it is opened. */
  unreadReports?: number;
  /** Consultations waiting on a GP. Null for everyone who is not an examiner
   *  or an admin, which hides the icon entirely. */
  reviewsWaiting?: number | null;
  /** Unanswered feedback. Null for everyone who is not an admin. */
  feedbackWaiting?: number | null;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08]" style={{ background: DARK }}>
      <div className="px-10 max-md:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 select-none transition-opacity duration-200 hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <SpeechIcon />
          </span>
          <span className="font-display font-bold text-[14px] tracking-[-0.01em] text-white">
            SCA <span style={{ color: YELLOW }}>FOCUS</span>
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/live-events"
            className="text-[13px] font-semibold no-underline transition-colors"
            style={{ color: "rgba(255,255,255,0.60)" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "white")}
            onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.60)")}
          >
            Live Events
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-[13px] font-semibold no-underline transition-colors"
                style={{ color: "rgba(255,255,255,0.60)" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "white")}
                onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.60)")}
              >
                Resources
              </Link>
              {/* The three badged icons, grouped before Account, widest
                  audience last: feedback is admin only, the review queue is
                  staff, the envelope is everyone. A trainee sees one icon
                  here; nobody sees an icon for something they cannot act on.

                  This is also the only route to /examiner anywhere in the
                  navigation — a GP used to reach the queue by typing the URL. */}
              <NavCountLink href="/admin/feedback" label="Feedback" count={feedbackWaiting}>
                <LifebuoyIcon />
              </NavCountLink>
              <NavCountLink href="/examiner" label="Reviews waiting" count={reviewsWaiting}>
                <DocumentIcon />
              </NavCountLink>
              <InboxMenu initialUnread={unreadReports} />
              <Link
                href="/account"
                className="text-[12.5px] font-bold px-4 py-2 rounded-lg no-underline transition-all bg-white/[.12] hover:bg-white/[.22]"
                style={{ color: "white" }}
              >
                Account
              </Link>
            </>
          ) : (
            <>
              {/* No "Home": the wordmark to its left is the link home, and
                  every site puts it there. */}
              <Link href="/about" className="text-[13px] font-semibold no-underline transition-opacity hover:opacity-100" style={{ color: "rgba(255,255,255,0.60)" }}>About</Link>
              <Link
                href="/login"
                className="text-[12.5px] font-bold px-4 py-2 rounded-lg no-underline bg-white/[.12] hover:bg-white/[.22] transition-all"
                style={{ color: "white" }}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
