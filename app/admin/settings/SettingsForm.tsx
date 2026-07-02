"use client";

import { useActionState } from "react";
import { updateSettings } from "../actions";

const SETTINGS_SCHEMA = [
  {
    group: "Free Training",
    items: [
      {
        key: "FREE_TRAINING_YOUTUBE_ID",
        label: "How To Get A Clear Pass — YouTube video ID",
        type: "text",
        hint: "The ID from the YouTube URL, e.g. dQw4w9WgXcQ (not the full URL). Leave blank to show a placeholder.",
      },
    ],
  },
  {
    group: "Live Session",
    items: [
      {
        key: "LIVE_SESSION_ZOOM_URL",
        label: "Zoom registration URL for the next live session",
        type: "url",
        hint: "Paste the Zoom registration link here. Leave blank to show 'No session scheduled' on the live-session page.",
      },
    ],
  },
  {
    group: "Observer gating",
    items: [
      {
        key: "OBSERVER_UNLOCKED_AT",
        label: "Observer unlocked after N confirmed Active bookings",
        type: "number",
        hint: "1 = require at least one Active Candidate before Observers can book. 0 = always allow.",
      },
    ],
  },
  {
    group: "Free webinar defaults",
    items: [
      { key: "DEFAULT_WEBINAR_TITLE", label: "Default title", type: "text", hint: "" },
      { key: "DEFAULT_WEBINAR_CAPACITY", label: "Capacity", type: "number", hint: "" },
      { key: "DEFAULT_WEBINAR_START", label: "Default start time (HH:MM, UK)", type: "time", hint: "" },
      { key: "DEFAULT_WEBINAR_END", label: "Default end time (HH:MM, UK)", type: "time", hint: "" },
      { key: "DEFAULT_WEBINAR_DESCRIPTION", label: "Default description", type: "text", hint: "" },
    ],
  },
  {
    group: "SCA Intensive defaults",
    items: [
      { key: "DEFAULT_INTENSIVE_TITLE", label: "Default title", type: "text", hint: "" },
      { key: "DEFAULT_INTENSIVE_ACTIVE_CAPACITY", label: "Active Candidate capacity", type: "number", hint: "" },
      { key: "DEFAULT_INTENSIVE_ACTIVE_PRICE", label: "Active Candidate price (pence — 20000 = £200)", type: "number", hint: "" },
      { key: "DEFAULT_INTENSIVE_OBSERVER_CAPACITY", label: "Observer capacity", type: "number", hint: "" },
      { key: "DEFAULT_INTENSIVE_OBSERVER_PRICE", label: "Observer price (pence — 5000 = £50)", type: "number", hint: "" },
      { key: "DEFAULT_INTENSIVE_START", label: "Default start time (HH:MM, UK)", type: "time", hint: "" },
      { key: "DEFAULT_INTENSIVE_END", label: "Default end time (HH:MM, UK)", type: "time", hint: "" },
      { key: "DEFAULT_INTENSIVE_DESCRIPTION", label: "Default description", type: "text", hint: "" },
    ],
  },
];

export function SettingsForm({
  currentValues,
}: {
  currentValues: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(updateSettings, {});

  return (
    <form action={formAction} className="flex flex-col gap-8 max-w-[680px]">
      {SETTINGS_SCHEMA.map((group) => (
        <div key={group.group}>
          <h2 className="font-display font-bold text-[16px] text-navy mb-4">
            {group.group}
          </h2>
          <div className="rounded-2xl border border-navy/10 bg-white p-5 flex flex-col gap-5">
            {group.items.map((item) => (
              <div key={item.key} className="flex flex-col gap-1.5">
                <label
                  htmlFor={item.key}
                  className="text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55"
                >
                  {item.label}
                </label>
                <input
                  id={item.key}
                  name={`setting_${item.key}`}
                  type={item.type}
                  defaultValue={currentValues[item.key] ?? ""}
                  className="field max-w-[360px]"
                />
                {item.hint && (
                  <p className="text-[11.5px] text-navy/40">{item.hint}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {state.error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-[13px] text-red-700">
          {state.error}
        </p>
      )}

      {!state.error && state !== undefined && Object.keys(state).length > 0 && (
        <p className="text-[13px] text-green-700 font-semibold">Settings saved.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-navy text-white text-[14px] font-bold px-6 py-3 rounded-xl hover:bg-navy/90 transition disabled:opacity-60 self-start"
      >
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
