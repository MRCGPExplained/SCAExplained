/**
 * The three plans, defined once.
 *
 * These numbers appear in at least four places that must agree: the pricing
 * page, the Stripe line item, the webhook that grants what was paid for, and
 * the dialogs that tell someone what they have left. They have drifted before
 * — the case count was 250+ in the hero, 256 in a card and 246 in the
 * database — so there is one table and everything reads it.
 *
 * PRICED AGAINST MEASURED COST, and the measurements have moved twice.
 *
 * AI is far cheaper than this comment used to claim. Over 31 consultations
 * in consultation_costs, Claude plus Deepgram runs £0.092 on average and
 * £0.203 at worst, with Daily adding about £0.02. The old figures here said
 * £0.32-£0.63 from a sample of five.
 *
 * A GP REVIEW IS £20, not the £4.00 still sitting in pricing_config. That is
 * what Brandon pays a reviewer, so it is the real number and the config row
 * is stale.
 *
 * THE RULE THIS TABLE USED TO KEEP IS NOW BROKEN ON PURPOSE. Every tier used
 * to clear its own allowance at the worst observed AI cost. Intensive no
 * longer does: £295 less £4.63 of Stripe less £240 of GP leaves £50, and 500
 * gradings cost £56 at the average and £111 at the worst seen. A candidate
 * who used the whole allowance would cost more than they paid.
 *
 * That is a deliberate trade and worth stating plainly rather than leaving
 * for someone to rediscover. The allowance is advertising: measured usage is
 * 15.5 gradings per candidate, so nobody is within an order of magnitude of
 * 500. The exposure is not the average customer, it is a single heavy user
 * wiping out the margin on their own plan, and it is capped at roughly £60.
 * Two candidates is not enough to know how rare that is.
 */
export type PlanKey = "starter" | "premium" | "intensive";

export interface Plan {
  key: PlanKey;
  name: string;
  /** Pence, because that is what Stripe wants and rounding twice is how
   *  a price ends up a penny out from the one advertised. */
  pricePence: number;
  /** AI gradings granted. Recording and transcribing stay free: they are 5%
   *  of the bill, and metering them would tax the habit rather than the cost. */
  aiGradings: number;
  /** GP reviews granted. The scarce one: twenty minutes of a person. */
  gpReviews: number;
  months: number;
  /** Shown on the card, in order. */
  features: string[];
}

export const PLANS: Record<PlanKey, Plan> = {
  starter: {
    key: "starter",
    name: "Starter",
    pricePence: 9000,
    aiGradings: 120,
    gpReviews: 0,
    months: 4,
    features: [
      "240+ realistic SCA stations",
      "Unlimited recording and transcription",
      "120 AI-graded consultations",
      "4 months access",
    ],
  },
  premium: {
    key: "premium",
    name: "Premium",
    pricePence: 21000,
    aiGradings: 300,
    gpReviews: 5,
    months: 4,
    features: [
      "240+ realistic SCA stations",
      "Unlimited recording and transcription",
      "300 AI-graded consultations",
      "5 consultations reviewed by a GP",
      "4 months access",
    ],
  },
  /*
    £295 = £240 to the reviewers (12 x £20) + £55 to the business, before
    Stripe takes £4.63 and before any AI. See the note at the top of this
    file for what that leaves and why the AI allowance is set above it.
  */
  intensive: {
    key: "intensive",
    name: "Intensive",
    pricePence: 29500,
    aiGradings: 500,
    gpReviews: 12,
    months: 4,
    features: [
      "240+ realistic SCA stations",
      "Unlimited recording and transcription",
      "500 AI-graded consultations",
      "12 consultations reviewed by a GP",
      "4 months access",
    ],
  },
};

export const PLAN_ORDER: PlanKey[] = ["starter", "premium", "intensive"];

export function isPlanKey(value: string): value is PlanKey {
  return value === "starter" || value === "premium" || value === "intensive";
}

/** "£90" — whole pounds, since every plan is priced in them. */
/**
 * The one-line sell under the plan name.
 *
 * Generated rather than typed, because the last hand-written set said
 * "enough recordings" for the thing every card calls unlimited, and the set
 * before that promised twenty GP reviews on all three. Any number in here
 * now comes from the same fields the bullets and the Stripe line item read,
 * so a blurb cannot claim an allowance the plan does not grant.
 */
export function planBlurb(plan: Plan): string {
  if (plan.key === "starter") {
    return `Starter pack to identify strengths and weaknesses. Access to all 240+ cases and ${plan.aiGradings} instant AI reviews.`;
  }
  const reviews = `${plan.gpReviews} GP review${plan.gpReviews === 1 ? "" : "s"}`;
  const tail =
    plan.key === "intensive"
      ? `, for GP registrars seeking tailored feedback and support`
      : "";
  return `Access to the entire case bank and enough AI reviews to cover the entire bank. Includes ${reviews}${tail}.`;
}

export function planPrice(plan: Plan): string {
  return `£${Math.round(plan.pricePence / 100)}`;
}
