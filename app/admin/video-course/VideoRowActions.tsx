"use client";

import Link from "next/link";
import { toggleVideoSystemPublishedAction, deleteVideoSystemAction } from "../actions";

export function VideoRowActions({ id, title, published }: { id: string; title: string; published: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <Link
        href={`/admin/video-course/${id}/edit`}
        className="text-[12px] font-semibold text-navy/60 hover:text-navy transition no-underline"
      >
        Edit
      </Link>
      <form action={toggleVideoSystemPublishedAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="published" value={published ? "false" : "true"} />
        <button type="submit" className="text-[12px] font-semibold text-navy/40 hover:text-navy transition">
          {published ? "Unpublish" : "Publish"}
        </button>
      </form>
      <button
        type="button"
        className="text-[12px] font-semibold text-red-600/60 hover:text-red-600 transition"
        onClick={async () => {
          if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
          await deleteVideoSystemAction(id);
        }}
      >
        Delete
      </button>
    </div>
  );
}
