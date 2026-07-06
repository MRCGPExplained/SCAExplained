import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: access } = await supabase
    .from("user_access")
    .select("expires_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const expiryDisplay = access?.expires_at ? formatExpiry(access.expires_at) : null;
  const isPromo = type === "promo";

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-12" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[480px] text-center">

        <div className="text-4xl mb-6">🎉</div>

        <h1 className="font-display font-extrabold text-[28px] mb-3 leading-[1.2]" style={{ color: DARK }}>
          {isPromo ? "Your free access is confirmed." : "You're in. Welcome to The Complete SCA Package."}
        </h1>

        {expiryDisplay && (
          <p className="text-[15px] mb-8" style={{ color: "rgba(51,51,51,0.60)" }}>
            Your access runs until <strong style={{ color: DARK }}>{expiryDisplay}</strong>.
          </p>
        )}

        <div className="flex gap-3 justify-center mb-8">
          <Link
            href="/case-bank"
            className="flex-1 max-w-[200px] rounded-xl py-3.5 font-display font-bold text-[14px] no-underline text-center transition-opacity hover:opacity-90"
            style={{ background: DARK, color: "white" }}
          >
            Open the Case Bank
          </Link>
          <Link
            href="/video-course"
            className="flex-1 max-w-[200px] rounded-xl py-3.5 font-display font-bold text-[14px] no-underline text-center transition-opacity hover:opacity-90"
            style={{ background: YELLOW, color: DARK }}
          >
            Watch the Video Course
          </Link>
        </div>

        <p className="text-[12px]" style={{ color: "rgba(51,51,51,0.38)" }}>
          You&apos;ll receive an email 3 days before your access expires.
        </p>

      </div>
    </div>
  );
}
