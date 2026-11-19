/**
 * The three plans, defined once.
 *
 * These numbers appear in at least four places that must agree: the pricing
 * page, the Stripe line item, the webhook that grants what was paid for, and
 * the dialogs that tell someone what they have left. They have drifted before
 * — the case count was 250+ in the hero, 256 in a card and 246 in the
 * database — so there is one table and everything reads it.
 *
 * PRICED AGAINST MEASURED COST. The measurements have moved three times and
 * the third move was a correction to how they were read, not to the data.
 *
 * THE WHOLE DISTRIBUTION, from consultation_costs on 19 Nov 2026, n=58:
 *
 *   mean £0.1082   median £0.1170   p90 £0.1197   p95 £0.1304   max £0.2340
 *
 * USE p95, NOT max. Exactly ONE row of 58 is above £0.20 and two above
 * £0.15, so the max is a 1.7% outlier. Every "worst case" in this file used
 * to apply £0.2340 to all 246 cases, which is not a scenario any candidate
 * can produce - it is a stress bound, and reading it as a forecast talked us
 * into treating healthy plans as marginal. p95 is the honest pessimistic
 * figure and it is 44% lower.
 *
 * WHERE THE MONEY GOES, per consultation: Deepgram £0.0739, Daily £0.0191,
 * Claude £0.0156. Transcription is 68% of it and the AI grading is 1.6p.
 * That is why unlimited AI is cheap to promise and why an allowance on
 * gradings was never protecting anything.
 *
 * A GP REVIEW COSTS £20 TO BUY AND £0 TODAY, and every number below is built
 * on the £20. Three figures get confused here, so all three:
 *
 *   £0   what a review actually costs right now. Brandon and his cofounder
 *        are the first two reviewers and they are not paying themselves, so
 *        no money leaves the business for one.
 *   £20  what a review costs once a third reviewer is hired, and what every
 *        number here is built on: £200 of Intensive's £295 is ten of these.
 *        Pricing on £0 would be pricing on founder time being free. Because
 *        the £20 IS costed below, nothing here has to be rebuilt when a paid
 *        reviewer starts - the margins already assume one.
 *   £4   a guess in pricing_config from before anyone knew, and the one
 *        value in that table that was never measured. It is neither of the
 *        above.
 *
 * pricing_config is DELIBERATELY LEFT AT £4 for now: consultation_costs
 * pins a pricing_version_id per row, so moving it to £20 would start
 * charging the ledger for cash that is not going out. The 13 reviews on it
 * today are founders reviewing testers. Move it when a paid reviewer starts,
 * and the versioning will cost the ones before and after correctly.
 *
 * EVERY TIER IS JUDGED ON ITS OWN MARGIN, NOT AGAINST THE TIER BELOW IT.
 * That is a deliberate decision and it was argued out, so here is the
 * argument. Priced incrementally, Intensive looks bad: once Premium is £149
 * with unlimited AI and the same bank, the only thing £146 of extra price
 * buys is ten reviews costing £200, so the STEP loses £56 a sale. Three
 * separate reviews called that fatal.
 *
 * It is not, because the step is not a thing anybody buys. Intensive's buyer
 * wants a GP to listen to their consultation; unlimited AI does not serve
 * that need, so an Intensive sale is overwhelmingly new revenue rather than
 * a Premium sale given up. And ten reviews at £20 IS the product - the
 * payout is what is being sold, not a cost to be squeezed. Judge the tier on
 * whether it clears its own costs with the reviewers paid, which it does.
 *
 * WHAT THE THREE TIERS ACTUALLY CLEAR. Stripe is 1.5% + £0.20. "Bank once"
 * is grading all 246 cases, which is what a candidate who works through the
 * product really spends; the p95 column is the honest pessimistic one.
 *
 *                  price  Stripe  payout  headroom   bank once    margin
 *   Starter          £80   £1.40      £0    £78.60  £16.2/£19.6  £62.4/£59.0
 *   Premium         £149   £2.44      £0   £146.57  £26.6/£32.1  £119.9/£114.5
 *   Intensive       £295   £4.63    £200    £90.38  £26.6/£32.1  £63.8/£58.3
 *
 * All three are healthy at every cost level in the measured distribution,
 * Intensive included and with its reviewers fully paid.
 *
 * THE ONE THING NOT IN THAT TABLE, OR IN ANY LEDGER: fixed costs. Vercel Pro
 * $20/mo plus Supabase Pro $25/mo is about £35.55 a month, £142.20 per
 * 4-month cohort. consultation_costs is a record of metered provider charges
 * and allocating rent into it would turn a measurement into a model, so it
 * stays out - but it means /admin/economics reports GROSS margin. Three
 * paying customers a cohort covers the whole infrastructure bill. Below
 * that, overhead is the dominant cost of the business and the per-customer
 * margins above are not what is kept.
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
  /**
   * GP reviews granted. The scarce one: twenty minutes of a person.
   *
   * THIS IS THE PRODUCT, not an overhead. Reviews are contracted work paid
   * out at £20 each and the founders are the first two reviewers, so every
   * one of these sold is £20 of contracted work created. Maximising them is
   * the point; the margin on the rest is secondary.
   *
   * It is also the real capacity ceiling. Ten reviews is 3.3 hours of a
   * person per customer, so two reviewers at five hours a week each cap the
   * business near fifty Intensive customers a cohort. That is a recruiting
   * problem rather than a pricing one, which is the honest place for it.
   */
  gpReviews: number;
  months: number;
  /** Shown on the card, in order. */
  features: string[];
}

/**
 * What "unlimited" actually means, as a number.
 *
 * 600 consultations in any four months. The cards say unlimited because for
 * every real candidate it is - 600 is 4.9 a day every day for 122 days, and
 * 1.5x the heaviest user we think exists - but a promise with no number
 * behind it is a promise that cannot be priced.
 *
 * THE REAL CEILING IS ON RECORDING, NOT GRADING, and lives in
 * checkCaseBankAccess in app/case-bank/actions.ts, which counts
 * station_recordings in a rolling 122-day window. That is where the money
 * is: Deepgram and Daily are 9.3p of every consultation and run on every
 * take, while the Claude grading is 1.6p and only runs when asked. A cap on
 * gradings would bound the cheap step and leave the expensive one open.
 * Capping recordings also makes a grading cap redundant, since nothing can
 * be graded that was not recorded.
 *
 * THIS CONSTANT IS THE SAME NUMBER, used as the plan's ai_allowance so the
 * two can never disagree. It is deliberately a real integer rather than a
 * sentinel: ai_allowance is integer NOT NULL and DDL is refused here, so
 * "truly uncapped" would have meant a magic 1,000,000 and a branch at the
 * checkout line item, the ai_gradings metadata round-trip, add_ai_allowance,
 * the credits endpoint and the grading gate. A real number keeps all of
 * those identical and keeps the remaining-credits display honest rather than
 * reading "999,851 left".
 *
 * WHAT IT COSTS IF ANYONE REACHES IT: £64.92 at the measured mean, £78.24 at
 * p95. Inside all three tiers, Starter included.
 */
export const FAIR_USE_AI = 600;

export const PLANS: Record<PlanKey, Plan> = {
  starter: {
    key: "starter",
    name: "Starter",
    pricePence: 8000,
    aiGradings: 150,
    gpReviews: 0,
    months: 4,
    features: [
      "240+ realistic SCA stations",
      "Unlimited recording and transcription (fair use: 600 per 4 months)",
      "150 AI-graded consultations",
      "4 months access",
    ],
  },
  premium: {
    key: "premium",
    name: "Premium",
    pricePence: 14900,
    aiGradings: FAIR_USE_AI,
    gpReviews: 0,
    months: 4,
    features: [
      "240+ realistic SCA stations",
      "Unlimited recording and transcription (fair use: 600 per 4 months)",
      "Unlimited AI-graded consultations",
      "4 months access",
    ],
  },
  /*
    £295 = £200 of contracted review work (10 x £20) + £95 to the business,
    before Stripe takes £4.63 and before any AI. That leaves £90.38, and
    grading the whole bank costs £26.64, so the tier clears £63.76 with its
    reviewers fully paid.

    TEN, DOWN FROM TWELVE. Twelve left £50.38 for AI and margin and broke on
    a heavy user. Ten leaves £90.38 and does not. The two reviews bought £40
    of headroom and three and a half hours of a person back.

    Read the header on why this tier is judged standalone and not against
    Premium below it.
  */
  intensive: {
    key: "intensive",
    name: "Intensive",
    pricePence: 29500,
    aiGradings: FAIR_USE_AI,
    gpReviews: 10,
    months: 4,
    features: [
      "240+ realistic SCA stations",
      "Unlimited recording and transcription (fair use: 600 per 4 months)",
      "Unlimited AI-graded consultations",
      "10 consultations reviewed by a GP",
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
  // Premium and Intensive both carry FAIR_USE_AI, so neither can print a
  // count here without contradicting the "unlimited" on its own card.
  if (plan.gpReviews === 0) {
    return "Access to the entire case bank with unlimited AI reviews, for registrars working through cases on their own.";
  }
  const reviews = `${plan.gpReviews} GP review${plan.gpReviews === 1 ? "" : "s"}`;
  const tail =
    plan.key === "intensive"
      ? `, for GP registrars seeking tailored feedback and support`
      : "";
  // "Enough to cover the bank" understated this the moment the tier went
  // unlimited, and understating is still contradicting the card.
  return `Access to the entire case bank with unlimited AI reviews. Includes ${reviews}${tail}.`;
}

export function planPrice(plan: Plan): string {
  return `£${Math.round(plan.pricePence / 100)}`;
}
