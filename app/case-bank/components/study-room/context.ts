"use client";

import { createContext, useContext } from "react";
import type { StudyRoom, ChatMessage, TimerPhase } from "@/lib/case-bank-types";

export type RecordingState = "idle" | "starting" | "recording" | "uploading" | "done" | "error";

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
  start: () => void;
  pause: () => void;
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
  setRecordingError: (msg: string) => void;
  /** "Try again" after a failed recording — clears the error and returns to idle. */
  clearRecordingError: () => void;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  myRecordingRole: "doctor" | "patient" | null;
  activeRecordingId: string | null;

  dailyConnecting: boolean;
  callConnected: boolean;
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
 * These throw rather than returning null: the provider is mounted in
 * app/case-bank/layout.tsx, so it is guaranteed to sit above every consumer.
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
