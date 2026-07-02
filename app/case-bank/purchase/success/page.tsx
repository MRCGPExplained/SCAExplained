import Link from "next/link";

export default function PurchaseSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[420px] text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-[28px] mx-auto mb-6"
          style={{ background: "rgba(246,212,75,0.2)" }}
        >
          ✓
        </div>

        <h1 className="font-display font-extrabold text-[26px] mb-3" style={{ color: "#1A1B52" }}>
          Access granted
        </h1>
        <p className="text-[14px] leading-relaxed mb-8" style={{ color: "rgba(26,27,82,0.6)" }}>
          Your 90-day Case Bank access is now active. A confirmation email is on its way.
        </p>

        <Link
          href="/case-bank"
          className="inline-block rounded-xl px-8 py-3.5 font-display font-bold text-[14px] no-underline"
          style={{ background: "#1A1B52", color: "white" }}
        >
          Open Case Bank →
        </Link>

        <p className="text-[12px] mt-6" style={{ color: "rgba(26,27,82,0.35)" }}>
          Didn&apos;t receive the email? Check your spam folder or contact{" "}
          <a
            href="mailto:mrcgpexplained@outlook.com"
            className="no-underline"
            style={{ color: "#1A1B52", fontWeight: 600 }}
          >
            mrcgpexplained@outlook.com
          </a>
        </p>
      </div>
    </div>
  );
}
