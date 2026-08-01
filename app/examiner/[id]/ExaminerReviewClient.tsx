"use client";

import { useState, useRef, useEffect, useActionState, useTransition } from "react";
import Link from "next/link";
import { submitExaminerReviewAction, generateOverallCommentAction, grammarCheckAction } from "../actions";

const NAVY = "#333333";
const LIGHT_BG = "#FAFAF8";

type Grade = "CF" | "F" | "P" | "CP";
const GRADES: Grade[] = ["CF", "F", "P", "CP"];

const GRADE_STYLE: Record<Grade, { bg: string; color: string; label: string }> = {
  CF: { bg: "rgba(239,68,68,0.1)",  color: "#B91C1C", label: "Clear Fail" },
  F:  { bg: "rgba(245,158,11,0.1)", color: "#92400E", label: "Fail" },
  P:  { bg: "rgba(34,197,94,0.1)",  color: "#166534", label: "Pass" },
  CP: { bg: "rgba(59,130,246,0.1)", color: "#1D4ED8", label: "Clear Pass" },
};

const DOMAIN_MAX: Record<string, number> = { dg: 3, cm: 4.5, ro: 3 };

function pts(grade: Grade | "", domain: string): number | null {
  if (!grade) return null;
  const maps: Record<string, Record<Grade, number>> = {
    dg: { CF: 0, F: 1,   P: 2, CP: 3 },
    cm: { CF: 0, F: 1.5, P: 3, CP: 4.5 },
    ro: { CF: 0, F: 1,   P: 2, CP: 3 },
  };
  return maps[domain]?.[grade] ?? null;
}

function GradeBadge({ grade }: { grade: string }) {
  const s = GRADE_STYLE[grade as Grade];
  if (!s) return null;
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: s.bg, color: s.color }}>
      {grade}
    </span>
  );
}

function GradeSelector({ name, value, onChange }: { name: string; value: Grade | ""; onChange: (g: Grade) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {GRADES.map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => onChange(g)}
          className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition"
          style={{
            background: value === g ? GRADE_STYLE[g].bg : "rgba(51,51,51,0.05)",
            color: value === g ? GRADE_STYLE[g].color : "rgba(51,51,51,0.4)",
            border: value === g ? `1.5px solid ${GRADE_STYLE[g].color}30` : "1.5px solid transparent",
          }}
        >
          {g}
          <span className="ml-1 font-normal text-[10px]">{GRADE_STYLE[g].label}</span>
        </button>
      ))}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

function Accordion({
  title, badge, defaultOpen = true, children,
}: {
  title: string;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)", borderRadius: 16, overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4"
        style={{
          background: "none", border: "none", cursor: "pointer",
          borderBottom: open ? "1px solid rgba(51,51,51,0.07)" : "none",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-bold" style={{ color: NAVY }}>{title}</span>
          {badge}
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s", flexShrink: 0 }}>
          <path d="M4 6l4 4 4-4" stroke="rgba(51,51,51,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
}

type RecordingFull = {
  id: string;
  station_number: number;
  station_title: string;
  doctor_display_name: string;
  patient_display_name: string;
  started_at: string;
  status: string;
  transcript_formatted: string | null;
  ai_data_gathering: string | null;
  ai_clinical_management: string | null;
  ai_relating_to_others: string | null;
  ai_comment_data_gathering: string | null;
  ai_comment_clinical_management: string | null;
  ai_comment_relating_to_others: string | null;
  examiner_data_gathering: string | null;
  examiner_clinical_management: string | null;
  examiner_relating_to_others: string | null;
  examiner_comment_data_gathering: string | null;
  examiner_comment_clinical_management: string | null;
  examiner_comment_relating_to_others: string | null;
  examiner_overall_comment: string | null;
  sent_to_candidate_at: string | null;
};

interface Props {
  recording: RecordingFull;
  doctorAudioUrl: string | null;
  patientAudioUrl: string | null;
}

export default function ExaminerReviewClient({ recording: rec, doctorAudioUrl, patientAudioUrl }: Props) {
  const isSent = !!rec.sent_to_candidate_at;

  const [dgGrade, setDgGrade] = useState<Grade | "">((rec.examiner_data_gathering ?? rec.ai_data_gathering ?? "") as Grade | "");
  const [cmGrade, setCmGrade] = useState<Grade | "">((rec.examiner_clinical_management ?? rec.ai_clinical_management ?? "") as Grade | "");
  const [roGrade, setRoGrade] = useState<Grade | "">((rec.examiner_relating_to_others ?? rec.ai_relating_to_others ?? "") as Grade | "");
  const [dgComment, setDgComment] = useState(rec.examiner_comment_data_gathering ?? rec.ai_comment_data_gathering ?? "");
  const [cmComment, setCmComment] = useState(rec.examiner_comment_clinical_management ?? rec.ai_comment_clinical_management ?? "");
  const [roComment, setRoComment] = useState(rec.examiner_comment_relating_to_others ?? rec.ai_comment_relating_to_others ?? "");
  const [overallComment, setOverallComment] = useState(rec.examiner_overall_comment ?? "");
  const [aiGenPending, startAiGen] = useTransition();
  const [grammarPending, startGrammar] = useTransition();
  const [aiGenError, setAiGenError] = useState("");

  const [voiceState, setVoiceState] = useState<"idle" | "recording" | "recorded" | "uploading" | "done">("idle");
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);

  const [playbackRate, setPlaybackRate] = useState(1);
  const doctorAudioRef = useRef<HTMLAudioElement | null>(null);
  const patientAudioRef = useRef<HTMLAudioElement | null>(null);

  function applyPlaybackRate(rate: number) {
    setPlaybackRate(rate);
    if (doctorAudioRef.current) doctorAudioRef.current.playbackRate = rate;
    if (patientAudioRef.current) patientAudioRef.current.playbackRate = rate;
  }

  async function startVoiceNote() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      voiceChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) voiceChunksRef.current.push(e.data); };
      recorder.onstop = () => { stream.getTracks().forEach((t) => t.stop()); setVoiceState("recorded"); };
      recorder.start();
      voiceRecorderRef.current = recorder;
      setVoiceState("recording");
    } catch {
      alert("Microphone access denied.");
    }
  }

  function stopVoiceNote() { voiceRecorderRef.current?.stop(); }

  async function uploadVoiceNote() {
    setVoiceState("uploading");
    const blob = new Blob(voiceChunksRef.current, { type: "audio/webm" });
    const fd = new FormData();
    fd.append("audio", blob);
    fd.append("recordingId", rec.id);
    await fetch("/api/recordings/voice-note", { method: "POST", body: fd });
    setVoiceState("done");
  }

  const totalPts = (() => {
    const d = pts(dgGrade, "dg");
    const c = pts(cmGrade, "cm");
    const r = pts(roGrade, "ro");
    if (d === null || c === null || r === null) return null;
    return d + c + r;
  })();

  const [state, formAction, pending] = useActionState(submitExaminerReviewAction, {});
  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => {
    if ("success" in state && state.success) {
      setShowSuccess(true);
      const t = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [state]);

  const hasAi = rec.ai_data_gathering || rec.ai_clinical_management || rec.ai_relating_to_others;

  return (
    <div className="min-h-screen" style={{ background: LIGHT_BG }}>
      <div className="max-w-[1060px] mx-auto px-4 py-10">

        <div className="mb-6">
          <Link href="/examiner" className="text-[12px] font-semibold" style={{ color: "rgba(51,51,51,0.45)", textDecoration: "none" }}>
            ← Review Queue
          </Link>
        </div>

        {/* Station header */}
        <div className="rounded-2xl p-6 mb-5" style={{ background: NAVY, color: "white" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-1 opacity-50">
            Station {rec.station_number}
          </div>
          <h1 className="font-display font-extrabold text-[22px] mb-3">{rec.station_title}</h1>
          <div className="flex items-center gap-4 text-[12px] opacity-60 flex-wrap">
            <span>Doctor: {rec.doctor_display_name}</span>
            <span>Patient: {rec.patient_display_name}</span>
            <span>{new Date(rec.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
            {isSent && <span style={{ color: "#86efac" }}>✓ Report already sent</span>}
          </div>
        </div>

        {/* Station score — always visible */}
        {totalPts !== null && (
          <div
            className="rounded-2xl px-5 py-4 mb-5 flex items-center justify-between"
            style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
          >
            <span className="text-[12px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>
              Station Score
            </span>
            <span className="font-extrabold text-[22px]" style={{ color: NAVY }}>{totalPts} / 10.5 pts</span>
          </div>
        )}

        <form action={formAction}>
          <input type="hidden" name="recordingId" value={rec.id} />

          {/* Two-column: AI left, examiner grading right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

            {/* Left — AI pre-assessment */}
            <div>
              {hasAi ? (
                <div
                  className="rounded-2xl p-5 h-full"
                  style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>
                      AI Pre-Assessment
                    </div>
                    <div className="flex gap-1">
                      {rec.ai_data_gathering && <GradeBadge grade={rec.ai_data_gathering} />}
                      {rec.ai_clinical_management && <GradeBadge grade={rec.ai_clinical_management} />}
                      {rec.ai_relating_to_others && <GradeBadge grade={rec.ai_relating_to_others} />}
                    </div>
                  </div>
                  <div className="flex flex-col gap-5">
                    {([
                      { label: "Data Gathering & Diagnosis", grade: rec.ai_data_gathering, comment: rec.ai_comment_data_gathering },
                      { label: "Clinical Management",        grade: rec.ai_clinical_management, comment: rec.ai_comment_clinical_management },
                      { label: "Relating to Others",         grade: rec.ai_relating_to_others, comment: rec.ai_comment_relating_to_others },
                    ] as const).map(({ label, grade, comment }) => (
                      <div key={label}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[12px] font-semibold" style={{ color: NAVY }}>{label}</span>
                          {grade && <GradeBadge grade={grade} />}
                        </div>
                        {comment && (
                          <p className="text-[12.5px] leading-relaxed" style={{ color: "rgba(51,51,51,0.65)" }}>{comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl px-4 py-3 text-[12px]" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#92400E" }}>
                  No AI assessment — marking pipeline may not have completed. Check Vercel logs.
                </div>
              )}
            </div>

            {/* Right — examiner grading */}
            <div className="flex flex-col gap-3">
              {([
                { key: "dg", label: "Data Gathering & Diagnosis", max: "3 pts",   grade: dgGrade, setGrade: setDgGrade, comment: dgComment, setComment: setDgComment, commentName: "dg_comment" as const },
                { key: "cm", label: "Clinical Management",        max: "4.5 pts", grade: cmGrade, setGrade: setCmGrade, comment: cmComment, setComment: setCmComment, commentName: "cm_comment" as const },
                { key: "ro", label: "Relating to Others",         max: "3 pts",   grade: roGrade, setGrade: setRoGrade, comment: roComment, setComment: setRoComment, commentName: "ro_comment" as const },
              ]).map(({ key, label, max, grade, setGrade, comment, setComment, commentName }) => (
                <Accordion
                  key={key}
                  title={label}
                  badge={
                    grade ? (
                      <div className="flex items-center gap-1.5">
                        <GradeBadge grade={grade} />
                        <span className="text-[11px]" style={{ color: "rgba(51,51,51,0.4)" }}>
                          {pts(grade, key)} / {DOMAIN_MAX[key]} pts
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px]" style={{ color: "rgba(51,51,51,0.3)" }}>max {max}</span>
                    )
                  }
                >
                  <GradeSelector name={`${key}_grade`} value={grade} onChange={setGrade} />
                  <AutoTextarea
                    name={commentName}
                    value={comment}
                    onChange={setComment}
                    placeholder="Add a comment…"
                    disabled={isSent}
                  />
                </Accordion>
              ))}

              {/* Overall comment */}
              <Accordion title="Overall Comment">
                {!isSent && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <button
                      type="button"
                      disabled={aiGenPending || !dgGrade || !cmGrade || !roGrade}
                      onClick={() => {
                        setAiGenError("");
                        startAiGen(async () => {
                          const res = await generateOverallCommentAction({
                            dgGrade, dgComment, cmGrade, cmComment, roGrade, roComment,
                            stationTitle: rec.station_title,
                          });
                          if (res.text) setOverallComment(res.text);
                          else setAiGenError(res.error ?? "Failed");
                        });
                      }}
                      className="px-3 py-1 rounded-lg text-[11px] font-semibold"
                      style={{ background: "rgba(51,51,51,0.07)", border: "none", color: NAVY, cursor: "pointer", opacity: aiGenPending || !dgGrade || !cmGrade || !roGrade ? 0.5 : 1 }}
                    >
                      {aiGenPending ? "Generating…" : "AI Generate"}
                    </button>
                    <button
                      type="button"
                      disabled={grammarPending || !overallComment.trim()}
                      onClick={() => {
                        setAiGenError("");
                        startGrammar(async () => {
                          const res = await grammarCheckAction({ text: overallComment });
                          if (res.text) setOverallComment(res.text);
                          else setAiGenError(res.error ?? "Failed");
                        });
                      }}
                      className="px-3 py-1 rounded-lg text-[11px] font-semibold"
                      style={{ background: "rgba(51,51,51,0.07)", border: "none", color: NAVY, cursor: "pointer", opacity: grammarPending || !overallComment.trim() ? 0.5 : 1 }}
                    >
                      {grammarPending ? "Checking…" : "Grammar / Spellcheck"}
                    </button>
                  </div>
                )}
                {aiGenError && <p className="text-[11px] text-red-600 mb-2">{aiGenError}</p>}
                <AutoTextarea
                  name="overall_comment"
                  value={overallComment}
                  onChange={setOverallComment}
                  placeholder="Optional overall comment to the candidate…"
                  disabled={isSent}
                />
                {!isSent && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px]" style={{ color: "rgba(51,51,51,0.45)" }}>Voice note:</span>
                    {voiceState === "idle" && (
                      <button type="button" onClick={startVoiceNote} className="text-[11px] font-semibold px-3 py-1 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#B91C1C", border: "none", cursor: "pointer" }}>⏺ Record</button>
                    )}
                    {voiceState === "recording" && (
                      <button type="button" onClick={stopVoiceNote} className="text-[11px] font-semibold px-3 py-1 rounded-lg" style={{ background: "rgba(239,68,68,0.2)", color: "#B91C1C", border: "none", cursor: "pointer" }}>⏹ Stop</button>
                    )}
                    {voiceState === "recorded" && (
                      <button type="button" onClick={uploadVoiceNote} className="text-[11px] font-semibold px-3 py-1 rounded-lg" style={{ background: "rgba(34,197,94,0.1)", color: "#166534", border: "none", cursor: "pointer" }}>↑ Save voice note</button>
                    )}
                    {voiceState === "uploading" && <span className="text-[11px]" style={{ color: "rgba(51,51,51,0.4)" }}>Uploading…</span>}
                    {voiceState === "done" && <span className="text-[11px]" style={{ color: "#166534" }}>✓ Voice note saved</span>}
                  </div>
                )}
              </Accordion>
            </div>
          </div>

          {/* Audio — full width below columns */}
          {(doctorAudioUrl || patientAudioUrl) && (
            <div className="mb-4">
              <Accordion title="Audio Recording">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px]" style={{ color: "rgba(51,51,51,0.4)" }}>Playback speed</span>
                  <div className="flex gap-1">
                    {[1, 1.5, 2].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => applyPlaybackRate(r)}
                        className="text-[11px] font-bold px-2 py-0.5 rounded"
                        style={{
                          background: playbackRate === r ? NAVY : "rgba(51,51,51,0.07)",
                          color: playbackRate === r ? "white" : "rgba(51,51,51,0.5)",
                          border: "none", cursor: "pointer",
                        }}
                      >
                        {r}×
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {doctorAudioUrl && (
                    <div>
                      <div className="text-[11px] mb-1" style={{ color: "rgba(51,51,51,0.45)" }}>Doctor</div>
                      <audio
                        ref={doctorAudioRef}
                        src={doctorAudioUrl}
                        controls
                        className="w-full"
                        style={{ height: 36 }}
                        onLoadedMetadata={(e) => { (e.target as HTMLAudioElement).playbackRate = playbackRate; }}
                      />
                    </div>
                  )}
                  {patientAudioUrl && (
                    <div>
                      <div className="text-[11px] mb-1" style={{ color: "rgba(51,51,51,0.45)" }}>Patient</div>
                      <audio
                        ref={patientAudioRef}
                        src={patientAudioUrl}
                        controls
                        className="w-full"
                        style={{ height: 36 }}
                        onLoadedMetadata={(e) => { (e.target as HTMLAudioElement).playbackRate = playbackRate; }}
                      />
                    </div>
                  )}
                </div>
              </Accordion>
            </div>
          )}

          {/* Transcript — full width below audio */}
          {rec.transcript_formatted && (
            <div className="mb-4">
              <Accordion title="Transcript" defaultOpen={false}>
                <TranscriptLines text={rec.transcript_formatted} />
              </Accordion>
            </div>
          )}

          {/* Error / success */}
          {"error" in state && state.error && (
            <p className="text-[12px] text-red-600 mb-3">{state.error as string}</p>
          )}
          {showSuccess && (
            <p className="text-[12px] mb-3" style={{ color: "#166534" }}>✓ Saved successfully.</p>
          )}

          {/* Action buttons */}
          {!isSent && (
            <div className="flex gap-2.5 flex-wrap">
              <button
                type="submit"
                name="send_now"
                value="0"
                disabled={pending || !dgGrade || !cmGrade || !roGrade}
                className="flex-1 rounded-xl py-3 text-[13px] font-bold"
                style={{ background: "rgba(51,51,51,0.07)", border: "none", color: NAVY, cursor: "pointer", opacity: pending || !dgGrade || !cmGrade || !roGrade ? 0.5 : 1 }}
              >
                Save Draft
              </button>
              <a
                href={`/recordings/${rec.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl py-3 text-[13px] font-bold text-center"
                style={{ background: "rgba(51,51,51,0.05)", border: "1px solid rgba(51,51,51,0.1)", color: "rgba(51,51,51,0.55)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
              >
                Preview Report
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5 }}>
                  <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <button
                type="submit"
                name="send_now"
                value="1"
                disabled={pending || !dgGrade || !cmGrade || !roGrade}
                className="flex-1 rounded-xl py-3 text-[13px] font-bold"
                style={{ background: NAVY, border: "none", color: "white", cursor: "pointer", opacity: pending || !dgGrade || !cmGrade || !roGrade ? 0.5 : 1 }}
              >
                {pending ? "Sending…" : "Send to Candidate"}
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}

function AutoTextarea({ name, value, onChange, placeholder, disabled }: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full mt-3 rounded-lg px-3 py-2 text-[12.5px] resize-none overflow-hidden"
      style={{ border: "1px solid rgba(51,51,51,0.12)", color: NAVY, background: LIGHT_BG, outline: "none", fontFamily: "inherit", lineHeight: 1.6, minHeight: "4.5rem" }}
      disabled={disabled}
    />
  );
}

function TranscriptLines({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <div className="flex flex-col gap-2.5">
      {lines.map((line, i) => {
        const m = line.match(/^(\[\d+:\d+\])\s*(Doctor|Patient):\s*(.*)$/);
        if (!m) return <p key={i} className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.6)" }}>{line}</p>;
        const [, timestamp, speaker, speech] = m;
        return (
          <div key={i}>
            <span className="text-[11px] mr-1.5 font-mono" style={{ color: "rgba(51,51,51,0.3)" }}>{timestamp}</span>
            <span className="text-[12.5px] font-bold mr-1" style={{ color: NAVY }}>{speaker}:</span>
            <span className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.75)" }}>{speech}</span>
          </div>
        );
      })}
    </div>
  );
}
