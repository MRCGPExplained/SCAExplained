"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin-auth";

// Which station columns the case-page pencil is allowed to write, and how the
// raw editor text should be parsed. Keep this in sync with stationFromForm in
// app/admin/actions.ts — an inline edit and an admin-form edit must agree.
const EDITABLE_FIELDS = {
  title: "text",
  patient_name: "text",
  patient_age: "text",
  reason_for_consultation: "text",
  recent_notes: "text",
  pmh: "lines",
  medications_and_allergies: "lines",
  dilemma: "text",
  opening_statement: "text",
  if_asked_further: "text",
  only_if_asked: "lines",
  social_history: "text",
  ice_ideas: "text",
  ice_concerns: "text",
  ice_expectations: "text",
  scenarios: "lines",
  question_for_doctor: "lines",
  data_gathering: "lines",
  management: "lines",
  example_explanation: "text",
  trainer_qa: "qa",
  admin_note: "text",
} as const;

export type EditableField = keyof typeof EDITABLE_FIELDS;

interface UpdateResult {
  error?: string;
}

export async function updateStationFieldAction(
  stationId: string,
  field: string,
  raw: string
): Promise<UpdateResult> {
  if (!(await isAdmin())) return { error: "Not authorised." };

  const type = EDITABLE_FIELDS[field as EditableField];
  if (!type) return { error: "That field can't be edited here." };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  let value: string | string[] | { question: string; answer: string }[];

  if (type === "text") {
    value = raw.trim();
  } else if (type === "lines") {
    value = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  } else {
    // qa — client sends a JSON array of {question, answer}
    try {
      const parsed = JSON.parse(raw);
      value = Array.isArray(parsed)
        ? parsed
            .map((r) => ({
              question: String(r?.question ?? "").trim(),
              answer: String(r?.answer ?? "").trim(),
            }))
            .filter((r) => r.question && r.answer)
        : [];
    } catch {
      return { error: "Couldn't read the Q&A data." };
    }
  }

  const { error } = await supabase
    .from("stations")
    .update({ [field]: value })
    .eq("id", stationId);

  if (error) return { error: error.message };
  return {};
}

export async function toggleStationPublishedAction(
  stationId: string,
  publish: boolean
): Promise<UpdateResult> {
  if (!(await isAdmin())) return { error: "Not authorised." };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Database not available." };

  const { error } = await supabase
    .from("stations")
    .update({ published: publish })
    .eq("id", stationId);

  if (error) return { error: error.message };
  return {};
}
