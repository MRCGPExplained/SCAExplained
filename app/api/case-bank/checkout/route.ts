import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CASE_BANK_PRICE_GBP = 3000; // £30 in pence

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // Check if already has active access
  const { data: existing } = await supabase
    .from("user_access")
    .select("expires_at")
    .eq("user_id", user.id)
    .eq("has_programme", true)
    .gt("expires_at", new Date().toISOString())
    .single<{ expires_at: string }>();

  if (existing) {
    return NextResponse.json(
      { error: "You already have active Case Bank access." },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Payment system not configured." },
      { status: 500 }
    );
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scaexplained.com";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: CASE_BANK_PRICE_GBP,
          product_data: {
            name: "SCA Case Bank",
            description: "246 practice stations, study rooms, notes & more. 90-day access.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "case_bank",
      user_id: user.id,
      user_email: user.email ?? "",
    },
    customer_email: user.email,
    success_url: `${origin}/case-bank/purchase/success`,
    cancel_url: `${origin}/case-bank/purchase`,
  });

  return NextResponse.json({ url: session.url });
}
