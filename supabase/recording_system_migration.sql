-- ══════════════════════════════════════════════════════════════════════════════
-- Recording System Migration
-- Run this ONCE in the Supabase SQL editor (safe to split if needed).
--
-- After running, go to Storage → New bucket and create:
--   Name: consultation-recordings   Public: OFF (private)
-- ══════════════════════════════════════════════════════════════════════════════

-- ── 1. Recording Credits ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recording_credits (
  user_id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance         INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  total_purchased INTEGER NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE recording_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own recording credits"
  ON recording_credits FOR SELECT
  USING (auth.uid() = user_id);

-- ── 2. Examiners table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS examiners (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  passcode   TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 3. Station Recordings ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS station_recordings (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id              UUID REFERENCES study_rooms(id) ON DELETE SET NULL,
  station_number       INTEGER NOT NULL,
  station_title        TEXT NOT NULL,

  -- Participants
  doctor_user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  patient_user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  doctor_display_name  TEXT,
  patient_display_name TEXT,
  candidate_email      TEXT,

  -- Timing
  started_at           TIMESTAMPTZ DEFAULT now(),
  ended_at             TIMESTAMPTZ,

  -- Audio (Supabase Storage paths; audio purged after 3 months by cron)
  doctor_audio_path    TEXT,
  patient_audio_path   TEXT,
  audio_deleted_at     TIMESTAMPTZ,

  -- Transcript
  transcript_formatted TEXT,
  transcript_raw       JSONB,

  -- AI grading
  ai_data_gathering              TEXT CHECK (ai_data_gathering IN ('CF','F','P','CP')),
  ai_clinical_management         TEXT CHECK (ai_clinical_management IN ('CF','F','P','CP')),
  ai_relating_to_others          TEXT CHECK (ai_relating_to_others IN ('CF','F','P','CP')),
  ai_comment_data_gathering      TEXT,
  ai_comment_clinical_management TEXT,
  ai_comment_relating_to_others  TEXT,
  ai_graded_at                   TIMESTAMPTZ,

  -- Examiner review
  examiner_id                          UUID REFERENCES examiners(id) ON DELETE SET NULL,
  examiner_data_gathering              TEXT CHECK (examiner_data_gathering IN ('CF','F','P','CP')),
  examiner_clinical_management         TEXT CHECK (examiner_clinical_management IN ('CF','F','P','CP')),
  examiner_relating_to_others          TEXT CHECK (examiner_relating_to_others IN ('CF','F','P','CP')),
  examiner_comment_data_gathering      TEXT,
  examiner_comment_clinical_management TEXT,
  examiner_comment_relating_to_others  TEXT,
  examiner_overall_comment             TEXT,
  examiner_voice_note_path             TEXT,
  examiner_reviewed_at                 TIMESTAMPTZ,

  -- Delivery
  sent_to_candidate_at TIMESTAMPTZ,
  status               TEXT NOT NULL DEFAULT 'uploading'
    CHECK (status IN ('uploading','processing','pending_examiner','reviewed','sent')),

  created_at           TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE station_recordings ENABLE ROW LEVEL SECURITY;

-- Candidate reads their own recordings
CREATE POLICY "Candidates read own recordings"
  ON station_recordings FOR SELECT
  USING (auth.uid() = doctor_user_id OR auth.uid() = patient_user_id);

-- ── 4. Per-station marking notes on stations ──────────────────────────────────
ALTER TABLE stations ADD COLUMN IF NOT EXISTS marking_notes_data_gathering      TEXT;
ALTER TABLE stations ADD COLUMN IF NOT EXISTS marking_notes_clinical_management TEXT;
ALTER TABLE stations ADD COLUMN IF NOT EXISTS marking_notes_relating_to_others  TEXT;
