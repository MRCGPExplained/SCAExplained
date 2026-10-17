import { getSupabaseAdmin } from "@/lib/supabase";
import { Swash } from "./components/Swash";
import { HowItWorks } from "./components/HowItWorks";
import { CaseBankMockup } from "./components/CaseBankMockup";
import { StudyRoomMockup } from "./components/StudyRoomMockup";
import { SampleReportContent } from "./components/SampleReportContent";
import { ScaledPreview } from "./components/ScaledPreview";
import { AwardIcon } from "./components/TrustIcons";
import { TestimonialsSection } from "./components/TestimonialsSection";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

function SmallCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill={YELLOW} />
      <path d="M7.5 12.5l3 3 6-6.5" stroke={DARK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}


type Testimonial = { id: string; quote: string; name: string; vts: string | null; sca_date: string | null; photo_url: string | null; initials: string | null };

export default async function HomePage() {
  const supabaseAdmin = getSupabaseAdmin();

  // The case count is stated as "240+" here and in the terms, the FAQ, the
  // upgrade page and the Stripe charge description — one claim, in one form,
  // that stays true as cases are added. Three figures had drifted apart before
  // this: 250+ in the hero and the pricing, 256 in the case-bank card, against
  // a bank of 246, so two were wrong and one overstated what was being sold.
  // There was also a query here fetching 32 station titles for a list that no
  // longer exists; it has gone with them.

  const testimonialsResult = supabaseAdmin
    ? await supabaseAdmin
        .from("testimonials")
        .select("id, quote, name, vts, sca_date, photo_url, initials")
        .eq("published", true)
        .order("display_order", { ascending: true })
    : { data: [] };

  const testimonials = (testimonialsResult.data ?? []) as Testimonial[];

  return (
    <main style={{ background: "#FAFAF8" }}>
      {/*
        Three tones and no more: cream (the page), white, and the dark the navbar
        and footer already use. They alternate strictly — cream, white, cream,
        dark, white, cream, dark — so every section is marked off from the one
        before it without the page acquiring a palette.

        It had drifted to five: two darks that were nearly the same (#333333 at
        the top and bottom, #1F2937 in the middle) and three lights (cream,
        white, and a nine-percent yellow wash over cream). Near-misses like
        that read as carelessness rather than as design, because the eye can
        tell they differ but not why.
      */}
      {/* HERO */}
      <section className="px-10 py-16 max-md:px-6">
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
              {(["Access to 240+ cases", "Unlimited AI review", "20 GP reviews"] as const).map((item) => (
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
      <section className="px-10 py-16 max-md:px-6 flex items-center min-h-[520px]" style={{ background: "white" }}>
        <div className="w-full max-w-[1150px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display font-extrabold text-[32px] leading-[1.2] mb-5" style={{ color: DARK }}>
              Every step is designed to help you improve.
            </h2>
            <p className="text-[15.5px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.6)" }}>
              From recording your consultation to receiving expert feedback, we make SCA
              preparation simple and effective.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-4" style={{ color: "rgba(51,51,51,0.40)" }}>
              How it works
            </p>
            <HowItWorks />
          </div>
        </div>
      </section>


      {/*
        FEATURE BLOCKS. One capability per band, each with the actual interface
        beside it rather than a sentence describing it — the product is a thing
        you look at, and the page was asking people to take it on trust.

        The panels are live markup on a small rotation, not screenshots. A
        picture of a screen goes stale the first time the screen changes and
        has to be re-cut at every width; this is the same components the app
        renders, so it cannot disagree with the product and stays sharp on any
        display. The tilt is 2 degrees and no more: enough to read as an object
        sitting on the page rather than a rectangle pasted onto it, little
        enough that nobody has to read text on a slant.
      */}

      {/* CASE BANK */}
      <section className="px-10 py-16 max-md:px-6 flex items-center min-h-[520px]">
        <div className="w-full max-w-[1150px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(51,51,51,0.40)" }}>
              Case bank
            </p>
            <h2 className="font-display font-extrabold text-[32px] leading-[1.2] mb-4" style={{ color: DARK }}>
              240+ cases, written like the real thing
            </h2>
            <p className="text-[15.5px] leading-[1.7] mb-6" style={{ color: "rgba(51,51,51,0.6)" }}>
              Every station comes with the doctor&apos;s brief, the patient&apos;s story, what to gather,
              how to manage it, and a worked example of the conversation. Star the ones you want to
              come back to and keep your own notes against each.
            </p>
            <Link
              href="/case-bank/sample"
              className="inline-block font-bold text-[14px] px-6 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
              style={{ background: DARK, color: "white" }}
            >
              See a sample case →
            </Link>
          </div>
          {/* A deck, not a card. The tilt only reads as composed when there is
              something behind it for the top card to be sitting on — alone it
              reads as slipped. It also says 240+ better than the number does. */}
          <div className="relative">
            {([[-8, -18, 14, 0.5], [-5, -9, 7, 0.75]] as const).map(([deg, x, y, opacity]) => (
              <div
                key={deg}
                aria-hidden="true"
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  transform: `rotate(${deg}deg) translate(${x}px, ${y}px)`,
                  background: "white",
                  border: "1px solid rgba(31,41,55,0.10)",
                  boxShadow: "0 6px 24px rgba(31,41,55,0.07)",
                  opacity,
                }}
              />
            ))}
            <div className="relative" style={{ transform: "rotate(-2deg)" }}>
              <CaseBankMockup />
            </div>
          </div>
        </div>
      </section>

      {/* STUDY ROOM */}
      <section className="px-10 py-16 max-md:px-6 flex items-center min-h-[520px]" style={{ background: DARK }}>
        <div className="w-full max-w-[1150px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="lg:order-2">
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
              Study room
            </p>
            <h2 className="font-display font-extrabold text-[32px] leading-[1.2] mb-4" style={{ color: "white" }}>
              Practise with a partner, in the browser
            </h2>
            <p className="text-[15.5px] leading-[1.7] mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
              Share a code and you are in the same room. Three minutes to read the case, then the
              voice call connects and the consultation records itself — twelve minutes, the same as
              the exam. Nothing to install, no Zoom, no third-party software.
            </p>
            <Link
              href="/register"
              className="inline-block font-bold text-[14px] px-6 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
              style={{ background: YELLOW, color: DARK }}
            >
              Register Now →
            </Link>
          </div>
          <div className="lg:order-1 max-w-[420px] w-full mx-auto">
            <StudyRoomMockup />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSection testimonials={testimonials} />

      {/* PRICING */}
      <section className="px-10 pt-16 pb-10 max-md:px-6" style={{ background: DARK }}>
        <div className="max-w-[900px] mx-auto">
          <div
            className="relative rounded-2xl p-8 bg-white"
            style={{ border: "1.5px solid rgba(246,212,75,0.55)" }}
          >
            <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(51,51,51,0.40)" }}>Pricing</p>
            <h2 className="font-display font-extrabold text-[32px] leading-[1.2] mb-1" style={{ color: DARK }}>
              The complete SCA programme
            </h2>
            <div className="flex items-end gap-2 mb-5">
              <span className="font-extrabold leading-none" style={{ fontSize: 36, color: DARK }}>£295</span>
              <span className="text-[13px] mb-1" style={{ color: "rgba(51,51,51,0.5)" }}>one-off payment</span>
            </div>

            <ul className="flex flex-col gap-2 mb-6">
              {(
                [
                  "Access to 240+ cases",
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

      {/* CONTACT LINE — rides the same dark band as the price rather than
          sitting on a 67px strip of cream between it and the dark footer,
          which read as a gap rather than a section. */}
      <section className="px-10 pb-16 max-md:px-6" style={{ background: DARK }}>
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            Have questions?{" "}
            <Link href="/faq" className="font-semibold no-underline" style={{ color: "white" }}>
              Read our FAQ
            </Link>{" "}
            or email{" "}
            <a href="mailto:mrcgpexplained@outlook.com" className="font-semibold no-underline" style={{ color: "white" }}>
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
