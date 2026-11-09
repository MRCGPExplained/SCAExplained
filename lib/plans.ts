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
 * INTENSIVE'S ALLOWANCE IS SET WHERE IT STOPS LOSING MONEY ON A TYPICAL
 * CONSULTATION. £295 less £4.62 of Stripe less £240 of reviewers leaves
 * £50.38 for AI and margin, so the plan breaks even at 398 gradings at the
 * average and 372 at the ninetieth percentile. 350 is under both:
 *
 *   350 at the mean   £44.27  margin  £6.10
 *   350 at the p90    £47.39  margin  £2.98
 *   350 at the worst  £81.90  margin  £31.53 LOST
 *
 * It was briefly 500, which loses £12.88 at the average, and 400 before
 * that, which loses £0.23. 350 is still 40% more than the 246 cases in the
 * bank, so nothing is given up on the card by choosing the number that
 * works.
 *
 * THE CEILING IS £19.26 AND NO ALLOWANCE CHANGES IT. Grading the bank once
 * costs £31.12 at the average, which is what a candidate who works through
 * the cases actually spends. That is the most Intensive can earn from such a
 * candidate whatever this number says, because the cost follows what people
 * do rather than what the card promises. The allowance only binds people who
 * would go past 246, and they are already the ones costing money.
 *
 * At the 15.5 gradings actually measured the margin is £48.41, on a sample
 * of two candidates, which is not enough to know how rare a heavy user is.
 *
 * STARTER AND PREMIUM ARE FINE AT EVERY COST LEVEL. Starter clears £60.37 at
 * the worst case and Premium £36.45; Premium could afford 455 gradings at
 * worst-case cost and promises 300. Intensive is the exception because £240
 * of its £295 leaves the business before anything is graded: it is a GP
 * review product that includes AI, not a plan with a margin.
 */
export type PlanKey = "starter" | "premium" | "intensive";

export interface Plan {
  key: PlanKey;
  name: string;
  /** Pence, because that is what Stripe wants and rounding twice is how
   *  a price ends up a penny out from the one advertised. */
  pricePence: number;
  /**
   * AI gradings granted.
   *
   * Recording and transcribing stay free. This used to say they were 5% of
   * the bill; they are 75% of it. Measured over 31 consultations: Deepgram
   * £0.0745 and Daily £0.0200 against £0.0173 of Claude, so the metered step
   * is the cheap one and the free steps are the expensive ones.
   *
   * THE HOLE THAT LEAVES is that an allowance does not bound the bill. Record
   * and transcribe 1,500 consultations, grade 350, and this number is honoured
   * while the unmetered 1,500 cost about £142. Four of the 31 recordings were
   * transcribed and never graded, so it is not hypothetical, only small so
   * far. Nothing here fixes it: closing it means metering transcription or
   * capping recordings, both of which change what the product promises.
   */
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
    aiGradings: 350,
    gpReviews: 12,
    months: 4,
    features: [
      "240+ realistic SCA stations",
      "Unlimited recording and transcription",
      "350 AI-graded consultations",
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
