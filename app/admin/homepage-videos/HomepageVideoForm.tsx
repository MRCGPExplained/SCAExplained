"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ActionResult } from "../actions";

type HomepageVideoFormProps = {
  action: (state: ActionResult, fd: FormData) => Promise<ActionResult>;
  initial?: {
    id?: string;
    title?: string;
    description?: string;
    bunny_video_id?: string;
    display_order?: number;
    published?: boolean;
  };
  submitLabel?: string;
};

export default function HomepageVideoForm({ action, initial, submitLabel = "Save" }: HomepageVideoFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(action, {});

  useEffect(() => {
    if (!state?.error && Object.keys(state ?? {}).length > 0) {
      router.push("/admin/homepage-videos");
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
          placeholder="e.g. What is the SCA?"
          className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Description <span className="normal-case font-normal">(optional)</span></label>
        <textarea
          name="description"
          rows={2}
          defaultValue={initial?.description ?? ""}
          placeholder="Short caption shown below the video title"
          className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50 resize-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Bunny Video ID</label>
        <input
          name="bunny_video_id"
          type="text"
          defaultValue={initial?.bunny_video_id ?? ""}
          placeholder="Paste the video ID from Bunny Stream dashboard"
          className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50"
        />
      </div>

      <div className="w-48">
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Display Order</label>
        <input
          name="display_order"
          type="number"
          required
          min={1}
          defaultValue={initial?.display_order ?? 1}
          className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50"
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
          Published (visible on homepage)
        </label>
      </div>

      {state && "error" in state && state.error && (
        <p className="text-[13px] text-red-600">{state.error}</p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-navy text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#F6D44B] hover:text-[#333333] transition disabled:opacity-50"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/homepage-videos")}
          className="text-[13px] text-navy/40 hover:text-navy/70 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
