import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

const TIERS = {
  entry:     { amount: 2400,  credits: 3,  name: "SCA Explained — Entry (3 Recording Credits)",      description: "Record 3 SCA consultations with AI grading and GP examiner feedback." },
  standard:  { amount: 9900,  credits: 15, name: "SCA Explained — Standard (15 Recording Credits)",  description: "Record 15 SCA consultations with AI grading and GP examiner feedback." },
  intensive: { amount: 27900, credits: 50, name: "SCA Explained — Intensive (50 Recording Credits)", description: "Record 50 SCA consultations with AI grading and GP examiner feedback." },
} as const;

type Tier = keyof typeof TIERS;

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await req.formData().catch(() => null);
  const tierKey = (body?.get("tier")?.toString() ?? "entry") as Tier;
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
