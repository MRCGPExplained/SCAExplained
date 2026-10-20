import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { TOPUPS, isTopUpKey } from "@/lib/topups";

export const dynamic = "force-dynamic";

/**
 * One route for all five top-ups, the same shape as the plan checkout.
 *
 * A top-up adds to a meter and touches nothing else: not access, not its
 * expiry date. Someone whose four months have run out needs a plan, not a
 * pack of gradings, and selling them one would take their money for
 * something they cannot use.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });

  const { topup } = (await req.json().catch(() => ({}))) as { topup?: string };
  if (!topup || !isTopUpKey(topup)) {
    return NextResponse.json({ error: "Unknown top-up." }, { status: 400 });
  }
  const t = TOPUPS[topup];

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: t.pricePence,
          product_data: {
            name: `SCA Focus: ${t.label}`,
            description:
              t.kind === "ai"
                ? `A top-up of ${t.units} AI gradings. Does not change your access or its expiry date.`
                : `A top-up of ${t.units} GP review credits. Does not change your access or its expiry date.`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "topup",
      topup: t.key,
      kind: t.kind,
      units: String(t.units),
      user_id: user.id,
      user_email: user.email ?? "",
    },
    customer_email: user.email,
    // Which pack, not just "a pack". The success page used to be told only
    // topped_up=1 and had to guess, so it named the GP pack and every one of
    // the four AI packs came back saying 20 GP reviews had been added.
    success_url: `${origin}/recordings?topped_up=${t.key}`,
    cancel_url: `${origin}/recordings`,
  });

  return NextResponse.json({ url: session.url });
}
