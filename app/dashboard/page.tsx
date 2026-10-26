import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { JoinStudyRoomCard } from "./JoinStudyRoomCard";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const FAINT = { color: "rgba(51,51,51,0.42)" };

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, creditsResult, accessResult] = await Promise.all([
    supabase.from("user_profiles").select("display_name").eq("id", user.id).single(),
    getSupabaseAdmin()
      ? getSupabaseAdmin()!.from("gp_review_credits").select("balance").eq("user_id", user.id).single<{ balance: number }>()
      : Promise.resolve({ data: null }),
    // The other meter. The badge read the GP balance alone and called it
    // "credits", so a Starter customer with 120 AI gradings and no GP reviews
    // (which is what Starter is) saw "0 credits" and could reasonably think
    // they had bought nothing that works.
    getSupabaseAdmin()
      ? getSupabaseAdmin()!
          .from("user_access")
          .select("ai_allowance, ai_uses_count, has_case_bank, case_bank_expires_at")
          .eq("user_id", user.id)
          .single<{ ai_allowance: number; ai_uses_count: number; has_case_bank: boolean; case_bank_expires_at: string | null }>()
      : Promise.resolve({ data: null }),
  ]);

  const name = profile?.display_name ?? null;
  const firstName = name ? name.trim().split(" ")[0] : null;
  const credits = (creditsResult as { data: { balance: number } | null }).data?.balance ?? 0;
  const access = (accessResult as { data: { ai_allowance: number; ai_uses_count: number; has_case_bank: boolean; case_bank_expires_at: string | null } | null }).data;
  const aiRemaining = Math.max(0, (access?.ai_allowance ?? 0) - (access?.ai_uses_count ?? 0));
  const accessLive =
    !!access?.has_case_bank &&
    !!access.case_bank_expires_at &&
    access.case_bank_expires_at > new Date().toISOString();

  /*
    Days left, counted in whole days from the end of today so the number
    does not tick over at whatever hour someone happened to buy. Shown under
    the greeting rather than in a banner: it is a fact about the account, not
    a notice, and it should be findable without being shouted.
  */
  const daysLeft =
    accessLive && access?.case_bank_expires_at
      ? Math.max(
          0,
          Math.ceil(
            (new Date(access.case_bank_expires_at).getTime() - Date.now()) / 86_400_000
          )
        )
      : null;
  const expiryLabel = access?.case_bank_expires_at
    ? new Date(access.case_bank_expires_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  /*
    Both balances, under the expiry rather than on the card.

    "Reviews" as the umbrella is a deliberate call, not an oversight. A bare
    review means the GP one in four other strings ("Top up 20 reviews", "You
    have 3 reviews left", "bonus reviews", and the "1 review" cost chip), and
    /recordings labels these same two numbers "AI gradings remaining" and "GP
    review credits remaining". Here the AI and GP tags carry that distinction
    themselves, so the label is only saying what kind of thing is counted.
    It reads fine in place; don't quietly change it back for consistency.

    Expiry outranks the numbers: once access has ended neither balance is
    spendable, so an expired account gets the "Access ended" line alone. The
    GP figure is dropped when it is zero rather than shown as "0 GP", because
    on Starter zero is the plan working as sold, not something that ran out.
    Zero AI gradings is shown, because that one did run out.
  */
  const reviewsLine = accessLive
    ? "Reviews left: " +
      [`${aiRemaining} AI`, credits > 0 ? `${credits} GP` : null]
        .filter(Boolean)
        .join(" · ")
    : null;

  const items = [
    {
      href: "/case-bank",
      label: "Case Bank",
      description: "240+ practice stations · study groups · notes",
      icon: (
        <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="2" width="14" height="18" rx="2" stroke={DARK} strokeWidth="1.5"/>
          <path d="M7 7.5h8M7 11h8M7 14.5h5" stroke={DARK} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      href: "/recordings",
      label: "My Reviews",
      description: "AI graded, with GP review on the ones you submit",
      icon: (
        <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="8.5" stroke={DARK} strokeWidth="1.5"/>
          <path d="M6.5 11.2l3 3 6-6.5" stroke={DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
          {expiryLabel && (
            <p className="text-[12.5px] mt-1.5" style={FAINT}>
              {accessLive ? `Access until ${expiryLabel}` : `Access ended on ${expiryLabel}`}
            </p>
          )}
          {daysLeft !== null && (
            <p className="text-[12.5px] mt-0.5" style={FAINT}>
              {daysLeft} day{daysLeft === 1 ? "" : "s"} left
            </p>
          )}
          {reviewsLine && (
            <p className="text-[12.5px] mt-0.5" style={FAINT}>
              {reviewsLine}
            </p>
          )}
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
              <span className="shrink-0 font-bold text-[14px] px-4 py-2 rounded-lg" style={{ background: DARK, color: "white" }}>Open →</span>
            </Link>
          ))}

          <JoinStudyRoomCard />

        </div>
      </div>
    </div>
  );
}
