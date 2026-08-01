"use client";

import { useState, useRef, useActionState } from "react";
import Link from "next/link";
import { submitExaminerReviewAction } from "../actions";

const NAVY = "#1A1B52";
const LIGHT_BG = "#F3F2FB";

type Grade = "CF" | "F" | "P" | "CP";
const GRADES: Grade[] = ["CF", "F", "P", "CP"];

const GRADE_STYLE: Record<Grade, { bg: string; color: string; label: string }> = {
  CF: { bg: "rgba(239,68,68,0.1)", color: "#B91C1C", label: "Clear Fail" },
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
            background: value === g ? GRADE_STYLE[g].bg : "rgba(26,27,82,0.05)",
            color: value === g ? GRADE_STYLE[g].color : "rgba(26,27,82,0.4)",
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

  // Pre-fill with examiner grades if already reviewed, else AI grades
  const [dgGrade, setDgGrade] = useState<Grade | "">((rec.examiner_data_gathering ?? rec.ai_data_gathering ?? "") as Grade | "");
  const [cmGrade, setCmGrade] = useState<Grade | "">((rec.examiner_clinical_management ?? rec.ai_clinical_management ?? "") as Grade | "");
  const [roGrade, setRoGrade] = useState<Grade | "">((rec.examiner_relating_to_others ?? rec.ai_relating_to_others ?? "") as Grade | "");
  const [dgComment, setDgComment] = useState(rec.examiner_comment_data_gathering ?? rec.ai_comment_data_gathering ?? "");
  const [cmComment, setCmComment] = useState(rec.examiner_comment_clinical_management ?? rec.ai_comment_clinical_management ?? "");
  const [roComment, setRoComment] = useState(rec.examiner_comment_relating_to_others ?? rec.ai_comment_relating_to_others ?? "");
  const [overallComment, setOverallComment] = useState(rec.examiner_overall_comment ?? "");

  // Voice note recording
  const [voiceState, setVoiceState] = useState<"idle" | "recording" | "recorded" | "uploading" | "done">("idle");
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);

  // Audio playback speed
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

  function stopVoiceNote() {
    voiceRecorderRef.current?.stop();
  }

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

  return (
    <div className="min-h-screen" style={{ background: LIGHT_BG }}>
      <div className="max-w-[900px] mx-auto px-4 py-10">

        <div className="mb-6">
          <Link href="/examiner" className="text-[12px] font-semibold" style={{ color: "rgba(26,27,82,0.45)", textDecoration: "none" }}>
            ← Review Queue
          </Link>
        </div>

        {/* Header */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: NAVY, color: "white" }}
        >
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Left: transcript + audio */}
          <div className="flex flex-col gap-5">

            {/* Audio players */}
            {(doctorAudioUrl || patientAudioUrl) && (
              <div
                className="rounded-2xl p-5"
                style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(26,27,82,0.4)" }}>
                    Audio
                  </div>
                  <div className="flex gap-1">
                    {[1, 1.5, 2].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => applyPlaybackRate(r)}
                        className="text-[11px] font-bold px-2 py-0.5 rounded"
                        style={{
                          background: playbackRate === r ? NAVY : "rgba(26,27,82,0.07)",
                          color: playbackRate === r ? "white" : "rgba(26,27,82,0.5)",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {r}×
                      </button>
                    ))}
                  </div>
                </div>

                {doctorAudioUrl && (
                  <div className="mb-3">
                    <div className="text-[11px] mb-1" style={{ color: "rgba(26,27,82,0.45)" }}>Doctor</div>
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
                    <div className="text-[11px] mb-1" style={{ color: "rgba(26,27,82,0.45)" }}>Patient</div>
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
            )}

            {/* AI pre-assessment */}
            {(rec.ai_data_gathering || rec.ai_clinical_management || rec.ai_relating_to_others) ? (
              <div
                className="rounded-2xl p-5"
                style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)" }}
              >
                <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-4" style={{ color: "rgba(26,27,82,0.4)" }}>
                  AI Pre-Assessment
                </div>
                <div className="flex flex-col gap-3">
                  {([
                    { key: "dg", label: "Data Gathering", grade: rec.ai_data_gathering, comment: rec.ai_comment_data_gathering },
                    { key: "cm", label: "Clinical Management", grade: rec.ai_clinical_management, comment: rec.ai_comment_clinical_management },
                    { key: "ro", label: "Relating to Others", grade: rec.ai_relating_to_others, comment: rec.ai_comment_relating_to_others },
                  ] as const).map(({ key, label, grade, comment }) => (
                    <div key={key}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] font-semibold" style={{ color: NAVY }}>{label}</span>
                        {grade && (
                          <span
                            className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                            style={{
                              background: grade === "CF" ? "rgba(239,68,68,0.1)" : grade === "F" ? "rgba(245,158,11,0.1)" : grade === "P" ? "rgba(34,197,94,0.1)" : "rgba(59,130,246,0.1)",
                              color: grade === "CF" ? "#B91C1C" : grade === "F" ? "#92400E" : grade === "P" ? "#166534" : "#1D4ED8",
                            }}
                          >
                            {grade}
                          </span>
                        )}
                      </div>
                      {comment && (
                        <p className="text-[12px] leading-relaxed" style={{ color: "rgba(26,27,82,0.6)" }}>{comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="rounded-xl px-4 py-3 text-[12px]"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#92400E" }}
              >
                No AI assessment found — the marking pipeline may not have completed. Check Vercel function logs.
              </div>
            )}

            {/* Transcript */}
            {rec.transcript_formatted && (
              <div
                className="rounded-2xl p-5 flex-1"
                style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)", maxHeight: 500, overflowY: "auto" }}
              >
                <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-3 sticky top-0 pb-2" style={{ color: "rgba(26,27,82,0.4)", background: "white" }}>
                  Transcript
                </div>
                <pre
                  className="text-[12.5px] leading-relaxed whitespace-pre-wrap"
                  style={{ color: "rgba(26,27,82,0.75)", fontFamily: "inherit" }}
                >
                  {rec.transcript_formatted}
                </pre>
              </div>
            )}
          </div>

          {/* Right: review form */}
          <div>
            <form action={formAction} className="flex flex-col gap-5">
              <input type="hidden" name="recordingId" value={rec.id} />

              {/* Score summary */}
              {totalPts !== null && (
                <div
                  className="rounded-xl px-4 py-3 text-center"
                  style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)" }}
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(26,27,82,0.4)" }}>Station total</span>
                  <div className="font-extrabold text-[24px]" style={{ color: NAVY }}>{totalPts} / 10.5 pts</div>
                </div>
              )}

              {/* Domain reviews */}
              {([
                { key: "dg", label: "Data Gathering & Diagnosis", max: "3 pts", grade: dgGrade, setGrade: setDgGrade, comment: dgComment, setComment: setDgComment, commentName: "dg_comment" },
                { key: "cm", label: "Clinical Management", max: "4.5 pts", grade: cmGrade, setGrade: setCmGrade, comment: cmComment, setComment: setCmComment, commentName: "cm_comment" },
                { key: "ro", label: "Relating to Others", max: "3 pts", grade: roGrade, setGrade: setRoGrade, comment: roComment, setComment: setRoComment, commentName: "ro_comment" },
              ] as const).map(({ key, label, max, grade, setGrade, comment, setComment, commentName }) => (
                <div
                  key={key}
                  className="rounded-2xl p-5"
                  style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)" }}
                >
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
                    <div className="text-[13px] font-bold" style={{ color: NAVY }}>{label}</div>
                    <div className="text-[11px]" style={{ color: "rgba(26,27,82,0.4)" }}>
                      {grade ? `${pts(grade, key)} / ${DOMAIN_MAX[key]} pts` : `max ${max}`}
                    </div>
                  </div>
                  <GradeSelector name={`${key}_grade`} value={grade} onChange={setGrade} />
                  <textarea
                    name={commentName}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={grade === "F" || grade === "CF" ? "Write developmental feedback (3 sentences recommended)…" : "Optional comment…"}
                    rows={3}
                    className="w-full mt-3 rounded-lg px-3 py-2 text-[12.5px] resize-none"
                    style={{ border: "1px solid rgba(26,27,82,0.15)", color: NAVY, background: LIGHT_BG, outline: "none", fontFamily: "inherit", lineHeight: 1.6 }}
                    disabled={isSent}
                  />
                </div>
              ))}

              {/* Overall comment */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "white", border: "1px solid rgba(26,27,82,0.08)" }}
              >
                <div className="text-[13px] font-bold mb-2" style={{ color: NAVY }}>Overall Comment</div>
                <textarea
                  name="overall_comment"
                  value={overallComment}
                  onChange={(e) => setOverallComment(e.target.value)}
                  placeholder="Optional overall comment to the candidate…"
                  rows={3}
                  className="w-full rounded-lg px-3 py-2 text-[12.5px] resize-none"
                  style={{ border: "1px solid rgba(26,27,82,0.15)", color: NAVY, background: LIGHT_BG, outline: "none", fontFamily: "inherit", lineHeight: 1.6 }}
                  disabled={isSent}
                />

                {/* Voice note */}
                {!isSent && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px]" style={{ color: "rgba(26,27,82,0.45)" }}>Voice note:</span>
                    {voiceState === "idle" && (
                      <button type="button" onClick={startVoiceNote} className="text-[11px] font-semibold px-3 py-1 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#B91C1C", border: "none", cursor: "pointer" }}>
                        ⏺ Record
                      </button>
                    )}
                    {voiceState === "recording" && (
                      <button type="button" onClick={stopVoiceNote} className="text-[11px] font-semibold px-3 py-1 rounded-lg" style={{ background: "rgba(239,68,68,0.2)", color: "#B91C1C", border: "none", cursor: "pointer" }}>
                        ⏹ Stop
                      </button>
                    )}
                    {voiceState === "recorded" && (
                      <button type="button" onClick={uploadVoiceNote} className="text-[11px] font-semibold px-3 py-1 rounded-lg" style={{ background: "rgba(34,197,94,0.1)", color: "#166534", border: "none", cursor: "pointer" }}>
                        ↑ Save voice note
                      </button>
                    )}
                    {voiceState === "uploading" && <span className="text-[11px]" style={{ color: "rgba(26,27,82,0.4)" }}>Uploading…</span>}
                    {voiceState === "done" && <span className="text-[11px]" style={{ color: "#166534" }}>✓ Voice note saved</span>}
                  </div>
                )}
              </div>

              {/* Error / success */}
              {"error" in state && state.error && (
                <p className="text-[12px] text-red-600">{state.error as string}</p>
              )}
              {"success" in state && state.success && (
                <p className="text-[12px]" style={{ color: "#166534" }}>✓ Saved successfully.</p>
              )}

              {/* Submit buttons */}
              {!isSent && (
                <div className="flex gap-2.5">
                  <button
                    type="submit"
                    name="send_now"
                    value="0"
                    disabled={pending || !dgGrade || !cmGrade || !roGrade}
                    className="flex-1 rounded-xl py-3 text-[13px] font-bold"
                    style={{ background: "rgba(26,27,82,0.07)", border: "none", color: NAVY, cursor: "pointer", opacity: pending || !dgGrade || !cmGrade || !roGrade ? 0.5 : 1 }}
                  >
                    Save Draft
                  </button>
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
      </div>
    </div>
  );
}
