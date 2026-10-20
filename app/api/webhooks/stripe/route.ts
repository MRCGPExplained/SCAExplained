import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * The AI gradings granted by the £295 programme. Named here because the
 * webhook is the only place a purchase turns into an allowance, and a bare
 * 400 in the middle of a grant is the kind of number nobody can later tell
 * is a tier or a typo. The tier table lives with the pricing page; this is
 * the one it pays for.
 */
const INTENSIVE_AI_ALLOWANCE = 400;
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

  // ── Idempotency ───────────────────────────────────────────────────────────
  // Stripe retries a delivery on any non-2xx and on a timeout, reusing the
  // same event id. None of the handlers below are safe to run twice: a second
  // run of the credits one adds another twenty reviews, and every retry logs
  // a second revenue event into the economics dashboard. Claiming the id
  // first makes a repeat delivery a no-op.
  //
  // This mattered less when nothing could be bought with credits. It matters
  // now that the top-up exists.
  const admin = getSupabaseAdmin();
  if (admin) {
    const { error: claimErr } = await admin
      .from("stripe_webhook_events")
      .insert({ event_id: event.id, event_type: event.type });

    if (claimErr) {
      // 23505 is the primary key conflict: this one has been handled.
      if (claimErr.code === "23505") {
        console.log("[webhook] duplicate delivery ignored:", event.id);
        return NextResponse.json({ received: true, duplicate: true });
      }
      // Anything else and we cannot tell whether this is a repeat. Fail, so
      // Stripe retries, rather than granting without the guard in place.
      console.error("[webhook] could not claim event:", claimErr.message);
      return NextResponse.json({ error: "could not record event" }, { status: 500 });
    }
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const type = session.metadata?.type;
      if (type === "programme") {
        await confirmProgrammePurchase(session);
      } else if (type === "recording_credits") {
        await confirmRecordingCreditsPurchase(session);
      } else if (type === "case_bank_programme") {
        await confirmCaseBankPurchase(session);
      }
      // Record actual revenue + Stripe fee for every recognised purchase, for
      // the economics dashboard. Best-effort — it swallows its own errors and
      // so can never release the claim below or trigger a retry that would
      // grant the purchase a second time.
      if (type === "programme" || type === "recording_credits" || type === "case_bank_programme") {
        await recordRevenueEvent(stripe, session, type);
      }
    }
  } catch (err) {
    // The claim is taken before the work, so a failure here would otherwise
    // leave the event marked handled with nothing granted. Release it and let
    // Stripe's retry do the work properly.
    if (admin) await admin.from("stripe_webhook_events").delete().eq("event_id", event.id);
    console.error("[webhook] handler failed, released event for retry:", err);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ── Revenue + Stripe fee capture ───────────────────────────────────────────────

async function recordRevenueEvent(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  planType: string
) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;

    const grossMinor = session.amount_total ?? 0; // pence
    const currency = session.currency ?? "gbp";

    // Fetch the actual Stripe fee from the charge's balance transaction.
    let feeMinor = 0;
    const piId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;
    if (piId) {
      const pi = await stripe.paymentIntents.retrieve(piId, {
        expand: ["latest_charge.balance_transaction"],
      });
      const charge = pi.latest_charge as Stripe.Charge | null;
      const bt = charge?.balance_transaction as Stripe.BalanceTransaction | null;
      feeMinor = bt?.fee ?? 0;
    }

    const grossGbp = grossMinor / 100;
    const feeGbp = feeMinor / 100;

    const { error } = await supabase.from("revenue_events").upsert(
      {
        user_id: session.metadata?.user_id ?? null,
        plan_type: planType,
        amount_gross_gbp: grossGbp,
        currency,
        stripe_fee_gbp: feeGbp,
        amount_net_gbp: grossGbp - feeGbp,
        stripe_session_id: session.id,
      },
      { onConflict: "stripe_session_id" }
    );
    if (error) console.error("[webhook] failed to record revenue_event:", error.message);
  } catch (e) {
    console.error("[webhook] recordRevenueEvent threw:", e);
  }
}

// ── Recording credits purchase ────────────────────────────────────────────────

async function confirmRecordingCreditsPurchase(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const credits = parseInt(session.metadata?.credits ?? "5", 10);

  if (!userId) {
    console.error("[webhook] recording_credits checkout without user_id");
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  await addRecordingCredits(supabase, userId, credits);
}

async function addRecordingCredits(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  userId: string,
  credits: number
) {
  // Upsert: add purchased credits to existing balance
  const { error } = await supabase.rpc("add_gp_review_credits", {
    p_user_id: userId,
    p_credits: credits,
  });

  if (error) {
    // Fallback: manual upsert if RPC doesn't exist yet
    const { data: existing } = await supabase
      .from("gp_review_credits")
      .select("balance, total_purchased")
      .eq("user_id", userId)
      .single<{ balance: number; total_purchased: number }>();

    await supabase.from("gp_review_credits").upsert({
      user_id: userId,
      balance: (existing?.balance ?? 0) + credits,
      total_purchased: (existing?.total_purchased ?? 0) + credits,
      updated_at: new Date().toISOString(),
    });
  }
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
      eventTitle: "The SCA Focus Programme: 90-Day Access",
      ticketName: "Access granted",
      startTime: now.toISOString(),
      endTime: newExpiry,
      zoomLink: null,
    });
  }
}

// ── Case Bank programme purchase (£295, 4 months, 20 GP reviews) ───────────────

async function confirmCaseBankPurchase(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const userEmail = session.metadata?.user_email ?? "";

  if (!userId) {
    console.error("[webhook] case_bank_programme checkout without user_id");
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setMonth(expiresAt.getMonth() + 4);

  const { data: existing } = await supabase
    .from("user_access")
    .select("case_bank_expires_at")
    .eq("user_id", userId)
    .single<{ case_bank_expires_at: string | null }>();

  const newExpiry =
    existing?.case_bank_expires_at && existing.case_bank_expires_at > expiresAt.toISOString()
      ? existing.case_bank_expires_at
      : expiresAt.toISOString();

  const { error } = await supabase.from("user_access").upsert({
    user_id: userId,
    has_case_bank: true,
    case_bank_expires_at: newExpiry,
  });

  if (error) {
    console.error("[webhook] failed to write case bank access:", error.message);
    return;
  }

  // 20 GP reviews, on top of any credits already held
  await addRecordingCredits(supabase, userId, 20);

  // And the AI gradings. Without this a purchase grants access and reviews
  // but leaves ai_allowance at its column default of zero, so the buyer
  // cannot grade a single consultation: the pipeline stops at `transcribed`
  // and every option that costs an AI credit is refused. Added rather than
  // set, so renewing tops up instead of discarding what is left.
  await supabase.rpc("add_ai_allowance", { p_user_id: userId, p_credits: INTENSIVE_AI_ALLOWANCE });

  if (userEmail) {
    await sendConfirmationEmail({
      to: userEmail,
      customerName: userEmail,
      eventTitle: "The Complete SCA Programme",
      ticketName: "Access granted: 240+ cases, unlimited AI review, 20 GP reviews",
      startTime: now.toISOString(),
      endTime: newExpiry,
      zoomLink: null,
    });
  }
}
