import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { LessonTable } from "./LessonTable";

export const dynamic = "force-dynamic";

export default async function AdminVideoCoursePage() {
  const supabase = getSupabaseAdmin();
  const { data: lessons } = supabase
    ? await supabase
        .from("video_course_systems")
        .select("id, title, description, bunny_video_id, duration_minutes, display_order, published")
        .order("display_order", { ascending: true })
    : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-navy">Video Course</h1>
          <p className="text-[13px] text-navy/50 mt-0.5">
            {lessons?.length ?? 0} lessons · drag rows to reorder
          </p>
        </div>
        <Link
          href="/admin/video-course/new"
          className="bg-navy text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-navy/90 transition no-underline"
        >
          + Add Lesson
        </Link>
      </div>

      {!lessons || lessons.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
          <p className="text-[14px] text-navy/50 mb-4">No lessons yet.</p>
          <Link href="/admin/video-course/new" className="text-[13px] font-semibold text-navy underline">
            Add your first lesson
          </Link>
        </div>
      ) : (
        <LessonTable initial={lessons} />
      )}
    </div>
  );
}
