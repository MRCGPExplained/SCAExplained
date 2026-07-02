"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ActionResult } from "../actions";

type SystemFormProps = {
  action: (state: ActionResult, fd: FormData) => Promise<ActionResult>;
  initial?: {
    id?: string;
    title?: string;
    description?: string;
    youtube_url?: string;
    display_order?: number;
    published?: boolean;
  };
  submitLabel?: string;
};

export default function SystemForm({ action, initial, submitLabel = "Save" }: SystemFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(action, {});

  useEffect(() => {
    if (!state?.error && Object.keys(state ?? {}).length > 0) {
      router.push("/admin/video-course");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-[640px]">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div>
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Title</label>
        <input
          name="title"
          type="text"
          required
          defaultValue={initial?.title ?? ""}
          placeholder="e.g. Cardiovascular"
          className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          placeholder="Brief description shown to students (optional)"
          className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50 resize-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">YouTube URL</label>
        <input
          name="youtube_url"
          type="url"
          defaultValue={initial?.youtube_url ?? ""}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50"
        />
        <p className="text-[11px] text-navy/40 mt-1">Paste any YouTube URL — unlisted videos are fine. Leave blank for a coming-soon placeholder.</p>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Display Order</label>
        <input
          name="display_order"
          type="number"
          required
          min={1}
          defaultValue={initial?.display_order ?? 1}
          className="w-40 border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-[13px] text-navy cursor-pointer">
          <input
            name="published"
            type="checkbox"
            value="true"
            defaultChecked={initial?.published ?? false}
            className="rounded"
          />
          Published (visible to students)
        </label>
      </div>

      {state && "error" in state && state.error && (
        <p className="text-[13px] text-red-600">{state.error}</p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-navy text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-navy/90 transition disabled:opacity-50"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/video-course")}
          className="text-[13px] text-navy/40 hover:text-navy/70 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
