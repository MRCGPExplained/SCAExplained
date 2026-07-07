import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

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

  const items = [
    {
      href: "/video-course",
      label: "Skills Workshop",
      description: "System-by-system teaching — every consultation skill examiners score",
      icon: (
        <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke={DARK} strokeWidth="1.5"/>
          <path d="M9 7.5l6 3.5-6 3.5V7.5z" fill={DARK}/>
        </svg>
      ),
    },
    {
      href: "/recorded-consultations",
      label: "Recorded Consultations",
      description: "Watch complete exam-style consultations from start to finish",
      icon: (
        <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke={DARK} strokeWidth="1.5"/>
          <path d="M9 7.5l6 3.5-6 3.5V7.5z" fill={DARK}/>
        </svg>
      ),
    },
    {
      href: "/case-bank",
      label: "Case Bank",
      description: "246 practice stations · study rooms · notes",
      icon: (
        <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="2" width="14" height="18" rx="2" stroke={DARK} strokeWidth="1.5"/>
          <path d="M7 7.5h8M7 11h8M7 14.5h5" stroke={DARK} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen px-6 pt-12 pb-16" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[560px] mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-[28px]" style={{ color: DARK }}>
            {firstName ? `Hi ${firstName}! 👋` : "Hi there! 👋"}
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl p-6 flex items-center gap-5 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-[rgba(246,212,75,0.07)]"
              style={{ border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 2px 12px rgba(51,51,51,0.05)" }}
            >
              <div className="shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-[17px]" style={{ color: DARK }}>{item.label}</p>
                <p className="text-[13px] mt-0.5" style={{ color: "rgba(51,51,51,0.50)" }}>{item.description}</p>
              </div>
              <span className="shrink-0 font-bold text-[14px] px-4 py-2 rounded-lg" style={{ background: DARK, color: "white" }}>Open →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
