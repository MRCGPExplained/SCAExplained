import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

const NAVY = "#1A1B52";
const YELLOW = "#F6D44B";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileResult, accessResult] = await Promise.all([
    supabase.from("user_profiles").select("display_name").eq("id", user.id).single(),
    supabase.from("user_access").select("has_video_course, has_case_bank, expires_at").eq("user_id", user.id).maybeSingle(),
  ]);

  const name = profileResult.data?.display_name ?? null;
  const firstName = name ? name.trim().split(" ")[0] : null;
  const access = accessResult.data;
  const now = new Date();
  const isActive = !!(access && new Date(access.expires_at) > now);
  const hasVideo = isActive && access!.has_video_course;
  const hasCaseBank = isActive && access!.has_case_bank;
  const hasNeither = !hasVideo && !hasCaseBank;
  const hasBoth = hasVideo && hasCaseBank;
  const expiryStr = isActive ? new Date(access!.expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[680px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-block no-underline mb-8">
            <span className="font-display font-extrabold text-[18px]" style={{ color: NAVY }}>
              SCA <span style={{ color: YELLOW }}>Explained</span>
            </span>
          </Link>
          <h1 className="font-display font-extrabold text-[28px] mt-4" style={{ color: NAVY }}>
            {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "rgba(26,27,82,0.5)" }}>
            {hasNeither
              ? "Choose what you'd like to access."
              : hasBoth
              ? `You have full access · expires ${expiryStr}`
              : `Access expires ${expiryStr}`}
          </p>
        </div>

        {/* Product cards */}
        <div className="flex flex-col gap-4">

          {/* Video Course */}
          <div className="rounded-2xl p-6 flex items-center justify-between gap-4" style={{ background: "white", border: `1px solid rgba(26,27,82,0.10)`, boxShadow: "0 2px 12px rgba(26,27,82,0.05)" }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display font-bold text-[17px]" style={{ color: NAVY }}>Video Course</span>
                {hasVideo && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(22,163,74,0.1)", color: "#166534" }}>Active</span>
                )}
              </div>
              <p className="text-[13px]" style={{ color: "rgba(26,27,82,0.55)" }}>
                System-by-system teaching · every clinical area examiners test
              </p>
            </div>
            {hasVideo ? (
              <Link href="/video-course" className="shrink-0 rounded-xl px-5 py-2.5 font-display font-bold text-[13px] no-underline" style={{ background: NAVY, color: "white" }}>
                Open →
              </Link>
            ) : (
              <Link href="/video-course/purchase" className="shrink-0 rounded-xl px-5 py-2.5 font-display font-bold text-[13px] no-underline" style={{ background: YELLOW, color: NAVY }}>
                Buy — £30
              </Link>
            )}
          </div>

          {/* Case Bank */}
          <div className="rounded-2xl p-6 flex items-center justify-between gap-4" style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)", boxShadow: "0 2px 12px rgba(26,27,82,0.05)" }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display font-bold text-[17px]" style={{ color: NAVY }}>Case Bank</span>
                {hasCaseBank && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(22,163,74,0.1)", color: "#166534" }}>Active</span>
                )}
              </div>
              <p className="text-[13px]" style={{ color: "rgba(26,27,82,0.55)" }}>
                246 realistic SCA stations · study rooms · notes and stars
              </p>
            </div>
            {hasCaseBank ? (
              <Link href="/case-bank" className="shrink-0 rounded-xl px-5 py-2.5 font-display font-bold text-[13px] no-underline" style={{ background: NAVY, color: "white" }}>
                Open →
              </Link>
            ) : (
              <Link href="/case-bank/purchase" className="shrink-0 rounded-xl px-5 py-2.5 font-display font-bold text-[13px] no-underline" style={{ background: YELLOW, color: NAVY }}>
                Buy — £30
              </Link>
            )}
          </div>

          {/* Bundle upsell — only if they don't have both */}
          {!hasBoth && (
            <div className="rounded-2xl p-6 flex items-center justify-between gap-4" style={{ background: NAVY, boxShadow: "0 4px 20px rgba(26,27,82,0.18)" }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-bold text-[17px] text-white">Bundle</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: YELLOW, color: NAVY }}>Best value</span>
                </div>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Video Course + Case Bank · save £10
                </p>
              </div>
              <Link href="/bundle/purchase" className="shrink-0 rounded-xl px-5 py-2.5 font-display font-bold text-[13px] no-underline" style={{ background: YELLOW, color: NAVY }}>
                Buy — £50
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-[12px] mt-8" style={{ color: "rgba(26,27,82,0.35)" }}>
          <Link href="/" className="no-underline hover:underline" style={{ color: "rgba(26,27,82,0.4)" }}>← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
