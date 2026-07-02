"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Station, TimerPhase } from "@/lib/case-bank-types";
import { PHASE_DURATIONS } from "@/lib/case-bank-types";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Timer } from "./Timer";
import { StudyRoomPanel } from "./StudyRoom";
import { ReportModal } from "./ReportModal";
import { toggleStarAction, recordAttemptAction } from "../actions";

const NAVY = "#1A1B52";
const YELLOW = "#F6D44B";
const LIGHT_BG = "#F3F2FB";

// ── Accordion ─────────────────────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-xl overflow-hidden mb-2.5"
      style={{ border: "1px solid rgba(26,27,82,0.10)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 transition-colors"
        style={{
          background: open ? NAVY : "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          className="font-display font-bold text-[13.5px]"
          style={{ color: open ? "white" : NAVY, transition: "color 0.2s" }}
        >
          {title}
        </span>
        <span
          className="text-[18px] font-bold leading-none"
          style={{ color: open ? YELLOW : NAVY }}
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="bg-white px-5 py-4">{children}</div>
      )}
    </div>
  );
}

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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="m-0 p-0 list-none flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span
            className="shrink-0 w-1.5 h-1.5 rounded-full mt-2"
            style={{ background: YELLOW }}
          />
          <span className="text-[13.5px] leading-[1.65]" style={{ color: "rgba(26,27,82,0.8)" }}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function DoctorBriefContent({ station }: { station: Station }) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <Label>Patient</Label>
          <div className="text-[14px] font-bold" style={{ color: NAVY }}>
            {station.patient_name}
          </div>
          <div className="text-[13px]" style={{ color: "rgba(26,27,82,0.65)" }}>
            {station.patient_age}
          </div>
        </div>
        <div>
          <Label>Type</Label>
          <div className="text-[13px]" style={{ color: "rgba(26,27,82,0.75)" }}>
            {station.consultation_type}
          </div>
        </div>
      </div>
      {station.pmh.length > 0 && (
        <div>
          <Label>Past Medical History</Label>
          <BulletList items={station.pmh} />
        </div>
      )}
      {station.medications_and_allergies.length > 0 && (
        <div>
          <Label>Drug & Allergy History</Label>
          <BulletList items={station.medications_and_allergies} />
        </div>
      )}
      {station.recent_notes && (
        <div>
          <Label>Recent Notes</Label>
          <p className="text-[13.5px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }}>
            {station.recent_notes}
          </p>
        </div>
      )}
      <div>
        <Label>Reason for Consultation</Label>
        <p className="text-[13.5px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }}>
          {station.reason_for_consultation}
        </p>
      </div>
    </div>
  );
}

function PatientStoryContent({ station }: { station: Station }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Opening statement */}
      <div className="rounded-lg p-4" style={{ background: NAVY }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: YELLOW }}>
          Opening Statement
        </div>
        <p className="text-[13.5px] leading-[1.65] italic" style={{ color: "white" }}>
          &ldquo;{station.opening_statement}&rdquo;
        </p>
      </div>

      {/* If asked further */}
      <div>
        <Label>If Asked to Explain Further</Label>
        <p className="text-[13.5px] leading-[1.65]" style={{ color: "rgba(26,27,82,0.8)" }}>
          {station.if_asked_further}
        </p>
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
            style={{ color: NAVY }}
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
                <span className="text-[13px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.75)" }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Social history */}
      <div>
        <Label>Social History</Label>
        <p className="text-[13.5px] leading-[1.65]" style={{ color: "rgba(26,27,82,0.8)" }}>
          {station.social_history}
        </p>
      </div>

      {/* ICE */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          ["Ideas", station.ice_ideas],
          ["Concerns", station.ice_concerns],
          ["Expectations", station.ice_expectations],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg p-3" style={{ background: LIGHT_BG }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: NAVY }}>
              {label}
            </div>
            <p className="text-[12px] leading-[1.55]" style={{ color: "rgba(26,27,82,0.75)" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Scenarios */}
      {station.scenarios && station.scenarios.length > 0 && (
        <div>
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
                <span className="text-[13px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }}>
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Question for doctor */}
      {station.question_for_doctor && (
        <div className="rounded-lg p-4" style={{ background: NAVY }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: YELLOW }}>
            Question for the Doctor
          </div>
          <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.85)" }}>
            {station.question_for_doctor}
          </p>
        </div>
      )}

      {/* Role player instruction */}
      {station.role_player_instruction && (
        <div
          className="pt-3 border-t"
          style={{ borderColor: "rgba(26,27,82,0.08)" }}
        >
          <p className="text-[12px] italic" style={{ color: "rgba(26,27,82,0.5)" }}>
            {station.role_player_instruction}
          </p>
        </div>
      )}
    </div>
  );
}

function getYouTubeEmbedUrl(url: string): string | null {
  const watchMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
  const id = watchMatch?.[1] ?? shortMatch?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : null;
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
  const [showReport, setShowReport] = useState(false);
  const [starPending, setStarPending] = useState(false);

  // Room state (exposed from StudyRoomPanel)
  const [inRoom, setInRoom] = useState(false);
  const [iAmHost, setIAmHost] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  // Timer state
  const [timerPhase, setTimerPhase] = useState<TimerPhase>("PREREAD");
  const [timeLeft, setTimeLeft] = useState(PHASE_DURATIONS.PREREAD);
  const [timerRunning, setTimerRunning] = useState(false);
  const [attemptRecorded, setAttemptRecorded] = useState(false);

  const handleRoomStatusChange = useCallback(
    (nowInRoom: boolean, nowHost: boolean, nowRoomId: string | null) => {
      setInRoom(nowInRoom);
      setIAmHost(nowHost);
      setRoomId(nowRoomId);
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
    if (!attemptRecorded) {
      setAttemptRecorded(true);
      recordAttemptAction(station.id);
    }
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
    setTimerRunning(false);
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

  // Timer sync received from StudyRoom (guest path)
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

  const embedUrl = station.editor_video_url
    ? getYouTubeEmbedUrl(station.editor_video_url)
    : null;

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
          <span
            className="text-[12px] font-semibold"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Station {station.number} of {totalStations}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowRoom((v) => !v)}
            className="rounded-md px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: showRoom ? "rgba(246,212,75,0.15)" : "rgba(255,255,255,0.08)",
              border: `1.5px solid ${showRoom ? YELLOW : "rgba(255,255,255,0.2)"}`,
              color: showRoom ? YELLOW : "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            👥 Study Room
          </button>

          <button
            onClick={handleToggleStar}
            className="rounded-md px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: starred ? YELLOW : "transparent",
              border: `1.5px solid ${starred ? YELLOW : "rgba(255,255,255,0.25)"}`,
              color: starred ? NAVY : "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            {starred ? "★ Starred" : "☆ Star"}
          </button>

          <button
            onClick={() => setShowReport(true)}
            className="rounded-md px-3 py-1.5 text-[12px]"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.45)",
              cursor: "pointer",
            }}
          >
            Report Issue
          </button>

          {prevStationNumber && (
            <button
              onClick={() => router.push(`/case-bank/${prevStationNumber}`)}
              className="rounded-md px-3 py-1.5 text-[12px] font-semibold"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
              }}
            >
              ← Prev
            </button>
          )}
          {nextStationNumber && (
            <button
              onClick={() => router.push(`/case-bank/${nextStationNumber}`)}
              className="rounded-md px-3 py-1.5 text-[12px] font-semibold"
              style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1300px] mx-auto px-6 py-6">
        <div
          className="grid gap-5 items-start"
          style={{ gridTemplateColumns: "1fr 240px" }}
        >
          {/* Station content */}
          <div>
            <Section title="Doctor's Brief" defaultOpen={true}>
              <DoctorBriefContent station={station} />
            </Section>

            <Section title="Patient's Story">
              <PatientStoryContent station={station} />
            </Section>

            <Section title="Data Gathering & Diagnosis">
              <BulletList items={station.data_gathering} />
            </Section>

            <Section title="Management">
              <BulletList items={station.management} />
            </Section>

            <Section title="Example Explanation">
              <p
                className="text-[13.5px] leading-[1.85]"
                style={{ color: "rgba(26,27,82,0.82)", whiteSpace: "pre-line" }}
              >
                {station.example_explanation}
              </p>
            </Section>

            <Section title="Key Takeaways">
              <BulletList items={station.key_takeaways} />
            </Section>

            {embedUrl && (
              <Section title="Message from Me">
                <div
                  className="relative rounded-lg overflow-hidden"
                  style={{ paddingBottom: "56.25%", height: 0, background: NAVY }}
                >
                  <iframe
                    src={embedUrl}
                    title="Message from Me"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </Section>
            )}
          </div>

          {/* Timer + study room */}
          <div className="sticky top-4 flex flex-col gap-3">
            <Timer
              phase={timerPhase}
              timeLeft={timeLeft}
              running={timerRunning}
              isHost={!inRoom || iAmHost}
              onStart={handleTimerStart}
              onPause={handleTimerPause}
              onSkipPreread={handleSkipPreread}
              onReset={handleTimerReset}
              onTick={handleTick}
              onPhaseComplete={handlePhaseComplete}
            />

            {showRoom && (
              <StudyRoomPanel
                stationId={station.id}
                stationNumber={station.number}
                userId={userId}
                displayName={userDisplayName}
                initials={userInitials}
                onTimerSync={handleTimerSync}
                onStationChange={handleStationChange}
                onRoomStatusChange={handleRoomStatusChange}
              />
            )}
          </div>
        </div>
      </div>

      {showReport && (
        <ReportModal
          stationId={station.id}
          stationNumber={station.number}
          stationTitle={station.title}
          onClose={() => setShowReport(false)}
        />
      )}
    </main>
  );
}
