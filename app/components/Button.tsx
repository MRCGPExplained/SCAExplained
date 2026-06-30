import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "yellow" | "outline" | "whiteOutline";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold no-underline cursor-pointer transition-transform transition-shadow duration-150 hover:-translate-y-0.5";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-white px-[26px] py-[13px] text-sm hover:shadow-[0_6px_18px_rgba(26,27,82,0.25)]",
  yellow:
    "bg-yellow text-navy font-bold px-7 py-[13px] text-sm hover:shadow-[0_6px_18px_rgba(246,212,75,0.35)]",
  outline:
    "bg-transparent text-navy border-[1.5px] border-navy px-6 py-3 text-sm hover:bg-navy/[0.06]",
  whiteOutline:
    "bg-transparent text-white border-[1.5px] border-white/50 px-[26px] py-3 text-sm hover:bg-white/[0.08]",
};

interface ButtonProps {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

/** Anchor-style button. Internal links (/book/...) and on-page anchors (#...)
 *  both render as <a>; Next <Link> is used for internal routes. */
export function Button({
  href,
  variant = "primary",
  children,
  className = "",
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const isInternalRoute = href.startsWith("/");
  if (isInternalRoute) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}
