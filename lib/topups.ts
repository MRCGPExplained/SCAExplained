/**
 * Top-ups, for when a plan's allowance runs out before the exam does.
 *
 * A top-up buys units, never time. Extending access by the pack would turn
 * the cheapest one into a renewal, and an account that can be kept alive
 * indefinitely for £25 is an account worth handing to someone else. Only a
 * live plan can be topped up.
 *
 * Two rules decide every number here.
 *
 * First, a top-up may never be cheaper per unit than a plan. An AI grading
 * costs £0.75 inside Starter (£90 for 120, the one tier with no GP reviews
 * muddying the arithmetic), so no AI top-up goes below that. Otherwise the
 * rational move is to buy the cheapest plan and top up forever, and the
 * ladder stops meaning anything.
 *
 * Second, every one of these has to clear its cost at the WORST measured
 * figure, not the average. A graded consultation has cost between £0.32 and
 * £0.63 across the five that have run, which is a four-fold spread on a
 * sample of five: the mean is not pinned down well enough to price against.
 *
 * AI steps down with volume because it is cheap and scales without limit, so
 * selling more is pure upside. GP does not, deliberately: a volume discount
 * exists to encourage buying more, and GP reviews are twenty minutes each of
 * the one thing there is no more of. Discounting the big pack would use
 * price to encourage exactly the behaviour that runs out the capacity.
 */
export type TopUpKind = "ai" | "gp";
export type TopUpKey = "ai25" | "ai50" | "ai100" | "ai200" | "gp20";

export interface TopUp {
  key: TopUpKey;
  kind: TopUpKind;
  units: number;
  /** Pence, because that is what Stripe takes. */
  pricePence: number;
  label: string;
  detail: string;
}

export const TOPUPS: Record<TopUpKey, TopUp> = {
  // £1.00 each. Priced above the others on purpose: Stripe's flat 20p bites
  // hardest on a small basket, and this is the only size where it shows.
  ai25:  { key: "ai25",  kind: "ai", units: 25,  pricePence: 2500,  label: "25 AI reviews",  detail: "£1.00 each" },
  ai50:  { key: "ai50",  kind: "ai", units: 50,  pricePence: 4500,  label: "50 AI reviews",  detail: "£0.90 each" },
  ai100: { key: "ai100", kind: "ai", units: 100, pricePence: 8500,  label: "100 AI reviews", detail: "£0.85 each" },
  ai200: { key: "ai200", kind: "ai", units: 200, pricePence: 16000, label: "200 AI reviews", detail: "£0.80 each" },

  // £9.00 each, flat. Break-even is £8.85 a review, so this survives the
  // £4.00 in pricing_config being wrong by more than double — which matters,
  // because no GP has yet been paid for one and that figure is an estimate.
  gp20:  { key: "gp20",  kind: "gp", units: 20,  pricePence: 18000, label: "20 GP reviews",   detail: "£9.00 each" },
};

export const AI_TOPUPS: TopUpKey[] = ["ai25", "ai50", "ai100", "ai200"];
export const GP_TOPUPS: TopUpKey[] = ["gp20"];

export function isTopUpKey(value: string): value is TopUpKey {
  return value in TOPUPS;
}

export function topUpPrice(t: TopUp): string {
  return `£${Math.round(t.pricePence / 100)}`;
}
