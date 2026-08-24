import { ContentPage } from "../components/ContentPage";

const DARK = "#333333";

const FAQS = [
  {
    q: "Who reviews consultations?",
    a: "Every consultation is reviewed by a qualified, experienced GP — the same kind of examiner who marks the real SCA.",
  },
  {
    q: "How quickly is feedback returned?",
    a: "AI analysis is available within minutes of submitting. Full, GP-reviewed feedback is usually returned within 5 working days.",
  },
  {
    q: "How does recording work?",
    a: "You record directly in your browser with a study partner — no downloads or extra software. One of you plays the doctor, the other the patient, for a fixed 12-minute consultation, just like the real exam.",
  },
  {
    q: "Do I need Zoom?",
    a: "No — consultations are recorded directly in your browser. Our free monthly teaching session is hosted on Zoom separately.",
  },
  {
    q: "How long are consultations?",
    a: "12 minutes, fixed, matching the real SCA exam timing.",
  },
  {
    q: "Is AI used?",
    a: "Yes. Every consultation is transcribed and given an AI-generated provisional score for fast initial feedback. A GP examiner then reviews it, verifies the scoring and finalises your feedback.",
  },
  {
    q: "What's included in the programme?",
    a: "A one-off £295 payment gives you access to 250+ cases, unlimited AI review, and 20 GP reviews, valid for 4 months.",
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
