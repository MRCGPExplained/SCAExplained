"use client";

import Link from "next/link";
import { toggleTestimonialPublishedAction, deleteTestimonialAction } from "../actions";

export function TestimonialRowActions({ id, name, published }: { id: string; name: string; published: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <Link
        href={`/admin/testimonials/${id}/edit`}
        className="text-[12px] font-semibold text-navy/60 hover:text-navy transition no-underline"
      >
        Edit
      </Link>
      <form action={toggleTestimonialPublishedAction}>
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
          if (!confirm(`Delete the testimonial from "${name}"? This cannot be undone.`)) return;
          await deleteTestimonialAction(id);
        }}
      >
        Delete
      </button>
    </div>
  );
}
