import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Swash } from "./components/Swash";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Europe/London",
  }).format(new Date(iso));
}

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

function LiveIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 3.5A1.5 1.5 0 013.5 2h13A1.5 1.5 0 0118 3.5v9A1.5 1.5 0 0116.5 14H7l-5 4V3.5z" stroke={DARK} strokeWidth="1.5" strokeLinejoin="round"/>
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
  const paidSessions = sessions.filter((s) => !s.is_free);
  const stationTitles = ((stationsResult.data ?? []) as { title: string }[]).map((s) => s.title);

  return (
    <main style={{ background: "#FAFAF8" }}>
      {/* HERO */}
      <section className="px-10 pt-10 pb-10 max-md:px-6">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-display mb-[22px]" style={{ color: DARK }}>
            <span className="block font-extrabold text-[46px] leading-[1.14] max-sm:text-[34px]">
              Perform Your Best On SCA<span style={{ color: YELLOW }}>.</span>
            </span>
            <span className="block font-bold text-[30px] leading-[1.25] max-sm:text-[22px]">
              Know Exactly What <Swash>Scores Marks</Swash>
            </span>
          </h1>
          <p className="text-[15.5px] leading-[1.7] mb-6" style={{ color: "rgba(51,51,51,0.68)" }}>
            Getting a Clear Pass isn&apos;t about knowing more medicine. It&apos;s about demonstrating
            a specific set of consultation skills naturally under exam conditions — ICE, shared
            decision-making, sitting with uncertainty, handling patient emotion. These are the skills
            RCGP examiners score. That&apos;s exactly what we teach.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              "246 practice stations",
              "Free monthly webinar",
              "Small-group live sessions",
            ].map((stat) => (
              <div key={stat} className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: YELLOW }} />
                <span className="text-[13px] font-semibold" style={{ color: "rgba(51,51,51,0.55)" }}>{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="px-10 pb-16 pt-6 max-md:px-6">
        <div className="max-w-[720px] mx-auto flex flex-col gap-5">

          {/* FREE WEBINAR — primary */}
          <div
            className="rounded-2xl p-8 bg-white hover:bg-[#FFFBEA] transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            style={{ border: "1.5px solid rgba(246,212,75,0.55)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <WebinarIcon />
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(51,51,51,0.40)" }}>Monthly Webinar</p>
            </div>
            <h2 className="font-display font-extrabold text-[28px] leading-[1.2] mb-3" style={{ color: DARK }}>
              How To Pass Your SCA — Free Monthly Webinar
            </h2>
            <p className="text-[14.5px] leading-[1.7] mb-6" style={{ color: "rgba(51,51,51,0.65)" }}>
              A free 1-hour Zoom session on the first Saturday of every month. Learn what the RCGP
              examiners are actually scoring, how high-performing candidates think through cases, and
              the consultation habits that separate a Clear Pass from a near miss. Attendees receive
              a code for 1 month of free Case Bank access.
            </p>

            {freeWebinars.length > 0 ? (
              <div className="flex flex-col gap-3">
                {freeWebinars.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
                    <p className="font-semibold text-[15px]" style={{ color: DARK }}>{formatDate(s.scheduled_at)}</p>
                    <a
                      href={s.zoom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 font-bold text-[14px] px-6 py-2.5 rounded-xl no-underline transition-opacity hover:opacity-85"
                      style={{ background: YELLOW, color: DARK }}
                    >
                      Register free →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] font-semibold" style={{ color: "rgba(51,51,51,0.45)" }}>
                Next date coming soon — check back shortly.
              </p>
            )}
          </div>

          {/* CASE BANK */}
          <div
            className="rounded-2xl p-8 bg-white hover:bg-[#FFFBEA] transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            style={{ border: "1px solid rgba(51,51,51,0.10)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CaseBankIcon />
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(51,51,51,0.40)" }}>Case Bank · 246 stations</p>
            </div>
            <h2 className="font-display font-extrabold text-[24px] leading-[1.2] mb-3" style={{ color: DARK }}>
              246 Realistic SCA Stations
            </h2>
            <p className="text-[14.5px] leading-[1.7] mb-5" style={{ color: "rgba(51,51,51,0.65)" }}>
              A growing library of exam-style cases built around the domains RCGP examiners score.
              Each station includes a full case sheet, data-gathering guidance, management points,
              and an example explanation — everything you need to practise purposefully.
            </p>

            {/* Station title glimpse — mask fade works on any background colour */}
            {stationTitles.length > 0 && (
              <div
                className="mb-6 overflow-hidden"
                style={{
                  maxHeight: 76,
                  WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent)",
                  maskImage: "linear-gradient(to bottom, black 40%, transparent)",
                }}
              >
                <div className="flex flex-wrap gap-1.5">
                  {stationTitles.map((title) => (
                    <span
                      key={title}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{ background: "rgba(51,51,51,0.06)", color: "rgba(51,51,51,0.55)" }}
                    >
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={user ? "/case-bank" : "/register"}
              className="inline-block font-bold text-[14px] px-7 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
              style={{ background: DARK, color: "white" }}
            >
              {user ? "Open Case Bank →" : "Get Access Now →"}
            </Link>
          </div>

          {/* LIVE PRACTICE SESSIONS */}
          <div
            className="rounded-2xl p-8 bg-white hover:bg-[#FFFBEA] transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            style={{ border: "1px solid rgba(51,51,51,0.10)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <LiveIcon />
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(51,51,51,0.40)" }}>Live Practice</p>
            </div>
            <h2 className="font-display font-extrabold text-[24px] leading-[1.2] mb-3" style={{ color: DARK }}>
              Monthly Live Practice Sessions
            </h2>
            <p className="text-[14.5px] leading-[1.7] mb-6" style={{ color: "rgba(51,51,51,0.65)" }}>
              Small-group live sessions on the second Saturday of every month. Work through 6
              exam-style cases with direct feedback — practice under realistic conditions and
              leave knowing exactly where your marks are going.
            </p>

            {paidSessions.length > 0 ? (
              <div className="flex flex-col gap-3">
                {paidSessions.map((s) => {
                  const date = new Date(s.scheduled_at);
                  const formatted = date.toLocaleDateString("en-GB", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                    timeZone: "Europe/London",
                  });
                  const time = date.toLocaleTimeString("en-GB", {
                    hour: "2-digit", minute: "2-digit", timeZone: "Europe/London",
                  });
                  return (
                    <div key={s.id} className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
                      <div>
                        <p className="font-semibold text-[15px]" style={{ color: DARK }}>{formatted}</p>
                        <p className="text-[13px] mt-0.5" style={{ color: "rgba(51,51,51,0.50)" }}>{time} GMT · £40 · 6 cases</p>
                      </div>
                      <a
                        href="mailto:mrcgpexplained@outlook.com"
                        className="shrink-0 font-bold text-[13px] px-5 py-2.5 rounded-lg no-underline transition-opacity hover:opacity-90"
                        style={{ background: YELLOW, color: DARK }}
                      >
                        Book via email
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[14px] font-semibold" style={{ color: "rgba(51,51,51,0.45)" }}>
                Next date coming soon — check back shortly.
              </p>
            )}
          </div>

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
