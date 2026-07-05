import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

const DARK = "#333333";

type CourseModule = {
  id: string;
  title: string;
  description: string | null;
  bunny_video_id: string | null;
  duration_minutes: number | null;
  display_order: number;
};

export default async function VideoModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/video-course");

  const { data: access } = await supabase
    .from("user_access")
    .select("expires_at")
    .eq("user_id", user.id)
    .eq("has_programme", true)
    .gt("expires_at", new Date().toISOString())
    .single<{ expires_at: string }>();

  if (!access) redirect("/programme");

  const { data: modules } = await supabase
    .from("video_course_systems")
    .select("id,title,description,bunny_video_id,duration_minutes,display_order")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .returns<CourseModule[]>();

  const mod = modules?.find((m) => m.id === id);
  if (!mod) notFound();

  const idx = modules!.findIndex((m) => m.id === id);
  const prev = idx > 0 ? modules![idx - 1] : null;
  const next = idx < modules!.length - 1 ? modules![idx + 1] : null;

  const cdnHost = process.env.BUNNY_CDN_HOSTNAME;
  const libId = process.env.BUNNY_LIBRARY_ID;
  const embedUrl = mod.bunny_video_id && cdnHost && libId
    ? `https://${cdnHost}/embed/${libId}/${mod.bunny_video_id}`
    : null;

  return (
    <main className="max-w-[860px] mx-auto px-6 py-10">
      <div className="mb-6">
        <Link href="/video-course" className="text-[13px] font-medium no-underline" style={{ color: "rgba(51,51,51,0.45)" }}>
          ← Video Course
        </Link>
      </div>

      <h1 className="font-display font-extrabold text-[28px] mb-6" style={{ color: DARK }}>
        {mod.title}
      </h1>

      {/* Video embed */}
      {embedUrl ? (
        <div
          onContextMenu={(e) => e.preventDefault()}
          style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 12, overflow: "hidden", background: "rgba(51,51,51,0.08)" }}
        >
          <iframe
            src={embedUrl}
            title={mod.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ paddingBottom: "56.25%", position: "relative", background: "rgba(51,51,51,0.08)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[14px]" style={{ color: "rgba(51,51,51,0.40)" }}>Video coming soon</p>
          </div>
        </div>
      )}

      {/* Meta */}
      {mod.duration_minutes && (
        <p className="text-[12px] font-semibold mt-3" style={{ color: "rgba(51,51,51,0.38)" }}>{mod.duration_minutes} mins</p>
      )}

      {/* Description */}
      {mod.description && (
        <p className="text-[14.5px] leading-[1.75] mt-4" style={{ color: "rgba(51,51,51,0.65)" }}>{mod.description}</p>
      )}

      {/* Prev / Next */}
      {(prev || next) && (
        <div className="flex items-center justify-between gap-4 mt-12 pt-6" style={{ borderTop: "1px solid rgba(51,51,51,0.09)" }}>
          {prev ? (
            <Link href={`/video-course/${prev.id}`} className="no-underline group flex-1" style={{ maxWidth: "48%" }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: "rgba(51,51,51,0.38)" }}>← Previous</p>
              <p className="text-[13.5px] font-semibold" style={{ color: DARK }}>{prev.title}</p>
            </Link>
          ) : <div className="flex-1" />}

          {next ? (
            <Link href={`/video-course/${next.id}`} className="no-underline text-right flex-1" style={{ maxWidth: "48%" }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: "rgba(51,51,51,0.38)" }}>Next →</p>
              <p className="text-[13.5px] font-semibold" style={{ color: DARK }}>{next.title}</p>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      )}
    </main>
  );
}
