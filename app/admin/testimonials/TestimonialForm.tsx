"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ActionResult } from "../actions";

type TestimonialFormProps = {
  action: (state: ActionResult, fd: FormData) => Promise<ActionResult>;
  initial?: {
    id?: string;
    quote?: string;
    name?: string;
    vts?: string;
    sca_date?: string;
    photo_url?: string;
    published?: boolean;
  };
  submitLabel?: string;
};

export default function TestimonialForm({ action, initial, submitLabel = "Save" }: TestimonialFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(action, {});

  useEffect(() => {
    if (!state?.error && Object.keys(state ?? {}).length > 0) {
      router.push("/admin/testimonials");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-[640px]">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div>
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Quote</label>
        <textarea
          name="quote"
          rows={4}
          required
          defaultValue={initial?.quote ?? ""}
          placeholder="What they said about SCA Focus"
          className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50 resize-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Name</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={initial?.name ?? ""}
          placeholder="e.g. Dr Jane Smith"
          className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">VTS <span className="normal-case font-normal">(optional)</span></label>
          <input
            name="vts"
            type="text"
            defaultValue={initial?.vts ?? ""}
            placeholder="e.g. North West VTS"
            className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">SCA Date <span className="normal-case font-normal">(optional)</span></label>
          <input
            name="sca_date"
            type="text"
            defaultValue={initial?.sca_date ?? ""}
            placeholder="e.g. August 2026"
            className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Photo URL <span className="normal-case font-normal">(optional — shows initials if left blank)</span></label>
        <input
          name="photo_url"
          type="text"
          defaultValue={initial?.photo_url ?? ""}
          placeholder="https://…"
          className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-[13px] text-navy cursor-pointer">
          <input
            name="published"
            type="checkbox"
            value="true"
            defaultChecked={initial?.published ?? true}
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
          onClick={() => router.push("/admin/testimonials")}
          className="text-[13px] text-navy/40 hover:text-navy/70 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
