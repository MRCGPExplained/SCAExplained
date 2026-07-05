import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

type CourseModule = {
  id: string;
  title: string;
  description: string | null;
  bunny_video_id: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  display_order: number;
};

function getThumbnailSrc(mod: CourseModule): string | null {
  if (mod.thumbnail_url) return mod.thumbnail_url;
  if (mod.bunny_video_id && process.env.BUNNY_CDN_HOSTNAME) {
    return `https://${process.env.BUNNY_CDN_HOSTNAME}/${mod.bunny_video_id}/thumbnail.jpg`;
  }
  return null;
}

export default async function VideoCoursePage() {
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
    .select("id,title,description,bunny_video_id,thumbnail_url,duration_minutes,display_order")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .returns<CourseModule[]>();

  return (
    <main className="max-w-[900px] mx-auto px-6 py-10">
      <div className="mb-2">
        <Link href="/dashboard" className="text-[13px] font-medium no-underline" style={{ color: "rgba(51,51,51,0.45)" }}>
          ← Dashboard
        </Link>
      </div>

      <div className="mb-8 mt-4">
        <h1 className="font-display font-extrabold text-[28px] mb-2" style={{ color: DARK }}>
          Video Course
        </h1>
        <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.55)" }}>
          Skills-based teaching built around what examiners actually assess. Watch each module at your own pace.
        </p>
      </div>

      {(!modules || modules.length === 0) ? (
        <div className="rounded-2xl px-8 py-12 text-center" style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)" }}>
          <p className="text-[14px]" style={{ color: "rgba(51,51,51,0.45)" }}>Videos are being uploaded — check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modules.map((mod) => {
            const thumbnailSrc = getThumbnailSrc(mod);
            const hasVideo = !!mod.bunny_video_id;
            const card = (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "white",
                  border: "1px solid rgba(51,51,51,0.10)",
                  boxShadow: "0 2px 10px rgba(51,51,51,0.05)",
                  opacity: hasVideo ? 1 : 0.75,
                }}
              >
                {/* Thumbnail */}
                <div className="relative" style={{ paddingBottom: "56.25%", background: "rgba(51,51,51,0.08)" }}>
                  {thumbnailSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbnailSrc} alt={mod.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                      <span className="text-[13px] font-semibold" style={{ color: "rgba(51,51,51,0.30)" }}>{mod.title}</span>
                    </div>
                  )}
                  {!hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(51,51,51,0.45)" }}>
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: YELLOW }}>Coming Soon</span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="px-5 py-4">
                  <p className="font-display font-bold text-[15px] leading-snug" style={{ color: DARK }}>{mod.title}</p>
                  {mod.description && (
                    <p className="text-[12.5px] mt-1 leading-[1.55] line-clamp-2" style={{ color: "rgba(51,51,51,0.55)" }}>{mod.description}</p>
                  )}
                  {mod.duration_minutes && (
                    <p className="text-[11.5px] mt-2 font-semibold" style={{ color: "rgba(51,51,51,0.38)" }}>{mod.duration_minutes} mins</p>
                  )}
                </div>
              </div>
            );

            return hasVideo ? (
              <Link key={mod.id} href={`/video-course/${mod.id}`} className="no-underline hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 block rounded-2xl">
                {card}
              </Link>
            ) : (
              <div key={mod.id}>{card}</div>
            );
          })}
        </div>
      )}
    </main>
  );
}
