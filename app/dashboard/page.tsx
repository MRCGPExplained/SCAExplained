import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

function VideoIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
      <rect x="3" y="8" width="32" height="22" rx="3" stroke="rgba(51,51,51,0.22)" strokeWidth="1.5"/>
      <path d="M37 13l4 3-4 3v-6z" fill="rgba(51,51,51,0.22)"/>
      <path d="M12 14.5l12 5.5-12 5.5V14.5z" fill="rgba(51,51,51,0.22)"/>
      <path d="M14 36h10M19 30v6" stroke="rgba(51,51,51,0.22)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function CaseIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
      <rect x="6" y="5" width="26" height="34" rx="3" stroke="rgba(51,51,51,0.22)" strokeWidth="1.5"/>
      <path d="M15 5v5h12V5" stroke="rgba(51,51,51,0.22)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 17h18M13 23h18M13 29h12" stroke="rgba(51,51,51,0.22)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const name = profile?.display_name ?? null;
  const firstName = name ? name.trim().split(" ")[0] : null;

  return (
    <div className="min-h-screen px-6 pt-12 pb-16" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[560px] mx-auto">
        <div className="mb-8">
          <p className="font-display font-bold text-[13px] mb-1.5" style={{ color: "rgba(51,51,51,0.4)" }}>
            SCA <span style={{ color: YELLOW }}>Explained</span>
          </p>
          <h1 className="font-display font-extrabold text-[28px]" style={{ color: DARK }}>
            {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/video-course"
            className="rounded-2xl p-6 flex items-center gap-5 no-underline"
            style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 2px 12px rgba(51,51,51,0.05)" }}
          >
            <VideoIcon />
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-[17px]" style={{ color: DARK }}>Video Course</p>
              <p className="text-[13px] mt-0.5" style={{ color: "rgba(51,51,51,0.50)" }}>System-by-system teaching · every clinical area</p>
            </div>
            <span className="shrink-0 font-bold text-[14px] px-4 py-2 rounded-lg" style={{ background: DARK, color: "white" }}>Open →</span>
          </Link>

          <Link
            href="/case-bank"
            className="rounded-2xl p-6 flex items-center gap-5 no-underline"
            style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 2px 12px rgba(51,51,51,0.05)" }}
          >
            <CaseIcon />
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-[17px]" style={{ color: DARK }}>Case Bank</p>
              <p className="text-[13px] mt-0.5" style={{ color: "rgba(51,51,51,0.50)" }}>246 practice stations · study rooms · notes</p>
            </div>
            <span className="shrink-0 font-bold text-[14px] px-4 py-2 rounded-lg" style={{ background: DARK, color: "white" }}>Open →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
