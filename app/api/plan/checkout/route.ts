import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { PLANS, isPlanKey, FAIR_USE_AI } from "@/lib/plans";

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

  const { plan: planKey, source } = (await req.json().catch(() => ({}))) as {
    plan?: string;
    source?: string;
  };
  if (!planKey || !isPlanKey(planKey)) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }
  const plan = PLANS[planKey];

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  /*
    An anonymous session is NOT a buyer, and this is the guard that stops a
    free-trial visitor paying for nothing.

    A trial account is a real Supabase user, so the plain !user test let one
    through: they would reach Stripe, pay, and the webhook would grant four
    months of access to an account the anonymous sweep deletes that night.
    Money taken, nothing delivered, and no obvious trail.

    401 rather than a refusal, because PlanButton already knows what to do
    with a 401 — send them to register and bring them back to the plan they
    picked, carrying the source so the sale is still attributed.
  */
  if (!user || user.is_anonymous) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  /*
    No guard on buying again.

    There was one, refusing any purchase while access was live, to stop a
    plan being changed part way through a term. It caught renewal in the
    same net: someone with three days left and a card in hand got a 409
    telling them their plan was still running, and pointing them at top-ups,
    which do not extend anything. Refusing a customer who is trying to pay
    was never the policy, only the way the policy happened to be expressed.

    Buying again adds the allowances and adds four months to whatever is
    left, so there is nothing to protect against: no proration, no tier
    swap, no partial refund, and nothing lost by buying early.
  */

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
            // Premium and Intensive carry a fair-use number that their cards
            // call unlimited. A receipt reading "600 AI-graded consultations"
            // would contradict what the buyer was shown, so say both.
            description: `240+ cases, ${
              plan.aiGradings >= FAIR_USE_AI
                ? `unlimited AI-graded consultations (fair use ${FAIR_USE_AI})`
                : `${plan.aiGradings} AI-graded consultations`
            }${reviews}. ${plan.months} months access.`,
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
      // Where the click came from, if anywhere. Stripe keeps session
      // metadata for good, so this is readable in the dashboard as well as
      // in revenue_events. Trimmed because it arrives from a query string.
      ...(source ? { source: String(source).slice(0, 60) } : {}),
    },
    customer_email: user.email,
    success_url: `${origin}/case-bank?purchased=1`,
    cancel_url: `${origin}/#pricing`,
  });

  return NextResponse.json({ url: session.url });
}
