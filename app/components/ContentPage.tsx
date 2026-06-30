import Link from "next/link";
import type { ReactNode } from "react";

/** Shared wrapper for FAQ / Privacy / Terms. Keeps these pages consistent and
 *  on-brand without repeating the full homepage chrome. */
export function ContentPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-cream min-h-screen flex flex-col">
      {/* Minimal header */}
      <header className="bg-navy px-6 md:px-10 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-bold text-white text-[15px] no-underline"
        >
          SCA Explained
        </Link>
        <Link
          href="/"
          className="text-[13px] text-white/60 no-underline hover:text-white/90 transition-colors"
        >
          ← Back to home
        </Link>
      </header>

      {/* Page header */}
      <div className="bg-navy px-6 md:px-10 pb-10 pt-6 border-t border-white/[0.07]">
        <div className="max-w-[760px] mx-auto">
          <h1 className="font-display font-extrabold text-[34px] leading-[1.15] text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-[14px] text-white/55">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="grow px-6 md:px-10 py-10 md:py-14">
        <div className="max-w-[760px] mx-auto prose-content">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-navy border-t border-white/[0.08] px-6 md:px-10 py-[18px] flex items-center justify-between flex-wrap gap-2.5">
        <p className="text-xs text-white/40">
          For educational purposes only. © 2026 SCA Explained.
        </p>
        <div className="flex gap-5 flex-wrap">
          <Link href="/faq" className="text-xs text-white/50 no-underline hover:text-white/80">FAQ</Link>
          <Link href="/privacy" className="text-[11px] text-white/30 no-underline hover:text-white/60">Privacy</Link>
          <Link href="/terms" className="text-[11px] text-white/30 no-underline hover:text-white/60">Terms</Link>
        </div>
      </footer>
    </div>
  );
}

/* ── Prose helpers ─────────────────────────────────────────────────────────────
   Tailwind v4 doesn't ship @tailwindcss/typography in the same way, so we
   style prose elements directly via the utility classes below. */
export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display font-bold text-[20px] text-navy mt-10 mb-3 leading-[1.3] first:mt-0">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display font-bold text-[16px] text-navy mt-6 mb-2 leading-[1.35]">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-[14.5px] leading-[1.75] text-navy/75 mb-4">{children}</p>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mb-4 flex flex-col gap-2 pl-1">{children}</ul>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[14.5px] leading-[1.65] text-navy/75">
      <span className="text-yellow font-bold mt-[3px] shrink-0">●</span>
      <span>{children}</span>
    </li>
  );
}

export function Divider() {
  return <hr className="border-navy/10 my-8" />;
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-yellow/20 border border-yellow/40 px-4 py-3.5 mb-6 text-[13.5px] leading-[1.65] text-navy/80">
      {children}
    </div>
  );
}
