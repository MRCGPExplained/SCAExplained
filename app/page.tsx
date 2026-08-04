import { Fragment } from "react";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Swash } from "./components/Swash";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

function WebinarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="14" height="14" rx="2.5" stroke={DARK} strokeWidth="1.6"/>
      <path d="M16 10l5.5-3.2v10.4L16 14" stroke={DARK} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
}

function CaseBankIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2.5" stroke={DARK} strokeWidth="1.6"/>
      <path d="M8 8h8M8 12h8M8 16h5" stroke={DARK} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="2" width="8" height="13" rx="4" stroke={DARK} strokeWidth="1.6"/>
      <path d="M5 11a7 7 0 0 0 14 0" stroke={DARK} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="12" y1="18" x2="12" y2="22" stroke={DARK} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="9" y1="22" x2="15" y2="22" stroke={DARK} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}


export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  const supabaseAdmin = getSupabaseAdmin();

  const [sessionsResult, stationsResult] = await Promise.all([
    supabaseAdmin
      ? supabaseAdmin
          .from("live_sessions")
          .select("id, scheduled_at, zoom_url, is_free")
          .gte("scheduled_at", new Date().toISOString())
          .order("scheduled_at", { ascending: true })
      : Promise.resolve({ data: [] }),
    supabaseAdmin
      ? supabaseAdmin
          .from("stations")
          .select("title")
          .eq("published", true)
          .order("number", { ascending: true })
          .limit(32)
      : Promise.resolve({ data: [] }),
  ]);

  const sessions = ((sessionsResult.data ?? []) as { id: string; scheduled_at: string; zoom_url: string; is_free: boolean }[]);
  const freeWebinars = sessions.filter((s) => s.is_free);
  const stationTitles = ((stationsResult.data ?? []) as { title: string }[]).map((s) => s.title);

  return (
    <main style={{ background: "#FAFAF8" }}>
      {/* HERO */}
      <section className="px-10 pt-10 pb-10 max-md:px-6">
        <div className="max-w-[900px] mx-auto">
          <h1 className="font-display mb-[22px]" style={{ color: DARK }}>
            <span className="block whitespace-nowrap font-extrabold text-[40px] leading-[1.2] max-sm:whitespace-normal max-sm:text-[26px]">
              Every Consultation Reviewed By A GP<span style={{ color: YELLOW }}>.</span>
            </span>
            <span className="block font-bold text-[26px] leading-[1.3] mt-2 max-sm:text-[19px]">
              Perform Your Best On SCA.
            </span>
            <span className="block font-bold text-[26px] leading-[1.3] max-sm:text-[19px]">
              Know Exactly What <Swash>Scores Marks</Swash>
            </span>
          </h1>
          <p className="text-[15.5px] leading-[1.7] mb-6 max-w-[720px]" style={{ color: "rgba(51,51,51,0.68)" }}>
            Getting a Clear Pass isn&apos;t about knowing more medicine. It&apos;s about demonstrating
            a specific set of consultation skills naturally under exam conditions — ICE, shared
            decision-making, sitting with uncertainty, handling patient emotion. These are the skills
            RCGP examiners score. That&apos;s exactly what we teach.
          </p>

        </div>
      </section>

      {/* CARDS */}
      <section className="px-10 pb-16 pt-6 max-md:px-6">
        <div className="max-w-[720px] mx-auto flex flex-col gap-5">

          <h2 className="font-display font-extrabold text-[22px]" style={{ color: DARK }}>
            What We Offer
          </h2>

          {/* FREE WEBINAR — primary */}
          <div
            className="relative rounded-2xl p-8 bg-white hover:bg-[#FFFBEA] transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            style={{ border: "1.5px solid rgba(246,212,75,0.55)" }}
          >
            <span
              className="absolute top-5 right-5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "#F6D44B", color: DARK }}
            >
              Free
            </span>
            <div className="flex items-center gap-2 mb-2">
              <WebinarIcon />
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(51,51,51,0.40)" }}>Monthly Webinar</p>
            </div>
            <h2 className="font-display font-extrabold text-[28px] leading-[1.2] mb-3" style={{ color: DARK }}>
              How To Pass Your SCA — Monthly Webinar
            </h2>
            <p className="text-[14.5px] leading-[1.7] mb-5" style={{ color: "rgba(51,51,51,0.65)" }}>
              A free 1-hour Zoom session every month. Learn what the RCGP
              examiners are actually scoring, how high-performing candidates think through cases, and
              the consultation habits that earn you a Clear Pass. Attendees receive
              a code for 2 free review credits.
            </p>

            {freeWebinars.length > 0 ? (
              <div className="pt-4" style={{ borderTop: "1px solid rgba(51,51,51,0.08)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: "rgba(51,51,51,0.40)" }}>
                  Upcoming Dates
                </p>
                <div
                  className="grid gap-x-3 gap-y-2 text-[13.5px] max-sm:grid-cols-1"
                  style={{ gridTemplateColumns: "auto auto 1fr" }}
                >
                  {freeWebinars.map((s) => (
                    <Fragment key={s.id}>
                      <span style={{ color: DARK, fontWeight: 600 }}>
                        {new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/London" }).format(new Date(s.scheduled_at))}
                      </span>
                      <span style={{ color: "rgba(51,51,51,0.45)" }}>
                        {new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }).format(new Date(s.scheduled_at))}
                      </span>
                      <a
                        href={s.zoom_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold no-underline hover:underline justify-self-start"
                        style={{ color: DARK }}
                      >
                        Register free →
                      </a>
                    </Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[14px] font-semibold pt-4" style={{ color: "rgba(51,51,51,0.45)", borderTop: "1px solid rgba(51,51,51,0.08)" }}>
                Next date coming soon — check back shortly.
              </p>
            )}
          </div>

          {/* CASE BANK */}
          <div
            className="relative rounded-2xl p-8 bg-white hover:bg-[#FFFBEA] transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            style={{ border: "1.5px solid rgba(246,212,75,0.55)" }}
          >
            <span
              className="absolute top-5 right-5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "#F6D44B", color: DARK }}
            >
              Free
            </span>
            <div className="flex items-center gap-2 mb-2">
              <CaseBankIcon />
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(51,51,51,0.40)" }}>Case Bank · 250+ cases</p>
            </div>
            <h2 className="font-display font-extrabold text-[24px] leading-[1.2] mb-3" style={{ color: DARK }}>
              SCA Case Bank
            </h2>
            <p className="text-[14.5px] leading-[1.7] mb-5" style={{ color: "rgba(51,51,51,0.65)" }}>
              Over 250 exam-style cases built to simulate the SCA examination.
              Each station includes a full case sheet, data-gathering guidance, management points
              and an example explanation to practise and learn effectively. Simply create an account
              to access the full bank for free.
            </p>


            <div className="flex items-center gap-3 flex-wrap">
              {user ? (
                <Link
                  href="/case-bank"
                  className="inline-block font-bold text-[14px] px-6 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
                  style={{ background: "rgba(51,51,51,0.07)", color: DARK }}
                >
                  Open Case Bank →
                </Link>
              ) : (
                <Link
                  href="/case-bank/sample"
                  className="inline-block font-bold text-[14px] px-6 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
                  style={{ background: "rgba(51,51,51,0.07)", color: DARK }}
                >
                  Show Sample Case →
                </Link>
              )}
            </div>
          </div>

          {/* EXAMINER MARKING */}
          <div
            className="relative rounded-2xl p-8 bg-white hover:bg-[#FFFBEA] transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            style={{ border: "1.5px solid rgba(246,212,75,0.55)" }}
          >
            <span
              className="absolute top-5 right-5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "#3B82F6", color: "white" }}
            >
              Paid
            </span>
            <div className="flex items-center gap-2 mb-2">
              <MicIcon />
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(51,51,51,0.40)" }}>GP Marking</p>
            </div>
            <h2 className="font-display font-extrabold text-[24px] leading-[1.2] mb-2" style={{ color: DARK }}>
              Real Feedback From a GP
            </h2>
            <p className="text-[15px] font-bold leading-[1.4] mb-3" style={{ color: DARK }}>
              Every consultation is reviewed by a GP examiner.
            </p>
            <p className="text-[14.5px] leading-[1.7] mb-5" style={{ color: "rgba(51,51,51,0.65)" }}>
              Record a consultation with a partner and get it marked the same way RCGP examiners
              mark in the real exam, graded across Data Gathering, Clinical Management, and Relating
              to Others, with written feedback and voice notes from a qualified GP.
            </p>

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
                  View My Recordings →
                </Link>
              ) : (
                <Link
                  href="/recordings/sample"
                  className="inline-block font-bold text-[14px] px-6 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
                  style={{ background: "rgba(51,51,51,0.07)", color: DARK }}
                >
                  Show Sample Report →
                </Link>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* CONTACT LINE */}
      <section className="px-10 pb-12 max-md:px-6">
        <div className="max-w-[720px] mx-auto text-center">
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
