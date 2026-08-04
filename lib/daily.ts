import { getSupabaseAdmin } from "./supabase";
import { PHASE_DURATIONS } from "./case-bank-types";

const DAILY_API_BASE = "https://api.daily.co/v1";

// Small buffer past the 12-minute consult window so Daily's own room/token
// expiry acts as a third independent hard-cutoff, alongside the client-side
// MediaRecorder cutoff and the host's broadcast cutoff.
const ROOM_LIFETIME_SECONDS = PHASE_DURATIONS.CONSULT + 60;

// Study rooms cap at 4 participants (1 doctor, 1 patient, 2 observers) —
// mirrors the same hard limit enforced in joinStudyRoomAction.
const MAX_PARTICIPANTS = 4;

function getDailyApiKey(): string | null {
  const key = process.env.DAILY_API_KEY;
  if (!key) {
    console.warn("[daily] DAILY_API_KEY missing — live audio disabled.");
    return null;
  }
  return key;
}

async function dailyFetch(path: string, init?: RequestInit): Promise<Response | null> {
  const key = getDailyApiKey();
  if (!key) return null;

  const res = await fetch(`${DAILY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  return res;
}

/**
 * Whether the admin has enabled DailyCo live audio (site_settings.daily_co_enabled).
 * Defaults to off — callers should fall back to local-recording-only when false.
 */
export async function isDailyCoEnabled(): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (!admin) return false;
  const { data } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "daily_co_enabled")
    .single<{ value: string }>();
  return data?.value === "true";
}

export interface DailyRoom {
  name: string;
  url: string;
}

/**
 * Creates a private, audio-only DailyCo room for one recording. The room
 * self-expires ROOM_LIFETIME_SECONDS after creation (~12 min consult + 1 min
 * buffer) and ejects everyone at that mark — call this right when the
 * recording starts, not earlier, so the expiry lines up with the consult
 * window rather than time spent in the lobby.
 *
 * Returns null on any failure (missing key, API error) so callers can
 * degrade gracefully to local-recording-only rather than blocking the
 * consultation from starting.
 */
export async function createDailyRoom(recordingId: string): Promise<DailyRoom | null> {
  try {
    const exp = Math.floor(Date.now() / 1000) + ROOM_LIFETIME_SECONDS;

    const res = await dailyFetch("/rooms", {
      method: "POST",
      body: JSON.stringify({
        name: `sca-${recordingId}`,
        privacy: "private",
        properties: {
          exp,
          eject_at_room_exp: true,
          max_participants: MAX_PARTICIPANTS,
          enable_screenshare: false,
          enable_chat: false,
          enable_recording: false,
          enable_prejoin_ui: false,
          start_video_off: true,
          start_audio_off: false,
        },
      }),
    });

    if (!res || !res.ok) {
      console.error("[daily] createDailyRoom failed:", res ? await res.text() : "no API key");
      return null;
    }

    const data = (await res.json()) as { name: string; url: string };
    return { name: data.name, url: data.url };
  } catch (err) {
    console.error("[daily] createDailyRoom threw:", err);
    return null;
  }
}

/**
 * Issues a short-lived join token scoped to one room. Token expiry matches
 * the room's own expiry so a participant can't rejoin after the cutoff.
 * Returns null on failure — callers should treat a null token as "live
 * audio unavailable" rather than blocking the recording.
 */
export async function createDailyMeetingToken(
  roomName: string,
  userName: string,
  isOwner: boolean
): Promise<string | null> {
  try {
    const exp = Math.floor(Date.now() / 1000) + ROOM_LIFETIME_SECONDS;

    const res = await dailyFetch("/meeting-tokens", {
      method: "POST",
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_name: userName,
          is_owner: isOwner,
          exp,
        },
      }),
    });

    if (!res || !res.ok) {
      console.error("[daily] createDailyMeetingToken failed:", res ? await res.text() : "no API key");
      return null;
    }

    const data = (await res.json()) as { token: string };
    return data.token;
  } catch (err) {
    console.error("[daily] createDailyMeetingToken threw:", err);
    return null;
  }
}

/**
 * Best-effort room cleanup after a recording ends. Safe to call even if the
 * room already expired/was already deleted — failures are logged, not thrown,
 * since a leftover room is harmless (it self-expires anyway) and shouldn't
 * block the rest of the stop/upload flow.
 */
export async function deleteDailyRoom(roomName: string): Promise<void> {
  try {
    const res = await dailyFetch(`/rooms/${roomName}`, { method: "DELETE" });
    if (res && !res.ok && res.status !== 404) {
      console.error("[daily] deleteDailyRoom failed:", await res.text());
    }
  } catch (err) {
    console.error("[daily] deleteDailyRoom threw:", err);
  }
}
