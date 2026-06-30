"use client";

import { useActionState, useState } from "react";
import { type ActionResult } from "../actions";

interface TicketDefaults {
  webinarTitle: string;
  webinarCapacity: number;
  intensiveTitle: string;
  activeCapacity: number;
  activePricePounds: number;
  observerCapacity: number;
  observerPricePounds: number;
}

interface Props {
  mode: "create" | "edit";
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
  defaults: TicketDefaults;
  initial?: {
    id: string;
    event_type: string;
    title: string;
    description: string;
    date: string;      // YYYY-MM-DD
    start_time: string; // HH:MM
    end_time: string;   // HH:MM
    zoom_link: string;
    status: string;
    webinar_capacity?: number;
    active_capacity?: number;
    active_price_pounds?: number;
    observer_capacity?: number;
    observer_price_pounds?: number;
  };
}

const WEBINAR_TITLE = "How To Get A Clear Pass";
const INTENSIVE_TITLE = "SCA Intensive";
const WEBINAR_DESC = "2-hour free training on what examiners are scoring.";
const INTENSIVE_DESC =
  "Small-group live workshop. Six stations — maximum two active candidates, minimum three consultations each.";

export function EventForm({ mode, action, defaults, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const [eventType, setEventType] = useState<string>(
    initial?.event_type ?? "intensive"
  );
  const [title, setTitle] = useState(
    initial?.title ?? defaults.intensiveTitle
  );
  const [description, setDescription] = useState(
    initial?.description ?? INTENSIVE_DESC
  );
  const [startTime, setStartTime] = useState(
    initial?.start_time ?? "10:00"
  );
  const [endTime, setEndTime] = useState(
    initial?.end_time ?? "12:00"
  );

  const isEdit = mode === "edit";
  const isWebinar = eventType === "webinar";

  function switchType(t: string) {
    setEventType(t);
    // Only auto-fill if in create mode and the user hasn't diverged from defaults
    if (mode === "create") {
      const isW = t === "webinar";
      setTitle(isW ? defaults.webinarTitle : defaults.intensiveTitle);
      setDescription(isW ? WEBINAR_DESC : INTENSIVE_DESC);
      setStartTime(isW ? "18:00" : "10:00");
      setEndTime(isW ? "20:00" : "12:00");
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[640px]">
      {isEdit && (
        <input type="hidden" name="id" value={initial?.id} />
      )}

      {/* Event type — locked on edit, selectable on create */}
      <div className="flex flex-col gap-1.5">
        <label className="label">Event type</label>
        {isEdit ? (
          <>
            <input type="hidden" name="event_type" value={eventType} />
            <p className="text-[14px] font-semibold text-navy capitalize">{eventType}</p>
          </>
        ) : (
          <div className="flex gap-3">
            {["intensive", "webinar"].map((t) => (
              <label
                key={t}
                className={[
                  "flex items-center gap-2 rounded-xl border px-4 py-3 cursor-pointer text-[13.5px] font-semibold capitalize transition",
                  eventType === t
                    ? "border-navy bg-navy/[0.05] text-navy"
                    : "border-navy/15 text-navy/60 hover:border-navy/40",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="event_type"
                  value={t}
                  checked={eventType === t}
                  onChange={() => switchType(t)}
                  className="accent-navy"
                />
                {t === "intensive" ? "SCA Intensive (paid)" : "Free Webinar"}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="label" htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="field"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="label" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="field resize-none"
        />
      </div>

      {/* Date + Times */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="label" htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={initial?.date ?? ""}
            className="field"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label" htmlFor="start_time">Start (UK time)</label>
          <input
            id="start_time"
            name="start_time"
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="field"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label" htmlFor="end_time">End (UK time)</label>
          <input
            id="end_time"
            name="end_time"
            type="time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="field"
          />
        </div>
      </div>

      {/* Zoom link */}
      <div className="flex flex-col gap-1.5">
        <label className="label" htmlFor="zoom_link">Zoom link</label>
        <input
          id="zoom_link"
          name="zoom_link"
          type="url"
          placeholder="https://us02web.zoom.us/j/..."
          defaultValue={initial?.zoom_link ?? ""}
          className="field"
        />
        <p className="text-[11.5px] text-navy/45">Never shown publicly — sent in confirmation email only.</p>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label className="label" htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={initial?.status ?? "scheduled"} className="field">
          <option value="scheduled">Scheduled</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Ticket fields */}
      {isWebinar ? (
        <div className="border border-navy/10 rounded-xl p-5 bg-white flex flex-col gap-4">
          <p className="text-[12px] font-bold tracking-[0.06em] uppercase text-navy/55">Webinar tickets</p>
          <div className="flex flex-col gap-1.5 max-w-[180px]">
            <label className="label" htmlFor="webinar_capacity">Capacity</label>
            <input
              id="webinar_capacity"
              name="webinar_capacity"
              type="number"
              min="1"
              required
              defaultValue={initial?.webinar_capacity ?? defaults.webinarCapacity}
              className="field"
            />
          </div>
        </div>
      ) : (
        <div className="border border-navy/10 rounded-xl p-5 bg-white flex flex-col gap-4">
          <p className="text-[12px] font-bold tracking-[0.06em] uppercase text-navy/55">Intensive tickets</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="label" htmlFor="active_capacity">Active capacity</label>
              <input
                id="active_capacity"
                name="active_capacity"
                type="number"
                min="1"
                required
                defaultValue={initial?.active_capacity ?? defaults.activeCapacity}
                className="field"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label" htmlFor="active_price">Active price (£)</label>
              <input
                id="active_price"
                name="active_price"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={initial?.active_price_pounds ?? defaults.activePricePounds}
                className="field"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label" htmlFor="observer_capacity">Observer capacity</label>
              <input
                id="observer_capacity"
                name="observer_capacity"
                type="number"
                min="0"
                required
                defaultValue={initial?.observer_capacity ?? defaults.observerCapacity}
                className="field"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label" htmlFor="observer_price">Observer price (£)</label>
              <input
                id="observer_price"
                name="observer_price"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={initial?.observer_price_pounds ?? defaults.observerPricePounds}
                className="field"
              />
            </div>
          </div>
        </div>
      )}

      {state.error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-[13px] text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-navy text-white text-[14px] font-bold px-6 py-3 rounded-xl hover:bg-navy/90 transition disabled:opacity-60"
        >
          {pending
            ? "Saving…"
            : isEdit
            ? "Save changes"
            : "Create event"}
        </button>
        <a
          href="/admin"
          className="text-[14px] font-semibold text-navy/55 px-4 py-3 rounded-xl hover:text-navy transition no-underline"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
