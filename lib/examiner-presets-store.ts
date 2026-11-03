/**
 * Reading and writing the preset lists.
 *
 * Kept out of lib/examiner-presets so that file stays pure data and types and
 * can be imported by client components without dragging a database client
 * into the browser bundle. Nothing here runs anywhere but the server.
 *
 * Stored as one JSON row in site_settings rather than a table of its own.
 * That is not a shortcut around normalising it: the whole list is read
 * together, written together, and never queried across, so a table would buy
 * nothing a key and a value do not already give. It also meant this could
 * ship without a migration.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  DEFAULT_PRESETS,
  PRESET_FIELDS,
  PRESETS_SETTING_KEY,
  presetId,
  type ExaminerPreset,
  type PresetField,
} from "./examiner-presets";

export type PresetMap = Record<PresetField, ExaminerPreset[]>;

/** Caps, so a stuck key or a bad paste cannot write a megabyte into settings. */
export const MAX_PRESETS_PER_FIELD = 40;
export const MAX_PRESET_LENGTH = 240;

export function defaultPresetMap(): PresetMap {
  const map = {} as PresetMap;
  for (const field of PRESET_FIELDS) {
    map[field] = DEFAULT_PRESETS[field].map((text) => ({ id: presetId(field, text), text }));
  }
  return map;
}

/**
 * Whatever was stored, made safe to render.
 *
 * Anything unrecognised in a field falls back to that field's defaults rather
 * than to an empty list. An examiner opening a review should never be shown
 * an empty tick list because a JSON blob got mangled — they would reasonably
 * conclude the feature was off and write the whole comment by hand.
 */
export function normalisePresetMap(raw: unknown): PresetMap {
  const map = defaultPresetMap();
  if (!raw || typeof raw !== "object") return map;

  for (const field of PRESET_FIELDS) {
    const list = (raw as Record<string, unknown>)[field];
    if (!Array.isArray(list)) continue;

    const cleaned: ExaminerPreset[] = [];
    const seen = new Set<string>();
    for (const entry of list) {
      if (!entry || typeof entry !== "object") continue;
      const { id, text } = entry as { id?: unknown; text?: unknown };
      if (typeof text !== "string") continue;
      const trimmed = text.trim().slice(0, MAX_PRESET_LENGTH);
      if (!trimmed) continue;
      // An id that went missing is derived back from the text. Losing the tie
      // to an already-ticked box is better than dropping the preset.
      const key = typeof id === "string" && id ? id : presetId(field, trimmed);
      if (seen.has(key)) continue;
      seen.add(key);
      cleaned.push({ id: key, text: trimmed });
      if (cleaned.length >= MAX_PRESETS_PER_FIELD) break;
    }

    // An empty list is a real choice — a field someone deliberately cleared —
    // so it is kept. Only a field that is absent or malformed falls back.
    map[field] = cleaned;
  }

  return map;
}

export async function loadPresetMap(admin: SupabaseClient): Promise<PresetMap> {
  // supabase-js returns { data, error } rather than throwing.
  const { data, error } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", PRESETS_SETTING_KEY)
    .maybeSingle<{ value: string }>();

  if (error) {
    console.error("[presets] could not read site_settings", error.message);
    return defaultPresetMap();
  }
  if (!data?.value) return defaultPresetMap();

  try {
    return normalisePresetMap(JSON.parse(data.value));
  } catch {
    console.error("[presets] stored value is not JSON; falling back to defaults");
    return defaultPresetMap();
  }
}

/**
 * Replaces one field's list.
 *
 * Read-modify-write on the whole blob, so two people editing different fields
 * at the same moment can lose one of the two edits. With two examiners that
 * is a coincidence rather than a risk, and the alternative — a row per preset
 * — needs a migration this could not get.
 */
export async function savePresetField(
  admin: SupabaseClient,
  field: PresetField,
  presets: ExaminerPreset[]
): Promise<{ error?: string }> {
  const current = await loadPresetMap(admin);
  const next = { ...current, [field]: presets };

  const { error } = await admin
    .from("site_settings")
    .upsert([{ key: PRESETS_SETTING_KEY, value: JSON.stringify(next) }]);

  if (error) return { error: error.message };
  return {};
}
