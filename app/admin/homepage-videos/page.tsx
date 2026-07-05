import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { HomepageVideoTable } from "./HomepageVideoTable";

export const dynamic = "force-dynamic";

export default async function AdminHomepageVideosPage() {
  const supabase = getSupabaseAdmin();
  const { data: videos } = supabase
    ? await supabase
        .from("homepage_videos")
        .select("id, title, description, bunny_video_id, display_order, published")
        .order("display_order", { ascending: true })
    : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-navy">Homepage Videos</h1>
          <p className="text-[13px] text-navy/50 mt-0.5">
            {videos?.length ?? 0} videos · drag rows to reorder · max 3 shown on homepage
          </p>
        </div>
        <Link
          href="/admin/homepage-videos/new"
          className="bg-navy text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-navy/90 transition no-underline"
        >
          + Add Video
        </Link>
      </div>

      {!videos || videos.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
          <p className="text-[14px] text-navy/50 mb-4">No homepage videos yet.</p>
          <Link href="/admin/homepage-videos/new" className="text-[13px] font-semibold text-navy underline">
            Add your first video
          </Link>
        </div>
      ) : (
        <HomepageVideoTable initial={videos} />
      )}
    </div>
  );
}
