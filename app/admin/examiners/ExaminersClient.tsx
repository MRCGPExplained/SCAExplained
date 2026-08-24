"use client";

import { useState, useActionState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createExaminerAction, updateExaminerAction, deleteExaminerAction,
  updateBypassSettingsAction, saveAiPromptAction, clearAiPromptAction,
  toggleExaminerIsAdminAction, toggleDeepgramAction, setVercelPlanAction, toggleResendAction,
  toggleDailyCoAction, bulkMarkExaminerPaidAction,
} from "../actions";

const NAVY = "#333333";

type Tab = "examiners" | "ai_prompt" | "transcription" | "resend";

type Examiner = { id: string; name: string; email: string; passcode: string; is_admin: boolean; created_at: string };
type ActivityRow = {
  id: string;
  station_number: number;
  station_title: string;
  doctor_display_name: string;
  examiner_reviewed_at: string | null;
  sent_to_candidate_at: string | null;
  status: string;
  examiner_id: string | null;
  examiner_paid_at: string | null;
};
type BypassSettings = { enabled: boolean; emails: string };

interface Props {
  examiners: Examiner[];
  activity: ActivityRow[];
  filters: { from: string; to: string; examiner: string };
  bypassSettings: BypassSettings;
  aiPrompt: string;
  defaultPrompt: string;
  deepgramEnabled: boolean;
  vercelPlan: "hobby" | "pro";
  resendEnabled: boolean;
  dailyCoEnabled: boolean;
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

// ── Main component ────────────────────────────────────────────────────────────
export default function ExaminersClient({ examiners, activity, filters, bypassSettings, aiPrompt, defaultPrompt, deepgramEnabled: initialDeepgram, vercelPlan: initialVercelPlan, resendEnabled: initialResend, dailyCoEnabled: initialDailyCo }: Props) {
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

  // Deepgram toggle
  const [deepgramOn, setDeepgramOn] = useState(initialDeepgram);
  const [deepgramPending, startDeepgramTransition] = useTransition();
  const [deepgramErr, setDeepgramErr] = useState("");

  // Vercel plan
  const [vercelPlan, setVercelPlan] = useState<"hobby" | "pro">(initialVercelPlan);
  const [vercelPlanPending, startVercelPlanTransition] = useTransition();

  // Resend toggle
  const [resendOn, setResendOn] = useState(initialResend);
  const [resendPending, startResendTransition] = useTransition();
  const [resendErr, setResendErr] = useState("");

  // DailyCo toggle
  const [dailyCoOn, setDailyCoOn] = useState(initialDailyCo);
  const [dailyCoPending, startDailyCoTransition] = useTransition();
  const [dailyCoErr, setDailyCoErr] = useState("");

  // Activity selection + bulk pay
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [markingPaid, setMarkingPaid] = useState(false);
  const [payErr, setPayErr] = useState("");

  useEffect(() => {
    if ("success" in promptState && promptState.success) {
      setShowPromptSaved(true);
      const t = setTimeout(() => setShowPromptSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [promptState]);

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

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll(rows: ActivityRow[]) {
    setSelectedIds((prev) =>
      prev.size === rows.length ? new Set() : new Set(rows.map((r) => r.id))
    );
  }

  async function handleMarkPaid() {
    if (!selectedIds.size) return;
    setMarkingPaid(true);
    setPayErr("");
    const result = await bulkMarkExaminerPaidAction(Array.from(selectedIds));
    setMarkingPaid(false);
    if (result.error) { setPayErr(result.error); return; }
    setSelectedIds(new Set());
    router.refresh();
  }

  function handleCreateInvoice(rows: ActivityRow[]) {
    const selected = rows.filter((r) => selectedIds.has(r.id));
    if (!selected.length) return;

    const examinerNames = [...new Set(
      selected.map((r) => (r.examiner_id ? examinerMap.get(r.examiner_id)?.name : null) ?? "Unknown")
    )].join(", ");

    const fmtDate = (iso: string | null) =>
      iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

    const tableRows = selected.map((r) => {
      const exName = (r.examiner_id ? examinerMap.get(r.examiner_id)?.name : null) ?? "Unknown";
      return `<tr>
        <td>${fmtDate(r.examiner_reviewed_at)}</td>
        <td>${exName}</td>
        <td>#${r.station_number} ${r.station_title}</td>
        <td>${r.doctor_display_name}</td>
        <td style="text-align:right">£4.00</td>
      </tr>`;
    }).join("");

    const total = selected.length * 4;
    const periodLine = (from || to) ? `Period: ${from || "—"} to ${to || "—"}<br>` : "";
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    const html = `<!DOCTYPE html><html><head><title>SCA Focus — Examiner Invoice</title>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #222; }

  /* Yellow header band */
  .top-band { background: #F6D44B; padding: 28px 48px; display: flex; align-items: center; justify-content: space-between; }

  /* Logo mark */
  .logo { display: flex; align-items: center; gap: 14px; }
  .logo-badge { background: #333; border-radius: 8px; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .logo-badge span { font-size: 15px; font-weight: 900; color: #F6D44B; letter-spacing: 0.04em; }
  .logo-text { display: flex; flex-direction: column; gap: 1px; }
  .logo-text .name { font-size: 22px; font-weight: 800; color: #333; letter-spacing: -0.02em; line-height: 1; }
  .logo-text .name em { font-style: normal; color: #333; opacity: 0.45; }
  .logo-text .tagline { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; color: rgba(51,51,51,0.55); }

  /* Invoice title in band */
  .invoice-title { text-align: right; }
  .invoice-title .word { font-size: 36px; font-weight: 900; color: #333; letter-spacing: -0.03em; line-height: 1; }
  .invoice-title .date { font-size: 12px; font-weight: 600; color: rgba(51,51,51,0.55); margin-top: 4px; letter-spacing: 0.02em; }

  /* Body */
  .body { padding: 40px 48px 52px; }

  /* Billing grid */
  .billing-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; margin-bottom: 40px; border: 1px solid #eee; border-radius: 10px; overflow: hidden; }
  .billing-cell { padding: 18px 20px; border-right: 1px solid #eee; }
  .billing-cell:last-child { border-right: none; }
  .billing-cell .lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #bbb; margin-bottom: 5px; }
  .billing-cell .val { font-size: 13.5px; color: #333; font-weight: 600; line-height: 1.5; }
  .billing-cell .val.light { font-weight: 400; color: #555; }

  /* Table */
  .table-wrap { border: 1px solid #eee; border-radius: 10px; overflow: hidden; margin-bottom: 0; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #333; }
  thead th { text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.65); padding: 11px 16px; }
  thead th:last-child { text-align: right; }
  tbody tr { border-bottom: 1px solid #f2f2f2; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:nth-child(even) { background: #fafaf8; }
  tbody td { padding: 10px 16px; font-size: 12.5px; vertical-align: top; color: #444; }
  tbody td:last-child { text-align: right; font-variant-numeric: tabular-nums; color: #333; font-weight: 600; }
  .dim { color: #bbb; }

  /* Total strip */
  .total-strip { background: #333; margin: 0 -1px -1px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; border-radius: 0 0 9px 9px; }
  .total-strip .tl { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.6); }
  .total-strip .tr { font-size: 22px; font-weight: 900; color: #F6D44B; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .total-strip .sub { font-size: 11px; color: rgba(255,255,255,0.38); font-weight: 400; margin-top: 1px; }

  /* Footer */
  .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
  .footer-left { display: flex; align-items: center; gap: 10px; }
  .footer-badge { background: #F6D44B; border-radius: 5px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
  .footer-badge span { font-size: 8px; font-weight: 900; color: #333; letter-spacing: 0.04em; }
  .footer-text { font-size: 11px; font-weight: 600; color: #333; }
  .footer-right { font-size: 11px; color: #bbb; text-align: right; line-height: 1.6; }

  /* Print button */
  .print-btn { display: flex; align-items: center; gap-8px; margin-top: 28px; padding: 11px 26px; background: #333; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
  .print-btn:hover { background: #111; }

  @media print {
    .print-btn { display: none !important; }
    body { background: white; }
    .body { padding: 32px 40px 40px; }
    .top-band { padding: 22px 40px; }
  }
</style>
</head>
<body>

  <!-- Yellow header band with logo + invoice label -->
  <div class="top-band">
    <div class="logo">
      <div class="logo-badge"><span>SCA</span></div>
      <div class="logo-text">
        <div class="name">Explained<em>.</em></div>
        <div class="tagline">GP SCA Preparation</div>
      </div>
    </div>
    <div class="invoice-title">
      <div class="word">Invoice</div>
      <div class="date">${today}</div>
    </div>
  </div>

  <div class="body">

    <!-- Billing details grid -->
    <div class="billing-grid">
      <div class="billing-cell">
        <div class="lbl">Bill To</div>
        <div class="val">${examinerNames}</div>
      </div>
      <div class="billing-cell">
        <div class="lbl">Period</div>
        <div class="val light">${from || to ? `${from || "—"} &rarr; ${to || "—"}` : "All dates"}</div>
      </div>
      <div class="billing-cell">
        <div class="lbl">Rate</div>
        <div class="val light">£4.00 per recording</div>
      </div>
    </div>

    <!-- Line items table -->
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Date</th><th>Examiner</th><th>Station</th><th>Candidate</th><th>Amount</th></tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      <!-- Total strip inside the table border -->
      <div class="total-strip">
        <div>
          <div class="tl">Total Due</div>
          <div class="sub">${selected.length} recording${selected.length === 1 ? "" : "s"} × £4.00</div>
        </div>
        <div class="tr">£${total.toFixed(2)}</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">
        <div class="footer-badge"><span>SCA</span></div>
        <div class="footer-text">SCA Focus &middot; scafocus.com &middot; mrcgpexplained@outlook.com</div>
      </div>
      <div class="footer-right">
        For educational purposes only<br>
        © ${new Date().getFullYear()} SCA Focus
      </div>
    </div>

    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

</body></html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "examiners", label: "Examiners" },
    { id: "ai_prompt", label: "AI Prompt" },
    { id: "transcription", label: "Transcription" },
    { id: "resend", label: "Resend" },
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
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-[14px] text-navy">{ex.name}</div>
                        {ex.is_admin && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.04em]" style={{ background: "rgba(99,102,241,0.1)", color: "#4338CA" }}>Admin</span>
                        )}
                      </div>
                      <div className="text-[12px] text-navy/50">{ex.email}</div>
                      <div className="text-[11px] mt-1 font-mono" style={{ color: "rgba(51,51,51,0.35)" }}>Passcode: {ex.passcode}</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => startTransition(async () => {
                          await toggleExaminerIsAdminAction(ex.id, !ex.is_admin);
                          window.location.reload();
                        })}
                        className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition"
                        style={{
                          background: ex.is_admin ? "rgba(99,102,241,0.1)" : "rgba(51,51,51,0.07)",
                          border: "none",
                          color: ex.is_admin ? "#4338CA" : "rgba(51,51,51,0.45)",
                          cursor: "pointer",
                        }}
                      >
                        {ex.is_admin ? "Admin: ON" : "Admin: OFF"}
                      </button>
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

            {/* Filters */}
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
                <button onClick={() => { setFrom(""); setTo(""); setExaminerFilter(""); setSelectedIds(new Set()); router.push("/admin/examiners"); }} className="text-[12px] text-navy/40 px-3 py-1.5" style={{ background: "none", border: "none", cursor: "pointer" }}>Clear</button>
              )}
            </div>

            {activity.length === 0 ? (
              <div className="bg-white rounded-xl border border-navy/10 px-5 py-4 text-[13px] text-navy/40">No marking activity found.</div>
            ) : (() => {
              const unpaid = activity.filter((r) => !r.examiner_paid_at);
              const paid = activity.filter((r) => r.examiner_paid_at);
              const allSelected = selectedIds.size === activity.length;
              const someSelected = selectedIds.size > 0;

              return (
                <>
                  {/* Summary stats */}
                  <div className="flex gap-3 mb-4 flex-wrap">
                    <div className="bg-white rounded-xl border border-navy/10 px-4 py-3 flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-navy/40">Total</span>
                      <span className="text-[20px] font-bold text-navy">{activity.length}</span>
                      <span className="text-[12px] text-navy/40">£{(activity.length * 4).toFixed(0)}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-navy/10 px-4 py-3 flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "#92400E" }}>Unpaid</span>
                      <span className="text-[20px] font-bold" style={{ color: "#92400E" }}>{unpaid.length}</span>
                      <span className="text-[12px]" style={{ color: "#92400E", opacity: 0.7 }}>£{(unpaid.length * 4).toFixed(0)}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-navy/10 px-4 py-3 flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "#166534" }}>Paid</span>
                      <span className="text-[20px] font-bold" style={{ color: "#166534" }}>{paid.length}</span>
                      <span className="text-[12px]" style={{ color: "#166534", opacity: 0.7 }}>£{(paid.length * 4).toFixed(0)}</span>
                    </div>
                  </div>

                  {/* Bulk action bar */}
                  {someSelected && (
                    <div className="flex items-center gap-3 mb-3 px-4 py-2.5 rounded-xl flex-wrap" style={{ background: "rgba(51,51,51,0.05)", border: "1px solid rgba(51,51,51,0.1)" }}>
                      <span className="text-[13px] font-semibold text-navy">{selectedIds.size} selected</span>
                      <button
                        onClick={handleMarkPaid}
                        disabled={markingPaid}
                        className="px-4 py-1.5 rounded-lg text-[12px] font-semibold text-white disabled:opacity-50"
                        style={{ background: "#166534", border: "none", cursor: "pointer" }}
                      >
                        {markingPaid ? "Marking…" : `Mark ${selectedIds.size} as Paid`}
                      </button>
                      <button
                        onClick={() => handleCreateInvoice(activity)}
                        className="px-4 py-1.5 rounded-lg text-[12px] font-semibold"
                        style={{ background: NAVY, color: "white", border: "none", cursor: "pointer" }}
                      >
                        Create Invoice
                      </button>
                      <button
                        onClick={() => setSelectedIds(new Set())}
                        className="text-[12px] text-navy/40"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                      >
                        Deselect all
                      </button>
                      {payErr && <span className="text-[12px] text-red-600">{payErr}</span>}
                    </div>
                  )}

                  {/* Table */}
                  <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
                    <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(51,51,51,0.08)" }}>
                          <th className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={() => toggleSelectAll(activity)}
                              style={{ cursor: "pointer" }}
                            />
                          </th>
                          {["Date", "Examiner", "Station", "Candidate", "Status", "Payment"].map((h) => (
                            <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activity.map((row) => {
                          const ex = row.examiner_id ? examinerMap.get(row.examiner_id) : null;
                          const isSelected = selectedIds.has(row.id);
                          return (
                            <tr
                              key={row.id}
                              onClick={() => toggleSelect(row.id)}
                              style={{ borderBottom: "1px solid rgba(51,51,51,0.05)", background: isSelected ? "rgba(51,51,51,0.03)" : undefined, cursor: "pointer" }}
                            >
                              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(row.id)} style={{ cursor: "pointer" }} />
                              </td>
                              <td className="px-4 py-3 text-navy/60 whitespace-nowrap">
                                {row.examiner_reviewed_at ? new Date(row.examiner_reviewed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                              </td>
                              <td className="px-4 py-3 font-semibold text-navy">{ex?.name ?? "Unknown"}</td>
                              <td className="px-4 py-3 text-navy/80"><span className="text-navy/40 mr-1.5">#{row.station_number}</span>{row.station_title}</td>
                              <td className="px-4 py-3 text-navy/60">{row.doctor_display_name}</td>
                              <td className="px-4 py-3">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={row.status === "sent" ? { background: "rgba(59,130,246,0.1)", color: "#1D4ED8" } : { background: "rgba(34,197,94,0.1)", color: "#166534" }}>
                                  {row.status === "sent" ? "Sent" : "Reviewed"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {row.examiner_paid_at ? (
                                  <span className="text-[11px] font-semibold" style={{ color: "#166534" }}>
                                    Paid {new Date(row.examiner_paid_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-semibold" style={{ color: "#92400E" }}>Unpaid</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        </>
      )}

      {/* ── Transcription tab ────────────────────────────────────────────────── */}
      {tab === "transcription" && (
        <div className="bg-white rounded-xl border border-navy/10 p-6">
          <h2 className="text-[15px] font-bold text-navy mb-1">Deepgram Transcription</h2>
          <p className="text-[12px] text-navy/45 mb-6">
            When enabled, consultation audio is transcribed by Deepgram and graded by AI before reaching the examiner queue.
            When disabled, recordings skip transcription and go straight to the examiner queue with audio only.
          </p>

          <div className="flex flex-col gap-5">
            {/* Deepgram on/off */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                disabled={deepgramPending}
                onClick={() => {
                  const next = !deepgramOn;
                  setDeepgramOn(next);
                  setDeepgramErr("");
                  startDeepgramTransition(async () => {
                    const res = await toggleDeepgramAction(next);
                    if (res.error) { setDeepgramOn(!next); setDeepgramErr(res.error); }
                  });
                }}
                className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition disabled:opacity-50"
                style={{
                  background: deepgramOn ? "rgba(34,197,94,0.12)" : "rgba(51,51,51,0.07)",
                  border: `1.5px solid ${deepgramOn ? "rgba(34,197,94,0.3)" : "rgba(51,51,51,0.12)"}`,
                  color: deepgramOn ? "#166534" : "rgba(51,51,51,0.45)",
                  cursor: "pointer",
                }}
              >
                {deepgramPending ? "Saving…" : deepgramOn ? "Deepgram: ON" : "Deepgram: OFF"}
              </button>
              <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>
                {deepgramOn
                  ? "Recordings will be transcribed and AI-graded."
                  : "Recordings skip transcription — examiner gets audio only."}
              </span>
              {deepgramErr && <span className="text-[12px] text-red-600">{deepgramErr}</span>}
            </div>

            {/* Vercel plan */}
            {deepgramOn && (
              <div style={{ paddingTop: 16, borderTop: "1px solid rgba(51,51,51,0.07)" }}>
                <div className="text-[12px] font-semibold mb-1" style={{ color: NAVY }}>Vercel Plan</div>
                <p className="text-[12px] mb-3" style={{ color: "rgba(51,51,51,0.45)" }}>
                  Hobby has a 60s function limit — real Deepgram transcription will time out. Set to Hobby to use a hardcoded transcript instead (AI grading still runs).
                </p>
                <div className="flex gap-2">
                  {(["pro", "hobby"] as const).map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      disabled={vercelPlanPending}
                      onClick={() => {
                        setVercelPlan(plan);
                        startVercelPlanTransition(async () => { await setVercelPlanAction(plan); });
                      }}
                      className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition disabled:opacity-50 capitalize"
                      style={{
                        background: vercelPlan === plan ? NAVY : "rgba(51,51,51,0.07)",
                        border: "1.5px solid transparent",
                        color: vercelPlan === plan ? "white" : "rgba(51,51,51,0.45)",
                        cursor: "pointer",
                      }}
                    >
                      {plan === "pro" ? "Pro / Enterprise" : "Hobby"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DailyCo on/off */}
            <div style={{ paddingTop: 16, borderTop: "1px solid rgba(51,51,51,0.07)" }}>
              <div className="text-[12px] font-semibold mb-1" style={{ color: NAVY }}>DailyCo Live Audio</div>
              <p className="text-[12px] mb-3" style={{ color: "rgba(51,51,51,0.45)" }}>
                When enabled, study room participants get a live audio call for the 12-minute consultation. When disabled, the call feature is hidden — participants only record locally as before.
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={dailyCoPending}
                  onClick={() => {
                    const next = !dailyCoOn;
                    setDailyCoOn(next);
                    setDailyCoErr("");
                    startDailyCoTransition(async () => {
                      const res = await toggleDailyCoAction(next);
                      if (res.error) { setDailyCoOn(!next); setDailyCoErr(res.error); }
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition disabled:opacity-50"
                  style={{
                    background: dailyCoOn ? "rgba(34,197,94,0.12)" : "rgba(51,51,51,0.07)",
                    border: `1.5px solid ${dailyCoOn ? "rgba(34,197,94,0.3)" : "rgba(51,51,51,0.12)"}`,
                    color: dailyCoOn ? "#166534" : "rgba(51,51,51,0.45)",
                    cursor: "pointer",
                  }}
                >
                  {dailyCoPending ? "Saving…" : dailyCoOn ? "DailyCo: ON" : "DailyCo: OFF"}
                </button>
                <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>
                  {dailyCoOn
                    ? "Live audio call is available in study rooms."
                    : "Live audio call is disabled."}
                </span>
                {dailyCoErr && <span className="text-[12px] text-red-600">{dailyCoErr}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Resend tab ───────────────────────────────────────────────────────── */}
      {tab === "resend" && (
        <div className="bg-white rounded-xl border border-navy/10 p-6">
          <h2 className="text-[15px] font-bold text-navy mb-1">Resend Emails</h2>
          <p className="text-[12px] text-navy/45 mb-6">
            When disabled, all outbound emails are silently skipped. Useful during testing to avoid burning Resend quota.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={resendPending}
              onClick={() => {
                const next = !resendOn;
                setResendOn(next);
                setResendErr("");
                startResendTransition(async () => {
                  const res = await toggleResendAction(next);
                  if (res.error) { setResendOn(!next); setResendErr(res.error); }
                });
              }}
              className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition disabled:opacity-50"
              style={{
                background: resendOn ? "rgba(34,197,94,0.12)" : "rgba(51,51,51,0.07)",
                border: `1.5px solid ${resendOn ? "rgba(34,197,94,0.3)" : "rgba(51,51,51,0.12)"}`,
                color: resendOn ? "#166534" : "rgba(51,51,51,0.45)",
                cursor: "pointer",
              }}
            >
              {resendPending ? "Saving…" : resendOn ? "Resend: ON" : "Resend: OFF"}
            </button>
            <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>
              {resendOn ? "Emails are being sent normally." : "All emails are disabled — nothing will be sent."}
            </span>
            {resendErr && <span className="text-[12px] text-red-600">{resendErr}</span>}
          </div>
        </div>
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

    </div>
  );
}
