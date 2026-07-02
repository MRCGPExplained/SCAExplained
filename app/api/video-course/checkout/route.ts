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

  const { data: existing } = await supabase
    .from("user_access")
    .select("expires_at")
    .eq("user_id", user.id)
    .eq("has_video_course", true)
    .gt("expires_at", new Date().toISOString())
    .single<{ expires_at: string }>();

  if (existing) {
    return NextResponse.json(
      { error: "You already have active Video Course access." },
      { status: 400 }
    );
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
          unit_amount: 3000,
          product_data: {
            name: "SCA Video Course",
            description: "System-by-system video teaching. 90-day access.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "video_course",
      user_id: user.id,
      user_email: user.email ?? "",
    },
    customer_email: user.email,
    success_url: `${origin}/video-course/purchase/success`,
    cancel_url: `${origin}/video-course/purchase`,
  });

  return NextResponse.json({ url: session.url });
}
