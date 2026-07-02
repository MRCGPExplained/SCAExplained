import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function LiveSessionPage() {
  const adminSupabase = getSupabaseAdmin();
  const { data: settings } = adminSupabase
    ? await adminSupabase.from("settings").select("key, value").in("key", ["LIVE_SESSION_ZOOM_URL", "LIVE_SESSION_DATE"])
    : { data: null };

  const settingsMap = Object.fromEntries((settings ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));
  const zoomUrl = settingsMap["LIVE_SESSION_ZOOM_URL"]?.trim() || null;
  const sessionDate = settingsMap["LIVE_SESSION_DATE"]?.trim() || null;
  const NAVY = "#1A1B52";
  const YELLOW = "#F6D44B";

  return (
    <main className="max-w-[680px] mx-auto px-6 py-10">
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full" style={{ background: "rgba(26,27,82,0.07)", color: "rgba(26,27,82,0.55)" }}>
          Free+
        </span>
        <h1 className="font-display font-extrabold text-[28px] mt-3 mb-2" style={{ color: NAVY }}>
          Monthly Live Practice Session
        </h1>
        <p className="text-[15px] leading-[1.7]" style={{ color: "rgba(26,27,82,0.60)" }}>
          A live session run on Zoom each month. The host works through a real SCA consultation
          in real time — coaching the active candidate, explaining the examiner&apos;s perspective,
          and showing exactly what scores marks in the moment.
        </p>
      </div>

      <div className="rounded-2xl p-7 mb-6" style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)", boxShadow: "0 2px 12px rgba(26,27,82,0.05)" }}>
        <h2 className="font-display font-bold text-[17px] mb-3" style={{ color: NAVY }}>How it works</h2>
        <ul className="flex flex-col gap-2.5">
          {[
            "Register via Zoom — the link is sent to you automatically",
            "The host picks active candidates on the day from those who put themselves forward",
            "Observers are always welcome — no pressure to participate",
            "Sessions run monthly, typically on an evening",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5" style={{ background: "rgba(26,27,82,0.08)", color: NAVY }}>✓</span>
              <span className="text-[13.5px]" style={{ color: "rgba(26,27,82,0.70)" }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {zoomUrl ? (
        <div className="flex flex-col gap-4">
          {sessionDate && (
            <div className="rounded-xl px-6 py-4 flex items-center gap-3" style={{ background: "rgba(26,27,82,0.05)", border: "1px solid rgba(26,27,82,0.10)" }}>
              <span className="text-[20px]">📅</span>
              <p className="text-[15px] font-semibold" style={{ color: NAVY }}>{sessionDate}</p>
            </div>
          )}
          <a
            href={zoomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center rounded-xl py-4 font-display font-bold text-[15px] no-underline"
            style={{ background: NAVY, color: "white" }}
          >
            Register for the Next Session →
          </a>
        </div>
      ) : (
        <div className="rounded-xl py-4 px-6 text-center" style={{ background: "rgba(26,27,82,0.05)", border: "1px solid rgba(26,27,82,0.10)" }}>
          <p className="text-[14px] font-semibold" style={{ color: "rgba(26,27,82,0.45)" }}>
            No session currently scheduled — check back soon.
          </p>
        </div>
      )}

      <p className="text-center text-[12px] mt-5" style={{ color: "rgba(26,27,82,0.35)" }}>
        Zoom will send the meeting link to your email after you register.
      </p>
    </main>
  );
}
