import { getSupabaseAdmin } from "@/lib/supabase";
import { VideoEmbed } from "./VideoEmbed";

export const dynamic = "force-dynamic";

export default async function HowToGetAClearPassPage() {
  const admin = getSupabaseAdmin();
  const { data: setting } = admin
    ? await admin.from("settings").select("value").eq("key", "FREE_TRAINING_YOUTUBE_ID").single()
    : { data: null };
  const videoId = setting?.value?.trim() || null;
  const EMBED_URL = videoId
    ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`
    : null;

  return (
    <main>
      {EMBED_URL ? (
        <VideoEmbed src={EMBED_URL} />
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "rgba(26,27,82,0.06)" }}>
          <p style={{ color: "rgba(26,27,82,0.40)", fontSize: "14px" }}>Video coming soon.</p>
        </div>
      )}
    </main>
  );
}
