import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { PLANS, isPlanKey } from "@/lib/plans";

export const dynamic = "force-dynamic";

/**
 * One route for all three plans rather than three near-identical ones.
 *
 * What differs between them is four numbers, and those live in lib/plans
 * where the pricing page reads the same copy. The allowances travel in the
 * session metadata so the webhook grants exactly what was advertised at the
 * moment of sale, rather than looking the plan up again later and risking a
 * price change in between paying and being granted.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });

  const { plan: planKey } = (await req.json().catch(() => ({}))) as { plan?: string };
  if (!planKey || !isPlanKey(planKey)) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }
  const plan = PLANS[planKey];

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  // No plan on top of a live plan. /case-bank/upgrade already turns away
  // anyone in date, but the homepage pricing buttons post straight here, so
  // a customer one month into Intensive could buy Intensive again from the
  // front page. They would not even get the time: the webhook takes
  // max(existing expiry, now + 4 months), so £295 buys three extra months
  // rather than four. Running out of an allowance is what top-ups are for,
  // and those deliberately leave the expiry alone.
  const { data: access } = await supabase
    .from("user_access")
    .select("has_case_bank, case_bank_expires_at")
    .eq("user_id", user.id)
    .single<{ has_case_bank: boolean; case_bank_expires_at: string | null }>();

  if (
    access?.has_case_bank &&
    access.case_bank_expires_at &&
    access.case_bank_expires_at > new Date().toISOString()
  ) {
    return NextResponse.json(
      {
        error:
          "Your plan is still running. Plans cannot be changed part way through, but you can top up AI gradings or GP reviews at any time from My Reviews.",
      },
      { status: 409 }
    );
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const reviews = plan.gpReviews > 0 ? `, ${plan.gpReviews} GP review${plan.gpReviews === 1 ? "" : "s"}` : "";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: plan.pricePence,
          product_data: {
            name: `SCA Focus ${plan.name}`,
            description: `240+ cases, ${plan.aiGradings} AI-graded consultations${reviews}. ${plan.months} months access.`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "plan",
      plan: plan.key,
      user_id: user.id,
      user_email: user.email ?? "",
      // Granted from metadata, not from a fresh lookup: what someone paid for
      // is what the page said when they paid, even if the plan changes before
      // the webhook lands.
      ai_gradings: String(plan.aiGradings),
      gp_reviews: String(plan.gpReviews),
      months: String(plan.months),
    },
    customer_email: user.email,
    success_url: `${origin}/case-bank?purchased=1`,
    cancel_url: `${origin}/#pricing`,
  });

  return NextResponse.json({ url: session.url });
}
