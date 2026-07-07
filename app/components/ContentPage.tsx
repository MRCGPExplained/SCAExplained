import type { ReactNode } from "react";
import Link from "next/link";

/** Shared wrapper for FAQ / Privacy / Terms. Keeps these pages consistent and
 *  on-brand without repeating the full homepage chrome. */
const DARK = "#333333";
const YELLOW = "#F6D44B";

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
    <div className="min-h-screen flex flex-col" style={{ background: "#FAFAF8" }}>
      {/* Page header */}
      <div className="px-6 md:px-10 pb-10 pt-6 border-t border-white/[0.07]" style={{ background: DARK }}>
        <div className="max-w-[760px] mx-auto">
          <h1 className="font-display font-extrabold text-[34px] leading-[1.15] text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-[14px]" style={{ color: "rgba(255,255,255,0.55)" }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="grow px-6 md:px-10 py-10 md:py-14">
        <div className="max-w-[760px] mx-auto prose-content">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 md:px-10 py-[18px] flex items-center justify-between flex-wrap gap-2.5" style={{ background: DARK, borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
          For educational purposes only. © 2026 SCA Explained.
        </p>
        <div className="flex gap-5 flex-wrap">
          <Link href="/privacy" className="text-[11px] no-underline" style={{ color: "rgba(255,255,255,0.40)" }}>Privacy</Link>
          <Link href="/terms" className="text-[11px] no-underline" style={{ color: "rgba(255,255,255,0.40)" }}>Terms</Link>
        </div>
      </footer>
    </div>
  );
}

/* ── Prose helpers ─────────────────────────────────────────────────────────────
   Tailwind v4 doesn't ship @tailwindcss/typography in the same way, so we
   style prose elements directly via the utility classes below. */
export function H2({ children, underline }: { children: ReactNode; underline?: boolean }) {
  return (
    <h2 className="font-display font-bold text-[20px] mt-10 mb-3 leading-[1.3] first:mt-0" style={{ color: DARK }}>
      {underline ? (
        <span className="border-b-[3px] pb-0.5" style={{ borderColor: YELLOW }}>{children}</span>
      ) : children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display font-bold text-[16px] mt-6 mb-2 leading-[1.35]" style={{ color: DARK }}>
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-[14.5px] leading-[1.75] mb-4" style={{ color: "rgba(51,51,51,0.72)" }}>{children}</p>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mb-4 flex flex-col gap-2 pl-1">{children}</ul>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[14.5px] leading-[1.65]" style={{ color: "rgba(51,51,51,0.72)" }}>
      <span className="font-bold mt-[3px] shrink-0" style={{ color: DARK }}>●</span>
      <span>{children}</span>
    </li>
  );
}

export function Divider() {
  return <hr className="my-8" style={{ borderColor: "rgba(51,51,51,0.10)" }} />;
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl px-4 py-3.5 mb-6 text-[13.5px] leading-[1.65]" style={{ background: "rgba(246,212,75,0.15)", border: "1px solid rgba(246,212,75,0.40)", color: "rgba(51,51,51,0.80)" }}>
      {children}
    </div>
  );
}
