"use client";

import Link from "next/link";
import { toggleHomepageVideoPublishedAction, deleteHomepageVideoAction } from "../actions";

export function HomepageVideoRowActions({ id, title, published }: { id: string; title: string; published: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <Link
        href={`/admin/homepage-videos/${id}/edit`}
        className="text-[12px] font-semibold text-navy/60 hover:text-navy transition no-underline"
      >
        Edit
      </Link>
      <form action={toggleHomepageVideoPublishedAction}>
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
          await deleteHomepageVideoAction(id);
        }}
      >
        Delete
      </button>
    </div>
  );
}
