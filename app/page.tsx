import { getUpcomingEvents } from "@/lib/events";
import { Swash } from "./components/Swash";
import { Button } from "./components/Button";
import { BookingAccordion } from "./components/BookingAccordion";

// Re-fetch on each request so availability and date lists stay current.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // One shared query feeds both lists — no risk of drift between them.
  const [webinarEvents, intensiveEvents] = await Promise.all([
    getUpcomingEvents("webinar"),
    getUpcomingEvents("intensive"),
  ]);

  return (
    <main className="bg-cream">
      {/* HERO */}
      <section className="px-10 pt-16 pb-20 max-md:px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 gap-[52px] items-center max-md:grid-cols-1">
          <div className="min-w-0">
            <div className="mb-5">
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-navy/55">
                Learning Designed for GP Trainees
              </span>
            </div>

            <h1 className="font-display font-extrabold text-[46px] leading-[1.14] text-navy mb-[26px] max-sm:text-[34px]">
              Stop Guessing What <Swash>Scores Marks.</Swash>
            </h1>

            <p className="text-[15.5px] leading-[1.7] text-navy/[0.68] mb-[34px]">
              Being a top SCA candidate is not about knowing more medicine; it&apos;s
              about knowing how to demonstrate a specific set of skills RCGP
              examiners are looking for. Skills which include handling patient
              expectations and emotion, exploring a patient&apos;s circumstances, ideas,
              concerns and expectations naturally, navigating the dilemmas thrown at
              you and committing to appropriate plans even when there&apos;s diagnostic
              uncertainty. These are exactly the skills we cover at SCA Explained.
              Start with{" "}
              <a
                href="#webinar-dates"
                className="font-bold text-navy no-underline border-b-2 border-yellow"
              >
                How To Get A Clear Pass
              </a>
              , our 2-hour free training, where we cover the top tips you need to
              secure your SCA pass.
            </p>

          </div>

          {/* Hero image — placeholder. Replace with a properly licensed
              GP/consultation photo before launch. */}
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

      {/* BOOKING ACCORDION */}
      <section id="booking" className="px-10 pb-20 max-md:px-6">
        <h2 className="font-display font-extrabold text-[28px] text-navy text-center mb-8 max-w-[1000px] mx-auto">
          Choose How You Want to Start
        </h2>
        <BookingAccordion
          webinarEvents={webinarEvents}
          intensiveEvents={intensiveEvents}
        />
      </section>

      {/* CLOSING STRIP */}
      <section className="bg-navy px-10 py-[22px] flex items-center justify-center gap-5 flex-wrap max-md:px-6">
        <span className="text-sm text-white/85 font-medium">
          Ready to find out where you stand?
        </span>
        <div className="flex gap-2.5 flex-wrap">
          <Button
            href="#booking"
            variant="whiteOutline"
            className="!px-[18px] !py-[9px] !text-[13px]"
          >
            Book How To Get A Clear Pass (Free)
          </Button>
          <Button
            href="#booking"
            variant="yellow"
            className="!px-[18px] !py-2 !text-[13px]"
          >
            Book the SCA Intensive
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy border-t border-white/[0.08] px-10 py-[18px] flex items-center justify-between flex-wrap gap-2.5 max-md:px-6">
        <p className="text-xs text-white/40">
          For educational purposes only. © 2026 SCA Explained.
        </p>
        <div className="flex gap-5 flex-wrap">
          <a href="#booking" className="text-xs text-white/50 no-underline">
            Free Webinar
          </a>
          <a href="#booking" className="text-xs text-white/50 no-underline">
            SCA Intensive
          </a>
          <a href="/faq" className="text-xs text-white/50 no-underline">
            FAQ
          </a>
          <a href="/privacy" className="text-[11px] text-white/30 no-underline">
            Privacy
          </a>
          <a href="/terms" className="text-[11px] text-white/30 no-underline">
            Terms
          </a>
        </div>
      </footer>
    </main>
  );
}
