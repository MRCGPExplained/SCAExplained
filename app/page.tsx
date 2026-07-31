import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Swash } from "./components/Swash";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";
const CARD_BG = "#FFFBEA";
const CARD_BORDER = "1px solid rgba(246,212,75,0.45)";

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
      <rect x="4" y="2" width="12" height="18" rx="2" stroke={DARK} strokeWidth="1.6"/>
      <path d="M8 7h5M8 11h5M8 15h3" stroke={DARK} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M16 5h1.5A1.5 1.5 0 0 1 19 6.5v13A1.5 1.5 0 0 1 17.5 21H7" stroke={DARK} strokeWidth="1.4" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

function LiveIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2.5" stroke={DARK} strokeWidth="1.6"/>
      <path d="M3 9h18" stroke={DARK} strokeWidth="1.6"/>
      <path d="M8 2v4M16 2v4" stroke={DARK} strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="8" cy="15" r="1.4" fill={DARK}/>
      <circle cx="12" cy="15" r="1.4" fill={DARK}/>
      <circle cx="16" cy="15" r="1.4" fill={DARK}/>
    </svg>
  );
}

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  const supabaseAdmin = getSupabaseAdmin();

  const { data: rawSessions } = supabaseAdmin
    ? await supabaseAdmin
        .from("live_sessions")
        .select("id, scheduled_at, zoom_url, is_free")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
    : { data: [] };

  const sessions = (rawSessions ?? []) as { id: string; scheduled_at: string; zoom_url: string; is_free: boolean }[];
  const freeWebinars = sessions.filter((s) => s.is_free);
  const paidSessions = sessions.filter((s) => !s.is_free);

  return (
    <main style={{ background: "#FAFAF8" }}>
      {/* HERO */}
      <section className="px-10 pt-10 pb-16 max-md:px-6">
        <div className="max-w-[720px] mx-auto">
          <h1 className="font-display mb-[22px]" style={{ color: DARK }}>
            <span className="block font-extrabold text-[46px] leading-[1.14] max-sm:text-[34px]">
              Perform Your Best On SCA<span style={{ color: YELLOW }}>.</span>
            </span>
            <span className="block font-bold text-[30px] leading-[1.25] max-sm:text-[22px]">
              Know Exactly What <Swash>Scores Marks</Swash>
            </span>
          </h1>
          <p className="text-[15.5px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.68)" }}>
            Getting a Clear Pass isn&apos;t about knowing more medicine. It&apos;s about demonstrating
            a specific set of consultation skills naturally under exam conditions — ICE, shared
            decision-making, sitting with uncertainty, handling patient emotion. These are the skills
            RCGP examiners score. That&apos;s exactly what we teach.
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="px-10 pb-16 max-md:px-6">
        <div className="max-w-[720px] mx-auto flex flex-col gap-5">

          {/* FREE WEBINAR */}
          <div className="rounded-2xl p-8" style={{ background: CARD_BG, border: CARD_BORDER }}>
            <div className="flex items-center gap-2 mb-2">
              <WebinarIcon />
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(51,51,51,0.40)" }}>Free · Every First Saturday</p>
            </div>
            <h2 className="font-display font-extrabold text-[24px] leading-[1.2] mb-3" style={{ color: DARK }}>
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
          <div className="rounded-2xl p-8" style={{ background: CARD_BG, border: CARD_BORDER }}>
            <div className="flex items-center gap-2 mb-2">
              <CaseBankIcon />
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(51,51,51,0.40)" }}>Case Bank</p>
            </div>
            <h2 className="font-display font-extrabold text-[24px] leading-[1.2] mb-3" style={{ color: DARK }}>
              246 Realistic SCA Stations
            </h2>
            <p className="text-[14.5px] leading-[1.7] mb-6" style={{ color: "rgba(51,51,51,0.65)" }}>
              A growing library of exam-style cases built around the domains RCGP examiners score.
              Each station includes a full case sheet, data-gathering guidance, management points,
              and an example explanation — everything you need to practise purposefully.
            </p>
            <Link
              href={user ? "/case-bank" : "/register"}
              className="inline-block font-bold text-[14px] px-7 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
              style={{ background: DARK, color: "white" }}
            >
              {user ? "Open Case Bank →" : "Create a free account →"}
            </Link>
          </div>

          {/* LIVE PRACTICE SESSIONS */}
          <div className="rounded-2xl p-8" style={{ background: CARD_BG, border: CARD_BORDER }}>
            <div className="flex items-center gap-2 mb-2">
              <LiveIcon />
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(51,51,51,0.40)" }}>Live Practice · Every Second Saturday</p>
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
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start"
                    >
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
