"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import {
  listModelConsultationCandidatesAction,
  setModelConsultationAction,
  clearModelConsultationAction,
  type ModelConsultationCandidate,
} from "@/app/admin/actions";

const NAVY = "#1A1B52";
const LIGHT_BG = "#F3F2FB";

/**
 * Admin-only: choose which take is published as this station's model
 * consultation.
 *
 * Lists only recordings that still have both tracks, newest first, because a
 * row whose audio has been swept has nothing left to copy. Filtering is by
 * name or email, which is what an admin has to hand once someone has agreed
 * to their consultation being used.
 */
export function ModelConsultationPicker({
  stationId,
  stationNumber,
  hasExisting,
}: {
  stationId: string;
  stationNumber: number;
  hasExisting: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ModelConsultationCandidate[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    // Debounced, so typing an email does not fire a query per keystroke.
    const t = setTimeout(async () => {
      const result = await listModelConsultationCandidatesAction(stationNumber, query);
      if (cancelled) return;
      if ("error" in result) setError(result.error);
      else {
        setError("");
        setRows(result.rows);
      }
    }, query ? 300 : 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [open, query, stationNumber]);

  function choose(recordingId: string) {
    start(async () => {
      const result = await setModelConsultationAction(stationId, recordingId);
      if (result.error) setError(result.error);
      else setOpen(false);
    });
  }

  function clear() {
    start(async () => {
      const result = await clearModelConsultationAction(stationId);
      if (result.error) setError(result.error);
    });
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={pending}
          className="text-[11px] font-semibold px-2.5 py-1 rounded"
          style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.12)", color: NAVY, cursor: "pointer" }}
        >
          {hasExisting ? "Change" : "Select"}
        </button>
        {hasExisting && (
          <button
            type="button"
            onClick={clear}
            disabled={pending}
            className="text-[11px] font-semibold px-2.5 py-1 rounded"
            style={{ background: "none", border: "none", color: "#B91C1C", cursor: "pointer" }}
          >
            Remove
          </button>
        )}
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center z-[70] px-6"
            style={{ background: "rgba(26,27,82,0.55)" }}
            onClick={() => !pending && setOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="mc-heading"
              className="w-full max-w-[560px] rounded-2xl p-6 max-h-[82vh] flex flex-col"
              style={{ background: "white", boxShadow: "0 20px 60px rgba(26,27,82,0.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="mc-heading" className="font-display font-extrabold text-[16px] mb-1" style={{ color: NAVY }}>
                Model consultation for station {stationNumber}
              </h2>
              <p className="text-[12px] mb-4" style={{ color: "rgba(26,27,82,0.55)" }}>
                The audio and transcript are copied, so the published copy survives
                retention and anything the candidate does to their own take.
              </p>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by name or email"
                className="w-full rounded-lg px-3 py-2 text-[13px] mb-3"
                style={{ border: "1px solid rgba(26,27,82,0.15)", background: LIGHT_BG, color: NAVY, outline: "none" }}
              />

              {error && <p className="text-[12px] mb-2" style={{ color: "#B91C1C" }}>{error}</p>}

              <div className="overflow-y-auto flex flex-col gap-1.5">
                {rows === null ? (
                  <p className="text-[12.5px]" style={{ color: "rgba(26,27,82,0.45)" }}>Loading…</p>
                ) : rows.length === 0 ? (
                  <p className="text-[12.5px]" style={{ color: "rgba(26,27,82,0.45)" }}>
                    No recordings for this station still have both tracks.
                  </p>
                ) : (
                  rows.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => choose(r.id)}
                      disabled={pending}
                      className="text-left rounded-lg px-3 py-2.5"
                      style={{
                        background: LIGHT_BG,
                        border: "1px solid rgba(26,27,82,0.08)",
                        cursor: pending ? "default" : "pointer",
                      }}
                    >
                      <span className="block text-[13px] font-semibold" style={{ color: NAVY }}>
                        {r.doctor_display_name ?? "Unknown"}
                        {r.patient_display_name ? ` with ${r.patient_display_name}` : ""}
                      </span>
                      <span className="block text-[11.5px]" style={{ color: "rgba(26,27,82,0.5)" }}>
                        {new Date(r.started_at).toLocaleString("en-GB")}
                        {r.candidate_email ? ` · ${r.candidate_email}` : ""}
                      </span>
                    </button>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="w-full text-[12px] mt-4"
                style={{ background: "none", border: "none", color: "rgba(26,27,82,0.5)", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
