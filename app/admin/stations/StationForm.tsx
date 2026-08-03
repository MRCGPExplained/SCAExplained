"use client";

import { useActionState, useState, useRef } from "react";
import Link from "next/link";
import type { Station } from "@/lib/case-bank-types";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  createStationAction,
  updateStationAction,
  getAudioUploadUrlAction,
  confirmAudioUploadAction,
  deleteAudioAction,
  deleteImageAction,
} from "../actions";

const SUBJECTS = [
  "Cardiovascular",
  "Respiratory",
  "Mental Health",
  "Musculoskeletal",
  "Gastroenterology",
  "Women's Health",
  "Paediatrics",
  "Dermatology",
  "Neurology",
  "Endocrine",
  "Renal",
  "Multimorbidity",
];

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-[11px] text-navy/40 mb-1">{hint}</p>}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-navy/15 text-[13.5px] text-navy bg-[#F3F2FB] outline-none focus:border-navy/40 transition"
      />
    </div>
  );
}

function TextareaField({
  label,
  name,
  defaultValue,
  required = false,
  hint,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-[11px] text-navy/40 mb-1">{hint}</p>}
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg border border-navy/15 text-[13.5px] text-navy bg-[#F3F2FB] outline-none focus:border-navy/40 transition resize-y"
      />
    </div>
  );
}

function ArrayField({
  label,
  name,
  defaultValue,
  hint,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string[];
  hint?: string;
  rows?: number;
}) {
  return (
    <TextareaField
      label={label}
      name={name}
      defaultValue={(defaultValue ?? []).join("\n")}
      hint={hint ?? "One item per line"}
      rows={rows}
    />
  );
}

export function StationForm({ station }: { station?: Station }) {
  const action = station ? updateStationAction : createStationAction;
  const [state, formAction, pending] = useActionState(action, {} as { error?: string });

  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(station?.audio_url ?? null);
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);

  const [imageUrls, setImageUrls] = useState<string[]>(station?.image_urls ?? []);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);
  const imagePasteRef = useRef<HTMLDivElement>(null);

  async function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !station?.id) return;
    setAudioUploading(true);
    setAudioError(null);
    try {
      const urlResult = await getAudioUploadUrlAction(station.id, file.name);
      if ("error" in urlResult) { setAudioError(urlResult.error); return; }
      const uploadRes = await fetch(urlResult.signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "audio/mpeg" },
      });
      if (!uploadRes.ok) { setAudioError("Upload failed — try again."); return; }
      const confirmResult = await confirmAudioUploadAction(station.id, urlResult.path);
      if ("error" in confirmResult) { setAudioError(confirmResult.error); return; }
      setCurrentAudioUrl(confirmResult.audioUrl);
    } finally {
      setAudioUploading(false);
      if (audioFileRef.current) audioFileRef.current.value = "";
    }
  }

  async function handleAudioDelete() {
    if (!station?.id) return;
    setAudioUploading(true);
    const result = await deleteAudioAction(station.id);
    if (result.error) { setAudioError(result.error); } else { setCurrentAudioUrl(null); }
    setAudioUploading(false);
  }

  async function uploadImage(file: File) {
    if (!station?.id) return;
    setImageUploading(true);
    setImageError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const timestamp = Date.now();
      const path = `${station.id}/${timestamp}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("station-images")
        .upload(path, file);

      if (uploadErr) { setImageError(uploadErr.message); return; }

      const { data: { publicUrl } } = supabase.storage
        .from("station-images")
        .getPublicUrl(path);

      setImageUrls([...imageUrls, publicUrl]);
    } catch (err) {
      setImageError(`Error: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setImageUploading(false);
      if (imageFileRef.current) imageFileRef.current.value = "";
    }
  }

  function handleImageFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
  }

  function handleImagePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          uploadImage(file);
        }
        break;
      }
    }
  }

  async function handleImageDelete(url: string) {
    if (!station?.id) return;
    setImageUploading(true);
    const result = await deleteImageAction(station.id, url);
    if (result.error) { setImageError(result.error); } else { setImageUrls(imageUrls.filter((u) => u !== url)); }
    setImageUploading(false);
  }

  return (
    <form action={formAction}>
      {station && <input type="hidden" name="id" value={station.id} />}

      {state.error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700">
          {state.error}
        </div>
      )}

      {/* ── Core ── */}
      <section className="bg-white rounded-xl border border-navy/10 p-6 mb-4">
        <h2 className="font-display font-bold text-[15px] text-navy mb-4">Core Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field
            label="Station Number"
            name="number"
            defaultValue={station?.number.toString()}
            type="number"
            required
          />
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              name="subject"
              defaultValue={station?.subject ?? ""}
              required
              className="w-full px-3 py-2 rounded-lg border border-navy/15 text-[13.5px] text-navy bg-[#F3F2FB] outline-none"
            >
              <option value="">Choose…</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <Field label="Title" name="title" defaultValue={station?.title} required />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">
              Consultation Type <span className="text-red-500">*</span>
            </label>
            <select
              name="consultation_type"
              defaultValue={station?.consultation_type ?? "Video Consultation"}
              className="w-full px-3 py-2 rounded-lg border border-navy/15 text-[13.5px] text-navy bg-[#F3F2FB] outline-none"
            >
              <option>Video Consultation</option>
              <option>Telephone Consultation</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">
              Published
            </label>
            <select
              name="published"
              defaultValue={station?.published ? "true" : "false"}
              className="w-full px-3 py-2 rounded-lg border border-navy/15 text-[13.5px] text-navy bg-[#F3F2FB] outline-none"
            >
              <option value="false">Draft — hidden from subscribers</option>
              <option value="true">Published — visible to subscribers</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Doctor's Brief ── */}
      <section className="bg-white rounded-xl border border-navy/10 p-6 mb-4">
        <h2 className="font-display font-bold text-[15px] text-navy mb-4">Doctor&apos;s Brief</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Patient Name" name="patient_name" defaultValue={station?.patient_name} required />
          <Field label="Patient Age" name="patient_age" defaultValue={station?.patient_age} required hint='e.g. "34-year-old female"' />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <ArrayField label="Past Medical History" name="pmh" defaultValue={station?.pmh} />
          <ArrayField label="Drug & Allergy History" name="medications_and_allergies" defaultValue={station?.medications_and_allergies} />
        </div>
        <div className="mb-4">
          <TextareaField label="Recent Notes" name="recent_notes" defaultValue={station?.recent_notes ?? ""} rows={2} />
        </div>
        <TextareaField
          label="Reason for Consultation"
          name="reason_for_consultation"
          defaultValue={station?.reason_for_consultation}
          required
          rows={2}
        />
      </section>

      {/* ── Patient's Story ── */}
      <section className="bg-white rounded-xl border border-navy/10 p-6 mb-4">
        <h2 className="font-display font-bold text-[15px] text-navy mb-4">Patient&apos;s Story</h2>
        <div className="flex flex-col gap-4">
          <TextareaField
            label="Opening Statement"
            name="opening_statement"
            defaultValue={station?.opening_statement}
            required
            rows={3}
          />
          <TextareaField
            label="If Asked to Explain Further"
            name="if_asked_further"
            defaultValue={station?.if_asked_further}
            required
            rows={3}
          />
          <ArrayField
            label="Only Say If Directly Asked"
            name="only_if_asked"
            defaultValue={station?.only_if_asked}
            rows={5}
          />
          <TextareaField
            label="Social History"
            name="social_history"
            defaultValue={station?.social_history}
            required
            rows={3}
          />
          <div className="grid grid-cols-3 gap-3">
            <TextareaField label="ICE — Ideas" name="ice_ideas" defaultValue={station?.ice_ideas} required rows={3} />
            <TextareaField label="ICE — Concerns" name="ice_concerns" defaultValue={station?.ice_concerns} required rows={3} />
            <TextareaField label="ICE — Expectations" name="ice_expectations" defaultValue={station?.ice_expectations} required rows={3} />
          </div>
          <ArrayField label="Specific Scenarios" name="scenarios" defaultValue={station?.scenarios ?? []} rows={4} />
          <TextareaField label="Question for the Doctor" name="question_for_doctor" defaultValue={station?.question_for_doctor ?? ""} rows={2} />
          <TextareaField label="Role-Player Instruction" name="role_player_instruction" defaultValue={station?.role_player_instruction ?? ""} rows={2} />
        </div>
      </section>

      {/* ── Marking ── */}
      <section className="bg-white rounded-xl border border-navy/10 p-6 mb-4">
        <h2 className="font-display font-bold text-[15px] text-navy mb-4">Marking Scheme</h2>
        <div className="grid grid-cols-2 gap-4">
          <ArrayField
            label="Data Gathering & Diagnosis"
            name="data_gathering"
            defaultValue={station?.data_gathering}
            rows={8}
          />
          <ArrayField
            label="Management"
            name="management"
            defaultValue={station?.management}
            rows={8}
          />
        </div>
      </section>

      {/* ── AI Marking Context ── */}
      <section className="bg-white rounded-xl border border-navy/10 p-6 mb-4">
        <h2 className="font-display font-bold text-[15px] text-navy mb-1">AI Marking Context</h2>
        <p className="text-[12px] text-navy/45 mb-4">
          Optional per-domain notes fed to the AI grader. Use these to clarify station-specific expectations that differ from the general RCGP criteria — e.g. a specific red flag that must be excluded, or a management step unique to this condition.
        </p>
        <div className="flex flex-col gap-4">
          <TextareaField
            label="Data Gathering & Diagnosis — AI notes"
            name="marking_notes_data_gathering"
            defaultValue={station?.marking_notes_data_gathering ?? ""}
            rows={3}
            hint="What must the candidate cover to pass data gathering for this specific station?"
          />
          <TextareaField
            label="Clinical Management — AI notes"
            name="marking_notes_clinical_management"
            defaultValue={station?.marking_notes_clinical_management ?? ""}
            rows={3}
            hint="Key management steps / safety-netting specific to this station."
          />
          <TextareaField
            label="Relating to Others — AI notes"
            name="marking_notes_relating_to_others"
            defaultValue={station?.marking_notes_relating_to_others ?? ""}
            rows={3}
            hint="Any communication-specific expectations for this scenario."
          />
        </div>
      </section>

      {/* ── Post-consult ── */}
      <section className="bg-white rounded-xl border border-navy/10 p-6 mb-6">
        <h2 className="font-display font-bold text-[15px] text-navy mb-4">Post-Consultation</h2>
        <div className="flex flex-col gap-4">
          <TextareaField
            label="Example Explanation"
            name="example_explanation"
            defaultValue={station?.example_explanation}
            required
            rows={10}
          />
          <ArrayField
            label="Key Takeaways"
            name="key_takeaways"
            defaultValue={station?.key_takeaways}
            rows={5}
          />
        </div>
      </section>

      {/* ── Audio Lesson ── */}
      {station && (
        <section className="bg-white rounded-xl border border-navy/10 p-6 mb-4">
          <h2 className="font-display font-bold text-[15px] text-navy mb-4">Audio Lesson</h2>

          {audioError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700">
              {audioError}
            </div>
          )}

          {currentAudioUrl ? (
            <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: "rgba(26,27,82,0.04)", border: "1px solid rgba(26,27,82,0.08)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 opacity-50">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              <span className="text-[13px] text-navy/70 flex-1 truncate">
                {currentAudioUrl.split("/").pop()}
              </span>
              <a
                href={currentAudioUrl}
                download
                className="text-[12px] font-medium no-underline text-navy/50 hover:text-navy transition"
              >
                Download
              </a>
              <button
                type="button"
                onClick={handleAudioDelete}
                disabled={audioUploading}
                className="text-[12px] font-medium text-red-600/70 hover:text-red-700 transition"
                style={{ background: "none", border: "none", cursor: audioUploading ? "not-allowed" : "pointer" }}
              >
                Delete
              </button>
            </div>
          ) : (
            <p className="text-[12px] text-navy/40 mb-4">No audio uploaded yet.</p>
          )}

          <div className="flex items-center gap-3 mb-5">
            <input
              type="file"
              accept="audio/*"
              ref={audioFileRef}
              style={{ display: "none" }}
              onChange={handleAudioUpload}
            />
            <button
              type="button"
              onClick={() => audioFileRef.current?.click()}
              disabled={audioUploading}
              className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-opacity"
              style={{ background: "rgba(26,27,82,0.08)", color: "rgba(26,27,82,0.7)", border: "none", cursor: audioUploading ? "not-allowed" : "pointer", opacity: audioUploading ? 0.6 : 1 }}
            >
              {audioUploading ? "Uploading…" : currentAudioUrl ? "Replace audio" : "Upload audio"}
            </button>
            {audioUploading && (
              <span className="text-[12px] text-navy/40">Uploading directly to storage…</span>
            )}
          </div>

          <TextareaField
            label="Audio Notes (optional)"
            name="audio_notes"
            defaultValue={station?.audio_notes ?? ""}
            rows={4}
            hint="Text shown below the audio player. Pipe-delimited rows (A | B | C) render as tables, same as Recent Notes."
          />
        </section>
      )}

      {/* ── Images ── */}
      {station && (
        <section className="bg-white rounded-xl border border-navy/10 p-6 mb-4">
          <h2 className="font-display font-bold text-[15px] text-navy mb-4">Images</h2>

          {imageError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700">
              {imageError}
            </div>
          )}

          {imageUrls.length > 0 && (
            <div className="mb-5 flex flex-col gap-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: "rgba(26,27,82,0.04)", border: "1px solid rgba(26,27,82,0.08)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 opacity-50">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  <span className="text-[13px] text-navy/70 flex-1 truncate">{url.split("/").pop()}</span>
                  <a href={url} download className="text-[12px] font-medium no-underline text-navy/50 hover:text-navy transition">
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={() => handleImageDelete(url)}
                    disabled={imageUploading}
                    className="text-[12px] font-medium text-red-600/70 hover:text-red-700 transition"
                    style={{ background: "none", border: "none", cursor: imageUploading ? "not-allowed" : "pointer" }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            ref={imagePasteRef}
            onPaste={handleImagePaste}
            className="mb-4 p-4 rounded-lg border-2 border-dashed transition-colors"
            style={{
              borderColor: "rgba(26,27,82,0.15)",
              background: "rgba(26,27,82,0.02)",
              cursor: "pointer",
              outline: "none",
            }}
            tabIndex={0}
          >
            <p className="text-[12px] text-navy/50 text-center m-0">
              Click or paste an image here
            </p>
            <input
              type="file"
              accept="image/*"
              ref={imageFileRef}
              style={{ display: "none" }}
              onChange={handleImageFileSelect}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => imageFileRef.current?.click()}
              disabled={imageUploading}
              className="block mx-auto mt-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-opacity"
              style={{ background: "rgba(26,27,82,0.08)", color: "rgba(26,27,82,0.7)", border: "none", cursor: imageUploading ? "not-allowed" : "pointer", opacity: imageUploading ? 0.6 : 1 }}
            >
              {imageUploading ? "Uploading…" : "Browse files"}
            </button>
          </div>

          <p className="text-[11px] text-navy/40 m-0">
            You can drag files here, paste from clipboard (Ctrl+V), or click Browse. Uploaded directly to storage.
          </p>

          <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(26,27,82,0.10)" }}>
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">
              Image URLs (for form submission)
            </label>
            <p className="text-[11px] text-navy/40 mb-3">
              Automatically populated with uploaded images. Add more URLs manually if needed, one per line.
            </p>
            <textarea
              name="image_urls_manual"
              value={imageUrls.join("\n")}
              onChange={(e) => setImageUrls(e.target.value.split("\n").map((u) => u.trim()).filter(Boolean))}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-navy/15 text-[13.5px] text-navy bg-[#F3F2FB] outline-none focus:border-navy/40 transition resize-y"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="bg-navy text-white px-8 py-3 rounded-lg font-semibold text-[14px] transition-opacity hover:opacity-90"
          style={{ opacity: pending ? 0.6 : 1, cursor: pending ? "not-allowed" : "pointer" }}
        >
          {pending
            ? "Saving…"
            : station
            ? "Save Changes"
            : "Create Station"}
        </button>
        <Link href="/admin/stations" className="text-[13px] text-navy/50 no-underline hover:text-navy transition">
          Cancel
        </Link>
      </div>
    </form>
  );
}
