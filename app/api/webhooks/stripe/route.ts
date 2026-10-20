import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendConfirmationEmail, sendPurchaseEmail, sendTopUpEmail } from "@/lib/email";

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
      } else if (type === "plan") {
        await confirmPlanPurchase(session);
      } else if (type === "topup") {
        await confirmTopUpPurchase(session);
      }
      // Record actual revenue + Stripe fee for every recognised purchase, for
      // the economics dashboard. Best-effort — it swallows its own errors and
      // so can never release the claim below or trigger a retry that would
      // grant the purchase a second time.
      if (type === "programme" || type === "recording_credits" || type === "case_bank_programme" || type === "plan" || type === "topup") {
        // The tier, not the kind. Logging a bare "plan" put Starter, Premium
        // and Intensive in one bucket the dashboard could not tell apart, and
        // "topup" did the same to five packs at five prices. Both carry their
        // identity in the session metadata already.
        const label =
          type === "plan"
            ? session.metadata?.plan ?? "plan"
            : type === "topup"
            ? session.metadata?.topup ?? "topup"
            : type;
        await recordRevenueEvent(stripe, session, label);
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
  /** The tier or pack key ("intensive", "ai100"), falling back to the
   *  purchase type for the retired flows that have no finer identity. */
  label: string
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
        plan_type: label,
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

// ── Top-up purchase ──────────────────────────────────────────────────────────

/**
 * Adds to one meter, and carries access to at least a month from the day of
 * purchase so the units bought can actually be spent. Still not a substitute
 * for a plan: /api/topup/checkout refuses anyone whose access has already
 * ended, so this can extend a live plan but never revive a dead one.
 *
 * Which meter and how many come out of the session metadata rather than a
 * fresh lookup, so a pack resized between paying and the webhook landing
 * still grants what was advertised at the till.
 */
async function confirmTopUpPurchase(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const userEmail = session.metadata?.user_email ?? "";
  const kind = session.metadata?.kind;
  const units = parseInt(session.metadata?.units ?? "0", 10);

  if (!userId || !units || (kind !== "ai" && kind !== "gp")) {
    console.error("[webhook] topup with missing or bad metadata", { userId, kind, units });
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  if (kind === "ai") {
    await supabase.rpc("add_ai_allowance", { p_user_id: userId, p_credits: units });
  } else {
    await addRecordingCredits(supabase, userId, units);
  }

  // A top-up now carries access to at least a month from the day it was
  // bought, so nobody buys gradings that expire before they can spend them.
  //
  // max(existing, now + 1 month), not existing + 1 month. Someone with three
  // months left keeps three months; someone with a fortnight left gets a
  // month from today. Additive would let a run of small packs buy a year of
  // access a month at a time, which is the plan's job.
  const now = new Date();
  const floor = new Date(now);
  floor.setMonth(floor.getMonth() + 1);

  const { data: access } = await supabase
    .from("user_access")
    .select("case_bank_expires_at")
    .eq("user_id", userId)
    .single<{ case_bank_expires_at: string | null }>();

  const newExpiry =
    access?.case_bank_expires_at && access.case_bank_expires_at > floor.toISOString()
      ? access.case_bank_expires_at
      : floor.toISOString();

  if (newExpiry !== access?.case_bank_expires_at) {
    const { error } = await supabase
      .from("user_access")
      .update({ case_bank_expires_at: newExpiry, renewal_reminder_sent_at: null })
      .eq("user_id", userId);
    if (error) console.error("[webhook] topup could not extend access:", error.message);
  }

  if (userEmail) {
    await sendTopUpEmail({
      to: userEmail,
      name: userEmail,
      packLabel: `${units} ${kind === "ai" ? "AI gradings" : `GP review${units === 1 ? "" : "s"}`}`,
      expiresAt: newExpiry,
      extended: newExpiry !== access?.case_bank_expires_at,
    });
  }
}

// ── Plan purchase (Starter / Premium / Intensive) ─────────────────────────────

/**
 * Grants exactly what the checkout session said it was selling.
 *
 * The allowances come out of the session metadata rather than being looked up
 * from lib/plans here. The two are the same today, but a price or allowance
 * edited between someone paying and this webhook landing would otherwise
 * grant them something other than what they bought.
 */
async function confirmPlanPurchase(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const userEmail = session.metadata?.user_email ?? "";
  const planName = session.metadata?.plan ?? "plan";
  const aiGradings = parseInt(session.metadata?.ai_gradings ?? "0", 10);
  const gpReviews = parseInt(session.metadata?.gp_reviews ?? "0", 10);
  const months = parseInt(session.metadata?.months ?? "4", 10);

  if (!userId) {
    console.error("[webhook] plan checkout without user_id");
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setMonth(expiresAt.getMonth() + months);

  // Buying again while still in date extends rather than truncates.
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
    console.error("[webhook] failed to write plan access:", error.message);
    return;
  }

  // Both meters are added to, never assigned, so a second purchase tops up
  // instead of throwing away whatever was left of the first.
  if (aiGradings > 0) {
    await supabase.rpc("add_ai_allowance", { p_user_id: userId, p_credits: aiGradings });
  }
  if (gpReviews > 0) {
    await addRecordingCredits(supabase, userId, gpReviews);
  }

  if (userEmail) {
    // The purchase template, not the webinar one. See sendPurchaseEmail.
    await sendPurchaseEmail({
      to: userEmail,
      name: userEmail,
      planName: `${planName.charAt(0).toUpperCase()}${planName.slice(1)}`,
      aiGradings,
      gpReviews,
      expiresAt: newExpiry,
    });
  }
}

// ── Programme purchase (retired: £60 for 90 days) ─────────────────────────────
//
// Nothing can create one of these any more. The route that did, POST
// /api/programme/checkout, is deleted: it was still live and still charging
// £60 for "90-Day Access" long after the three plans replaced it, and it only
// survived because no page in the app linked to it.
//
// The handler stays because deleting it is the one change that could lose
// money. A Stripe session created before that deploy stays payable for up to
// 24 hours, and if one landed here with no branch to catch it the customer
// would be charged and granted nothing. It is safe to delete this, and the
// has_programme flag with it, once the dashboard shows no programme revenue
// for a day.

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

// ── Case Bank programme purchase (retired: £295, 4 months, 20 GP reviews) ─────
//
// Retired alongside confirmProgrammePurchase above, and kept for the same
// reason: /api/case-bank/checkout is gone, so nothing can create a
// case_bank_programme session, but one created before that deploy stays
// payable for 24 hours and deleting the branch would take the money without
// granting anything. Safe to remove with the other one.

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
    // Says what this branch actually grants, which is the Intensive
    // allowance. It used to promise "unlimited AI review" beside a line
    // granting exactly 400 gradings.
    await sendPurchaseEmail({
      to: userEmail,
      name: userEmail,
      planName: "Intensive",
      aiGradings: INTENSIVE_AI_ALLOWANCE,
      gpReviews: 20,
      expiresAt: newExpiry,
    });
  }
}
