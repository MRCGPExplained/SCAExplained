import { Fragment } from "react";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DARK = "#333333";

function WebinarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="14" height="14" rx="2.5" stroke={DARK} strokeWidth="1.6"/>
      <path d="M16 10l5.5-3.2v10.4L16 14" stroke={DARK} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
}

export default async function LiveEventsPage() {
  const supabaseAdmin = getSupabaseAdmin();

  const sessionsResult = supabaseAdmin
    ? await supabaseAdmin
        .from("live_sessions")
        .select("id, scheduled_at, zoom_url, is_free")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
    : { data: [] };

  const sessions = ((sessionsResult.data ?? []) as { id: string; scheduled_at: string; zoom_url: string; is_free: boolean }[]);
  const freeWebinars = sessions.filter((s) => s.is_free);

  return (
    <main style={{ background: "#FAFAF8" }} className="min-h-screen">
      <section className="px-10 pt-10 pb-16 max-md:px-6">
        <div className="max-w-[900px] mx-auto">
          <h1 className="font-display font-extrabold text-[28px] mb-6" style={{ color: DARK }}>
            Live Events
          </h1>

          <div
            className="relative rounded-2xl p-8 bg-white"
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
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(51,51,51,0.40)" }}>Monthly Live SCA Teaching</p>
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
                        Reserve Your Place →
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
        </div>
      </section>
    </main>
  );
}
