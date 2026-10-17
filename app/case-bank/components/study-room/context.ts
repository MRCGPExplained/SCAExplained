"use client";

import { createContext, useContext } from "react";
import type { StudyRoom, ChatMessage, TimerPhase } from "@/lib/case-bank-types";

export type RecordingState = "idle" | "starting" | "recording" | "uploading" | "done" | "error";

/**
 * Where a finished take has got to on the server, which is a different question
 * from what this browser is doing. `RecordingState` ends the moment our own
 * blob lands; the transcript and the grades take another minute after that.
 * Keeping the two apart is what lets the panel hand the Record button back for
 * the next station while the last one is still being marked.
 */
export type ReviewStage = "uploading" | "transcribing" | "marking" | "review" | "failed";

export interface Participant {
  userId: string;
  displayName: string;
  initials: string;
  isHost: boolean;
  isSelf: boolean;
  isGuest: boolean;
  muted: boolean;
  joinedAt: string;
}

/**
 * Split into three contexts on purpose. `timeLeft` changes once a second, and
 * a single combined context would re-render the whole station page — every
 * highlightable block of case text included — on every tick.
 */

/** Low frequency. Consumed by StationPageClient for nav gating. */
export interface StudyRoomStatusValue {
  inRoom: boolean;
  iAmHost: boolean;
  roomId: string | null;
  hostName: string | null;
  isRecordingActive: boolean;
  /**
   * The case the room is on, from the room row rather than the URL — what a
   * guest who has stepped away needs in order to find their way back.
   */
  hostStationNumber: number | null;
  /** Current station from the URL; null on the list/login/register pages. */
  stationNumber: number | null;
  registerStation: (number: number, title: string) => void;
}

/** 1 Hz. Consumed by StudyRoomTimer, and by the panel for `sessionIdle`. */
export interface StudyRoomTimerValue {
  phase: TimerPhase;
  timeLeft: number;
  running: boolean;
  isTimerHost: boolean;
  locked: boolean;
  /**
   * Why the clock cannot be started, or null when it can. In a room the timer
   * is what begins a session, so it refuses rather than counting down toward a
   * consultation that could never be recorded. Null outside a room.
   */
  startBlockedReason: string | null;
  /**
   * True when pressing start begins a graded, recorded consultation rather
   * than just running a clock, so the button can say which it is.
   */
  startWillRecord: boolean;
  start: () => void;
  /**
   * Halts the clock where it stands. In PREREAD that reads as a pause and
   * Start resumes it; in CONSULT it is terminal, because a consultation that
   * could be paused and resumed would not be a 12-minute consultation.
   */
  stop: () => void;
  skipPreread: () => void;
  reset: () => void;
  tick: (next: number) => void;
  phaseComplete: () => void;
}

/** Everything the panel needs. */
export interface StudyRoomValue {
  userId: string | null;
  displayName: string;
  initials: string;

  room: StudyRoom | null;
  participants: Participant[];
  connectedIds: Set<string>;
  doctorUserId: string | null;
  patientUserId: string | null;
  myAssignedRole: "doctor" | "patient" | null;
  rolesReady: boolean;
  sessionIdle: boolean;
  rolesSaving: boolean;
  iAmHost: boolean;

  loading: boolean;
  joinError: string;
  createRoom: () => Promise<void>;
  joinRoom: (code: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  setRoles: (doctor: string, patient: string | null) => Promise<void>;
  removeParticipant: (userId: string, name: string) => Promise<void>;

  messages: ChatMessage[];
  sendChat: (text: string) => Promise<void>;

  recordingState: RecordingState;
  recordingError: string;
  /** "Try again" after a failed recording — clears the error and returns to idle. */
  clearRecordingError: () => void;
  /**
   * Pressing Start is now the commitment, so the "before you start" notice
   * belongs to it. Raised by the timer's Start when the run that follows will
   * be recorded; `confirmStart` then actually starts the clock.
   */
  showStartWarning: boolean;
  confirmStart: () => void;
  cancelStart: () => void;
  stopRecording: () => void;
  myRecordingRole: "doctor" | "patient" | null;
  activeRecordingId: string | null;

  /** Null until a take finishes; then it advances until the report is ready. */
  reviewStage: ReviewStage | null;
  /** The recording `reviewStage` refers to — the target of the Review link. */
  reviewRecordingId: string | null;
  dismissReviewStage: () => void;

  dailyConnecting: boolean;
  callConnected: boolean;
  /** Signalling dropped, SDK still retrying — not yet a failure. */
  dailyReconnecting: boolean;
  dailyFailed: boolean;
  debriefSecondsLeft: number | null;
  endDebrief: () => void;

  recentReportId: string | null;
  shareRecentReport: () => Promise<void>;
  showScreenTip: boolean;
  dontShowScreenTip: boolean;
  setDontShowScreenTip: (v: boolean) => void;
  dismissScreenTip: () => void;
}

const StudyRoomStatusContext = createContext<StudyRoomStatusValue | null>(null);
const StudyRoomTimerContext = createContext<StudyRoomTimerValue | null>(null);
const StudyRoomContext = createContext<StudyRoomValue | null>(null);

export const StudyRoomStatusProvider = StudyRoomStatusContext.Provider;
export const StudyRoomTimerProvider = StudyRoomTimerContext.Provider;
export const StudyRoomValueProvider = StudyRoomContext.Provider;

/**
 * These throw rather than returning null: the provider is mounted in the root
 * layout, so it is guaranteed to sit above every consumer.
 * A null here would mean the tree was restructured, which should fail loudly.
 */
export function useStudyRoomStatus(): StudyRoomStatusValue {
  const v = useContext(StudyRoomStatusContext);
  if (!v) throw new Error("useStudyRoomStatus must be used inside <StudyRoomProvider>");
  return v;
}

export function useStudyRoomTimer(): StudyRoomTimerValue {
  const v = useContext(StudyRoomTimerContext);
  if (!v) throw new Error("useStudyRoomTimer must be used inside <StudyRoomProvider>");
  return v;
}

export function useStudyRoom(): StudyRoomValue {
  const v = useContext(StudyRoomContext);
  if (!v) throw new Error("useStudyRoom must be used inside <StudyRoomProvider>");
  return v;
}
