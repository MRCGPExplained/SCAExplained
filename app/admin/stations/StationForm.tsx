"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Station } from "@/lib/case-bank-types";
import { createStationAction, updateStationAction } from "../actions";

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
        <Field
          label="Editor Video URL (optional)"
          name="editor_video_url"
          defaultValue={station?.editor_video_url ?? ""}
          hint="YouTube unlisted URL. Leave blank to hide the 'Message from Me' section."
        />
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
