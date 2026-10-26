import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getCaseBankAccess } from "@/lib/case-bank-access";
import { PlanCards } from "@/app/components/PlanCards";

export const dynamic = "force-dynamic";

const DARK = "#333333";

/**
 * Where you land when you have no access, or it has run out.
 *
 * Not optional and not a duplicate of the homepage band: /case-bank and every
 * station redirect here when getCaseBankAccess says no, so it is the page
 * someone hits mid-flow rather than one they chose to visit. What it owes
 * them is the reason they are here and a way out, which is why it keeps its
 * own heading and loses the marketing around the cards.
 *
 * It sells the same three plans from the same table, through the same
 * checkout. It used to sell a single programme through a route of its own,
 * which made two purchase paths to keep correct and, once the plans existed,
 * one of them was selling something that was no longer on the menu.
 */
export default async function CaseBankUpgradePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/case-bank/login?next=/case-bank/upgrade");

  const access = await getCaseBankAccess(supabase, user.id);
  // No redirect for someone already in date. This sent anyone with live
  // access straight back to the case bank, which was right while buying
  // again was refused and is wrong now that it is the way to renew: the
  // page they would be bounced away from is the one selling the thing they
  // came to buy.

  /*
    Three states, not two. This asked only whether an expiry date had ever
    existed, which was enough while anyone in date was redirected away: the
    only people who got here either had no access or had lost it. Now that
    buying again is how you renew, someone still in date can arrive, and
    telling them their access has run out would be plainly false.
  */
  const live = access.hasAccess;
  const expired = !live && !!access.expiresAt;
  const expiryLabel = access.expiresAt
    ? new Date(access.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen px-6 py-14" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[1150px] mx-auto">
        <div className="text-center max-w-[600px] mx-auto mb-10">
          <h1 className="font-display font-extrabold text-[28px] leading-[1.2] mb-3 max-sm:text-[24px]" style={{ color: DARK }}>
            {live ? "Add to your plan" : expired ? "Your access has run out" : "Unlock the case bank"}
          </h1>
          <p className="text-[15px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.6)" }}>
            {live
              ? `Buying again adds the allowances to what you have left, and adds four months to your current end date${expiryLabel ? ` of ${expiryLabel}` : ""}. Nothing is lost by renewing early.`
              : expired
                ? "Your recordings and reports are all still here. Pick a plan to carry on where you left off."
                : "240+ cases, study groups, and unlimited recording on all three plans. What changes is how much marking you get, and how much of it is read by a GP."}
          </p>
        </div>

        <PlanCards />

        <p className="text-[12.5px] mt-10 text-center" style={{ color: "rgba(51,51,51,0.45)" }}>
          <Link href="/" className="font-semibold no-underline" style={{ color: DARK }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
