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
 * First, a top-up may never be cheaper per unit than a plan, or the
 * rational move is to buy the cheapest plan and top up forever. Starter is
 * the peg: £80 for 150 gradings is £0.533 each, so no AI top-up goes below
 * that. It used to be £0.75 (£90 for 120) and the floor dropped when Starter
 * was repriced - the rule did not change, the peg did.
 *
 * Second, nothing above £35 of AI. Premium at £149 grants unlimited AI AND
 * four more months, and a repeat purchase stacks both, so any top-up
 * approaching £149 is a purchase nobody should make. Starter plus the
 * largest AI pack is £115, which leaves real daylight before upgrading
 * becomes the better buy. The £85 and £160 packs were deleted rather than
 * repriced: there is no price for 200 gradings that beats £149 for unlimited.
 *
 * Third, cost is not the binding constraint, and pretending otherwise is how
 * the old prices happened. A grading is £0.0156 of Claude; a whole
 * consultation is £0.1082 at the mean and £0.1304 at p95 over 58 measured
 * rows. This comment used to price against "£0.32 and £0.63 across the five
 * that have run" - a four-fold spread on a sample of five, and about five
 * times too high.
 *
 * AI steps down with volume because it is cheap and scales without limit, so
 * selling more is pure upside. GP steps down too, for the different reason
 * set out below.
 */
export type TopUpKind = "ai" | "gp";
export type TopUpKey = "ai25" | "ai50" | "gp1" | "gp5" | "gp10" | "gp20";

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
  /*
    Two rungs, and both exist only for Starter. Premium and Intensive carry
    unlimited AI, so nobody on those can use these at all.

      25 at £20  £0.80 each  margin £16.79 at the mean, £13.65 at p95
      50 at £35  £0.70 each  margin £28.86 at the mean, £22.58 at p95

    Both clear Starter's £0.533 a grading and both sit far below the £149
    that buys unlimited plus four more months, which is the ceiling the
    second rule in the header is protecting.
  */
  ai25: { key: "ai25", kind: "ai", units: 25, pricePence: 2000, label: "25 AI reviews", detail: "£0.80 each" },
  ai50: { key: "ai50", kind: "ai", units: 50, pricePence: 3500, label: "50 AI reviews", detail: "£0.70 each" },

  /*
    £25 each, flat, because a reviewer costs £20 of it to buy.

    Not "is paid": today the reviewers are Brandon and his cofounder and
    nobody is paid, so a review costs £0 in cash. £20 is what it costs the
    day a third reviewer starts, and pricing against £0 would be pricing
    against founder time being free. See the note at the top of lib/plans.ts
    for why pricing_config still says £4.

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
    changed is that a reviewer is paid PER REVIEW, so capacity is bought
    rather than fixed: more demand funds more reviewers instead of consuming
    a pool. Two examiners is still two examiners, so the risk has moved from
    the price list to the recruiting, which is the honest place for it.

    That is the model rather than today's position - the two examiners are
    the founders and are unpaid - but the ladder has to hold once it is true,
    because that is the point at which a thin margin becomes a real loss.

    The ladder only exists because the single moved to £28. At a £25 flat
    base there is £5 of room, and a discount eats it: 20 at £23 each leaves
    £2.64 a review, which one re-review wipes out. Starting at £28 buys a
    real saving at every step while the margin holds.

      1  at £28 each  margin £7.38
      5  at £27 each  margin £6.56 each
      10 at £26 each  margin £5.59 each
      20 at £25 each  margin £4.62 each

    THE OLD REASON FOR THE £25 FLOOR IS GONE. It used to be "what the
    Intensive plan works out at per review", from £295 / 12 = £24.58. At ten
    reviews that division gives £29.50, which would make every rung here
    cheaper than the plan and break the header's first rule outright. The
    division was always the wrong test: £295 is a bundle, and what it
    includes beyond the reviews is not worth nothing.

    THE TEST THAT ACTUALLY PROTECTS THE PLAN is whether the cheapest route to
    N reviews is the plan itself, at and above the plan's own count. A top-up
    needs a live plan to be usable, so the real comparison is Premium plus
    top-ups:

      1  review   Premium + gp1    £177  beats Intensive £295 - correct, one
                                         review should not cost £295
      5  reviews  Premium + gp5    £284  beats £295 by £11
      6  reviews  Premium+gp5+gp1  £312  Intensive wins
      10 reviews  Premium + gp10   £409  Intensive wins by £114

    So the crossover is six, and the plan is never undercut at its own count,
    which is the thing that needed protecting.

    WORTH KNOWING: this moves the 5-review buyer from today's £210 Premium to
    £284, a 35% rise on the configuration most current customers sit in.
    Deliberate, since Premium shed its reviews, but it is the one price in
    this change that went up.
  */
  gp1:  { key: "gp1",  kind: "gp", units: 1,  pricePence: 2800,  label: "1 GP review",   detail: "£28.00" },
  gp5:  { key: "gp5",  kind: "gp", units: 5,  pricePence: 13500, label: "5 GP reviews",  detail: "£27.00 each" },
  gp10: { key: "gp10", kind: "gp", units: 10, pricePence: 26000, label: "10 GP reviews", detail: "£26.00 each" },
  gp20: { key: "gp20", kind: "gp", units: 20, pricePence: 50000, label: "20 GP reviews", detail: "£25.00 each" },
};

export const AI_TOPUPS: TopUpKey[] = ["ai25", "ai50"];
export const GP_TOPUPS: TopUpKey[] = ["gp1", "gp5", "gp10", "gp20"];

export function isTopUpKey(value: string): value is TopUpKey {
  return value in TOPUPS;
}

export function topUpPrice(t: TopUp): string {
  return `£${Math.round(t.pricePence / 100)}`;
}
