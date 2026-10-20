import type { Metadata } from "next";
import { PLANS, PLAN_ORDER, planPrice } from "@/lib/plans";
import { PlanButton } from "./PlanButton";

export const metadata: Metadata = {
  title: "Pricing: SCA Focus",
  description:
    "Three plans for SCA preparation. 240+ cases and study groups on all of them, with AI marking and GP review to the depth you need.",
};

const DARK = "#333333";
const YELLOW = "#F6D44B";
const WASH = "#F9F3D9";

function Tick() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 mt-[3px]">
      <circle cx="12" cy="12" r="10" fill={YELLOW} />
      <path d="M7.5 12.5l3 3 6-6.5" stroke={DARK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Three cards side by side, the middle one raised.
 *
 * No monthly-equivalent price. The competition divides by a twelve-month
 * term to turn £295 into £24.60, which works because their term is long;
 * dividing a four-month price by four turns £295 into £73.75 and makes the
 * same money look worse. The one-off price, said plainly, is the better
 * number here.
 *
 * What the tiers differ by is deliberate. Starter and Premium used to differ
 * only in how much AI marking you got, which is a quantity of the cheap,
 * abundant thing and invites people to do the arithmetic and take the
 * cheaper one. They differ by GP reviews now: nought, five, twenty. That is
 * the scarce thing, it is what each step up is actually selling, and it is
 * the axis the product is built around.
 */
export default function PricingPage() {
  return (
    <main style={{ background: "#FAFAF8" }}>
      <section className="px-10 py-16 max-md:px-6">
        <div className="max-w-[1150px] mx-auto">
          <div className="text-center max-w-[620px] mx-auto mb-12">
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(51,51,51,0.40)" }}>
              Pricing
            </p>
            <h1 className="font-display font-extrabold text-[36px] leading-[1.15] mb-4 max-sm:text-[28px]" style={{ color: DARK }}>
              Every plan has the whole case bank.
            </h1>
            <p className="text-[15.5px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.6)" }}>
              240+ cases, study groups, and unlimited recording on all three. What changes is how
              much marking you get, and how much of it is read by a GP.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {PLAN_ORDER.map((key) => {
              const plan = PLANS[key];
              const featured = key === "premium";
              return (
                <div
                  key={key}
                  className="relative rounded-[22px] p-7 flex flex-col"
                  style={{
                    background: featured ? WASH : "white",
                    border: featured ? `2px solid ${YELLOW}` : "1px solid rgba(51,51,51,0.10)",
                    boxShadow: featured
                      ? "0 18px 50px rgba(51,51,51,0.12)"
                      : "0 6px 24px rgba(51,51,51,0.05)",
                    // The middle card sits proudest, as the one most people
                    // should be choosing.
                    marginTop: featured ? -10 : 0,
                  }}
                >
                  {featured && (
                    <span
                      className="absolute left-1/2 -translate-x-1/2 -top-3 text-[10px] font-bold uppercase tracking-[0.07em] px-3 py-1 rounded-full"
                      style={{ background: DARK, color: "white" }}
                    >
                      Most popular
                    </span>
                  )}

                  <p className="font-display font-extrabold text-[19px] mb-1" style={{ color: DARK }}>
                    {plan.name}
                  </p>
                  <p className="text-[13px] leading-[1.6] mb-5" style={{ color: "rgba(51,51,51,0.6)" }}>
                    {plan.blurb}
                  </p>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-display font-extrabold leading-none" style={{ fontSize: 40, color: DARK }}>
                      {planPrice(plan)}
                    </span>
                    <span className="text-[13px]" style={{ color: "rgba(51,51,51,0.5)" }}>one-off</span>
                  </div>
                  <p className="text-[12.5px] mb-6" style={{ color: "rgba(51,51,51,0.45)" }}>
                    {plan.months} months access
                  </p>

                  <PlanButton
                    plan={plan.key}
                    label={`Get ${plan.name}`}
                    featured={featured}
                  />

                  <ul className="flex flex-col gap-2.5 mt-6 pt-6" style={{ borderTop: "1px solid rgba(51,51,51,0.09)" }}>
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13.5px] leading-[1.5]" style={{ color: "rgba(51,51,51,0.75)" }}>
                        <Tick />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <p className="text-center text-[13px] mt-10" style={{ color: "rgba(51,51,51,0.5)" }}>
            Recording and transcription are unlimited on every plan, and never cost a credit. You
            choose which consultations are worth marking once you have seen how they went.
          </p>
        </div>
      </section>
    </main>
  );
}
