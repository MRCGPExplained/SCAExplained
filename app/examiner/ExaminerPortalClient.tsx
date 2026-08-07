"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RetryPipelineButton from "./RetryPipelineButton";

const NAVY = "#333333";

export type QueueRow = {
  id: string;
  station_number: number;
  station_title: string;
  doctor_display_name: string;
  candidate_email: string | null;
  started_at: string;
  status: string;
  ai_data_gathering: string | null;
  ai_clinical_management: string | null;
  ai_relating_to_others: string | null;
  examiner_data_gathering: string | null;
  examiner_clinical_management: string | null;
  examiner_relating_to_others: string | null;
  sent_to_candidate_at: string | null;
  doctor_audio_path: string | null;
  examiner_id: string | null;
  manually_checked_at: string | null;
  examiners: { name: string } | null;
};

type Examiner = { id: string; name: string };
type Tab = "gp" | "ai";
type DateRange = "all" | "today" | "7d" | "30d";

interface Props {
  gpRows: QueueRow[];
  aiRows: QueueRow[];
  examiners: Examiner[];
  pipelineRetryEnabled: boolean;
}

function withinRange(startedAt: string, range: DateRange): boolean {
  if (range === "all") return true;
  const then = new Date(startedAt).getTime();
  const now = Date.now();
  if (range === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return then >= start.getTime();
  }
  const days = range === "7d" ? 7 : 30;
  return then >= now - days * 24 * 60 * 60 * 1000;
}

function matchesUser(rec: QueueRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    (rec.doctor_display_name ?? "").toLowerCase().includes(q) ||
    (rec.candidate_email ?? "").toLowerCase().includes(q)
  );
}

export default function ExaminerPortalClient({ gpRows, aiRows, examiners, pipelineRetryEnabled }: Props) {
  const [tab, setTab] = useState<Tab>("gp");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [userQuery, setUserQuery] = useState("");
  const [reviewerFilter, setReviewerFilter] = useState<string>("all");
  const [completedOpen, setCompletedOpen] = useState(false);

  const gpFiltered = useMemo(
    () =>
      gpRows.filter(
        (r) =>
          withinRange(r.started_at, dateRange) &&
          matchesUser(r, userQuery) &&
          (reviewerFilter === "all" || r.examiner_id === reviewerFilter)
      ),
    [gpRows, dateRange, userQuery, reviewerFilter]
  );

  const queue = gpFiltered.filter((r) => r.status === "pending_examiner" || r.status === "reviewing");
  const completed = gpFiltered.filter((r) => r.status === "reviewed" || r.status === "sent");

  const aiFiltered = useMemo(
    () => aiRows.filter((r) => withinRange(r.started_at, dateRange) && matchesUser(r, userQuery)),
    [aiRows, dateRange, userQuery]
  );

  return (
    <div>
      {/* Pill toggle */}
      <div
        className="inline-flex p-1 rounded-xl mb-6"
        style={{ background: "rgba(51,51,51,0.06)" }}
      >
        {(["gp", "ai"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg text-[13px] font-bold transition"
            style={{
              background: tab === t ? "white" : "transparent",
              color: tab === t ? NAVY : "rgba(51,51,51,0.45)",
              border: "none",
              cursor: "pointer",
              boxShadow: tab === t ? "0 1px 3px rgba(51,51,51,0.12)" : "none",
            }}
          >
            {t === "gp" ? `GP (${gpRows.length})` : `AI (${aiRows.length})`}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-end gap-3 flex-wrap mb-6">
        <Field label="Date">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="rounded-lg px-3 py-2 text-[13px] outline-none"
            style={{ border: "1px solid rgba(51,51,51,0.15)", background: "white", color: NAVY }}
          >
            <option value="all">All dates</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </Field>

        <Field label="User">
          <input
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Name or email"
            className="rounded-lg px-3 py-2 text-[13px] outline-none"
            style={{ border: "1px solid rgba(51,51,51,0.15)", background: "white", color: NAVY, minWidth: 200 }}
          />
        </Field>

        {tab === "gp" && (
          <Field label="Reviewed by">
            <select
              value={reviewerFilter}
              onChange={(e) => setReviewerFilter(e.target.value)}
              className="rounded-lg px-3 py-2 text-[13px] outline-none"
              style={{ border: "1px solid rgba(51,51,51,0.15)", background: "white", color: NAVY }}
            >
              <option value="all">All examiners</option>
              {examiners.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </Field>
        )}
      </div>

      {tab === "gp" ? (
        <>
          <div className="mb-8">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.06em] mb-3" style={{ color: "rgba(51,51,51,0.45)" }}>
              Awaiting Review ({queue.length})
            </h2>
            {queue.length === 0 ? (
              <EmptyState label="Queue is clear." />
            ) : (
              <div className="flex flex-col gap-2.5">
                {queue.map((rec) => (
                  <RecordingCard key={rec.id} rec={rec} tab="gp" pipelineRetryEnabled={pipelineRetryEnabled} />
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setCompletedOpen((v) => !v)}
              className="flex items-center gap-2 mb-3"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <svg
                width="14" height="14" viewBox="0 0 16 16" fill="none"
                style={{ transform: completedOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s" }}
              >
                <path d="M4 6l4 4 4-4" stroke="rgba(51,51,51,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.45)" }}>
                Completed ({completed.length})
              </span>
            </button>
            {completedOpen && (
              completed.length === 0 ? (
                <EmptyState label="Nothing completed yet." />
              ) : (
                <div className="flex flex-col gap-2.5">
                  {completed.map((rec) => (
                    <RecordingCard key={rec.id} rec={rec} tab="gp" pipelineRetryEnabled={pipelineRetryEnabled} />
                  ))}
                </div>
              )
            )}
          </div>
        </>
      ) : (
        <div>
          <h2 className="text-[13px] font-bold uppercase tracking-[0.06em] mb-3" style={{ color: "rgba(51,51,51,0.45)" }}>
            AI graded ({aiFiltered.length})
          </h2>
          {aiFiltered.length === 0 ? (
            <EmptyState label="No AI-graded recordings." />
          ) : (
            <div className="flex flex-col gap-2.5">
              {aiFiltered.map((rec) => (
                <RecordingCard key={rec.id} rec={rec} tab="ai" pipelineRetryEnabled={pipelineRetryEnabled} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl p-8 text-center" style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}>
      <p className="text-[14px]" style={{ color: "rgba(51,51,51,0.4)" }}>{label}</p>
    </div>
  );
}

function RecordingCard({
  rec, tab, pipelineRetryEnabled,
}: {
  rec: QueueRow;
  tab: Tab;
  pipelineRetryEnabled: boolean;
}) {
  const router = useRouter();
  const isReviewing = rec.status === "reviewing";
  const isPending = rec.status === "pending_examiner";
  const examinerName = rec.examiners?.name ?? null;
  const canRetry = pipelineRetryEnabled && !!rec.doctor_audio_path && !rec.ai_data_gathering && (isPending || isReviewing);
  const manuallyChecked = !!rec.manually_checked_at;

  const statusChip = tab === "ai"
    ? manuallyChecked
      ? { label: "Manually checked", bg: "rgba(34,197,94,0.1)", color: "#166534" }
      : { label: "AI graded", bg: "rgba(59,130,246,0.1)", color: "#1D4ED8" }
    : isPending
    ? { label: "Needs review", bg: "rgba(245,158,11,0.12)", color: "#92400E" }
    : isReviewing
    ? { label: `Being reviewed${examinerName ? ` — ${examinerName}` : ""}`, bg: "rgba(99,102,241,0.1)", color: "#4338CA" }
    : rec.sent_to_candidate_at
    ? { label: "Sent", bg: "rgba(59,130,246,0.1)", color: "#1D4ED8" }
    : { label: "Reviewed", bg: "rgba(34,197,94,0.1)", color: "#166534" };

  // GP cards go straight to the review page. AI cards read as the report, with
  // a separate "Manual Overwrite" button that opens the same review page.
  const href = tab === "ai" ? `/recordings/${rec.id}` : `/examiner/${rec.id}`;

  return (
    <Link
      href={href}
      className="block rounded-2xl p-5 transition hover:shadow-md"
      style={{
        background: "white",
        border: `1px solid ${isPending || isReviewing ? "rgba(245,158,11,0.3)" : "rgba(51,51,51,0.08)"}`,
        textDecoration: "none",
      }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: "rgba(51,51,51,0.4)" }}>
            Station {rec.station_number}
          </div>
          <div className="font-bold text-[15px] mb-1" style={{ color: NAVY }}>{rec.station_title}</div>
          <div className="text-[12px]" style={{ color: "rgba(51,51,51,0.5)" }}>
            Dr {rec.doctor_display_name} · {new Date(rec.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            {" "}{new Date(rec.started_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </div>
          {rec.candidate_email && (
            <div className="text-[11px] mt-0.5" style={{ color: "rgba(51,51,51,0.4)" }}>{rec.candidate_email}</div>
          )}
          {isReviewing && examinerName && (
            <div className="text-[12px] font-semibold mt-1" style={{ color: "#4338CA" }}>
              Reviewing: {examinerName}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.05em]"
            style={{ background: statusChip.bg, color: statusChip.color }}
          >
            {statusChip.label}
          </span>
          {rec.ai_data_gathering && (
            <div className="text-[11px]" style={{ color: "rgba(51,51,51,0.4)" }}>
              AI: {rec.ai_data_gathering} / {rec.ai_clinical_management} / {rec.ai_relating_to_others}
            </div>
          )}
          {rec.examiner_data_gathering && (
            <div className="text-[11px]" style={{ color: "rgba(51,51,51,0.4)" }}>
              GP: {rec.examiner_data_gathering} / {rec.examiner_clinical_management} / {rec.examiner_relating_to_others}
            </div>
          )}
          {tab === "ai" && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/examiner/${rec.id}`);
              }}
              className="text-[11px] font-bold px-3 py-1.5 rounded-lg"
              style={{ background: NAVY, color: "white", border: "none", cursor: "pointer" }}
            >
              Manual Overwrite
            </button>
          )}
          {canRetry && <RetryPipelineButton recordingId={rec.id} />}
        </div>
      </div>
    </Link>
  );
}
