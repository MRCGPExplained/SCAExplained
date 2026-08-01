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
          unit_amount: 6000,
          product_data: {
            name: "SCA Explained — 5 Recording Credits",
            description: "Record 5 SCA consultations with AI grading and examiner feedback.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "recording_credits",
      user_id: user.id,
      user_email: user.email ?? "",
      credits: "5",
    },
    success_url: `${origin}/recordings?purchased=1`,
    cancel_url: `${origin}/recordings`,
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
