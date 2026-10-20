import { PLANS, PLAN_ORDER, planPrice } from "@/lib/plans";
import { PlanButton } from "./PlanButton";

const DARK = "#333333";
const YELLOW = "#F6D44B";

function Tick() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 mt-[3px]">
      <circle cx="12" cy="12" r="10" fill={YELLOW} />
      <path d="M7.5 12.5l3 3 6-6.5" stroke={DARK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The three plans, side by side and all equal.
 *
 * No "most popular" badge and no raised middle card. A badge tells someone
 * which one to buy before they have read what the three actually are, and
 * the difference here is genuinely a matter of how much GP time you want
 * rather than one obvious right answer. The tiers differ by reviews, which
 * is the scarce thing and the thing each step up is really selling, so
 * letting them be compared plainly is the point.
 *
 * No monthly-equivalent price either. Dividing by a twelve-month term turns
 * £295 into £24.60 and flatters it; dividing a four-month price by four
 * turns it into £73.75 and does the opposite.
 */
export function PlanCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      {PLAN_ORDER.map((key) => {
        const plan = PLANS[key];
        return (
          <div
            key={key}
            className="rounded-[22px] p-7 flex flex-col"
            style={{
              background: "white",
              border: "1px solid rgba(51,51,51,0.10)",
              boxShadow: "0 8px 30px rgba(51,51,51,0.06)",
            }}
          >
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

            <PlanButton plan={plan.key} label={`Get ${plan.name}`} />

            <ul className="flex flex-col gap-2.5 mt-6 pt-6" style={{ borderTop: "1px solid rgba(51,51,51,0.09)" }}>
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[13.5px] leading-[1.5]"
                  style={{ color: "rgba(51,51,51,0.75)" }}
                >
                  <Tick />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
