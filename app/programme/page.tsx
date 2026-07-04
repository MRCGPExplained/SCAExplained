import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProgrammeBuyButton from "./ProgrammeBuyButton";

export const dynamic = "force-dynamic";

const NAVY = "#1A1B52";
const YELLOW = "#F6D44B";

export default async function ProgrammePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: access } = await supabase
      .from("user_access")
      .select("has_programme, expires_at")
      .eq("user_id", user.id)
      .maybeSingle();
    const hasProgramme = !!(access?.has_programme && access.expires_at && new Date(access.expires_at) > new Date());
    if (hasProgramme) redirect("/dashboard");
  }

  // Sales view — non-subscriber or logged-out
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[520px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block no-underline">
            <span className="font-display font-extrabold text-[18px]" style={{ color: NAVY }}>SCA <span style={{ color: YELLOW }}>Explained</span></span>
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)", boxShadow: "0 4px 24px rgba(26,27,82,0.08)" }}>
          <div className="px-8 py-7" style={{ background: NAVY }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: YELLOW }}>The SCA Explained Programme</div>
            <div className="flex items-baseline gap-3">
              <span className="font-display font-extrabold text-[36px] text-white">£60</span>
              <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>90 days · one payment</span>
            </div>
          </div>

          <div className="px-8 py-7">
            <p className="text-[14.5px] leading-[1.7] mb-6" style={{ color: "rgba(26,27,82,0.65)" }}>
              Everything you need to turn SCA knowledge into SCA performance. A system-by-system
              video course and 246 practice stations, together.
            </p>

            <div className="flex flex-col gap-2 mb-7">
              {[
                "System-by-system video course — every clinical area examiners test",
                "246 fully-structured SCA practice stations",
                "Real-time study rooms to practise with colleagues",
                "Personal notes, starred stations, and progress tracking",
                "90-day access · one payment · no subscription",
              ].map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5" style={{ background: "rgba(26,27,82,0.08)", color: NAVY }}>✓</span>
                  <span className="text-[13.5px]" style={{ color: "rgba(26,27,82,0.70)" }}>{f}</span>
                </div>
              ))}
            </div>

            <ProgrammeBuyButton />

            <p className="text-center text-[11.5px] mt-3" style={{ color: "rgba(26,27,82,0.35)" }}>
              Secure payment via Stripe · No subscription
            </p>
          </div>
        </div>

        <p className="text-center text-[12px] mt-5" style={{ color: "rgba(26,27,82,0.4)" }}>
          Already purchased?{" "}
          <Link href="/login" className="font-semibold no-underline" style={{ color: NAVY }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
