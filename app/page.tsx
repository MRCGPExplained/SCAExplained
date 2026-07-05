import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Swash } from "./components/Swash";
import { HomepageVideos } from "./components/HomepageVideos";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  const supabaseAdmin = getSupabaseAdmin();
  const { data: rawVideos } = supabaseAdmin
    ? await supabaseAdmin
        .from("homepage_videos")
        .select("id, title, description, bunny_video_id")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .limit(3)
    : { data: [] };

  const libId = process.env.BUNNY_LIBRARY_ID;
  const cdnHost = process.env.BUNNY_CDN_HOSTNAME;

  const videos = (rawVideos ?? []).map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description ?? null,
    embed_url: libId && v.bunny_video_id
      ? `https://iframe.mediadelivery.net/embed/${libId}/${v.bunny_video_id}`
      : "",
    thumbnail_url: cdnHost && v.bunny_video_id
      ? `https://${cdnHost}/${v.bunny_video_id}/thumbnail.jpg`
      : null,
  })).filter((v) => v.embed_url);

  return (
    <main style={{ background: "#FAFAF8" }}>
      {/* HERO */}
      <section className="px-10 pt-10 pb-20 max-md:px-6">
        <div className="max-w-[680px] mx-auto">
          <h1 className="font-display mb-[26px]" style={{ color: DARK }}>
            <span className="block font-extrabold text-[46px] leading-[1.14] max-sm:text-[34px]">
              Perform Your Best On SCA.
            </span>
            <span className="block font-bold text-[30px] leading-[1.25] max-sm:text-[22px]">
              Know Exactly What <Swash>Scores Marks</Swash>
            </span>
          </h1>

          <p className="text-[15.5px] leading-[1.7] mb-4" style={{ color: "rgba(51,51,51,0.68)" }}>
            Getting a Clear Pass isn&apos;t about knowing more medicine. It&apos;s about
            demonstrating a specific set of consultation skills, naturally under exam
            conditions. Exploring a patient&apos;s ICE without it feeling like a checklist.
            Sitting with diagnostic uncertainty and committing to a plan anyway. Handling
            patient emotion without losing structure. These are the skills RCGP examiners
            are scoring. That&apos;s exactly what we teach.
          </p>

          <p className="text-[15.5px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.68)" }}>
            Start with{" "}
            <Link href="/how-to-get-a-clear-pass" className="font-bold no-underline border-b-2 border-yellow" style={{ color: DARK }}>
              How To Get A Clear Pass
            </Link>
            {" "}— our free recorded training covering exactly what examiners are looking for.
          </p>
        </div>
      </section>

      {/* HOMEPAGE VIDEOS */}
      {videos.length > 0 && (
        <section className="px-10 pb-20 max-md:px-6">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display font-extrabold text-[26px]" style={{ color: DARK }}>
                Learn About Our Programme
              </h2>
            </div>
            <HomepageVideos videos={videos} />
          </div>
        </section>
      )}

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
