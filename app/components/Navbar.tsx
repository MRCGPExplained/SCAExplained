import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-navy/[0.07]">
      <div className="max-w-[1100px] mx-auto px-10 max-md:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <span className="w-8 h-8 rounded-full bg-navy text-white group-hover:bg-yellow group-hover:text-navy group-hover:shadow-[0_0_14px_rgba(246,212,75,0.55)] transition-all duration-200 shrink-0 flex items-center justify-center">
            {/* viewBox expanded to give rays room outside the bulb */}
            <svg viewBox="-3 -4 26 26" fill="currentColor" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1a6 6 0 0 0-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 0 0 .572.729 6.016 6.016 0 0 0 2.856 0A.75.75 0 0 0 12 15.1v-.644c0-1.013.763-1.957 1.815-2.825A6 6 0 0 0 10 1z"/>
              <path d="M8.863 17.414a.75.75 0 0 0-.226 1.483 9.066 9.066 0 0 0 2.726 0 .75.75 0 0 0-.226-1.483 7.553 7.553 0 0 1-2.274 0z"/>
              {/* Light rays radiating from dome centre (10, 7) */}
              <rect x="9.2" y="-2.2" width="1.6" height="2.8" rx="0.8"/>
              <rect x="9.2" y="-2.2" width="1.6" height="2.8" rx="0.8" transform="rotate(45 10 7)"/>
              <rect x="9.2" y="-2.2" width="1.6" height="2.8" rx="0.8" transform="rotate(-45 10 7)"/>
              <rect x="9.2" y="-2.2" width="1.6" height="2.8" rx="0.8" transform="rotate(90 10 7)"/>
              <rect x="9.2" y="-2.2" width="1.6" height="2.8" rx="0.8" transform="rotate(-90 10 7)"/>
            </svg>
          </span>
          <span className="font-display font-bold text-[14px] text-navy tracking-[-0.01em]">
            SCA Explained
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-5">
          <Link
            href="/about"
            className="text-[13px] font-semibold text-navy/60 hover:text-navy transition-colors no-underline"
          >
            About
          </Link>
          <Link
            href="/faq"
            className="text-[13px] font-semibold text-navy/60 hover:text-navy transition-colors no-underline"
          >
            FAQ
          </Link>
          <a
            href="#booking"
            className="bg-navy text-white text-[12.5px] font-bold px-4 py-2 rounded-lg hover:bg-navy/85 transition-colors no-underline"
          >
            Book now
          </a>
        </div>
      </div>
    </header>
  );
}
