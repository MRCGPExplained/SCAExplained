import { getSupabaseAdmin } from "@/lib/supabase";
import { Swash } from "./components/Swash";
import { HowItWorks } from "./components/HowItWorks";
import { SampleReportContent } from "./components/SampleReportContent";
import { ScaledPreview } from "./components/ScaledPreview";
import { AwardIcon, SparklesIcon, StethoscopeIcon, BooksIcon } from "./components/TrustIcons";
import { TestimonialsSection } from "./components/TestimonialsSection";
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

function SmallCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill={YELLOW} />
      <path d="M7.5 12.5l3 3 6-6.5" stroke={DARK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChatIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H10l-4.5 4V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1z" fill={YELLOW} />
      <path d="M7.5 9.5h9M7.5 13h6" stroke={DARK} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ShieldCheckIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5l7.5 3v6c0 5-3.2 8.6-7.5 10-4.3-1.4-7.5-5-7.5-10v-6l7.5-3z" fill={YELLOW} />
      <path d="M8.5 12.2l2.4 2.4 4.6-5" stroke={DARK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


type Testimonial = { id: string; quote: string; name: string; vts: string | null; sca_date: string | null };

export default async function HomePage() {
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

  const testimonialsResult = supabaseAdmin
    ? await supabaseAdmin
        .from("testimonials")
        .select("id, quote, name, vts, sca_date")
        .eq("published", true)
        .order("display_order", { ascending: true })
    : { data: [] };

  const testimonials = (testimonialsResult.data ?? []) as Testimonial[];

  return (
    <main style={{ background: "#FAFAF8" }}>
      {/* HERO */}
      <section className="px-10 pt-14 pb-16 max-md:px-6">
        <div className="max-w-[1450px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: message + CTAs */}
          <div className="max-w-[650px]">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5"
              style={{ background: "rgba(246,212,75,0.32)" }}
            >
              <AwardIcon size={15} />
              <span className="text-[11px] font-bold uppercase tracking-[0.05em]" style={{ color: DARK }}>
                Built by Experienced GP Educators
              </span>
            </div>

            <h1 className="font-display font-extrabold mb-5" style={{ color: DARK }}>
              <span className="block text-[42px] leading-[1.18] max-sm:text-[28px]">
                The <Swash>Complete</Swash> SCA Package<span style={{ color: YELLOW }}>.</span>
              </span>
            </h1>

            <div className="flex items-center gap-5 flex-wrap mb-7">
              {(["Access to 250+ cases", "Unlimited AI review", "20 GP reviews"] as const).map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-[13.5px] font-semibold" style={{ color: DARK }}>
                  <SmallCheck /> {item}
                </span>
              ))}
            </div>

            <p className="text-[16px] leading-[1.7] mb-7" style={{ color: "rgba(51,51,51,0.65)" }}>
              Passing the SCA isn&apos;t just about knowing more medicine. It&apos;s about demonstrating
              the consultation skills RCGP examiners assess—ICE, shared decision-making, managing
              uncertainty and responding to patient emotion. Every consultation is reviewed by an
              experienced GP, giving you clear, personalised feedback so you know exactly what to
              improve before exam day.
            </p>

            <div className="flex items-center gap-3 flex-wrap mb-7">
              <Link
                href="/register"
                className="inline-block font-bold text-[15px] px-7 py-3.5 rounded-xl no-underline transition-opacity hover:opacity-90"
                style={{ background: YELLOW, color: DARK }}
              >
                Register Now →
              </Link>
              <Link
                href="/case-bank/sample"
                className="inline-block font-bold text-[15px] px-7 py-3.5 rounded-xl no-underline transition-colors"
                style={{ border: `1.5px solid rgba(51,51,51,0.2)`, color: DARK }}
              >
                See Demo Case
              </Link>
            </div>
          </div>

          {/* Right: report preview — the clearest proof of the product */}
          <Link
            href="/recordings/sample"
            className="block rounded-[28px] p-6 sm:p-7 no-underline transition-all duration-200 hover:-translate-y-1"
            style={{ background: "#F4F4F2", border: `2px solid ${DARK}`, boxShadow: "0 20px 50px rgba(51,51,51,0.16)" }}
          >
            <ScaledPreview scale={0.85}>
              <SampleReportContent interactive={false} compact />
            </ScaledPreview>
          </Link>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-10 py-16 max-md:px-6" style={{ background: "rgba(246,212,75,0.09)" }}>
        <div className="max-w-[1150px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display font-extrabold text-[38px] leading-[1.2] mb-5" style={{ color: DARK }}>
              Every step is designed to help you improve.
            </h2>
            <p className="text-[15.5px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.6)" }}>
              From recording your consultation to receiving expert feedback, we make SCA
              preparation simple and effective.
            </p>
          </div>
          <div>
            <h2 className="font-display font-extrabold text-[22px] mb-6" style={{ color: DARK }}>
              How It Works
            </h2>
            <HowItWorks />
          </div>
        </div>
      </section>

      {/* EXAMPLES: full sample report, straight from /recordings/sample */}
      <section className="px-10 pb-16 pt-16 max-md:px-6">
        <div className="max-w-[1250px] mx-auto">
          <h2 className="font-display font-extrabold text-[22px] mb-6" style={{ color: DARK }}>
            Everything Included In Your Programme
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[3fr_5fr] gap-9">
            {/* Value props */}
            <div className="rounded-[28px] p-7 sm:p-8" style={{ background: "rgba(246,212,75,0.14)" }}>
              {(
                [
                  { icon: AwardIcon, title: "Built by Experienced GP Educators", body: "Built by experienced GP educators who understand the SCA inside out." },
                  { icon: SparklesIcon, title: "AI Feedback Attuned to the SCA", body: "Instant feedback aligned with the RCGP SCA marking domains." },
                  { icon: StethoscopeIcon, title: "Every Consultation Expertly Reviewed", body: "Every submitted consultation reviewed by an experienced GP." },
                  { icon: BooksIcon, title: "Complete Case Bank", body: "256 consultations covering every SCA clinical domain." },
                ] as const
              ).map(({ icon: Icon, title, body }, i) => {
                const isBadge = i === 0;
                return (
                  <div
                    key={title}
                    className="flex items-start gap-4 py-5"
                    style={i > 0 ? { borderTop: "1px solid rgba(51,51,51,0.1)" } : undefined}
                  >
                    <span
                      className="shrink-0 flex items-center justify-center rounded-full"
                      style={{ width: isBadge ? 60 : 48, height: isBadge ? 60 : 48, background: "white" }}
                    >
                      <Icon size={isBadge ? 32 : 26} />
                    </span>
                    <div>
                      <h3 className="font-display font-extrabold mb-1" style={{ color: DARK, fontSize: isBadge ? 18 : 16 }}>{title}</h3>
                      <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(51,51,51,0.65)" }}>{body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Why Human Review Matters */}
            <div
              className="rounded-[28px] p-7 sm:p-9"
              style={{ background: "#F4F4F2", border: `2px solid ${DARK}`, boxShadow: "0 20px 50px rgba(51,51,51,0.16)" }}
            >
              <h3 className="font-display font-extrabold text-[22px] mb-3" style={{ color: DARK }}>
                Why Human Review Matters
              </h3>
              <p className="text-[14.5px] leading-[1.7] mb-2" style={{ color: "rgba(51,51,51,0.65)" }}>
                AI is excellent for speed — it gives you a provisional score within minutes of finishing
                your consultation. But exam feedback needs judgement AI can&apos;t fully replace, so every
                single consultation is reviewed by an experienced GP before your feedback is finalised.
              </p>
              {(
                [
                  { icon: SparklesIcon, title: "Instant AI Feedback", body: "A provisional score lands within minutes of finishing your consultation." },
                  { icon: StethoscopeIcon, title: "Reviewed by an Experienced GP", body: "Every single consultation is checked by a GP before it's marked final." },
                  { icon: ChatIcon, title: "Personalised Comments", body: "Feedback speaks to what actually happened in your consultation." },
                  { icon: ShieldCheckIcon, title: "Feedback You Can Trust", body: "Verified judgement, not just an algorithm's best guess." },
                ] as const
              ).map(({ icon: Icon, title, body }, i) => (
                <div
                  key={title}
                  className="flex items-start gap-4 py-4"
                  style={i > 0 ? { borderTop: "1px solid rgba(51,51,51,0.1)" } : undefined}
                >
                  <span
                    className="shrink-0 flex items-center justify-center rounded-full"
                    style={{ width: 44, height: 44, background: "white" }}
                  >
                    <Icon size={22} />
                  </span>
                  <div>
                    <h4 className="font-display font-extrabold mb-0.5 text-[15px]" style={{ color: DARK }}>{title}</h4>
                    <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(51,51,51,0.65)" }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSection testimonials={testimonials} />

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
            <h2 className="font-display font-extrabold text-[24px] leading-[1.2] mb-1" style={{ color: DARK }}>
              The Complete SCA Programme
            </h2>
            <div className="flex items-end gap-2 mb-5">
              <span className="font-extrabold leading-none" style={{ fontSize: 36, color: DARK }}>£295</span>
              <span className="text-[13px] mb-1" style={{ color: "rgba(51,51,51,0.5)" }}>one-off payment</span>
            </div>

            <ul className="flex flex-col gap-2 mb-6">
              {(
                [
                  "Access to 250+ cases",
                  "Unlimited AI review",
                  "20 GP reviews",
                  "Access lasts 4 months",
                ] as const
              ).map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[14px]" style={{ color: DARK }}>
                  <SmallCheck /> {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/register"
                className="inline-block font-bold text-[14px] px-6 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
                style={{ background: YELLOW, color: DARK }}
              >
                Register Now →
              </Link>
              <Link
                href="/recordings/sample"
                className="inline-block font-bold text-[14px] px-6 py-3 rounded-xl no-underline transition-colors"
                style={{ border: "1.5px solid rgba(51,51,51,0.2)", color: DARK }}
              >
                Show Sample Review
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT LINE */}
      <section className="px-10 pb-12 max-md:px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.45)" }}>
            Have questions?{" "}
            <Link href="/faq" className="font-semibold no-underline" style={{ color: DARK }}>
              Read our FAQ
            </Link>{" "}
            or email{" "}
            <a href="mailto:mrcgpexplained@outlook.com" className="font-semibold no-underline" style={{ color: DARK }}>
              mrcgpexplained@outlook.com
            </a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-10 py-[18px] flex items-center justify-between flex-wrap gap-2.5 max-md:px-6" style={{ background: DARK, borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>For educational purposes only. © 2026 SCA Focus.</p>
        <div className="flex gap-5">
          <Link href="/faq" className="text-[11px] no-underline" style={{ color: "rgba(255,255,255,0.40)" }}>FAQ</Link>
          <Link href="/privacy" className="text-[11px] no-underline" style={{ color: "rgba(255,255,255,0.40)" }}>Privacy</Link>
          <Link href="/terms" className="text-[11px] no-underline" style={{ color: "rgba(255,255,255,0.40)" }}>Terms</Link>
        </div>
      </footer>
    </main>
  );
}
