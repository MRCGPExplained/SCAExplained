"use client";

import Link from "next/link";

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
  hasProgramme,
  displayName,
}: {
  isLoggedIn: boolean;
  hasProgramme: boolean;
  displayName?: string | null;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08]" style={{ background: DARK }}>
      <div className="max-w-[1100px] mx-auto px-10 max-md:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 select-none transition-opacity duration-200 hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <SpeechIcon />
          </span>
          <span className="font-display font-bold text-[14px] tracking-[-0.01em] text-white">
            SCA <span style={{ color: YELLOW }}>Explained</span>
          </span>
        </Link>

        <div className="flex items-center gap-5">
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
              <Link href="/" className="text-[13px] font-semibold no-underline transition-opacity hover:opacity-100" style={{ color: "rgba(255,255,255,0.60)" }}>Home</Link>
              <Link href="/about" className="text-[13px] font-semibold no-underline transition-opacity hover:opacity-100" style={{ color: "rgba(255,255,255,0.60)" }}>About</Link>
              <Link href="/pricing" className="text-[13px] font-semibold no-underline transition-opacity hover:opacity-100" style={{ color: "rgba(255,255,255,0.60)" }}>Pricing</Link>
              <Link href="/faq" className="text-[13px] font-semibold no-underline transition-opacity hover:opacity-100" style={{ color: "rgba(255,255,255,0.60)" }}>FAQ</Link>
              <Link
                href="/login"
                className="text-[12.5px] font-bold px-4 py-2 rounded-lg no-underline"
                style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
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
