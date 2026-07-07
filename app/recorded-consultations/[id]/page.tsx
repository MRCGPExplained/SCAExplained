import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { VideoEmbed } from "@/app/video-course/[id]/VideoEmbed";

export const dynamic = "force-dynamic";

const DARK = "#333333";

type Consultation = {
  id: string;
  title: string;
  description: string | null;
  bunny_video_id: string | null;
  duration_minutes: number | null;
  display_order: number;
};

export default async function RecordedConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const consultation = consultations?.find((c) => c.id === id);
  if (!consultation) notFound();

  const idx = consultations!.findIndex((c) => c.id === id);
  const prev = idx > 0 ? consultations![idx - 1] : null;
  const next = idx < consultations!.length - 1 ? consultations![idx + 1] : null;

  const libId = process.env.BUNNY_LIBRARY_ID;
  const embedUrl = consultation.bunny_video_id && libId
    ? `https://iframe.mediadelivery.net/embed/${libId}/${consultation.bunny_video_id}`
    : null;

  return (
    <main className="max-w-[860px] mx-auto px-6 py-10">
      <div className="mb-6">
        <Link href="/recorded-consultations" className="text-[13px] font-medium no-underline" style={{ color: "rgba(51,51,51,0.45)" }}>
          ← Recorded Consultations
        </Link>
      </div>

      <h1 className="font-display font-extrabold text-[28px] mb-6" style={{ color: DARK }}>
        {idx + 1}: {consultation.title}
      </h1>

      {embedUrl ? (
        <VideoEmbed src={embedUrl} title={consultation.title} />
      ) : (
        <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden", background: "rgba(51,51,51,0.08)" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[14px]" style={{ color: "rgba(51,51,51,0.40)" }}>Video coming soon</p>
          </div>
        </div>
      )}

      {consultation.duration_minutes && (
        <p className="text-[12px] font-semibold mt-3" style={{ color: "rgba(51,51,51,0.38)" }}>{consultation.duration_minutes} mins</p>
      )}

      {consultation.description && (
        <p className="text-[14.5px] leading-[1.75] mt-4" style={{ color: "rgba(51,51,51,0.65)" }}>{consultation.description}</p>
      )}

      {(prev || next) && (
        <div className="flex items-center justify-between gap-4 mt-12 pt-6" style={{ borderTop: "1px solid rgba(51,51,51,0.09)" }}>
          {prev ? (
            <Link href={`/recorded-consultations/${prev.id}`} className="no-underline flex-1" style={{ maxWidth: "48%" }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: "rgba(51,51,51,0.38)" }}>← Previous</p>
              <p className="text-[13.5px] font-semibold" style={{ color: DARK }}>{prev.title}</p>
            </Link>
          ) : <div className="flex-1" />}

          {next ? (
            <Link href={`/recorded-consultations/${next.id}`} className="no-underline text-right flex-1" style={{ maxWidth: "48%" }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: "rgba(51,51,51,0.38)" }}>Next →</p>
              <p className="text-[13.5px] font-semibold" style={{ color: DARK }}>{next.title}</p>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      )}
    </main>
  );
}
