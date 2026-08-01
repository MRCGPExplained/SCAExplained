"use client";

import { useState, useActionState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createExaminerAction, updateExaminerAction, deleteExaminerAction, updateBypassSettingsAction } from "../actions";

const NAVY = "#333333";

type Examiner = { id: string; name: string; email: string; passcode: string; created_at: string };
type ActivityRow = {
  id: string;
  station_number: number;
  station_title: string;
  doctor_display_name: string;
  examiner_reviewed_at: string | null;
  sent_to_candidate_at: string | null;
  status: string;
  examiner_id: string | null;
};
type BypassSettings = { enabled: boolean; emails: string };

interface Props {
  examiners: Examiner[];
  activity: ActivityRow[];
  filters: { from: string; to: string; examiner: string };
  bypassSettings: BypassSettings;
}

function ExaminerForm({
  examiner,
  onDone,
}: {
  examiner?: Examiner;
  onDone: () => void;
}) {
  const action = examiner ? updateExaminerAction : createExaminerAction;
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) onDone();
  }, [state.success]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {examiner && <input type="hidden" name="id" value={examiner.id} />}

      {state.error && (
        <p className="text-[12px] text-red-600">{state.error}</p>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">Name</label>
          <input
            name="name"
            defaultValue={examiner?.name}
            required
            placeholder="Dr Jane Smith"
            className="w-full px-3 py-2 rounded-lg border border-navy/15 text-[13px] bg-[#F3F2FB] outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={examiner?.email}
            required
            placeholder="jane@example.com"
            className="w-full px-3 py-2 rounded-lg border border-navy/15 text-[13px] bg-[#F3F2FB] outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">Passcode</label>
          <input
            name="passcode"
            defaultValue={examiner?.passcode}
            required
            placeholder="e.g. spring2025"
            className="w-full px-3 py-2 rounded-lg border border-navy/15 text-[13px] bg-[#F3F2FB] outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white"
          style={{ background: NAVY, border: "none", cursor: "pointer", opacity: pending ? 0.6 : 1 }}
        >
          {pending ? "Saving…" : examiner ? "Save Changes" : "Add Examiner"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-5 py-2 rounded-lg text-[13px] text-navy/50"
          style={{ background: "none", border: "1px solid rgba(51,51,51,0.15)", cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ExaminersClient({ examiners, activity, filters, bypassSettings }: Props) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Bypass settings state
  const [bypassEnabled, setBypassEnabled] = useState(bypassSettings.enabled);
  const [bypassState, bypassAction, bypassPending] = useActionState(updateBypassSettingsAction, {});

  const [from, setFrom] = useState(filters.from);
  const [to, setTo] = useState(filters.to);
  const [examinerFilter, setExaminerFilter] = useState(filters.examiner);

  function applyFilters() {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (examinerFilter) params.set("examiner", examinerFilter);
    router.push(`/admin/examiners?${params.toString()}`);
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Remove examiner "${name}"? Their past reviews will be retained.`)) return;
    startTransition(async () => {
      await deleteExaminerAction(id);
      window.location.reload();
    });
  }

  const examinerMap = new Map(examiners.map((e) => [e.id, e]));

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-[22px] text-navy">Examiners</h1>
          <p className="text-[13px] text-navy/50 mt-0.5">
            Manage examiner accounts. Each examiner logs in with their passcode only.
          </p>
        </div>
        {!showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
            style={{ background: NAVY, border: "none", cursor: "pointer" }}
          >
            + Add Examiner
          </button>
        )}
      </div>

      {/* Recording bypass toggle */}
      <div className="bg-white rounded-xl border border-navy/10 px-4 py-3 mb-6 flex items-center gap-3">
        <span className="text-[12px] font-semibold text-navy/60">Credit bypass</span>
        <button
          onClick={() => {
            const fd = new FormData();
            fd.set("bypass_enabled", (!bypassEnabled).toString());
            fd.set("bypass_emails", "");
            setBypassEnabled((v) => !v);
            startTransition(() => { bypassAction(fd); });
          }}
          disabled={bypassPending}
          className="px-3 py-1 rounded-md text-[11px] font-bold transition disabled:opacity-50"
          style={{
            background: bypassEnabled ? "rgba(34,197,94,0.12)" : "rgba(51,51,51,0.07)",
            color: bypassEnabled ? "#166534" : "rgba(51,51,51,0.4)",
            border: `1px solid ${bypassEnabled ? "rgba(34,197,94,0.25)" : "rgba(51,51,51,0.1)"}`,
            cursor: "pointer",
          }}
        >
          {bypassEnabled ? "ON" : "OFF"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-navy/10 p-5 mb-6">
          <h2 className="text-[14px] font-bold text-navy mb-4">New Examiner</h2>
          <ExaminerForm onDone={() => { setShowCreate(false); window.location.reload(); }} />
        </div>
      )}

      {/* Examiner list */}
      <div className="flex flex-col gap-2 mb-10">
        {examiners.length === 0 && (
          <div className="bg-white rounded-xl border border-navy/10 px-5 py-4 text-[13px] text-navy/40">
            No examiners yet. Add one above.
          </div>
        )}
        {examiners.map((ex) => (
          <div key={ex.id} className="bg-white rounded-xl border border-navy/10 p-5">
            {editId === ex.id ? (
              <ExaminerForm
                examiner={ex}
                onDone={() => { setEditId(null); window.location.reload(); }}
              />
            ) : (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold text-[14px] text-navy">{ex.name}</div>
                  <div className="text-[12px] text-navy/50">{ex.email}</div>
                  <div className="text-[11px] mt-1 font-mono" style={{ color: "rgba(51,51,51,0.35)" }}>
                    Passcode: {ex.passcode}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditId(ex.id)}
                    className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(51,51,51,0.07)", border: "none", color: NAVY, cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ex.id, ex.name)}
                    disabled={isPending}
                    className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.08)", border: "none", color: "#B91C1C", cursor: "pointer" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Activity log */}
      <div>
        <h2 className="font-display font-bold text-[18px] text-navy mb-4">Marking Activity</h2>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-navy/10 p-4 mb-4 flex items-end gap-3 flex-wrap">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/40">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-navy/15 text-[13px] bg-[#F3F2FB] outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/40">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-navy/15 text-[13px] bg-[#F3F2FB] outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/40">Examiner</label>
            <select
              value={examinerFilter}
              onChange={(e) => setExaminerFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-navy/15 text-[13px] bg-[#F3F2FB] outline-none"
            >
              <option value="">All examiners</option>
              {examiners.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={applyFilters}
            className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white"
            style={{ background: NAVY, border: "none", cursor: "pointer" }}
          >
            Filter
          </button>
          {(from || to || examinerFilter) && (
            <button
              onClick={() => { setFrom(""); setTo(""); setExaminerFilter(""); router.push("/admin/examiners"); }}
              className="text-[12px] text-navy/40 px-3 py-1.5"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Clear
            </button>
          )}
        </div>

        {activity.length === 0 ? (
          <div className="bg-white rounded-xl border border-navy/10 px-5 py-4 text-[13px] text-navy/40">
            No marking activity found for the selected filters.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
            <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(51,51,51,0.08)" }}>
                  {["Date", "Examiner", "Station", "Candidate", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activity.map((row) => {
                  const ex = row.examiner_id ? examinerMap.get(row.examiner_id) : null;
                  return (
                    <tr key={row.id} style={{ borderBottom: "1px solid rgba(51,51,51,0.05)" }}>
                      <td className="px-4 py-3 text-navy/60">
                        {row.examiner_reviewed_at
                          ? new Date(row.examiner_reviewed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-navy">{ex?.name ?? "Unknown"}</td>
                      <td className="px-4 py-3 text-navy/80">
                        <span className="text-navy/40 mr-1.5">#{row.station_number}</span>
                        {row.station_title}
                      </td>
                      <td className="px-4 py-3 text-navy/60">{row.doctor_display_name}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                          style={
                            row.status === "sent"
                              ? { background: "rgba(59,130,246,0.1)", color: "#1D4ED8" }
                              : { background: "rgba(34,197,94,0.1)", color: "#166534" }
                          }
                        >
                          {row.status === "sent" ? "Sent" : "Reviewed"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
