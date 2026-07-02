import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { toggleVideoSystemPublishedAction, deleteVideoSystemAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminVideoCoursePage() {
  const supabase = getSupabaseAdmin();
  const { data: systems } = supabase
    ? await supabase
        .from("video_course_systems")
        .select("id, title, description, youtube_url, display_order, published")
        .order("display_order", { ascending: true })
    : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-navy">Video Course</h1>
          <p className="text-[13px] text-navy/50 mt-0.5">
            {systems?.length ?? 0} systems · drag to reorder (coming soon)
          </p>
        </div>
        <Link
          href="/admin/video-course/new"
          className="bg-navy text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-navy/90 transition no-underline"
        >
          + Add System
        </Link>
      </div>

      {!systems || systems.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
          <p className="text-[14px] text-navy/50 mb-4">No video systems yet.</p>
          <Link href="/admin/video-course/new" className="text-[13px] font-semibold text-navy underline">
            Add your first system
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-navy/10 bg-white overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-navy/10 bg-navy/[0.03]">
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50 w-10">#</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Title</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">YouTube</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Status</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((system, i) => (
                <tr key={system.id} className={i < systems.length - 1 ? "border-b border-navy/[0.06]" : ""}>
                  <td className="px-5 py-3 text-navy/30 text-[12px]">{system.display_order}</td>
                  <td className="px-5 py-3">
                    <div className="font-semibold text-navy">{system.title}</div>
                    {system.description && (
                      <div className="text-[12px] text-navy/45 mt-0.5 line-clamp-1">{system.description}</div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-[12px]">
                    {system.youtube_url ? (
                      <span className="text-green-600 font-semibold">Set</span>
                    ) : (
                      <span className="text-navy/30 italic">Not set</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${system.published ? "bg-green-50 text-green-700" : "bg-navy/10 text-navy/40"}`}
                    >
                      {system.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/video-course/${system.id}/edit`}
                        className="text-[12px] font-semibold text-navy/60 hover:text-navy transition no-underline"
                      >
                        Edit
                      </Link>
                      <form action={toggleVideoSystemPublishedAction}>
                        <input type="hidden" name="id" value={system.id} />
                        <input type="hidden" name="published" value={system.published ? "false" : "true"} />
                        <button type="submit" className="text-[12px] font-semibold text-navy/40 hover:text-navy transition">
                          {system.published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await deleteVideoSystemAction(system.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-[12px] font-semibold text-red-600/60 hover:text-red-600 transition"
                          onClick={(e) => {
                            if (!confirm(`Delete "${system.title}"? This cannot be undone.`)) e.preventDefault();
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
