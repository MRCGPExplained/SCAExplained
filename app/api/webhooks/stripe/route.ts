import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    console.error("[webhook] Stripe not configured.");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.type === "programme") {
      await confirmProgrammePurchase(session);
    }
  }

  return NextResponse.json({ received: true });
}

// ── Programme purchase ────────────────────────────────────────────────────────

async function confirmProgrammePurchase(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const userEmail = session.metadata?.user_email ?? "";

  if (!userId) {
    console.error("[webhook] programme checkout without user_id");
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 90);

  const { data: existing } = await supabase
    .from("user_access")
    .select("expires_at")
    .eq("user_id", userId)
    .single<{ expires_at: string | null }>();

  const newExpiry =
    existing?.expires_at && existing.expires_at > expiresAt.toISOString()
      ? existing.expires_at
      : expiresAt.toISOString();

  const { error } = await supabase.from("user_access").upsert({
    user_id: userId,
    has_programme: true,
    expires_at: newExpiry,
    renewal_reminder_sent_at: null,
  });

  if (error) {
    console.error("[webhook] failed to write user_access:", error.message);
    return;
  }

  if (userEmail) {
    await sendConfirmationEmail({
      to: userEmail,
      customerName: userEmail,
      eventTitle: "The SCA Explained Programme — 90-Day Access",
      ticketName: "Access granted",
      startTime: now.toISOString(),
      endTime: newExpiry,
      zoomLink: null,
    });
  }
}
