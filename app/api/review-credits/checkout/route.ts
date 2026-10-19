import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

/**
 * A top-up of GP reviews for someone who has spent the twenty that came
 * with their programme. It does not touch access or extend the four
 * months — it adds reviews and nothing else.
 *
 * The receiving half of this already existed: the Stripe webhook has
 * dispatched `type: "recording_credits"` to confirmRecordingCreditsPurchase
 * since before this route, reading the number from `credits` metadata and
 * adding it to the balance. Nothing ever created such a session, so the
 * handler sat there with no producer. This is the producer.
 *
 * `credits` is sent as metadata rather than derived from the amount, because
 * the webhook reads it from metadata and a second source of truth for "how
 * many reviews is £50" is how the two drift apart.
 */
const CREDITS = 20;
const PRICE_PENCE = 5000;

export async function POST() {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });

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
          unit_amount: PRICE_PENCE,
          product_data: {
            name: `${CREDITS} GP Reviews`,
            description: `A top-up of ${CREDITS} GP review credits. Does not change your programme access or its expiry date.`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "recording_credits",
      user_id: user.id,
      user_email: user.email ?? "",
      credits: String(CREDITS),
    },
    success_url: `${origin}/recordings?topped_up=1`,
    cancel_url: `${origin}/recordings`,
  });

  return NextResponse.json({ url: session.url });
}
