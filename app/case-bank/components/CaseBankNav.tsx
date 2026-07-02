import Link from "next/link";
import { logoutAction } from "../actions";

const NAVY = "#1A1B52";
const YELLOW = "#F6D44B";

function formatExpiry(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function isExpiryWarning(isoString: string): boolean {
  const msLeft = new Date(isoString).getTime() - Date.now();
  return msLeft < 10 * 24 * 60 * 60 * 1000; // less than 10 days
}

export function CaseBankNav({
  displayName,
  initials,
  expiresAt,
}: {
  displayName: string;
  initials: string;
  expiresAt: string | null;
}) {
  const showWarning = expiresAt ? isExpiryWarning(expiresAt) : false;

  return (
    <nav
      className="sticky top-0 z-20 flex items-center justify-between px-6 py-3"
      style={{ background: NAVY, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="font-display font-extrabold text-[15px] no-underline"
          style={{ color: "white" }}
        >
          SCA <span style={{ color: YELLOW }}>Explained</span>
        </Link>
        <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
        <Link
          href="/case-bank"
          className="text-[13px] font-semibold no-underline"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          Case Bank
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {expiresAt && (
          <span
            className="text-[11.5px] font-medium px-3 py-1 rounded-full"
            style={{
              background: showWarning ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.07)",
              color: showWarning ? "#FCA5A5" : "rgba(255,255,255,0.45)",
              border: showWarning ? "1px solid rgba(239,68,68,0.25)" : "none",
            }}
          >
            Access expires {formatExpiry(expiresAt)}
          </span>
        )}

        <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>
          {displayName}
        </span>

        <div
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
          style={{ background: YELLOW, color: NAVY }}
        >
          {initials}
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="text-[11.5px] font-medium px-2 py-1 rounded transition-colors"
            style={{ color: "rgba(255,255,255,0.35)", background: "transparent", border: "none", cursor: "pointer" }}
          >
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
