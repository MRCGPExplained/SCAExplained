import { getSupabaseAdmin } from "@/lib/supabase";
import { Swash } from "./components/Swash";
import { HowItWorks } from "./components/HowItWorks";
import { PlanCards } from "./components/PlanCards";
import { CaseBankMockup } from "./components/CaseBankMockup";
import { SampleReportContent } from "./components/SampleReportContent";
import { ScaledPreview } from "./components/ScaledPreview";
import { AwardIcon } from "./components/TrustIcons";
import { TestimonialsSection } from "./components/TestimonialsSection";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

// The alternate band tone: the page's own yellow laid over the cream at
// eighteen percent. A nine percent wash was tried here before and taken out
// for being a near-miss — far enough from cream that the eye could tell, not
// far enough that it could tell why. White replaced it and had the opposite
// problem: #FAFAF8 against #FFFFFF is five points in one channel, so the
// bands it was meant to separate read as one unbroken slab. This is a tone
// you can actually see, and still quiet enough to sit under body copy.
const WASH = "#F9F3D9";

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
        Three tones and no more: the yellow wash, cream (the page), and the
        dark the footer uses. The five light bands alternate strictly —
        wash, cream, wash, cream, wash — so every section is marked off
        from the one before it without the page acquiring a palette.

        An odd number of light bands means the two ends share a tone, and
        there are only two ways to seat it. This one puts the wash on the
        hero, How It Works and the price, with the case bank and the
        testimonials on cream; the other starts on cream and lands the wash
        on the case bank and the testimonials instead. Either alternates
        strictly — the choice is only which three sections carry yellow.

        The light pair used to be cream and white, which is five points in a
        single channel: invisible on most screens, at most angles. The hero,
        the case bank and How It Works read as one pale slab seventeen
        hundred pixels tall, and then everything below it went dark at once.
        Two blocks, no rhythm. No dividers were added for it — a hairline
        between two tones that are already indistinguishable patches over the
        symptom, and the tones were the symptom.
      */}
      {/* HERO */}
      <section className="px-10 py-16 max-md:px-6" style={{ background: WASH }}>
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
              {(["Access to 240+ cases", "AI feedback in minutes", "GP Reviews available on request"] as const).map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-[13.5px] font-semibold" style={{ color: DARK }}>
                  <SmallCheck /> {item}
                </span>
              ))}
            </div>

            <p className="text-[16px] leading-[1.7] mb-7" style={{ color: "rgba(51,51,51,0.65)" }}>
              Passing the SCA isn&apos;t just about knowing more medicine. It&apos;s about demonstrating
              the consultation skills RCGP examiners assess: exploring and addressing ICE, shared
              decision-making, managing uncertainty and responding to patient emotion. Record as
              often as you like, get a consultation marked by AI in minutes, and send the ones that
              matter to an experienced GP for clear, personalised feedback on what you actually did,
              so you know what to improve before exam day.
            </p>

            <div className="flex items-center gap-3 flex-wrap mb-7">
              <Link
                href="/register"
                className="inline-block font-bold text-[15px] px-7 py-3.5 rounded-xl no-underline transition-opacity hover:opacity-90"
                style={{ background: YELLOW, color: DARK }}
              >
                Register Now →
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

      {/*
        CASE BANK, and the first band after the hero. The cases are the
        thing people came to see — the four-step explanation of what
        happens to a recording only matters once you believe there is
        something worth recording against, so it follows rather than leads.

        No eyebrow. "Case bank" above a heading that already says "cases"
        is the same noun twice in two lines. The eyebrows elsewhere survive
        that test, because those headings never name the feature.
      */}
      <section className="px-10 py-16 max-md:px-6 flex items-center min-h-[520px]">
        <div className="w-full max-w-[1150px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display font-extrabold text-[32px] leading-[1.2] mb-4" style={{ color: DARK }}>
              240+ cases, written like the real thing
            </h2>
            {/*
              No button. It pointed at /case-bank/sample, and so did the
              hero's "See Demo Case": the same destination offered twice on
              one screen. Both are gone now and the panel itself is the way
              in, which is a better invitation to open a case than either
              of them was.
            */}
            <p className="text-[15.5px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.6)" }}>
              Every station comes with the doctor&apos;s brief, the patient&apos;s story, what to gather,
              how to manage it, and a worked example of the conversation. Star the ones you want to
              come back to and keep your own notes against each.
            </p>
          </div>
          {/*
            A deck, not a card: it says 240+ better than the number does.

            The top sheet is square and only the ones under it are askew.
            All three used to lean the same way, -8, -5 and -2, which is a
            fan — and a fan reads as one slab rotated rather than as loose
            sheets. Squaring the top gets more apparent depth out of less
            rotation, and it matters more now that this panel carries the
            group's names at 9.5px, which is exactly the size that stops
            being readable on a slant. It is also the only tilt left on the
            page since the study room band went, and a lone tilted panel is
            one judgement away from looking crooked rather than composed.
          */}
          <div className="relative">
            {([[-7, -17, 13, 0.5], [-3.5, -8, 6, 0.75]] as const).map(([deg, x, y, opacity]) => (
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
            {/* The panel is the door to a sample case now that the hero's
                "See Demo Case" button has gone. Showing a case is a better
                invitation to open one than the words were. */}
            <Link
              href="/case-bank/sample"
              aria-label="Open a sample case"
              className="relative block no-underline transition-transform duration-200 hover:-translate-y-1"
            >
              <CaseBankMockup />
            </Link>
          </div>
        </div>
      </section>

      {/*
        HOW IT WORKS. The band is the component now — the large active
        step takes the left column where a heading and a sentence
        restating that heading used to sit, and the heading moved to the
        top of the right column in place of the "How it works" eyebrow.
      */}
      <section className="px-10 py-16 max-md:px-6 flex items-center min-h-[520px]" style={{ background: WASH }}>
        <div className="w-full max-w-[1150px] mx-auto">
          <HowItWorks />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSection testimonials={testimonials} />

      {/*
        PRICING. Three plans rather than one, sold here rather than on a
        page of their own: this is where people already are by the time
        they want the number, and a separate page is a second place to
        keep correct.

        They differ by GP reviews, nought, five and twenty, which is the
        scarce thing and what each step up actually sells. Differing only
        by how much AI marking you get would have been a quantity of the
        cheap, abundant thing, and an invitation to do the arithmetic and
        take the cheaper one.
      */}
      <section id="pricing" className="px-10 pt-16 pb-10 max-md:px-6" style={{ background: WASH }}>
        <div className="max-w-[1150px] mx-auto">
          <div className="text-center max-w-[620px] mx-auto mb-10">
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(51,51,51,0.40)" }}>
              Pricing
            </p>
            <h2 className="font-display font-extrabold text-[32px] leading-[1.2] mb-4 max-sm:text-[26px]" style={{ color: DARK }}>
              Every plan has the whole case bank.
            </h2>
            <p className="text-[15.5px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.6)" }}>
              240+ cases, study groups, and unlimited recording on all three. What changes is how
              much marking you get, and how much of it is read by a GP.
            </p>
          </div>

          <PlanCards />

          <p className="text-center text-[13px] mt-9" style={{ color: "rgba(51,51,51,0.5)" }}>
            Recording and transcription are unlimited on every plan and never cost a credit. You
            choose which consultations are worth marking once you have seen how they went.{" "}
            <Link href="/recordings/sample" className="font-semibold no-underline" style={{ color: DARK }}>
              See a sample report
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CONTACT LINE — rides the same band as the price rather than
          sitting on a 67px strip of its own between it and the footer,
          which read as a gap rather than a section. */}
      <section className="px-10 pb-16 max-md:px-6" style={{ background: WASH }}>
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.55)" }}>
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
