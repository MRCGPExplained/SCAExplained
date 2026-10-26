/**
 * The three plans, defined once.
 *
 * These numbers appear in at least four places that must agree: the pricing
 * page, the Stripe line item, the webhook that grants what was paid for, and
 * the dialogs that tell someone what they have left. They have drifted before
 * — the case count was 250+ in the hero, 256 in a card and 246 in the
 * database — so there is one table and everything reads it.
 *
 * Priced against measured cost, not guessed. A graded consultation costs
 * £0.32-£0.63 of AI (mean £0.42) and a GP review is £4.00 in the pricing
 * config, though no GP has been paid for one yet. Each tier clears its own
 * allowance at the worst observed AI cost, which is the column that matters:
 * the mean is five consultations wide and not firmly pinned down.
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
  intensive: {
    key: "intensive",
    name: "Intensive",
    pricePence: 29500,
    aiGradings: 400,
    gpReviews: 20,
    months: 4,
    features: [
      "240+ realistic SCA stations",
      "Unlimited recording and transcription",
      "400 AI-graded consultations",
      "20 consultations reviewed by a GP",
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
