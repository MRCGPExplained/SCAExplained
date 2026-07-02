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
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

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

    if (type === "case_bank" || type === "video_course" || type === "bundle") {
      await confirmProductPurchase(session, type);
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
    .single<{
      customer_name: string;
      customer_email: string;
      event_id: string;
      ticket_type_id: string;
    }>();

  if (error || !booking) {
    console.error("[webhook] failed to mark booking paid:", error?.message);
    return;
  }

  const { data: ev } = await supabase
    .from("events")
    .select("title, start_time, end_time, zoom_link")
    .eq("id", eventId ?? booking.event_id)
    .single<{
      title: string;
      start_time: string;
      end_time: string;
      zoom_link: string | null;
    }>();

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

// ── Product purchases (case_bank / video_course / bundle) ────────────────────

async function confirmProductPurchase(
  session: Stripe.Checkout.Session,
  type: "case_bank" | "video_course" | "bundle"
) {
  const userId = session.metadata?.user_id;
  const userEmail = session.metadata?.user_email ?? "";

  if (!userId) {
    console.error(`[webhook] ${type} checkout without user_id`);
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const now = new Date();
  const ninetyDaysLater = new Date(now);
  ninetyDaysLater.setDate(ninetyDaysLater.getDate() + 90);
  const expiresAt = ninetyDaysLater.toISOString();

  const grantVideoCourse = type === "video_course" || type === "bundle";
  const grantCaseBank = type === "case_bank" || type === "bundle";

  // Upsert: set product flags, take greatest expires_at
  const { error } = await supabase.rpc("upsert_user_access", {
    p_user_id: userId,
    p_has_video_course: grantVideoCourse,
    p_has_case_bank: grantCaseBank,
    p_expires_at: expiresAt,
  });

  if (error) {
    // Fallback: manual upsert if RPC not available yet
    const { data: existing } = await supabase
      .from("user_access")
      .select("has_video_course, has_case_bank, expires_at")
      .eq("user_id", userId)
      .single<{ has_video_course: boolean; has_case_bank: boolean; expires_at: string | null }>();

    const newExpiry =
      existing?.expires_at && existing.expires_at > expiresAt
        ? existing.expires_at
        : expiresAt;

    const { error: upsertErr } = await supabase.from("user_access").upsert({
      user_id: userId,
      has_video_course: grantVideoCourse || (existing?.has_video_course ?? false),
      has_case_bank: grantCaseBank || (existing?.has_case_bank ?? false),
      expires_at: newExpiry,
    });

    if (upsertErr) {
      console.error("[webhook] failed to write user_access:", upsertErr.message);
      return;
    }
  }

  const productLabel =
    type === "bundle"
      ? "SCA Video Course + Case Bank"
      : type === "video_course"
      ? "SCA Video Course"
      : "SCA Case Bank";

  if (userEmail) {
    await sendConfirmationEmail({
      to: userEmail,
      customerName: userEmail,
      eventTitle: `${productLabel} — 90-Day Access`,
      ticketName: "Access granted",
      startTime: now.toISOString(),
      endTime: expiresAt,
      zoomLink: null,
    });
  }
}
