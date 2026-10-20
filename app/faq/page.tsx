import { ContentPage } from "../components/ContentPage";
import { PLANS, PLAN_ORDER, planPrice } from "@/lib/plans";

const DARK = "#333333";

/**
 * Built from lib/plans.ts rather than typed out. This answer previously read
 * "A one-off £295 payment gives you access to 240+ cases, unlimited AI
 * review, and 20 GP reviews" — a single product at the top price, with an
 * allowance no plan carries and a review count only Intensive carries. It was
 * written when there was one plan and nothing made it move when there were
 * three. Generated, it cannot say something the plans do not.
 */
const PLAN_SUMMARY = PLAN_ORDER.map((key) => {
  const p = PLANS[key];
  const reviews = p.gpReviews > 0 ? ` and ${p.gpReviews} GP review${p.gpReviews === 1 ? "" : "s"}` : "";
  return `${p.name} at ${planPrice(p)} (${p.aiGradings} AI gradings${reviews})`;
}).join(", ");

const FAQS = [
  {
    q: "Who reviews consultations?",
    a: "An experienced GP who teaches SCA preparation and writes the cases here. Once a consultation is transcribed you choose what happens to it: AI grading, GP review, or neither. How many GP reviews you have depends on your plan, and you can buy more at any time.",
  },
  {
    q: "How quickly is feedback returned?",
    a: "AI analysis is available within minutes of recording. When you submit a consultation for GP review, that feedback is usually returned within 5 working days.",
  },
  {
    q: "How does recording work?",
    a: "You record directly in your browser with a study partner, no downloads or extra software. One of you plays the doctor, the other the patient, for a fixed 12-minute consultation, just like the real exam.",
  },
  {
    q: "Do I need Zoom?",
    a: "No. Consultations are recorded directly in your browser. Our free monthly teaching session is hosted on Zoom separately.",
  },
  {
    q: "How long are consultations?",
    a: "12 minutes, fixed, matching the real SCA exam timing.",
  },
  {
    q: "Is AI used?",
    a: "Yes. Recording and transcription are free and unlimited on every plan. Sending a transcript for AI grading returns a provisional score against the three domains within minutes and spends one of your AI gradings. Sending it for GP review instead puts it in front of a GP, who checks the scoring and writes your feedback.",
  },
  {
    q: "What's included, and what does it cost?",
    a: `Three plans, each a one-off payment giving 4 months of access: ${PLAN_SUMMARY}. All three include the full case bank of 240+ stations, study groups, and unlimited recording and transcription. You can top up either balance at any time without changing your plan or its expiry date.`,
  },
] as const;

export default function FaqPage() {
  return (
    <ContentPage title="Frequently Asked Questions">
      <div className="flex flex-col gap-2.5">
        {FAQS.map(({ q, a }) => (
          <details
            key={q}
            className="rounded-xl px-5 py-4 bg-white"
            style={{ border: "1px solid rgba(51,51,51,0.08)" }}
          >
            <summary className="cursor-pointer select-none font-display font-bold text-[14.5px]" style={{ color: DARK }}>
              {q}
            </summary>
            <p className="text-[13.5px] leading-[1.65] mt-2.5" style={{ color: "rgba(51,51,51,0.65)" }}>
              {a}
            </p>
          </details>
        ))}
      </div>
    </ContentPage>
  );
}
