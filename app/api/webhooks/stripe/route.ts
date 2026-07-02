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
    const type = session.metadata?.type;

    if (type === "programme") {
      await confirmProgrammePurchase(session);
    } else {
      await confirmBooking(session);
    }
  }

  return NextResponse.json({ received: true });
}

// ── SCA Intensive booking ─────────────────────────────────────────────────────

async function confirmBooking(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.booking_id;
  const eventId = session.metadata?.event_id;
  if (!bookingId) {
    console.error("[webhook] checkout.session.completed without booking_id");
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { data: booking, error } = await supabase
    .from("bookings")
    .update({ status: "paid", stripe_checkout_session_id: session.id })
    .eq("id", bookingId)
    .select("customer_name, customer_email, event_id, ticket_type_id")
    .single<{ customer_name: string; customer_email: string; event_id: string; ticket_type_id: string }>();

  if (error || !booking) {
    console.error("[webhook] failed to mark booking paid:", error?.message);
    return;
  }

  const { data: ev } = await supabase
    .from("events")
    .select("title, start_time, end_time, zoom_link")
    .eq("id", eventId ?? booking.event_id)
    .single<{ title: string; start_time: string; end_time: string; zoom_link: string | null }>();

  const { data: ticket } = await supabase
    .from("ticket_types")
    .select("name")
    .eq("id", booking.ticket_type_id)
    .single<{ name: string }>();

  await sendConfirmationEmail({
    to: booking.customer_email,
    customerName: booking.customer_name,
    eventTitle: ev?.title ?? "SCA Intensive",
    ticketName: ticket?.name ?? "Active Candidate",
    startTime: ev?.start_time ?? "",
    endTime: ev?.end_time ?? "",
    zoomLink: ev?.zoom_link ?? null,
  });
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
