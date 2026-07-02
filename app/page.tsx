import { getUpcomingEvents } from "@/lib/events";
import { Swash } from "./components/Swash";
import { DateList } from "./components/DateList";
import Link from "next/link";

export const dynamic = "force-dynamic";

const NAVY = "#1A1B52";
const YELLOW = "#F6D44B";

function PriceCard({
  label,
  title,
  subtitle,
  price,
  saving,
  features,
  cta,
  href,
  highlight,
}: {
  label: string;
  title: string;
  subtitle: string;
  price: string;
  saving?: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: highlight ? NAVY : "white",
        border: highlight ? "none" : "1px solid rgba(26,27,82,0.10)",
        boxShadow: highlight
          ? "0 8px 32px rgba(26,27,82,0.22)"
          : "0 2px 12px rgba(26,27,82,0.06)",
      }}
    >
      <div className="px-7 pt-7 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full"
            style={{
              background: highlight ? YELLOW : "rgba(26,27,82,0.07)",
              color: highlight ? NAVY : "rgba(26,27,82,0.55)",
            }}
          >
            {label}
          </span>
          {saving && (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: YELLOW, color: NAVY }}
            >
              {saving}
            </span>
          )}
        </div>

        <h3
          className="font-display font-extrabold text-[20px] mb-1"
          style={{ color: highlight ? "white" : NAVY }}
        >
          {title}
        </h3>
        <p
          className="text-[13.5px] leading-[1.65] mb-4"
          style={{ color: highlight ? "rgba(255,255,255,0.55)" : "rgba(26,27,82,0.58)" }}
        >
          {subtitle}
        </p>

        <div className="flex items-baseline gap-2 mb-5">
          <span
            className="font-display font-extrabold text-[30px]"
            style={{ color: highlight ? YELLOW : NAVY }}
          >
            {price}
          </span>
          {saving && (
            <span
              className="text-[13px] line-through"
              style={{ color: highlight ? "rgba(255,255,255,0.3)" : "rgba(26,27,82,0.3)" }}
            >
              £60
            </span>
          )}
        </div>

        <ul className="flex flex-col gap-2 mb-6">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <span
                className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5"
                style={{
                  background: highlight ? "rgba(246,212,75,0.2)" : "rgba(26,27,82,0.08)",
                  color: highlight ? YELLOW : NAVY,
                }}
              >
                ✓
              </span>
              <span
                className="text-[13px] leading-snug"
                style={{ color: highlight ? "rgba(255,255,255,0.65)" : "rgba(26,27,82,0.70)" }}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-7 pb-7 mt-auto">
        <Link
          href={href}
          className="block w-full text-center rounded-xl py-3 font-display font-bold text-[14px] no-underline transition-opacity hover:opacity-90"
          style={{
            background: highlight ? YELLOW : NAVY,
            color: highlight ? NAVY : "white",
          }}
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const webinarEvents = await getUpcomingEvents("webinar");

  return (
    <main className="bg-cream">
      {/* HERO */}
      <section className="px-10 pt-8 pb-20 max-md:px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 gap-[52px] items-center max-md:grid-cols-1">
          <div className="min-w-0">
            <h1 className="font-display text-navy mb-[26px]">
              <span className="block font-extrabold text-[46px] leading-[1.14] max-sm:text-[34px]">
                Perform Your Best On SCA.
              </span>
              <span className="block font-bold text-[30px] leading-[1.25] max-sm:text-[22px]">
                Know Exactly What <Swash>Scores Marks</Swash>
              </span>
            </h1>

            <p className="text-[15.5px] leading-[1.7] text-navy/[0.68] mb-4">
              Getting a Clear Pass isn&apos;t about knowing more medicine. It&apos;s about
              demonstrating a specific set of consultation skills, naturally under
              exam conditions. Exploring a patient&apos;s ICE without it feeling like a
              checklist. Sitting with diagnostic uncertainty and committing to a plan
              anyway. Handling patient emotion without losing structure. Building a
              shared management plan the patient actually buys into. These are the
              skills RCGP examiners are scoring. That&apos;s exactly what scores marks.
              And it&apos;s exactly what we teach.
            </p>

            <p className="text-[15.5px] leading-[1.7] text-navy/[0.68] mb-[34px]">
              Start with{" "}
              <a
                href="#webinar"
                className="font-bold text-navy no-underline border-b-2 border-yellow"
              >
                How To Get A Clear Pass
              </a>
              , our free 2-hour training: the top tips you need, straight from
              someone who knows what examiners are looking for.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(26,27,82,0.18)] aspect-[4/3] bg-navy relative min-w-0 flex items-center justify-center max-md:hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(135deg, rgba(246,212,75,0.06) 0px, rgba(246,212,75,0.06) 2px, transparent 2px, transparent 18px)",
              }}
            />
            <span className="relative text-white/50 text-[13px] font-semibold tracking-[0.04em]">
              GP consultation photo — placeholder
            </span>
          </div>
        </div>
      </section>

      {/* FREE WEBINAR */}
      <section id="webinar" className="px-10 pb-16 max-md:px-6">
        <div className="max-w-[860px] mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full"
              style={{ background: "rgba(26,27,82,0.07)", color: "rgba(26,27,82,0.55)" }}
            >
              Free — Layer 1
            </span>
            <h2 className="font-display font-extrabold text-[22px] text-navy">
              How To Get A Clear Pass
            </h2>
          </div>

          <div
            className="rounded-2xl border border-navy/10 bg-white px-7 py-7"
          >
            <p className="text-[14.5px] leading-[1.7] text-navy/65 mb-4 max-w-[640px]">
              This webinar is built around one question: what are RCGP examiners
              actually scoring when they watch a consultation? Most candidates assume
              it&apos;s clinical knowledge. It isn&apos;t. There is a specific set of consultation
              skills the SCA is designed to assess — and a large number of well-prepared
              candidates fall short not because they don&apos;t know the medicine, but because
              they don&apos;t know what they&apos;re being scored on.
            </p>
            <p className="text-[14.5px] leading-[1.7] text-navy/65 mb-6 max-w-[640px]">
              We go through each of these skills in detail: how to explore ICE naturally,
              how to handle uncertainty without losing the patient&apos;s confidence, how to
              structure a management plan the patient actually agrees with. You&apos;ll leave
              knowing exactly what examiners are looking for and precisely what to work on
              before exam day.
            </p>
            <p className="text-[12px] font-bold tracking-[0.06em] uppercase text-navy/40 mb-3">
              Upcoming dates
            </p>
            <DateList events={webinarEvents} rowTitle="How To Get A Clear Pass" />
          </div>
        </div>
      </section>

      {/* PAID PRODUCTS */}
      <section className="px-10 pb-20 max-md:px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-navy/40 mb-2">
              Go deeper
            </p>
            <h2 className="font-display font-extrabold text-[26px] text-navy">
              The SCA Explained preparation pathway
            </h2>
            <p className="text-[14px] text-navy/55 mt-2 max-w-[520px] mx-auto leading-[1.65]">
              The webinar orients you. The course teaches you. The case bank develops you.
              Use them in order.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
            <PriceCard
              label="Layer 2 — £30"
              title="The SCA Video Course"
              subtitle="System by system. Built on the same framework as the free webinar — but going deeper into every clinical area examiners test."
              price="£30"
              features={[
                "System-by-system video teaching",
                "Every clinical area examiners test",
                "Watch at your own pace",
                "90-day access",
              ]}
              cta="Buy the Video Course"
              href="/video-course/purchase"
            />

            <PriceCard
              label="Layer 3 — £30"
              title="The SCA Case Bank"
              subtitle="246 realistic SCA stations. Practice what you have learned, in a shared study room, at your own pace."
              price="£30"
              features={[
                "246 fully-structured practice stations",
                "Real-time study rooms",
                "Personal notes and starred stations",
                "90-day access",
              ]}
              cta="Buy the Case Bank"
              href="/case-bank/purchase"
            />

            <PriceCard
              label="Bundle"
              title="Video Course + Case Bank"
              subtitle="The complete SCA Explained preparation package. Everything you need from first lesson to final practice station."
              price="£50"
              saving="Save £10"
              features={[
                "Full video course access",
                "All 246 case bank stations",
                "Study rooms, notes, stars",
                "90-day access to both",
              ]}
              cta="Buy the Bundle"
              href="/bundle/purchase"
              highlight
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy border-t border-white/[0.08] px-10 py-[18px] flex items-center justify-between flex-wrap gap-2.5 max-md:px-6">
        <p className="text-xs text-white/40">
          For educational purposes only. © 2026 SCA Explained.
        </p>
        <div className="flex gap-5 flex-wrap">
          <a href="#webinar" className="text-xs text-white/50 no-underline">Free Webinar</a>
          <Link href="/video-course/purchase" className="text-xs text-white/50 no-underline">Video Course</Link>
          <Link href="/case-bank/purchase" className="text-xs text-white/50 no-underline">Case Bank</Link>
          <Link href="/bundle/purchase" className="text-xs text-white/50 no-underline">Bundle</Link>
          <Link href="/about" className="text-xs text-white/50 no-underline">About</Link>
          <a href="/faq" className="text-xs text-white/50 no-underline">FAQ</a>
          <a href="/privacy" className="text-[11px] text-white/30 no-underline">Privacy</a>
          <a href="/terms" className="text-[11px] text-white/30 no-underline">Terms</a>
        </div>
      </footer>
    </main>
  );
}
