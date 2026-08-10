export type QAPair = { question: string; answer: string };

export type Station = {
  id: string;
  number: number;
  title: string;
  subject: string;
  consultation_type: string;
  published: boolean;
  archived: boolean;
  admin_note: string | null;
  patient_name: string;
  patient_age: string;
  pmh: string[];
  medications_and_allergies: string[];
  recent_notes: string | null;
  reason_for_consultation: string;
  opening_statement: string;
  if_asked_further: string;
  only_if_asked: string[];
  social_history: string;
  ice_ideas: string;
  ice_concerns: string;
  ice_expectations: string;
  scenarios: string[] | null;
  question_for_doctor: string | null;
  role_player_instruction: string | null;
  dilemma: string | null;
  data_gathering: string[];
  management: string[];
  example_explanation: string;
  message: string | null;
  key_takeaways: string[];
  patient_qa: QAPair[];
  audio_url: string | null;
  audio_notes: string | null;
  image_urls: string[] | null;
  marking_notes_data_gathering: string | null;
  marking_notes_clinical_management: string | null;
  marking_notes_relating_to_others: string | null;
  created_at: string;
  updated_at: string;
};

export type StationListRow = {
  id: string;
  number: number;
  title: string;
  subject: string;
  consultation_type: string;
  published: boolean;
  archived: boolean;
};

export type StudyRoom = {
  id: string;
  room_code: string;
  host_user_id: string;
  doctor_user_id: string | null;
  patient_user_id: string | null;
  current_station_id: string | null;
  current_station_number: number | null;
  timer_phase: "PREREAD" | "CONSULT";
  timer_started_at: string | null;
  timer_paused_at: string | null;
  timer_paused_remaining: number | null;
  timer_skipped_preread: boolean;
  created_at: string;
};

export type RoomParticipant = {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  muted: boolean;
};

export type UserProfile = {
  id: string;
  display_name: string;
  initials: string;
};

export type ChatMessage = {
  id: string;
  from: string;
  fromSelf: boolean;
  text: string;
  time: string;
};

export type HighlightColor = "red" | "orange" | "yellow" | "green" | "blue" | "violet" | "pink";

export type Highlight = {
  id: string;
  container_key: string;
  start_offset: number;
  end_offset: number;
  color: HighlightColor;
};

export const HIGHLIGHT_COLORS: Record<HighlightColor, string> = {
  red: "#FFADAD",
  orange: "#FFD6A5",
  yellow: "#FDFFB6",
  green: "#CAFFBF",
  blue: "#A0E7E5",
  violet: "#BDB2FF",
  pink: "#FFC6FF",
};

export type TimerPhase = "PREREAD" | "CONSULT";

export const PHASE_DURATIONS: Record<TimerPhase, number> = {
  PREREAD: 3 * 60,
  CONSULT: 12 * 60,
};

// The voice call stays open this long after recording stops so the two
// candidates can debrief. Shared so the Daily room's expiry can be set to
// outlast it (consult + debrief + buffer).
export const DEBRIEF_DURATION_SECONDS = 3 * 60;

export const SUBJECTS = [
  "All",
  "Cardiovascular",
  "Respiratory",
  "Mental Health",
  "Musculoskeletal",
  "Gastroenterology",
  "Women's Health",
  "Paediatrics",
  "Dermatology",
  "Neurology",
  "Endocrine",
  "Renal",
  "Multimorbidity",
] as const;

export const SUBJECT_COLORS: Record<string, { bg: string; text: string }> = {
  Cardiovascular: { bg: "rgba(239,68,68,0.09)", text: "#B91C1C" },
  Respiratory: { bg: "rgba(59,130,246,0.09)", text: "#1D4ED8" },
  "Mental Health": { bg: "rgba(139,92,246,0.09)", text: "#6D28D9" },
  Musculoskeletal: { bg: "rgba(245,158,11,0.09)", text: "#B45309" },
  Gastroenterology: { bg: "rgba(16,185,129,0.09)", text: "#065F46" },
  "Women's Health": { bg: "rgba(236,72,153,0.09)", text: "#9D174D" },
  Paediatrics: { bg: "rgba(14,165,233,0.09)", text: "#0369A1" },
  Dermatology: { bg: "rgba(234,179,8,0.09)", text: "#854D0E" },
  Neurology: { bg: "rgba(99,102,241,0.09)", text: "#3730A3" },
  Endocrine: { bg: "rgba(20,184,166,0.09)", text: "#0F766E" },
  Renal: { bg: "rgba(168,85,247,0.09)", text: "#7E22CE" },
  Multimorbidity: { bg: "rgba(107,114,128,0.09)", text: "#374151" },
};
