import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

type CourseSystem = {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  display_order: number;
};

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&iv_load_policy=3`;
}

export default async function VideoCoursePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/case-bank/login?next=/video-course");

  const { data: access } = await supabase
    .from("user_access")
    .select("expires_at")
    .eq("user_id", user.id)
    .eq("has_programme", true)
    .gt("expires_at", new Date().toISOString())
    .single<{ expires_at: string }>();

  if (!access) redirect("/programme");

  const { data: systems } = await supabase
    .from("video_course_systems")
    .select("id,title,description,youtube_url,display_order")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .returns<CourseSystem[]>();

  const NAVY = "#1A1B52";
  const YELLOW = "#F6D44B";

  return (
    <main className="max-w-[860px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h1
          className="font-display font-extrabold text-[28px] mb-2"
          style={{ color: NAVY }}
        >
          Video Course
        </h1>
        <p className="text-[14.5px] leading-[1.7]" style={{ color: "rgba(26,27,82,0.60)" }}>
          System by system. Built on the same framework as the free webinar — but going deeper
          into every clinical area examiners test. Watch each video at your own pace.
        </p>
      </div>

      {(!systems || systems.length === 0) ? (
        <div
          className="rounded-2xl border px-8 py-12 text-center"
          style={{ border: "1px solid rgba(26,27,82,0.10)", background: "white" }}
        >
          <p className="text-[14px]" style={{ color: "rgba(26,27,82,0.45)" }}>
            Videos are being uploaded — check back soon.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {systems.map((sys) => {
            const embedUrl = sys.youtube_url ? getYouTubeEmbedUrl(sys.youtube_url) : null;
            return (
              <div
                key={sys.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(26,27,82,0.10)",
                  background: "white",
                  boxShadow: "0 2px 12px rgba(26,27,82,0.05)",
                }}
              >
                {/* Video or placeholder */}
                <div
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    background: NAVY,
                    overflow: "hidden",
                  }}
                >
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={sys.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center flex-col gap-2"
                    >
                      <div
                        className="text-[11px] font-bold uppercase tracking-[0.1em]"
                        style={{ color: YELLOW }}
                      >
                        Coming Soon
                      </div>
                      <div className="text-[14px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Video being uploaded
                      </div>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="px-6 py-5">
                  <h2
                    className="font-display font-bold text-[17px] mb-1"
                    style={{ color: NAVY }}
                  >
                    {sys.title}
                  </h2>
                  {sys.description && (
                    <p
                      className="text-[13.5px] leading-[1.65]"
                      style={{ color: "rgba(26,27,82,0.60)" }}
                    >
                      {sys.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
