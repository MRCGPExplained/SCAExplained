"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getStripe, stripePriceIdForTicket } from "@/lib/stripe";
import { sendConfirmationEmail } from "@/lib/email";

export interface BookingState {
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function siteUrl(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  // Fall back to the request's own host (works on Vercel preview/prod).
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "";
}

/**
 * Booking entry point (form Server Action).
 *
 * 1. Reserves a seat via the reserve_booking RPC — a single transaction that
 *    locks the ticket-type row and checks capacity, so two simultaneous clicks
 *    on the last Intensive seat can't both succeed.
 * 2. Paid ticket  → create Stripe Checkout (carrying our UUIDs in metadata) and
 *    redirect to it. The webhook confirms + emails the Zoom link.
 *    Free ticket  → already 'confirmed' by the RPC; email the Zoom link now and
 *    go straight to the confirmation page.
 */
export async function createBooking(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const eventId = String(formData.get("eventId") ?? "");
  const ticketTypeId = String(formData.get("ticketTypeId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!eventId || !ticketTypeId) {
    return { error: "Please choose a ticket type." };
  }
  if (name.length < 2) {
    return { error: "Please enter your full name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { error: "Booking isn't available just yet. Please try again soon." };
  }

  // 1 — atomic reservation. The RPC returns a single `bookings` composite row,
  // so PostgREST hands it back as an object directly (no .single()).
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "reserve_booking",
    {
      p_event_id: eventId,
      p_ticket_type_id: ticketTypeId,
      p_customer_name: name,
      p_customer_email: email,
    }
  );
  const booking = rpcData as { id: string; status: string } | null;

  if (rpcError || !booking) {
    const msg = rpcError?.message ?? "";
    if (msg.includes("sold_out")) {
      return { error: "Sorry — that ticket just sold out. Try another date." };
    }
    if (msg.includes("observer_not_unlocked")) {
      return { error: "Observer places open once the first Active Candidate has booked. Check back soon." };
    }
    console.error("[booking] reserve_booking failed:", msg);
    return { error: "Something went wrong reserving your place. Please try again." };
  }

  // Authoritative ticket + event details (never trust client for price).
  const { data: ticket } = await supabase
    .from("ticket_types")
    .select("name, price")
    .eq("id", ticketTypeId)
    .single<{ name: string; price: number }>();

  const { data: event } = await supabase
    .from("events")
    .select("title, start_time, end_time, zoom_link")
    .eq("id", eventId)
    .single<{
      title: string;
      start_time: string;
      end_time: string;
      zoom_link: string | null;
    }>();

  const price = ticket?.price ?? 0;
  let redirectTo: string;

  if (price > 0) {
    // 2a — paid: Stripe Checkout
    const stripe = getStripe();
    if (!stripe) {
      return { error: "Payments aren't available just yet. Please try again soon." };
    }
    const base = await siteUrl();
    const priceId = stripePriceIdForTicket(ticket?.name ?? "");

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        line_items: [
          priceId
            ? { price: priceId, quantity: 1 }
            : {
                quantity: 1,
                price_data: {
                  currency: "gbp",
                  unit_amount: price,
                  product_data: {
                    name: `${event?.title ?? "SCA Intensive"} — ${ticket?.name ?? "Ticket"}`,
                  },
                },
              },
        ],
        // Date-specificity carried entirely in our own UUIDs.
        metadata: {
          booking_id: booking.id,
          event_id: eventId,
          ticket_type_id: ticketTypeId,
        },
        success_url: `${base}/book/confirmed?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/?cancelled=1#intensive-dates`,
      });

      await supabase
        .from("bookings")
        .update({ stripe_checkout_session_id: session.id })
        .eq("id", booking.id);

      if (!session.url) {
        return { error: "Couldn't start checkout. Please try again." };
      }
      redirectTo = session.url;
    } catch (err) {
      console.error("[booking] Stripe session failed:", err);
      return { error: "Couldn't start checkout. Please try again." };
    }
  } else {
    // 2b — free: confirmed by the RPC already; email the Zoom link now.
    await sendConfirmationEmail({
      to: email,
      customerName: name,
      eventTitle: event?.title ?? "How To Get A Clear Pass",
      ticketName: ticket?.name ?? "Webinar (Free)",
      startTime: event?.start_time ?? "",
      endTime: event?.end_time ?? "",
      zoomLink: event?.zoom_link ?? null,
    });
    redirectTo = `/book/confirmed?b=${booking.id}`;
  }

  // redirect() throws — keep it outside the try/catch blocks above.
  redirect(redirectTo);
}
