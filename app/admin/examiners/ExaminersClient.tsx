"use client";

import { useState, useActionState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createExaminerAction, updateExaminerAction, deleteExaminerAction,
  updateBypassSettingsAction, saveAiPromptAction, clearAiPromptAction,
  createAdminPasscodeAction, updateAdminPasscodeAction, deleteAdminPasscodeAction,
} from "../actions";

const NAVY = "#333333";

type Tab = "examiners" | "ai_prompt" | "passcodes";

type Examiner = { id: string; name: string; email: string; passcode: string; created_at: string };
type AdminPasscode = { id: string; name: string; passcode: string; created_at: string };
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
  aiPrompt: string;
  defaultPrompt: string;
  adminPasscodes: AdminPasscode[];
}

// ── Shared input styles ───────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2 rounded-lg border border-navy/15 text-[13px] bg-[#F3F2FB] outline-none";

// ── Examiner form ─────────────────────────────────────────────────────────────
function ExaminerForm({ examiner, onDone }: { examiner?: Examiner; onDone: () => void }) {
  const action = examiner ? updateExaminerAction : createExaminerAction;
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) onDone();
  }, [state.success]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {examiner && <input type="hidden" name="id" value={examiner.id} />}
      {state.error && <p className="text-[12px] text-red-600">{state.error}</p>}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">Name</label>
          <input name="name" defaultValue={examiner?.name} required placeholder="Dr Jane Smith" className={inputCls} />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">Email</label>
          <input name="email" type="email" defaultValue={examiner?.email} required placeholder="jane@example.com" className={inputCls} />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">Passcode</label>
          <input name="passcode" defaultValue={examiner?.passcode} required placeholder="e.g. spring2025" className={inputCls} />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: NAVY, border: "none", cursor: "pointer", opacity: pending ? 0.6 : 1 }}>
          {pending ? "Saving…" : examiner ? "Save Changes" : "Add Examiner"}
        </button>
        <button type="button" onClick={onDone} className="px-5 py-2 rounded-lg text-[13px] text-navy/50" style={{ background: "none", border: "1px solid rgba(51,51,51,0.15)", cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Admin passcode form ───────────────────────────────────────────────────────
function PasscodeForm({ passcode, onDone }: { passcode?: AdminPasscode; onDone: () => void }) {
  const action = passcode ? updateAdminPasscodeAction : createAdminPasscodeAction;
  const [state, formAction, pending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) onDone();
  }, [state.success]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {passcode && <input type="hidden" name="id" value={passcode.id} />}
      {state.error && <p className="text-[12px] text-red-600">{state.error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">Name / Label</label>
          <input name="name" defaultValue={passcode?.name} required placeholder="e.g. Brandon (personal)" className={inputCls} />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/50">Passcode</label>
          <input name="passcode" defaultValue={passcode?.passcode} required placeholder="e.g. admin2025" className={inputCls} />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: NAVY, border: "none", cursor: "pointer", opacity: pending ? 0.6 : 1 }}>
          {pending ? "Saving…" : passcode ? "Save Changes" : "Add Passcode"}
        </button>
        <button type="button" onClick={onDone} className="px-5 py-2 rounded-lg text-[13px] text-navy/50" style={{ background: "none", border: "1px solid rgba(51,51,51,0.15)", cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ExaminersClient({ examiners, activity, filters, bypassSettings, aiPrompt, defaultPrompt, adminPasscodes }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("examiners");
  const [isPending, startTransition] = useTransition();

  // Examiner list state
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Bypass toggle
  const [bypassEnabled, setBypassEnabled] = useState(bypassSettings.enabled);
  const [, bypassAction, bypassPending] = useActionState(updateBypassSettingsAction, {});

  // Activity filters
  const [from, setFrom] = useState(filters.from);
  const [to, setTo] = useState(filters.to);
  const [examinerFilter, setExaminerFilter] = useState(filters.examiner);

  // AI prompt
  const [promptText, setPromptText] = useState(aiPrompt || defaultPrompt);
  const [promptState, promptAction, promptPending] = useActionState(saveAiPromptAction, {});
  const [showPromptSaved, setShowPromptSaved] = useState(false);
  const [clearPending, startClearTransition] = useTransition();
  useEffect(() => {
    if ("success" in promptState && promptState.success) {
      setShowPromptSaved(true);
      const t = setTimeout(() => setShowPromptSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [promptState]);

  // Admin passcodes state
  const [showCreatePasscode, setShowCreatePasscode] = useState(false);
  const [editPasscodeId, setEditPasscodeId] = useState<string | null>(null);

  const examinerMap = new Map(examiners.map((e) => [e.id, e]));

  function applyFilters() {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (examinerFilter) params.set("examiner", examinerFilter);
    router.push(`/admin/examiners?${params.toString()}`);
  }

  function handleDeleteExaminer(id: string, name: string) {
    if (!confirm(`Remove examiner "${name}"? Their past reviews will be retained.`)) return;
    startTransition(async () => {
      await deleteExaminerAction(id);
      window.location.reload();
    });
  }

  function handleDeletePasscode(id: string, name: string) {
    if (!confirm(`Delete passcode for "${name}"?`)) return;
    startTransition(async () => {
      await deleteAdminPasscodeAction(id);
      window.location.reload();
    });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "examiners", label: "Examiners" },
    { id: "ai_prompt", label: "AI Prompt" },
    { id: "passcodes", label: "Admin Passcodes" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="font-display font-bold text-[22px] text-navy">Examiners &amp; Settings</h1>
        {tab === "examiners" && !showCreate && (
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: NAVY, border: "none", cursor: "pointer" }}>
            + Add Examiner
          </button>
        )}
        {tab === "passcodes" && !showCreatePasscode && (
          <button onClick={() => setShowCreatePasscode(true)} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: NAVY, border: "none", cursor: "pointer" }}>
            + Add Passcode
          </button>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-navy/10 p-1.5" style={{ width: "fit-content" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-1.5 rounded-lg text-[13px] font-semibold transition"
            style={{
              background: tab === t.id ? NAVY : "transparent",
              color: tab === t.id ? "white" : "rgba(51,51,51,0.45)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Examiners tab ─────────────────────────────────────────────────────── */}
      {tab === "examiners" && (
        <>
          {/* Credit bypass */}
          <div className="bg-white rounded-xl border border-navy/10 px-4 py-3 mb-5 flex items-center gap-3">
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
            <div className="bg-white rounded-xl border border-navy/10 p-5 mb-5">
              <h2 className="text-[14px] font-bold text-navy mb-4">New Examiner</h2>
              <ExaminerForm onDone={() => { setShowCreate(false); window.location.reload(); }} />
            </div>
          )}

          {/* Examiner list */}
          <div className="flex flex-col gap-2 mb-10">
            {examiners.length === 0 && (
              <div className="bg-white rounded-xl border border-navy/10 px-5 py-4 text-[13px] text-navy/40">No examiners yet. Add one above.</div>
            )}
            {examiners.map((ex) => (
              <div key={ex.id} className="bg-white rounded-xl border border-navy/10 p-5">
                {editId === ex.id ? (
                  <ExaminerForm examiner={ex} onDone={() => { setEditId(null); window.location.reload(); }} />
                ) : (
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-semibold text-[14px] text-navy">{ex.name}</div>
                      <div className="text-[12px] text-navy/50">{ex.email}</div>
                      <div className="text-[11px] mt-1 font-mono" style={{ color: "rgba(51,51,51,0.35)" }}>Passcode: {ex.passcode}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditId(ex.id)} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg" style={{ background: "rgba(51,51,51,0.07)", border: "none", color: NAVY, cursor: "pointer" }}>Edit</button>
                      <button onClick={() => handleDeleteExaminer(ex.id, ex.name)} disabled={isPending} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", border: "none", color: "#B91C1C", cursor: "pointer" }}>Remove</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Activity log */}
          <div>
            <h2 className="font-display font-bold text-[18px] text-navy mb-4">Marking Activity</h2>
            <div className="bg-white rounded-xl border border-navy/10 p-4 mb-4 flex items-end gap-3 flex-wrap">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/40">From</label>
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-1.5 rounded-lg border border-navy/15 text-[13px] bg-[#F3F2FB] outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/40">To</label>
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-1.5 rounded-lg border border-navy/15 text-[13px] bg-[#F3F2FB] outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1 text-navy/40">Examiner</label>
                <select value={examinerFilter} onChange={(e) => setExaminerFilter(e.target.value)} className="px-3 py-1.5 rounded-lg border border-navy/15 text-[13px] bg-[#F3F2FB] outline-none">
                  <option value="">All examiners</option>
                  {examiners.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <button onClick={applyFilters} className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white" style={{ background: NAVY, border: "none", cursor: "pointer" }}>Filter</button>
              {(from || to || examinerFilter) && (
                <button onClick={() => { setFrom(""); setTo(""); setExaminerFilter(""); router.push("/admin/examiners"); }} className="text-[12px] text-navy/40 px-3 py-1.5" style={{ background: "none", border: "none", cursor: "pointer" }}>Clear</button>
              )}
            </div>
            {activity.length === 0 ? (
              <div className="bg-white rounded-xl border border-navy/10 px-5 py-4 text-[13px] text-navy/40">No marking activity found.</div>
            ) : (
              <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
                <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(51,51,51,0.08)" }}>
                      {["Date", "Examiner", "Station", "Candidate", "Status"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((row) => {
                      const ex = row.examiner_id ? examinerMap.get(row.examiner_id) : null;
                      return (
                        <tr key={row.id} style={{ borderBottom: "1px solid rgba(51,51,51,0.05)" }}>
                          <td className="px-4 py-3 text-navy/60">{row.examiner_reviewed_at ? new Date(row.examiner_reviewed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                          <td className="px-4 py-3 font-semibold text-navy">{ex?.name ?? "Unknown"}</td>
                          <td className="px-4 py-3 text-navy/80"><span className="text-navy/40 mr-1.5">#{row.station_number}</span>{row.station_title}</td>
                          <td className="px-4 py-3 text-navy/60">{row.doctor_display_name}</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={row.status === "sent" ? { background: "rgba(59,130,246,0.1)", color: "#1D4ED8" } : { background: "rgba(34,197,94,0.1)", color: "#166534" }}>
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
        </>
      )}

      {/* ── AI Prompt tab ─────────────────────────────────────────────────────── */}
      {tab === "ai_prompt" && (
        <div className="bg-white rounded-xl border border-navy/10 p-6">
          <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
            <div>
              <h2 className="text-[15px] font-bold text-navy">AI Marking Instructions</h2>
              <p className="text-[12px] text-navy/45 mt-0.5">
                Sent to Claude as the grading system prompt for every consultation. Changes apply to new recordings only.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {showPromptSaved && <span className="text-[12px] font-semibold" style={{ color: "#166534" }}>✓ Saved</span>}
            </div>
          </div>

          <div className="mt-1 mb-3 flex gap-2 text-[11px]">
            <span
              className="px-2 py-0.5 rounded font-semibold"
              style={{
                background: promptText === defaultPrompt ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                color: promptText === defaultPrompt ? "#166534" : "#92400E",
              }}
            >
              {promptText === defaultPrompt ? "Using default" : "Custom prompt active"}
            </span>
          </div>

          <form action={promptAction} className="flex flex-col gap-3">
            <textarea
              name="ai_prompt"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={16}
              className="w-full px-3 py-2.5 rounded-lg border border-navy/15 text-[12.5px] font-mono resize-y"
              style={{ color: NAVY, background: "#F9F9FC", outline: "none", lineHeight: 1.6 }}
            />
            {"error" in promptState && promptState.error && (
              <p className="text-[12px] text-red-600">{String(promptState.error)}</p>
            )}
            <div className="flex gap-2 flex-wrap">
              <button
                type="submit"
                disabled={promptPending}
                className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white"
                style={{ background: NAVY, border: "none", cursor: "pointer", opacity: promptPending ? 0.6 : 1 }}
              >
                {promptPending ? "Saving…" : "Set as Default"}
              </button>
              <button
                type="button"
                disabled={clearPending}
                onClick={() => {
                  startClearTransition(async () => {
                    await clearAiPromptAction();
                    setPromptText(defaultPrompt);
                    setShowPromptSaved(true);
                    setTimeout(() => setShowPromptSaved(false), 3000);
                  });
                }}
                className="px-5 py-2 rounded-lg text-[13px]"
                style={{ background: "none", border: "1px solid rgba(51,51,51,0.15)", color: "rgba(51,51,51,0.5)", cursor: "pointer", opacity: clearPending ? 0.6 : 1 }}
              >
                Return to Default
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Admin Passcodes tab ───────────────────────────────────────────────── */}
      {tab === "passcodes" && (
        <>
          <div className="bg-white rounded-xl border border-navy/10 px-5 py-3 mb-4 text-[12px] text-navy/50" style={{ lineHeight: 1.6 }}>
            These passcodes grant full admin access at <code className="text-[11.5px] font-mono bg-navy/5 px-1 rounded">/admin/login</code>. Each one is tied to a name so you know who has access.
          </div>

          {showCreatePasscode && (
            <div className="bg-white rounded-xl border border-navy/10 p-5 mb-5">
              <h2 className="text-[14px] font-bold text-navy mb-4">New Admin Passcode</h2>
              <PasscodeForm onDone={() => { setShowCreatePasscode(false); window.location.reload(); }} />
            </div>
          )}

          <div className="flex flex-col gap-2">
            {adminPasscodes.length === 0 && (
              <div className="bg-white rounded-xl border border-navy/10 px-5 py-4 text-[13px] text-navy/40">No additional passcodes yet. The ADMIN_PASSWORD env var is always active.</div>
            )}
            {adminPasscodes.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-navy/10 p-5">
                {editPasscodeId === p.id ? (
                  <PasscodeForm passcode={p} onDone={() => { setEditPasscodeId(null); window.location.reload(); }} />
                ) : (
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-semibold text-[14px] text-navy">{p.name}</div>
                      <div className="text-[11px] mt-0.5 font-mono" style={{ color: "rgba(51,51,51,0.35)" }}>
                        Passcode: {p.passcode}
                      </div>
                      <div className="text-[11px] mt-0.5 text-navy/35">
                        Added {new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditPasscodeId(p.id)} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg" style={{ background: "rgba(51,51,51,0.07)", border: "none", color: NAVY, cursor: "pointer" }}>Edit</button>
                      <button onClick={() => handleDeletePasscode(p.id, p.name)} disabled={isPending} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", border: "none", color: "#B91C1C", cursor: "pointer" }}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
