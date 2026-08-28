"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { replyToStationReportAction } from "../actions";

const NAVY = "#333333";

type ReportType = "feedback" | "help";

/** The three pills. "report" is AI-report feedback, which has its own shape. */
type Tab = ReportType | "report";

export type ReportFeedbackRow = {
  id: string;
  recording_id: string;
  agrees: boolean;
  comment: string | null;
  created_at: string;
  station_recordings: {
    station_number: number;
    station_title: string;
    doctor_display_name: string;
    candidate_email: string | null;
  } | null;
};

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

// The timezone must be pinned, not left to the runtime: this renders on the
// server (UTC) and again on the client (Europe/London), so through BST the two
// differ by an hour and React throws a hydration mismatch on every load.
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/London",
  });
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

/**
 * One candidate's verdict on an AI report. Read-only: unlike case feedback and
 * help, there is no reply — it is a quality signal about the marking itself.
 */
function ReportFeedbackRowCard({ row }: { row: ReportFeedbackRow }) {
  const rec = row.station_recordings;
  return (
    <div className="rounded-2xl border border-navy/10 bg-white px-5 py-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-navy m-0">
            {rec ? `Station #${rec.station_number} — ${rec.station_title}` : "Recording unavailable"}
          </p>
          <p className="text-[12px] text-navy/50 mt-0.5 m-0">
            {rec?.doctor_display_name ?? "Unknown"}
            {rec?.candidate_email ? ` · ${rec.candidate_email}` : ""} · {fmtDate(row.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.04em]"
            style={
              row.agrees
                ? { background: "rgba(34,197,94,0.12)", color: "#166534" }
                : { background: "rgba(239,68,68,0.12)", color: "#B91C1C" }
            }
          >
            {row.agrees ? "Agreed" : "Disagreed"}
          </span>
          <a
            href={`/recordings/${row.recording_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-navy/50 hover:text-navy transition no-underline"
          >
            View report →
          </a>
        </div>
      </div>
      {row.comment?.trim() && (
        <p
          className="text-[13.5px] leading-[1.6] mt-3 mb-0 px-3 py-2 rounded-lg"
          style={{ background: "rgba(51,51,51,0.04)", color: "rgba(51,51,51,0.75)", whiteSpace: "pre-line" }}
        >
          {row.comment}
        </p>
      )}
    </div>
  );
}

export function FeedbackClient({
  reports,
  reportFeedback,
}: {
  reports: Report[];
  reportFeedback: ReportFeedbackRow[];
}) {
  const [tab, setTab] = useState<Tab>("feedback");
  const [sortAsc, setSortAsc] = useState(false);
  const [awaitingOnly, setAwaitingOnly] = useState(false);

  // Report feedback is a one-way signal about AI marking quality — there is
  // nobody to reply to — so the reply-oriented controls don't apply to it.
  const isReplyTab = tab !== "report";

  const counts = {
    feedbackAwaiting: reports.filter((r) => r.type === "feedback" && !r.resolved).length,
    helpAwaiting: reports.filter((r) => r.type === "help" && !r.resolved).length,
    disagreements: reportFeedback.filter((r) => !r.agrees).length,
  };

  const filtered = reports
    .filter((r) => r.type === tab)
    .filter((r) => !awaitingOnly || !r.resolved)
    .sort((a, b) => {
      const delta = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortAsc ? delta : -delta;
    });

  const sortedReportFeedback = [...reportFeedback].sort((a, b) => {
    const delta = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return sortAsc ? delta : -delta;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-1 bg-white rounded-xl border border-navy/10 p-1.5" style={{ width: "fit-content" }}>
          {([
            { id: "feedback" as const, label: "Case Feedback", awaiting: counts.feedbackAwaiting },
            { id: "report" as const, label: "Report Feedback", awaiting: counts.disagreements },
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
          {isReplyTab && (
            <label className="flex items-center gap-2 text-[12.5px] text-navy/60 cursor-pointer">
              <input type="checkbox" checked={awaitingOnly} onChange={(e) => setAwaitingOnly(e.target.checked)} className="rounded" />
              Only awaiting reply
            </label>
          )}
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

      {tab === "report" ? (
        sortedReportFeedback.length === 0 ? (
          <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
            <p className="text-[14px] text-navy/40">No report feedback yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedReportFeedback.map((r) => (
              <ReportFeedbackRowCard key={r.id} row={r} />
            ))}
          </div>
        )
      ) : filtered.length === 0 ? (
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
