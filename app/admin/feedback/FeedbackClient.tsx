"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { replyToStationReportAction } from "../actions";

const NAVY = "#333333";

type ReportType = "feedback" | "help";

type Report = {
  id: string;
  station_number: number | null;
  station_title: string | null;
  user_name: string | null;
  user_email: string | null;
  content: string;
  type: ReportType;
  resolved: boolean;
  reply_text: string | null;
  replied_at: string | null;
  replied_by_name: string | null;
  created_at: string;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ReplyRow({ report }: { report: Report }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!reply.trim()) return;
    setSending(true);
    setError("");
    const result = await replyToStationReportAction(report.id, reply);
    setSending(false);
    if (result.error) { setError(result.error); return; }
    setExpanded(false);
    setReply("");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-navy/10 bg-white p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-[13.5px] text-navy">{report.user_name ?? "Unknown"}</span>
            {report.user_email && <span className="text-[12px] text-navy/40">{report.user_email}</span>}
          </div>
          <div className="text-[12px] text-navy/45 mb-2">
            Station #{report.station_number} — {report.station_title} · {fmtDate(report.created_at)}
          </div>
          <p className="text-[13.5px] leading-[1.6] text-navy/80 whitespace-pre-wrap">{report.content}</p>
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.04em] shrink-0"
          style={report.resolved
            ? { background: "rgba(34,197,94,0.1)", color: "#166534" }
            : { background: "rgba(217,119,6,0.12)", color: "#B45309" }}
        >
          {report.resolved ? "Replied" : "Awaiting reply"}
        </span>
      </div>

      {report.resolved && report.reply_text && (
        <div className="mt-4 rounded-lg p-3.5" style={{ background: "rgba(51,51,51,0.04)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-navy/40 mb-1">
            Reply from {report.replied_by_name} · {report.replied_at && fmtDate(report.replied_at)}
          </div>
          <p className="text-[13px] leading-[1.6] text-navy/70 whitespace-pre-wrap">{report.reply_text}</p>
        </div>
      )}

      {!report.resolved && (
        <div className="mt-4">
          {!expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="px-4 py-2 rounded-lg text-[12.5px] font-semibold text-white"
              style={{ background: NAVY, border: "none", cursor: "pointer" }}
            >
              Reply
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              {error && <p className="text-[12px] text-red-600">{error}</p>}
              <textarea
                autoFocus
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                placeholder={`Reply to ${report.user_name ?? "this candidate"}…`}
                className="w-full border border-navy/20 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-navy/50 resize-y"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={submit}
                  disabled={sending || !reply.trim()}
                  className="px-4 py-2 rounded-lg text-[12.5px] font-semibold text-white disabled:opacity-50"
                  style={{ background: NAVY, border: "none", cursor: sending ? "not-allowed" : "pointer" }}
                >
                  {sending ? "Sending…" : "Send Reply"}
                </button>
                <button
                  type="button"
                  onClick={() => { setExpanded(false); setReply(""); setError(""); }}
                  disabled={sending}
                  className="text-[12.5px] text-navy/40 hover:text-navy/70 transition"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FeedbackClient({ reports }: { reports: Report[] }) {
  const [tab, setTab] = useState<ReportType>("feedback");
  const [sortAsc, setSortAsc] = useState(false);
  const [awaitingOnly, setAwaitingOnly] = useState(false);

  const counts = {
    feedback: reports.filter((r) => r.type === "feedback").length,
    feedbackAwaiting: reports.filter((r) => r.type === "feedback" && !r.resolved).length,
    help: reports.filter((r) => r.type === "help").length,
    helpAwaiting: reports.filter((r) => r.type === "help" && !r.resolved).length,
  };

  const filtered = reports
    .filter((r) => r.type === tab)
    .filter((r) => !awaitingOnly || !r.resolved)
    .sort((a, b) => {
      const delta = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortAsc ? delta : -delta;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-1 bg-white rounded-xl border border-navy/10 p-1.5" style={{ width: "fit-content" }}>
          {([
            { id: "feedback" as const, label: "Feedback", awaiting: counts.feedbackAwaiting },
            { id: "help" as const, label: "Help", awaiting: counts.helpAwaiting },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-1.5 rounded-lg text-[13px] font-semibold transition flex items-center gap-1.5"
              style={{
                background: tab === t.id ? NAVY : "transparent",
                color: tab === t.id ? "white" : "rgba(51,51,51,0.45)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {t.label}
              {t.awaiting > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: tab === t.id ? "rgba(255,255,255,0.2)" : "rgba(217,119,6,0.15)",
                    color: tab === t.id ? "white" : "#B45309",
                  }}
                >
                  {t.awaiting}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-[12.5px] text-navy/60 cursor-pointer">
            <input type="checkbox" checked={awaitingOnly} onChange={(e) => setAwaitingOnly(e.target.checked)} className="rounded" />
            Only awaiting reply
          </label>
          <button
            type="button"
            onClick={() => setSortAsc((v) => !v)}
            className="text-[12.5px] font-semibold text-navy/60 hover:text-navy transition flex items-center gap-1"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {sortAsc ? "Oldest first" : "Newest first"} ↕
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
          <p className="text-[14px] text-navy/40">
            {awaitingOnly ? "Nothing awaiting reply." : `No ${tab} submissions yet.`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <ReplyRow key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  );
}
