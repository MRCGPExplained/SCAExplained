import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { updateHomepageVideoAction } from "../../../actions";
import HomepageVideoForm from "../../HomepageVideoForm";

export const dynamic = "force-dynamic";

export default async function EditHomepageVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();

  const { data: video } = await supabase
    .from("homepage_videos")
    .select("id, title, description, bunny_video_id, display_order, published")
    .eq("id", id)
    .single();

  if (!video) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/homepage-videos" className="text-[13px] text-navy/50 hover:text-navy transition no-underline">
          ← Homepage Videos
        </Link>
        <span className="text-navy/20">/</span>
        <h1 className="font-display font-extrabold text-[22px] text-navy">Edit Video — {video.title}</h1>
      </div>
      <HomepageVideoForm action={updateHomepageVideoAction} initial={video} submitLabel="Save Changes" />
    </div>
  );
}
