import { getUpcomingEvents } from "@/lib/events";
import { Swash } from "./components/Swash";
import { Button } from "./components/Button";
import { DateList } from "./components/DateList";

// Re-fetch on each request so availability and date lists stay current.
export const dynamic = "force-dynamic";

const FEATURES = [
  {
    emoji: "🎯",
    title: "How To Get A Clear Pass",
    desc: "Our free training on exactly what examiners are scoring — structure, ICE, safety-netting, and the pitfalls that cost marks.",
  },
  {
    emoji: "🩺",
    title: "SCA Intensive",
    desc: "A small-group live workshop. Two active candidates each complete three realistic consultations, with observer places available.",
  },
  {
    emoji: "📊",
    title: "Score Prediction",
    desc: "After each consultation, get a realistic sense of where you’d score against the examiner’s criteria — not just generic feedback.",
  },
  {
    emoji: "📈",
    title: "An Individual Improvement Plan",
    desc: "Leave the Intensive with a clear, personalised plan for what to work on before exam day.",
  },
];

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

            <div className="flex gap-3 flex-wrap">
              <Button href="#webinar-dates" variant="primary">
                Book How To Get A Clear Pass (Free)
              </Button>
              <Button href="#intensive-dates" variant="yellow">
                Book the SCA Intensive
              </Button>
            </div>
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

      {/* BOOKING */}
      <section id="booking" className="px-10 pb-20 max-md:px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-display font-extrabold text-[28px] text-navy text-center mb-11">
            Choose How You Want to Start
          </h2>

          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
            {/* Free webinar card */}
            <div className="bg-navy rounded-2xl px-7 py-8 flex flex-col">
              <span className="self-start bg-yellow text-navy text-[11px] font-bold tracking-[0.06em] uppercase px-2.5 py-[5px] rounded-md mb-4">
                Free
              </span>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                How To Get A Clear Pass
              </h3>
              <p className="text-[13.5px] leading-[1.65] text-white/70 mb-5 grow">
                A 90–120 minute online training covering how the SCA is marked,
                common reasons candidates fail, consultation structure, time
                management, ICE, safety-netting and examiner expectations.
              </p>
              <Button
                href="#webinar-dates"
                variant="yellow"
                className="self-start"
              >
                Book How To Get A Clear Pass (Free)
              </Button>
            </div>

            {/* Intensive card */}
            <div className="bg-navy rounded-2xl px-7 py-8 flex flex-col">
              <div className="flex gap-2 mb-4">
                <span className="bg-white/15 text-white text-[11px] font-bold tracking-[0.06em] uppercase px-2.5 py-[5px] rounded-md">
                  Active £200
                </span>
                <span className="bg-white/15 text-white text-[11px] font-bold tracking-[0.06em] uppercase px-2.5 py-[5px] rounded-md">
                  Observer £50
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                SCA Intensive
              </h3>
              <p className="text-[13.5px] leading-[1.65] text-white/70 mb-5 grow">
                A small-group live workshop. Maximum two active candidates each
                complete three realistic consultations with personalised,
                examiner-style feedback. Observer places available.
              </p>
              <Button
                href="#intensive-dates"
                variant="yellow"
                className="self-start"
              >
                Book the SCA Intensive
              </Button>
            </div>
          </div>

          {/* Webinar dates */}
          <div id="webinar-dates" className="mt-8">
            <p className="text-[13px] font-bold text-navy tracking-[0.04em] uppercase mb-3.5">
              Upcoming How To Get A Clear Pass Dates
            </p>
            <DateList events={webinarEvents} rowTitle="How To Get A Clear Pass" />
          </div>

          {/* Intensive dates */}
          <div id="intensive-dates" className="mt-8">
            <p className="text-[13px] font-bold text-navy tracking-[0.04em] uppercase mb-3.5">
              Upcoming SCA Intensive Dates
            </p>
            <DateList events={intensiveEvents} rowTitle="SCA Intensive" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-lilac px-10 py-[72px] border-y border-navy/[0.08] max-md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-display font-extrabold text-[30px] text-navy text-center mb-2.5 leading-[1.3]">
            Practice Does Not Make Perfect. Practice Makes Habit.
          </h2>
          <p className="text-center text-[17px] font-bold text-navy mb-3.5">
            Develop <Swash>Good</Swash> Habits.
          </p>
          <p className="text-center text-[15px] text-navy/60 max-w-[560px] mx-auto mb-[52px]">
            Real practice, real feedback, and a clear plan for what to improve
            before exam day.
          </p>
          <div className="grid grid-cols-4 gap-[18px] max-lg:grid-cols-2 max-[480px]:grid-cols-1">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 border border-navy/10 bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(26,27,82,0.10)]"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] mb-4 bg-yellow">
                  {f.emoji}
                </div>
                <p className="text-[13.5px] font-bold text-navy mb-2 leading-[1.3]">
                  {f.title}
                </p>
                <p className="text-[12.5px] leading-[1.6] text-navy/65">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING STRIP */}
      <section className="bg-navy px-10 py-[22px] flex items-center justify-center gap-5 flex-wrap max-md:px-6">
        <span className="text-sm text-white/85 font-medium">
          Ready to find out where you stand?
        </span>
        <div className="flex gap-2.5 flex-wrap">
          <Button
            href="#webinar-dates"
            variant="whiteOutline"
            className="!px-[18px] !py-[9px] !text-[13px]"
          >
            Book How To Get A Clear Pass (Free)
          </Button>
          <Button
            href="#intensive-dates"
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
          <a href="#webinar-dates" className="text-xs text-white/50 no-underline">
            Free Webinar
          </a>
          <a href="#intensive-dates" className="text-xs text-white/50 no-underline">
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
