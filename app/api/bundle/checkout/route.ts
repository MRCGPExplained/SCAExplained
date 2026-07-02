import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Payment system not configured." }, { status: 500 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scaexplained.com";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: 5000,
          product_data: {
            name: "SCA Explained Bundle — Video Course + Case Bank",
            description: "Complete SCA preparation package. Save £10 vs buying separately. 90-day access.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "bundle",
      user_id: user.id,
      user_email: user.email ?? "",
    },
    customer_email: user.email,
    success_url: `${origin}/bundle/purchase/success`,
    cancel_url: `${origin}/bundle/purchase`,
  });

  return NextResponse.json({ url: session.url });
}
