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
 * THE £55 ON INTENSIVE IS GROSS, AND AI COMES OUT OF IT. Brandon's decision,
 * made with the arithmetic in front of him, and it replaces the rule this
 * table used to keep: that every tier clears its own allowance at the worst
 * observed AI cost. Intensive does not. £295 less £4.63 of Stripe less £240
 * of reviewers leaves £50.38, and 500 gradings cost £56 at the measured
 * average and £111.50 at the worst seen.
 *
 * It is a reasonable bet rather than an oversight. Measured usage is 15.5
 * gradings per candidate, where the margin is £48.64 whatever number the
 * card prints. 400 and 500 are the same decision in practice: £22 apart at
 * the worst case and nothing apart in expectation, and both already exceed
 * the 246 cases in the bank, so the larger number costs almost nothing and
 * sells better. The exposure is one heavy user wiping out the margin on
 * their own plan, capped near £60.
 *
 * What it rests on: two candidates. Not enough to know how rare that user
 * is. If anyone ever grades more than about 450 consultations, that plan
 * sold at a loss, and the number to revisit is this one.
 *
 * The other two tiers still clear their allowances comfortably at the worst
 * case, Starter by £61.69 and Premium by £39.75. Intensive is the exception
 * because £240 of its £295 leaves the business before anything is graded.
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
