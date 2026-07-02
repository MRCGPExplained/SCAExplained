import Link from "next/link";

export default function VideoCoursePurchaseSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[440px] text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-[28px] mx-auto mb-5" style={{ background: "rgba(246,212,75,0.2)" }}>
          ✓
        </div>
        <h1 className="font-display font-extrabold text-[24px] mb-2" style={{ color: "#1A1B52" }}>
          You&apos;re in.
        </h1>
        <p className="text-[14px] leading-[1.7] mb-6" style={{ color: "rgba(26,27,82,0.60)" }}>
          Your Video Course access is active. Check your email for a confirmation.
        </p>
        <Link
          href="/video-course"
          className="inline-block rounded-xl px-7 py-3 font-display font-bold text-[15px] no-underline"
          style={{ background: "#1A1B52", color: "white" }}
        >
          Start Watching →
        </Link>
      </div>
    </div>
  );
}
