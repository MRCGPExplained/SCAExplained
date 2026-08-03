import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, creditsResult] = await Promise.all([
    supabase.from("user_profiles").select("display_name").eq("id", user.id).single(),
    getSupabaseAdmin()
      ? getSupabaseAdmin()!.from("recording_credits").select("balance").eq("user_id", user.id).single<{ balance: number }>()
      : Promise.resolve({ data: null }),
  ]);

  const name = profile?.display_name ?? null;
  const firstName = name ? name.trim().split(" ")[0] : null;
  const credits = (creditsResult as { data: { balance: number } | null }).data?.balance ?? 0;

  const items = [
    {
      href: "/case-bank",
      label: "Case Bank",
      description: "246 practice stations · study rooms · notes",
      badge: null,
      icon: (
        <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="2" width="14" height="18" rx="2" stroke={DARK} strokeWidth="1.5"/>
          <path d="M7 7.5h8M7 11h8M7 14.5h5" stroke={DARK} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      href: "/recordings",
      label: "My Recordings",
      description: "AI-graded consultations with RCGP examiner review",
      badge: `${credits} credit${credits !== 1 ? "s" : ""}`,
      icon: (
        <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
          <rect x="8" y="2" width="6" height="10" rx="3" stroke={DARK} strokeWidth="1.5"/>
          <path d="M4.5 10.5a6.5 6.5 0 0 0 13 0" stroke={DARK} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="11" y1="17" x2="11" y2="20" stroke={DARK} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="8" y1="20" x2="14" y2="20" stroke={DARK} strokeWidth="1.5" strokeLinecap="round"/>
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
              <div className="shrink-0 flex items-center justify-center">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-[17px]" style={{ color: DARK }}>{item.label}</p>
                <p className="text-[13px] mt-0.5" style={{ color: "rgba(51,51,51,0.50)" }}>{item.description}</p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                {item.badge && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ background: "rgba(26,27,82,0.07)", color: "rgba(26,27,82,0.5)" }}>
                    {item.badge}
                  </span>
                )}
                <span className="font-bold text-[14px] px-4 py-2 rounded-lg" style={{ background: DARK, color: "white" }}>Open →</span>
              </div>
            </Link>
          ))}
          {credits === 0 && (
            <Link
              href="/redeem"
              className="block text-center no-underline px-4 py-3 rounded-xl transition-opacity duration-200 hover:opacity-70"
              style={{ border: "1px dashed rgba(51,51,51,0.18)", color: "rgba(51,51,51,0.40)", fontSize: "12.5px" }}
            >
              Have a webinar code? Redeem it for 3 free recording credits.{" "}
              <span style={{ fontWeight: 600 }}>Redeem code →</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
