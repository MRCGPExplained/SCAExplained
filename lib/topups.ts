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
export type TopUpKey = "ai25" | "ai50" | "ai100" | "ai200" | "gp1" | "gp5" | "gp10" | "gp20";

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

  /*
    £25 each, flat, because a reviewer is paid £20 of it.

    This used to be £9.00 a review, priced against the £4.00 in
    pricing_config. That figure is an estimate nobody had tested and it is
    wrong by five times: the real cost is £20, so every top-up review sold at
    £9 lost £11, and the 20-pack lost £220 a sale. Nothing had been bought
    yet, which is the only reason that is a correction rather than a refund.

    IT DOES STEP DOWN WITH VOLUME, which reverses what this file used to say
    and is worth explaining rather than quietly flipping. The old argument was
    that a volume discount encourages buying more, and GP reviews are twenty
    minutes each of the one thing there is no more of, so discounting the big
    pack would use price to encourage the behaviour that exhausts capacity.

    That argument still has force and it was overruled deliberately. What
    changed is that a reviewer is now paid per review, so capacity is bought
    rather than fixed: more demand funds more reviewers instead of consuming
    a pool. Two examiners is still two examiners, so the risk has moved from
    the price list to the recruiting, which is the honest place for it.

    The ladder only exists because the single moved to £28. At a £25 flat
    base there is £5 of room, and a discount eats it: 20 at £23 each leaves
    £2.64 a review, which one re-review wipes out. Starting at £28 buys a
    real saving at every step while the margin holds.

      1  at £28 each  margin £7.38
      5  at £27 each  margin £6.56 each
      10 at £26 each  margin £5.59 each
      20 at £25 each  margin £4.62 each

    The bottom of the ladder lands on £25, which is what the Intensive plan
    works out at per review. The biggest top-up and the plan agreeing is a
    tidy place for it to stop: buying twenty at a time is as good as being on
    the plan, and never better.
  */
  gp1:  { key: "gp1",  kind: "gp", units: 1,  pricePence: 2800,  label: "1 GP review",   detail: "£28.00" },
  gp5:  { key: "gp5",  kind: "gp", units: 5,  pricePence: 13500, label: "5 GP reviews",  detail: "£27.00 each" },
  gp10: { key: "gp10", kind: "gp", units: 10, pricePence: 26000, label: "10 GP reviews", detail: "£26.00 each" },
  gp20: { key: "gp20", kind: "gp", units: 20, pricePence: 50000, label: "20 GP reviews", detail: "£25.00 each" },
};

export const AI_TOPUPS: TopUpKey[] = ["ai25", "ai50", "ai100", "ai200"];
export const GP_TOPUPS: TopUpKey[] = ["gp1", "gp5", "gp10", "gp20"];

export function isTopUpKey(value: string): value is TopUpKey {
  return value in TOPUPS;
}

export function topUpPrice(t: TopUp): string {
  return `£${Math.round(t.pricePence / 100)}`;
}
