import Link from "next/link";

const NAVY = "#1A1B52";
const YELLOW = "#F6D44B";

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
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-navy/[0.07]">
      <div className="max-w-[1100px] mx-auto px-10 max-md:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <span className="w-8 h-8 rounded-full bg-navy text-white group-hover:bg-yellow group-hover:text-navy group-hover:shadow-[0_0_14px_rgba(246,212,75,0.55)] transition-all duration-200 shrink-0 flex items-center justify-center font-display font-extrabold text-[15px] select-none">
            S
          </span>
          <span className="font-display font-bold text-[14px] text-navy tracking-[-0.01em]">
            SCA Explained
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/" className="text-[13px] font-semibold text-navy/60 hover:text-navy transition-colors no-underline">Home</Link>
          <Link href="/about" className="text-[13px] font-semibold text-navy/60 hover:text-navy transition-colors no-underline">About</Link>
          <Link href="/pricing" className="text-[13px] font-semibold text-navy/60 hover:text-navy transition-colors no-underline">Pricing</Link>
          <Link href="/faq" className="text-[13px] font-semibold text-navy/60 hover:text-navy transition-colors no-underline">FAQ</Link>

          {isLoggedIn && hasProgramme && (
            <>
              <Link href="/video-course" className="text-[13px] font-semibold text-navy/60 hover:text-navy transition-colors no-underline">Video Course</Link>
              <Link href="/case-bank" className="text-[13px] font-semibold text-navy/60 hover:text-navy transition-colors no-underline">Case Bank</Link>
            </>
          )}
          {isLoggedIn ? (
            <Link href="/programme" className="text-[12.5px] font-bold px-4 py-2 rounded-lg no-underline transition-colors" style={{ background: NAVY, color: "white" }}>
              {displayName ? displayName.split(" ")[0] : "Account"}
            </Link>
          ) : (
            <Link href="/login" className="text-[12.5px] font-bold px-4 py-2 rounded-lg no-underline transition-colors" style={{ background: NAVY, color: "white" }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
