"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Station, TimerPhase } from "@/lib/case-bank-types";
import { PHASE_DURATIONS } from "@/lib/case-bank-types";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Timer } from "./Timer";
import { StudyRoomPanel } from "./StudyRoom";
import { FeedbackModal } from "./ReportModal";
import { HighlightProvider, Highlightable } from "./Highlighter";
import { toggleStarAction, updateLastStationAction } from "../actions";

const NAVY = "#1F2937";
const YELLOW = "#F6D44B";
const LIGHT_BG = "#F3F2FB";

// ── Tabs ──────────────────────────────────────────────────────────────────────

type TabKey = "brief" | "story" | "data" | "management" | "explanation" | "message" | "takeaways" | "qa" | "audio";

const TABS: { key: TabKey; label: string }[] = [
  { key: "brief", label: "Doctor's Brief" },
  { key: "story", label: "Patient's Story" },
  { key: "data", label: "Data Gathering" },
  { key: "management", label: "Management" },
  { key: "explanation", label: "Example Explanation" },
  { key: "message", label: "Message" },
  { key: "takeaways", label: "Key Takeaways" },
  { key: "qa", label: "Q&A" },
  { key: "audio", label: "Sample Consultation" },
];

// ── Content helpers ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1.5"
      style={{ color: "rgba(26,27,82,0.5)" }}
    >
      {children}
    </div>
  );
}

function BulletList({ items, listKey }: { items: string[]; listKey?: string }) {
  return (
    <ul className="m-0 p-0 list-none flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span
            className="shrink-0 w-1.5 h-1.5 rounded-full mt-2"
            style={{ background: "rgba(31,41,55,0.25)" }}
          />
          {listKey ? (
            <Highlightable
              unitKey={`${listKey}-${i}`}
              text={item}
              className="text-[16px] leading-[1.65]"
              style={{ color: "rgba(26,27,82,0.8)" }}
            />
          ) : (
            <span className="text-[16px] leading-[1.65]" style={{ color: "rgba(26,27,82,0.8)" }}>
              {item}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function RecentNotesRenderer({ text }: { text: string }) {
  type Segment = { type: "text"; lines: string[] } | { type: "table"; rows: string[][] };
  const segments: Segment[] = [];
  let currentType: "text" | "table" | null = null;
  let currentLines: string[] = [];

  for (const line of text.split("\n")) {
    const isTableRow = line.includes(" | ");
    if (isTableRow) {
      if (currentType !== "table") {
        if (currentType !== null) segments.push({ type: currentType, lines: currentLines });
        currentLines = [];
        currentType = "table";
      }
      currentLines.push(line);
    } else {
      if (currentType !== "text") {
        if (currentType !== null) segments.push({ type: currentType as "table", rows: currentLines.map(l => l.split(" | ").map(c => c.trim())) });
        currentLines = [];
        currentType = "text";
      }
      currentLines.push(line);
    }
  }
  if (currentType === "table") segments.push({ type: "table", rows: currentLines.map(l => l.split(" | ").map(c => c.trim())) });
  if (currentType === "text") segments.push({ type: "text", lines: currentLines });

  return (
    <div className="flex flex-col gap-3">
      {segments.map((seg, i) => {
        if (seg.type === "table") {
          const [header, ...body] = seg.rows;
          return (
            <div key={i} className="overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(26,27,82,0.08)" }}>
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(26,27,82,0.04)" }}>
                    {header.map((cell, j) => (
                      <th key={j} className="text-left py-2 px-3 font-bold" style={{ color: "rgba(26,27,82,0.45)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid rgba(26,27,82,0.10)" }}>
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : "rgba(26,27,82,0.015)" }}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="py-2 px-3" style={{ color: "rgba(26,27,82,0.8)", fontSize: "13.5px", borderBottom: ri < body.length - 1 ? "1px solid rgba(26,27,82,0.06)" : "none" }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Text segment — split on blank lines into paragraphs
        const paragraphs: string[] = [];
        let current: string[] = [];
        for (const line of seg.lines) {
          if (line.trim() === "") {
            if (current.length > 0) { paragraphs.push(current.join("\n")); current = []; }
          } else {
            current.push(line);
          }
        }
        if (current.length > 0) paragraphs.push(current.join("\n"));

        return (
          <div key={i} className="flex flex-col gap-2">
            {paragraphs.map((para, pi) => (
              <p key={pi} className="m-0 text-[15px] leading-[1.65]" style={{ whiteSpace: "pre-line" }}>
                <Highlightable
                  unitKey={`recent_notes-${i}-${pi}`}
                  text={para}
                  style={{ color: "rgba(26,27,82,0.8)" }}
                />
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function DoctorBriefContent({ station }: { station: Station }) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <Label>Patient</Label>
          <div className="text-[16px] font-bold" style={{ color: NAVY }}>
            {station.patient_name}
          </div>
          <div className="text-[16px]" style={{ color: "rgba(26,27,82,0.65)" }}>
            {station.patient_age}
          </div>
        </div>
        <div>
          <Label>Type</Label>
          <div className="text-[16px]" style={{ color: "rgba(26,27,82,0.8)" }}>
            {station.consultation_type}
          </div>
        </div>
      </div>
      {station.pmh.length > 0 && (
        <div>
          <Label>Past Medical History</Label>
          <BulletList items={station.pmh} listKey="pmh" />
        </div>
      )}
      {station.medications_and_allergies.length > 0 && (
        <div>
          <Label>Drug & Allergy History</Label>
          <BulletList items={station.medications_and_allergies} listKey="medications_and_allergies" />
        </div>
      )}
      {station.recent_notes && (
        <div>
          <Label>Recent Notes</Label>
          <RecentNotesRenderer text={station.recent_notes} />
        </div>
      )}
      <div>
        <Label>Reason for Consultation</Label>
        <p className="text-[16px] leading-[1.6]">
          <Highlightable unitKey="reason_for_consultation" text={station.reason_for_consultation} style={{ color: "rgba(26,27,82,0.8)" }} />
        </p>
      </div>
      {station.image_urls && station.image_urls.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {station.image_urls.map((item, idx) => {
            let record: { supabaseUrl?: string; originalUrl?: string; attributedTo?: string } = {};
            try {
              record = JSON.parse(item);
            } catch {
              record = { supabaseUrl: item };
            }
            const imgUrl = record.supabaseUrl || record.originalUrl || item;
            return (
              <div key={idx} className="flex flex-col gap-1.5">
                <img src={imgUrl} alt={`Station image ${idx + 1}`} className="w-full h-auto max-h-[500px] object-contain rounded-lg" />
                {record.attributedTo && (
                  <p className="text-[12px]" style={{ color: "rgba(26,27,82,0.50)" }}>
                    Image: {record.attributedTo}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Renders the Example Explanation. If the text is written as a Doctor/Patient
// dialogue (lines prefixed "Doctor:" / "Patient:") it renders as a styled
// script; otherwise it falls back to a prose block.
function ExplanationBody({ text }: { text: string }) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const turns: { speaker: "Doctor" | "Patient"; text: string }[] = [];
  for (const line of lines) {
    const m = line.match(/^(Doctor|Patient)\s*:\s*(.*)$/i);
    if (m) {
      const speaker: "Doctor" | "Patient" = /^d/i.test(m[1]) ? "Doctor" : "Patient";
      const last = turns[turns.length - 1];
      // Merge consecutive lines from the same speaker so a run never renders
      // as two back-to-back labels.
      if (last && last.speaker === speaker) last.text += " " + m[2];
      else turns.push({ speaker, text: m[2] });
    } else if (turns.length) {
      turns[turns.length - 1].text += " " + line;
    }
  }

  if (turns.length < 2) {
    return (
      <p className="text-[16px] leading-[1.85]" style={{ whiteSpace: "pre-line", color: "#1a1a1a" }}>
        <Highlightable unitKey="example_explanation" text={text} style={{ color: "#1a1a1a" }} />
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {turns.map((t, i) => (
        <p key={i} className="text-[16px] leading-[1.75]" style={{ color: "#1a1a1a" }}>
          <span style={{ fontWeight: 700 }}>{t.speaker}:</span>{" "}
          <Highlightable unitKey={`example_explanation-${i}`} text={t.text} style={{ color: "#1a1a1a" }} />
        </p>
      ))}
    </div>
  );
}

function PatientStoryContent({ station }: { station: Station }) {
  return (
    <div className="flex flex-col gap-4">
      {/* The dilemma — the case's central tension and how the patient should play it */}
      {station.dilemma && (
        <div
          className="rounded-lg p-4"
          style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.35)" }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: "#C2410C" }}>
            The Dilemma
          </div>
          <p className="text-[16px] leading-[1.6]">
            <Highlightable unitKey="dilemma" text={station.dilemma} style={{ color: "rgba(26,27,82,0.8)" }} />
          </p>
        </div>
      )}

      {/* Presenting complaint — opening statement + if asked further (grey box) */}
      <div className="rounded-lg p-4 flex flex-col gap-3" style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.08)" }}>
        <div>
          <Label>Opening Statement</Label>
          <p className="text-[16px] leading-[1.65] italic">
            &ldquo;<Highlightable unitKey="opening_statement" text={station.opening_statement} style={{ color: "rgba(26,27,82,0.8)" }} />&rdquo;
          </p>
        </div>
        <div>
          <Label>If Asked to Explain Further</Label>
          <p className="text-[16px] leading-[1.65]">
            <Highlightable unitKey="if_asked_further" text={station.if_asked_further} style={{ color: "rgba(26,27,82,0.8)" }} />
          </p>
        </div>
      </div>

      {/* Only if directly asked */}
      {station.only_if_asked.length > 0 && (
        <div
          className="rounded-lg p-4"
          style={{
            background: "rgba(246,212,75,0.08)",
            border: "1px solid rgba(246,212,75,0.25)",
          }}
        >
          <div
            className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2.5"
            style={{ color: "#854D0E" }}
          >
            ⚠ Only Say Below If Directly Asked
          </div>
          <ul className="m-0 p-0 list-none flex flex-col gap-2">
            {station.only_if_asked.map((item, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <span
                  className="shrink-0 w-1.5 h-1.5 rounded-full mt-2 opacity-40"
                  style={{ background: NAVY }}
                />
                <Highlightable
                  unitKey={`only_if_asked-${i}`}
                  text={item}
                  className="text-[16px] leading-[1.6]"
                  style={{ color: "rgba(26,27,82,0.8)" }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ICE — three blue column boxes */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          ["Ideas", "ice_ideas", station.ice_ideas],
          ["Concerns", "ice_concerns", station.ice_concerns],
          ["Expectations", "ice_expectations", station.ice_expectations],
        ].map(([label, key, value]) => (
          <div key={label} className="rounded-lg p-3" style={{ background: "#EFF6FF" }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: "rgba(26,27,82,0.5)" }}>
              {label}
            </div>
            <p className="text-[16px] leading-[1.55]">
              <Highlightable unitKey={key} text={value} style={{ color: "rgba(26,27,82,0.8)" }} />
            </p>
          </div>
        ))}
      </div>

      {/* Background — social history + PMH + medications & allergies (grey box) */}
      <div className="rounded-lg p-4 flex flex-col gap-3.5" style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.08)" }}>
        <div>
          <Label>Social History</Label>
          <p className="text-[16px] leading-[1.65]">
            <Highlightable unitKey="social_history" text={station.social_history} style={{ color: "rgba(26,27,82,0.8)" }} />
          </p>
        </div>
        {station.pmh && station.pmh.length > 0 && (
          <div>
            <Label>Past Medical History</Label>
            <ul className="m-0 p-0 list-none flex flex-col gap-2">
              {station.pmh.map((item, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2 opacity-40" style={{ background: NAVY }} />
                  <Highlightable unitKey={`story_pmh-${i}`} text={item} className="text-[16px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {station.medications_and_allergies && station.medications_and_allergies.length > 0 && (
          <div>
            <Label>Medications &amp; Allergies</Label>
            <ul className="m-0 p-0 list-none flex flex-col gap-2">
              {station.medications_and_allergies.map((item, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2 opacity-40" style={{ background: NAVY }} />
                  <Highlightable unitKey={`story_meds-${i}`} text={item} className="text-[16px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Scenarios — own grey box */}
      {station.scenarios && station.scenarios.length > 0 && (
        <div className="rounded-lg p-4" style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.08)" }}>
          <Label>Specific Scenarios</Label>
          <ul className="m-0 p-0 list-none flex flex-col gap-2">
            {station.scenarios.map((s, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <span
                  className="shrink-0 text-[12px] font-bold mt-px"
                  style={{ color: NAVY }}
                >
                  {i + 1}.
                </span>
                <Highlightable
                  unitKey={`scenarios-${i}`}
                  text={s}
                  className="text-[16px] leading-[1.6]"
                  style={{ color: "rgba(26,27,82,0.8)" }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Questions for the doctor — own grey box */}
      {station.question_for_doctor && station.question_for_doctor.length > 0 && (
        <div className="rounded-lg p-4" style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.08)" }}>
          <Label>{station.question_for_doctor.length > 1 ? "Questions for the Doctor" : "Question for the Doctor"}</Label>
          <ul className="m-0 p-0 list-none flex flex-col gap-2">
            {station.question_for_doctor.map((q, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2 opacity-40" style={{ background: NAVY }} />
                <Highlightable unitKey={`question_for_doctor-${i}`} text={q} className="text-[16px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function StationPageClient({
  station,
  userId,
  totalStations,
  prevStationNumber,
  nextStationNumber,
  initialStarred,
  userDisplayName,
  userInitials,
}: {
  station: Station;
  userId: string;
  totalStations: number;
  prevStationNumber: number | null;
  nextStationNumber: number | null;
  initialStarred: boolean;
  userDisplayName: string;
  userInitials: string;
}) {
  const router = useRouter();

  const supabase = createSupabaseBrowserClient();

  const [starred, setStarred] = useState(initialStarred);
  const [showRoom, setShowRoom] = useState(false);
  // Initialise from sessionStorage after hydration (useState initialiser runs on
  // the server where window is undefined, so we use an effect instead)
  useEffect(() => {
    if (sessionStorage.getItem("studyRoomId")) setShowRoom(true);
  }, []);
  const [showFeedback, setShowFeedback] = useState(false);
  const [starPending, setStarPending] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("brief");
  const visibleTabs = TABS.filter((t) => {
    if (t.key === "audio") return !!station.audio_url;
    if (t.key === "explanation") return !!station.example_explanation?.trim();
    if (t.key === "message") return !!station.message?.trim();
    if (t.key === "qa") return (station.trainer_qa?.length ?? 0) > 0;
    return true;
  });

  // Room state (exposed from StudyRoomPanel)
  const [inRoom, setInRoom] = useState(false);
  const [iAmHost, setIAmHost] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomHostName, setRoomHostName] = useState<string | null>(null);
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  const broadcastTimerRef = useRef<((phase: TimerPhase, timeLeft: number, running: boolean) => void) | null>(null);
  const timerStateRef = useRef<{ phase: TimerPhase; timeLeft: number; running: boolean }>({
    phase: "PREREAD",
    timeLeft: PHASE_DURATIONS.PREREAD,
    running: false,
  });

  // Station jump
  const [jumpOpen, setJumpOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState("");

  // Timer state
  const [timerPhase, setTimerPhase] = useState<TimerPhase>("PREREAD");
  const [timeLeft, setTimeLeft] = useState(PHASE_DURATIONS.PREREAD);
  const [timerRunning, setTimerRunning] = useState(false);

  const handleRoomStatusChange = useCallback(
    (nowInRoom: boolean, nowHost: boolean, nowRoomId: string | null, nowHostName: string | null) => {
      setInRoom(nowInRoom);
      setIAmHost(nowHost);
      setRoomId(nowRoomId);
      setRoomHostName(nowHostName);
    },
    []
  );

  async function handleToggleStar() {
    if (starPending) return;
    setStarPending(true);
    setStarred((v) => !v);
    await toggleStarAction(station.id, starred);
    setStarPending(false);
  }

  async function handleTimerStart() {
    setTimerRunning(true);
    broadcastTimerRef.current?.(timerPhase, timeLeft, true);
    if (roomId && iAmHost) {
      // Compute started_at so elapsed = already-consumed time, preserving remaining
      const startedAt = new Date(
        Date.now() - (PHASE_DURATIONS[timerPhase] - timeLeft) * 1000
      ).toISOString();
      await supabase
        .from("study_rooms")
        .update({ timer_started_at: startedAt, timer_paused_at: null, timer_paused_remaining: null })
        .eq("id", roomId);
    }
  }

  async function handleTimerPause() {
    setTimerRunning(false);
    broadcastTimerRef.current?.(timerPhase, timeLeft, false);
    if (roomId && iAmHost) {
      await supabase
        .from("study_rooms")
        .update({ timer_paused_at: new Date().toISOString(), timer_paused_remaining: timeLeft })
        .eq("id", roomId);
    }
  }

  async function handleSkipPreread() {
    setTimerPhase("CONSULT");
    setTimeLeft(PHASE_DURATIONS.CONSULT);
    setTimerRunning(true);
    broadcastTimerRef.current?.("CONSULT", PHASE_DURATIONS.CONSULT, true);
    if (roomId && iAmHost) {
      await supabase
        .from("study_rooms")
        .update({
          timer_phase: "CONSULT",
          timer_started_at: null,
          timer_paused_at: null,
          timer_paused_remaining: null,
          timer_skipped_preread: true,
        })
        .eq("id", roomId);
    }
  }

  async function handleTimerReset() {
    setTimerPhase("PREREAD");
    setTimeLeft(PHASE_DURATIONS.PREREAD);
    setTimerRunning(false);
    broadcastTimerRef.current?.("PREREAD", PHASE_DURATIONS.PREREAD, false);
    if (roomId && iAmHost) {
      await supabase
        .from("study_rooms")
        .update({
          timer_phase: "PREREAD",
          timer_started_at: null,
          timer_paused_at: null,
          timer_paused_remaining: null,
          timer_skipped_preread: false,
        })
        .eq("id", roomId);
    }
  }

  const handleTick = useCallback((newTime: number) => {
    setTimeLeft(newTime);
  }, []);

  async function handlePhaseComplete() {
    if (timerPhase === "PREREAD") {
      const startedAt = new Date().toISOString();
      setTimerPhase("CONSULT");
      setTimeLeft(PHASE_DURATIONS.CONSULT);
      setTimerRunning(true);
      broadcastTimerRef.current?.("CONSULT", PHASE_DURATIONS.CONSULT, true);
      if (roomId && iAmHost) {
        await supabase
          .from("study_rooms")
          .update({
            timer_phase: "CONSULT",
            timer_started_at: startedAt,
            timer_paused_at: null,
            timer_paused_remaining: null,
          })
          .eq("id", roomId);
      }
    } else {
      setTimerRunning(false);
    }
  }

  // Persist last-visited station — Supabase for cross-device, localStorage as immediate fallback
  useEffect(() => {
    localStorage.setItem("lastCaseBankStation", String(station.number));
    updateLastStationAction(station.number);
  }, [station.number]);

  function handleStationJump() {
    const n = parseInt(jumpValue, 10);
    if (!isNaN(n) && n >= 1 && n <= totalStations) {
      setJumpOpen(false);
      setJumpValue("");
      router.push(`/case-bank/${n}`);
    }
  }

  // Keep timerStateRef in sync so presence-join re-announcements have current values
  useEffect(() => {
    timerStateRef.current = { phase: timerPhase, timeLeft, running: timerRunning };
  }, [timerPhase, timeLeft, timerRunning]);

  // Reset timer to PREREAD whenever the station changes (desired behavior).
  // Skip the very first render — useState already initialises to PREREAD.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setTimerPhase("PREREAD");
    setTimeLeft(PHASE_DURATIONS.PREREAD);
    setTimerRunning(false);
    broadcastTimerRef.current?.("PREREAD", PHASE_DURATIONS.PREREAD, false);
  }, [station.number]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer sync received from StudyRoom (guest path — broadcast only)
  const handleTimerSync = useCallback(
    (phase: TimerPhase, time: number, running: boolean) => {
      setTimerPhase(phase);
      setTimeLeft(time);
      setTimerRunning(running);
    },
    []
  );

  // Guest navigation: follow host to a different station
  const handleStationChange = useCallback(
    (stationNumber: number) => {
      router.push(`/case-bank/${stationNumber}`);
    },
    [router]
  );

  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif", minHeight: "100vh" }}>

      {/* Top nav */}
      <div
        className="flex flex-wrap items-center justify-between px-6 py-2.5 gap-2"
        style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-3.5">
          <Link
            href="/case-bank"
            className="text-[12px] no-underline"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            ← Case Bank
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <div className="flex items-center gap-1">
            {(!inRoom || iAmHost) && prevStationNumber && (
              <button
                onClick={() => router.push(`/case-bank/${prevStationNumber}`)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", padding: "2px 6px", fontSize: "14px", lineHeight: 1 }}
              >
                ←
              </button>
            )}
            {inRoom && !iAmHost ? (
              <span className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
                Station {station.number} / {totalStations}
              </span>
            ) : jumpOpen ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleStationJump();
                    if (e.key === "Escape") { setJumpOpen(false); setJumpValue(""); }
                  }}
                  autoFocus
                  placeholder={String(station.number)}
                  className="rounded-md px-2 py-1 text-[12px] text-center w-[52px]"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                  / {totalStations}
                </span>
                <button
                  onClick={() => { setJumpOpen(false); setJumpValue(""); }}
                  className="text-[12px]"
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setJumpOpen(true)}
                className="text-[12px] font-semibold rounded-md"
                style={{
                  background: "none",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.65)",
                  cursor: "pointer",
                  padding: "3px 10px",
                }}
              >
                Station {station.number} / {totalStations}
              </button>
            )}
            {(!inRoom || iAmHost) && nextStationNumber && (
              <button
                onClick={() => router.push(`/case-bank/${nextStationNumber}`)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", padding: "2px 6px", fontSize: "14px", lineHeight: 1 }}
              >
                →
              </button>
            )}
            {inRoom && !iAmHost && (
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>
                {roomHostName ?? "Host"} is navigating
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowRoom(true)}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="11" rx="3"/>
              <path d="M5 10a7 7 0 0 0 14 0"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
              <line x1="9" y1="21" x2="15" y2="21"/>
            </svg>
            Record
          </button>

          <button
            onClick={() => setShowRoom((v) => !v)}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={showRoom ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Study Room
          </button>

          <button
            onClick={handleToggleStar}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {starred ? "Starred" : "Star"}
          </button>

          <button
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Feedback
          </button>

        </div>
      </div>

      {/* Tab strip */}
      <div style={{ background: "white", borderBottom: "1px solid rgba(31,41,55,0.10)" }}>
        <div className="max-w-[1300px] mx-auto px-6 flex items-end">
          {visibleTabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="py-2.5 px-4 text-[12.5px] transition-colors whitespace-nowrap"
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: active ? `2px solid ${YELLOW}` : "2px solid transparent",
                  marginBottom: "-1px",
                  cursor: "pointer",
                  color: active ? NAVY : "rgba(31,41,55,0.40)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1300px] mx-auto px-6 py-6">
        <div
          className="grid gap-5 items-start"
          style={{ gridTemplateColumns: "1fr 240px" }}
        >
          {/* Tab content */}
          <div className="rounded-xl bg-white px-6 py-5" style={{ border: "1px solid rgba(31,41,55,0.10)" }}>
            <HighlightProvider stationId={station.id}>
            {activeTab === "brief" && <DoctorBriefContent station={station} />}
            {activeTab === "story" && <PatientStoryContent station={station} />}
            {activeTab === "data" && <BulletList items={station.data_gathering} listKey="data_gathering" />}
            {activeTab === "management" && <BulletList items={station.management} listKey="management" />}
            {activeTab === "explanation" && (
              <ExplanationBody text={station.example_explanation} />
            )}
            {activeTab === "message" && (
              <p className="text-[16px] leading-[1.85]" style={{ whiteSpace: "pre-line" }}>
                <Highlightable unitKey="message" text={station.message ?? ""} style={{ color: "rgba(26,27,82,0.82)" }} />
              </p>
            )}
            {activeTab === "takeaways" && <BulletList items={station.key_takeaways} listKey="key_takeaways" />}
            {activeTab === "qa" && (
              <div className="flex flex-col gap-4">
                {station.trainer_qa.map((qa, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-4"
                    style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.08)" }}
                  >
                    <p className="text-[15px] font-semibold mb-1.5" style={{ color: NAVY }}>
                      <Highlightable unitKey={`trainer_qa_q-${i}`} text={qa.question} style={{ color: NAVY }} />
                    </p>
                    <p className="text-[15.5px] leading-[1.7]" style={{ color: "rgba(26,27,82,0.8)", whiteSpace: "pre-line" }}>
                      <Highlightable unitKey={`trainer_qa_a-${i}`} text={qa.answer} style={{ color: "rgba(26,27,82,0.8)" }} />
                    </p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "audio" && station.audio_url && (
              <div className="flex flex-col gap-5">
                <audio
                  controls
                  src={station.audio_url}
                  className="w-full"
                  style={{ borderRadius: "8px", outline: "none" }}
                />
                {station.audio_notes && (
                  <p className="text-[16px] leading-[1.8]" style={{ color: "rgba(26,27,82,0.8)", whiteSpace: "pre-line" }}>
                    {station.audio_notes}
                  </p>
                )}
              </div>
            )}
            </HighlightProvider>
          </div>

          {/* Timer + study room */}
          <div className="sticky top-4 flex flex-col gap-3">
            <div>
              <Timer
                phase={timerPhase}
                timeLeft={timeLeft}
                running={timerRunning}
                isHost={!inRoom || iAmHost}
                locked={isRecordingActive}
                onStart={handleTimerStart}
                onPause={handleTimerPause}
                onSkipPreread={handleSkipPreread}
                onReset={handleTimerReset}
                onTick={handleTick}
                onPhaseComplete={handlePhaseComplete}
              />
              {inRoom && !iAmHost && (
                <p className="text-center text-[11px] mt-1.5" style={{ color: "rgba(31,41,55,0.4)" }}>
                  Timer controlled by {roomHostName ?? "host"}
                </p>
              )}
            </div>

            <div style={{ display: showRoom ? undefined : "none" }}>
              <StudyRoomPanel
                stationId={station.id}
                stationNumber={station.number}
                stationTitle={station.title}
                userId={userId}
                displayName={userDisplayName}
                initials={userInitials}
                onTimerSync={handleTimerSync}
                onStationChange={handleStationChange}
                onRoomStatusChange={handleRoomStatusChange}
                onRecordingStateChange={setIsRecordingActive}
                broadcastTimerRef={broadcastTimerRef}
                timerStateRef={timerStateRef}
                onTimerReset={handleTimerReset}
                timerPhase={timerPhase}
                timerRunning={timerRunning}
                timeLeft={timeLeft}
              />
            </div>
          </div>
        </div>
      </div>

      {showFeedback && (
        <FeedbackModal
          stationId={station.id}
          stationNumber={station.number}
          stationTitle={station.title}
          onClose={() => setShowFeedback(false)}
        />
      )}


    </main>
  );
}
