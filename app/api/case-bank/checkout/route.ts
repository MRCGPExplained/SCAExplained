import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

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
          unit_amount: 29500,
          product_data: {
            name: "The Complete SCA Programme",
            description: "250+ case bank access, unlimited AI review, 20 GP reviews. Valid for 4 months.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "case_bank_programme",
      user_id: user.id,
      user_email: user.email ?? "",
    },
    success_url: `${origin}/case-bank?purchased=1`,
    cancel_url: `${origin}/`,
  });

  return NextResponse.json({ url: session.url });
}
