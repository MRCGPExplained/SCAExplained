import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";

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
    <div className="min-h-screen px-6 pt-14 pb-16" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[560px] mx-auto">
        <h1 className="font-display font-extrabold text-[28px] mb-8" style={{ color: DARK }}>
          {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
        </h1>

        <div className="flex flex-col gap-4">
          <Link
            href="/video-course"
            className="rounded-2xl p-6 flex items-center justify-between gap-4 no-underline"
            style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 2px 12px rgba(51,51,51,0.05)" }}
          >
            <div>
              <p className="font-display font-bold text-[17px]" style={{ color: DARK }}>Video Course</p>
              <p className="text-[13px] mt-0.5" style={{ color: "rgba(51,51,51,0.50)" }}>System-by-system teaching · every clinical area</p>
            </div>
            <span className="shrink-0 font-bold text-[14px] px-4 py-2 rounded-lg" style={{ background: DARK, color: "white" }}>Open →</span>
          </Link>

          <Link
            href="/case-bank"
            className="rounded-2xl p-6 flex items-center justify-between gap-4 no-underline"
            style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 2px 12px rgba(51,51,51,0.05)" }}
          >
            <div>
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
