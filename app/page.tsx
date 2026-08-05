import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Swash } from "./components/Swash";
import { HowItWorks } from "./components/HowItWorks";
import { SampleReportContent } from "./components/SampleReportContent";
import { ScaledPreview } from "./components/ScaledPreview";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

function TickIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke={DARK} strokeWidth="1.6"/>
      <path d="M7.5 12.5l3 3 6-6.5" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}


export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  const supabaseAdmin = getSupabaseAdmin();

  const stationsResult = supabaseAdmin
    ? await supabaseAdmin
        .from("stations")
        .select("title")
        .eq("published", true)
        .order("number", { ascending: true })
        .limit(32)
    : { data: [] };

  const stationTitles = ((stationsResult.data ?? []) as { title: string }[]).map((s) => s.title);

  return (
    <main style={{ background: "#FAFAF8" }}>
      {/* HERO */}
      <section className="px-10 pt-10 pb-10 max-md:px-6">
        <div className="max-w-[900px] mx-auto">
          <h1 className="font-display mb-[22px]" style={{ color: DARK }}>
            <span className="block whitespace-nowrap tracking-tight font-extrabold text-[34px] leading-[1.2] max-sm:whitespace-normal max-sm:text-[22px]">
              <Swash>Every</Swash> Consultation Reviewed By A GP<span style={{ color: YELLOW }}>.</span>
            </span>
          </h1>
          <p className="text-[15.5px] leading-[1.7] mb-6" style={{ color: "rgba(51,51,51,0.68)" }}>
            Passing the SCA isn&apos;t just about knowing more medicine. It&apos;s about demonstrating
            the consultation skills RCGP examiners assess—ICE, shared decision-making, managing
            uncertainty and responding to patient emotion. Every consultation is reviewed by an
            experienced GP, giving you clear, personalised feedback so you know exactly what to
            improve before exam day.
          </p>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-10 py-16 max-md:px-6" style={{ background: "rgba(246,212,75,0.09)" }}>
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-display font-extrabold text-[22px] mb-6" style={{ color: DARK }}>
            How It Works
          </h2>
          <HowItWorks />
        </div>
      </section>

      {/* EXAMPLES: full sample report, straight from /recordings/sample */}
      <section className="px-10 pb-16 pt-16 max-md:px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-display font-extrabold text-[22px] mb-6" style={{ color: DARK }}>
            See Exactly What You&apos;ll Receive
          </h2>
          <div
            className="rounded-[28px] p-6 sm:p-8"
            style={{ background: "#F4F4F2", border: `2px solid ${DARK}`, boxShadow: "0 20px 50px rgba(51,51,51,0.16)" }}
          >
            <ScaledPreview scale={0.75}>
              <SampleReportContent interactive={false} />
            </ScaledPreview>
          </div>
        </div>
      </section>

      {/* WHY HUMAN REVIEW MATTERS */}
      <section className="px-10 pb-16 max-md:px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-display font-extrabold text-[22px] mb-3" style={{ color: DARK }}>
            Why Human Review Matters
          </h2>
          <p className="text-[14.5px] leading-[1.7] mb-5" style={{ color: "rgba(51,51,51,0.65)" }}>
            AI is excellent for speed — it gives you a provisional score within minutes of finishing
            your consultation. But exam feedback needs judgement AI can&apos;t fully replace, so every
            single consultation is reviewed by an experienced GP before your feedback is finalised.
          </p>
          <ul className="flex flex-col gap-2.5">
            {(
              [
                "Instant AI feedback",
                "Every consultation reviewed by an experienced GP",
                "Personalised comments",
                "Feedback you can trust",
              ] as const
            ).map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[14.5px]" style={{ color: DARK }}>
                <span className="shrink-0"><TickIcon /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-10 pb-16 max-md:px-6">
        <div className="max-w-[900px] mx-auto">
          <div
            className="relative rounded-2xl p-8 bg-white"
            style={{ border: "1.5px solid rgba(246,212,75,0.55)" }}
          >
            <span
              className="absolute top-5 right-5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "#3B82F6", color: "white" }}
            >
              Paid
            </span>
            <div className="flex items-center gap-2 mb-2">
              <TickIcon />
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(51,51,51,0.40)" }}>Pricing</p>
            </div>
            <h2 className="font-display font-extrabold text-[24px] leading-[1.2] mb-5" style={{ color: DARK }}>
              Get Your Consultations Reviewed
            </h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {(
                [
                  { tier: "Entry",     label: "3 reviews",  price: "£24"  },
                  { tier: "Standard",  label: "15 reviews", price: "£99"  },
                  { tier: "Intensive", label: "40 reviews", price: "£259" },
                ] as const
              ).map(({ tier, label, price }) => (
                <div
                  key={tier}
                  className="rounded-lg px-3 py-1.5 text-[13px]"
                  style={{ background: "rgba(51,51,51,0.05)", color: DARK, border: "1px solid rgba(51,51,51,0.08)" }}
                >
                  <span className="font-bold">{tier}</span>
                  <span style={{ color: "rgba(51,51,51,0.5)" }}> · {label} · {price}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {user ? (
                <Link
                  href="/recordings"
                  className="inline-block font-bold text-[14px] px-6 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
                  style={{ background: "rgba(51,51,51,0.07)", color: DARK }}
                >
                  My Reviews →
                </Link>
              ) : (
                <Link
                  href="/recordings/sample"
                  className="inline-block font-bold text-[14px] px-6 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
                  style={{ background: "rgba(51,51,51,0.07)", color: DARK }}
                >
                  Show Sample Review →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-10 pb-16 max-md:px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-display font-extrabold text-[22px] mb-5" style={{ color: DARK }}>
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-2.5">
            {(
              [
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
                  q: "How do credits work?",
                  a: "Each consultation review uses one credit. Credits come in bundles of 3, 15 or 40, and attending our free monthly webinar earns you 2 free credits.",
                },
              ] as const
            ).map(({ q, a }) => (
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
        </div>
      </section>

      {/* CONTACT LINE */}
      <section className="px-10 pb-12 max-md:px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.45)" }}>
            Questions?{" "}
            <a href="mailto:mrcgpexplained@outlook.com" className="font-semibold no-underline" style={{ color: DARK }}>
              mrcgpexplained@outlook.com
            </a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-10 py-[18px] flex items-center justify-between flex-wrap gap-2.5 max-md:px-6" style={{ background: DARK, borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>For educational purposes only. © 2026 SCA Explained.</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="text-[11px] no-underline" style={{ color: "rgba(255,255,255,0.40)" }}>Privacy</Link>
          <Link href="/terms" className="text-[11px] no-underline" style={{ color: "rgba(255,255,255,0.40)" }}>Terms</Link>
        </div>
      </footer>
    </main>
  );
}
