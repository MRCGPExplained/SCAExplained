import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

type Consultation = {
  id: string;
  title: string;
  description: string | null;
  bunny_video_id: string | null;
  duration_minutes: number | null;
  display_order: number;
};

export default async function RecordedConsultationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/recorded-consultations");

  const { data: access } = await supabase
    .from("user_access")
    .select("expires_at")
    .eq("user_id", user.id)
    .eq("has_programme", true)
    .gt("expires_at", new Date().toISOString())
    .single<{ expires_at: string }>();

  if (!access) redirect("/programme");

  const admin = getSupabaseAdmin();
  const { data: consultations } = admin
    ? await admin
        .from("recorded_consultations")
        .select("id,title,description,bunny_video_id,duration_minutes,display_order")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .returns<Consultation[]>()
    : { data: [] };

  const cdnHost = process.env.BUNNY_CDN_HOSTNAME;

  return (
    <main className="max-w-[860px] mx-auto px-6 py-10">
      <div className="mb-8">
        <Link href="/dashboard" className="text-[13px] font-semibold no-underline mb-4 inline-block" style={{ color: "rgba(51,51,51,0.40)" }}>
          ← Dashboard
        </Link>
        <h1 className="font-display font-extrabold text-[28px] mt-1" style={{ color: DARK }}>
          Recorded Consultations
        </h1>
        <p className="text-[14px] leading-[1.7] mt-1" style={{ color: "rgba(51,51,51,0.55)" }}>
          Watch complete exam-style consultations from start to finish with expert commentary.
        </p>
      </div>

      {(!consultations || consultations.length === 0) ? (
        <div className="rounded-2xl px-8 py-12 text-center" style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)" }}>
          <p className="text-[14px]" style={{ color: "rgba(51,51,51,0.45)" }}>Consultations are being recorded — check back soon.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {consultations.map((c, i) => {
            const thumbSrc = cdnHost && c.bunny_video_id ? `https://${cdnHost}/${c.bunny_video_id}/thumbnail.jpg` : null;
            const hasVideo = !!c.bunny_video_id;

            const inner = (
              <div
                className={`flex items-center gap-0 rounded-2xl overflow-hidden transition-all duration-200 ${hasVideo ? "hover:-translate-y-0.5 hover:shadow-md" : ""}`}
                style={{
                  background: "white",
                  border: "1px solid rgba(51,51,51,0.10)",
                  boxShadow: "0 2px 8px rgba(51,51,51,0.05)",
                  opacity: hasVideo ? 1 : 0.65,
                }}
              >
                {/* Thumbnail */}
                <div className="relative shrink-0 w-[140px] h-[88px] sm:w-[168px] sm:h-[100px]" style={{ background: "rgba(51,51,51,0.08)" }}>
                  {thumbSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbSrc} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[11px] font-semibold px-3 text-center" style={{ color: "rgba(51,51,51,0.28)" }}>{c.title}</span>
                    </div>
                  )}
                  {!hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(51,51,51,0.50)" }}>
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: YELLOW }}>Coming Soon</span>
                    </div>
                  )}
                  {hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.30)" }}>
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="14" fill="rgba(0,0,0,0.50)"/>
                        <path d="M11 9l9 5-9 5V9z" fill="white"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 px-5 py-3">
                  <div className="mb-0.5">
                    <span className="text-[11px] font-bold" style={{ color: "rgba(51,51,51,0.30)" }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="font-display font-bold text-[15px] leading-snug" style={{ color: DARK }}>{c.title}</p>
                  {c.description && (
                    <p className="text-[12.5px] mt-1 leading-[1.5] line-clamp-2" style={{ color: "rgba(51,51,51,0.50)" }}>{c.description}</p>
                  )}
                  {c.duration_minutes && (
                    <p className="text-[11px] mt-1.5 font-semibold" style={{ color: "rgba(51,51,51,0.35)" }}>{c.duration_minutes} min</p>
                  )}
                </div>
              </div>
            );

            return hasVideo ? (
              <Link key={c.id} href={`/recorded-consultations/${c.id}`} className="no-underline block">
                {inner}
              </Link>
            ) : (
              <div key={c.id}>{inner}</div>
            );
          })}
        </div>
      )}
    </main>
  );
}
