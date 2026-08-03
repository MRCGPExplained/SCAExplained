import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

const TIERS = {
  starter:   { amount: 3000,  credits: 3,   name: "SCA Explained — 3 Recording Credits",         description: "Record 3 SCA consultations with AI grading and examiner feedback." },
  standard:  { amount: 6000,  credits: 10,  name: "SCA Explained — 10 Recording Credits",        description: "Record 10 SCA consultations with AI grading and examiner feedback." },
  unlimited: { amount: 25000, credits: 300, name: "SCA Explained — Unlimited Recording Credits", description: "Up to 300 SCA consultations with AI grading and examiner feedback." },
} as const;

type Tier = keyof typeof TIERS;

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await req.formData().catch(() => null);
  const tierKey = (body?.get("tier")?.toString() ?? "standard") as Tier;
  const tier = TIERS[tierKey] ?? TIERS.standard;

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: tier.amount,
          product_data: { name: tier.name, description: tier.description },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "recording_credits",
      user_id: user.id,
      user_email: user.email ?? "",
      credits: String(tier.credits),
    },
    success_url: `${origin}/recordings?purchased=1`,
    cancel_url: `${origin}/recordings`,
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
