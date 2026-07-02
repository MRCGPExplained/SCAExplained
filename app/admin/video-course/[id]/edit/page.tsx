import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { updateVideoSystemAction } from "../../../actions";
import SystemForm from "../../SystemForm";

export const dynamic = "force-dynamic";

export default async function EditVideoSystemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();

  const { data: system } = await supabase
    .from("video_course_systems")
    .select("id, title, description, youtube_url, display_order, published")
    .eq("id", id)
    .single();

  if (!system) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/video-course" className="text-[13px] text-navy/50 hover:text-navy transition no-underline">
          ← Video Course
        </Link>
        <span className="text-navy/20">/</span>
        <h1 className="font-display font-extrabold text-[22px] text-navy">Edit — {system.title}</h1>
      </div>
      <SystemForm action={updateVideoSystemAction} initial={system} submitLabel="Save Changes" />
    </div>
  );
}
