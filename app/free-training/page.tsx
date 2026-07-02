import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function FreeTrainingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/free-training");

  const admin = getSupabaseAdmin();
  const { data: setting } = admin
    ? await admin.from("settings").select("value").eq("key", "FREE_TRAINING_YOUTUBE_ID").single()
    : { data: null };
  const videoId = setting?.value?.trim() || null;
  const EMBED_URL = videoId
    ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`
    : null;

  const NAVY = "#1A1B52";
  const YELLOW = "#F6D44B";

  return (
    <main className="max-w-[800px] mx-auto px-6 py-10">
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full" style={{ background: "rgba(26,27,82,0.07)", color: "rgba(26,27,82,0.55)" }}>
          Free
        </span>
        <h1 className="font-display font-extrabold text-[28px] mt-3 mb-2" style={{ color: NAVY }}>
          How To Get A Clear Pass
        </h1>
        <p className="text-[15px] leading-[1.7]" style={{ color: "rgba(26,27,82,0.60)" }}>
          This is the foundation of everything on SCA Explained. Before you practise stations or
          watch the video course, watch this. It covers what the SCA is actually testing, how
          examiners mark, and the specific consultation skills that determine whether you get a
          Clear Pass or not.
        </p>
      </div>

      {EMBED_URL ? (
        <div
          onContextMenu={(e) => e.preventDefault()}
          style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: NAVY, borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 32px rgba(26,27,82,0.18)" }}
        >
          <iframe
            src={EMBED_URL}
            title="How To Get A Clear Pass"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          />
        </div>
      ) : (
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "360px", background: "rgba(26,27,82,0.06)", borderRadius: "16px", border: "2px dashed rgba(26,27,82,0.15)" }}
        >
          <p style={{ color: "rgba(26,27,82,0.40)", fontSize: "14px" }}>Video coming soon.</p>
        </div>
      )}

      <div className="mt-8 rounded-2xl p-6" style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)" }}>
        <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(26,27,82,0.65)" }}>
          Ready to go deeper? The{" "}
          <a href="/programme" className="font-semibold no-underline" style={{ color: NAVY, borderBottom: `2px solid ${YELLOW}` }}>
            SCA Explained Programme
          </a>{" "}
          covers every clinical system in detail and gives you 246 practice stations to apply what you&apos;ve learned.
        </p>
      </div>
    </main>
  );
}
