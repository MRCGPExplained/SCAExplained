"use client";

import { useActionState } from "react";
import { createLiveSessionAction, deleteLiveSessionAction } from "./actions";

type Session = { id: string; zoom_url: string; scheduled_at: string };

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Europe/London",
  }).format(new Date(iso));
}

export function LiveSessionsClient({ sessions }: { sessions: Session[] }) {
  const [state, formAction, pending] = useActionState(createLiveSessionAction, { success: false } as { error?: string; success?: boolean });

  return (
    <div className="flex flex-col gap-8 max-w-[700px]">

      {/* Existing sessions */}
      <div>
        <h2 className="font-display font-bold text-[16px] text-navy mb-3">Scheduled sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-[13px] text-navy/40">No sessions scheduled.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((s) => (
              <div key={s.id} className="rounded-xl border border-navy/10 bg-white px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] font-semibold text-navy">{formatDate(s.scheduled_at)}</p>
                  <p className="text-[12px] text-navy/40 mt-0.5 truncate max-w-[380px]">{s.zoom_url}</p>
                </div>
                <form action={deleteLiveSessionAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    type="submit"
                    className="text-[12px] font-semibold text-red-500 hover:text-red-700 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add session form */}
      <div>
        <h2 className="font-display font-bold text-[16px] text-navy mb-3">Add a session</h2>
        <form action={formAction} className="rounded-2xl border border-navy/10 bg-white p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="scheduled_at" className="text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55">
              Date &amp; Time
            </label>
            <input
              id="scheduled_at"
              name="scheduled_at"
              type="datetime-local"
              required
              className="field max-w-[280px]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="zoom_url" className="text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55">
              Zoom Registration URL
            </label>
            <input
              id="zoom_url"
              name="zoom_url"
              type="url"
              placeholder="https://us02web.zoom.us/meeting/register/..."
              required
              className="field"
            />
          </div>

          {state && "error" in state && state.error && (
            <p className="text-[13px] text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="bg-navy text-white text-[14px] font-bold px-5 py-2.5 rounded-xl hover:bg-[#F6D44B] hover:text-[#333333] transition disabled:opacity-60 self-start"
          >
            {pending ? "Adding…" : "Add Session"}
          </button>
        </form>
      </div>
    </div>
  );
}
