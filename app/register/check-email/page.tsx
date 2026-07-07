import Link from "next/link";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[400px] text-center">

        <Link href="/" className="inline-block no-underline mb-8">
          <span className="font-display font-extrabold text-[22px]" style={{ color: DARK }}>
            SCA <span style={{ color: YELLOW }}>Explained</span>
          </span>
        </Link>

        <div
          className="rounded-2xl p-8 mt-2"
          style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 4px 24px rgba(51,51,51,0.07)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(246,212,75,0.20)" }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="5" width="18" height="13" rx="2" stroke={DARK} strokeWidth="1.5"/>
              <path d="M2 8l9 5.5L20 8" stroke={DARK} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <h1 className="font-display font-bold text-[20px] mb-2" style={{ color: DARK }}>
            Check your email
          </h1>
          <p className="text-[13.5px] leading-[1.6]" style={{ color: "rgba(51,51,51,0.55)" }}>
            We&apos;ve sent a confirmation link to{" "}
            {email ? (
              <strong style={{ color: DARK }}>{email}</strong>
            ) : (
              "your email address"
            )}
            . Click it to activate your account.
          </p>
        </div>

        <p className="text-[12px] mt-5" style={{ color: "rgba(51,51,51,0.35)" }}>
          Already confirmed?{" "}
          <Link href="/login" className="font-semibold no-underline" style={{ color: "rgba(51,51,51,0.55)" }}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
