import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.warn("[stripe] STRIPE_SECRET_KEY missing — payments disabled.");
    return null;
  }
  cached = new Stripe(key);
  return cached;
}

/**
 * The two persistent Stripe Price IDs, created ONCE in the Stripe dashboard and
 * reused across every Intensive date (per the brief — do NOT create a new
 * Product/Price per date). Date-specificity is carried entirely in our own
 * UUIDs via Checkout `metadata`. Mapped by ticket-type name.
 *
 * If a Price ID isn't configured yet, the checkout falls back to inline
 * price_data using the amount stored on the ticket type, so booking still works
 * before the Stripe catalog is set up.
 */
export function stripePriceIdForTicket(name: string): string | undefined {
  const normalized = name.trim().toLowerCase();
  if (normalized.includes("active")) return process.env.STRIPE_PRICE_ACTIVE;
  if (normalized.includes("observer")) return process.env.STRIPE_PRICE_OBSERVER;
  return undefined;
}
