"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ActionResult } from "../actions";
import { uploadTestimonialPhotoAction, deleteTestimonialPhotoAction } from "../actions";
import { Avatar } from "@/app/components/Avatar";

type TestimonialFormProps = {
  action: (state: ActionResult, fd: FormData) => Promise<ActionResult>;
  initial?: {
    id?: string;
    quote?: string;
    name?: string;
    vts?: string;
    sca_date?: string;
    photo_url?: string;
    initials?: string;
    published?: boolean;
  };
  submitLabel?: string;
};

export default function TestimonialForm({ action, initial, submitLabel = "Save" }: TestimonialFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(action, {});

  const [name, setName] = useState(initial?.name ?? "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(initial?.photo_url ?? null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state?.error && Object.keys(state ?? {}).length > 0) {
      router.push("/admin/testimonials");
      router.refresh();
    }
  }, [state, router]);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    setPhotoError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      const result = await uploadTestimonialPhotoAction(fd);
      if (result.error) { setPhotoError(result.error); return; }
      setPhotoUrl(result.url ?? null);
    } finally {
      setPhotoUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handlePhotoRemove() {
    if (!photoUrl) return;
    setPhotoUploading(true);
    await deleteTestimonialPhotoAction(photoUrl);
    setPhotoUrl(null);
    setPhotoUploading(false);
  }

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-[640px]">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="photo_url" value={photoUrl ?? ""} />

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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Photo <span className="normal-case font-normal">(optional)</span></label>
        <div className="flex items-center gap-4">
          <Avatar name={name || "?"} photoUrl={photoUrl} initials={initial?.initials} size={56} />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoUpload}
          />
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={photoUploading}
              className="px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-opacity self-start"
              style={{ background: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.7)", border: "none", cursor: photoUploading ? "not-allowed" : "pointer", opacity: photoUploading ? 0.6 : 1 }}
            >
              {photoUploading ? "Uploading…" : photoUrl ? "Replace photo" : "Upload photo"}
            </button>
            {photoUrl && (
              <button
                type="button"
                onClick={handlePhotoRemove}
                disabled={photoUploading}
                className="text-[12px] font-medium text-red-600/70 hover:text-red-700 transition self-start"
                style={{ background: "none", border: "none", cursor: photoUploading ? "not-allowed" : "pointer" }}
              >
                Remove photo
              </button>
            )}
          </div>
        </div>
        {photoError && <p className="text-[12px] text-red-600 mt-1.5">{photoError}</p>}
      </div>

      <div className="w-32">
        <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Initials</label>
        <input
          name="initials"
          type="text"
          required
          maxLength={2}
          defaultValue={initial?.initials ?? ""}
          placeholder="e.g. JS"
          className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-navy/50 uppercase"
        />
        <p className="text-[11.5px] text-navy/40 mt-1">Shown when there&apos;s no photo — this is the fallback, not optional.</p>
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
