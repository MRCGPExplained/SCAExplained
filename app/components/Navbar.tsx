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

export function Navbar({
  isLoggedIn,
  displayName,
  unreadReports = 0,
}: {
  isLoggedIn: boolean;
  displayName?: string | null;
  /** GP reviews sent and not yet opened. Rendered with the page, so it is
   *  correct as of this load; the envelope re-asks when it is opened. */
  unreadReports?: number;
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
              {/* Next to Account, not out among the text links.
                  The navbar holds two kinds of thing: places you can go
                  (Live Events, Resources) and things that are yours. The
                  envelope is the second kind, and sitting between two
                  destinations it read as a third one. */}
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
