"use server";

import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createStudyRoomAction } from "@/app/case-bank/actions";
import {
  TRIAL_STATION,
  TRIAL_DAILY_CAP,
  TRIAL_CAP_MESSAGE,
  trialDayStart,
} from "@/lib/trial";

/**
 * Two people, one room, no accounts.
 *
 * The host creates a room and reads out a code; the friend types it in on
 * the same page. Both are anonymous accounts, both name themselves, and when
 * the second name lands they are both put into the case with the seats
 * already filled.
 *
 * A NAME IS THE READY SIGNAL, which is why the profile is written with an
 * empty display_name up front and filled in later. The alternative, asking
 * for a name before the pairing, means a host types their name and then
 * finds out the day is capped. display_name is NOT NULL, so "" is the
 * not-yet state rather than null.
 */

export interface TrialStart {
  error?: string;
  capped?: boolean;
  roomId?: string;
  roomCode?: string;
}

export interface TrialStatus {
  roomCode?: string;
  /** Empty string until they name themselves. */
  hostName?: string;
  guestName?: string;
  /** Both named: time to go. */
  ready?: boolean;
  /** The room stopped existing — host left, or it was swept. */
  gone?: boolean;
}

/** Fails closed: a broken count must not switch the cap off. */
async function trialsToday(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>
): Promise<number | null> {
  const { count, error } = await admin
    .from("station_recordings")
    .select("id", { count: "exact", head: true })
    .eq("is_trial", true)
    .gte("created_at", trialDayStart());

  if (error) {
    console.error("[trial] could not count today's trials, refusing", error.message);
    return null;
  }
  return count ?? 0;
}

export async function trialCapacityAction(): Promise<{ available: boolean; used: number }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { available: false, used: TRIAL_DAILY_CAP };
  const used = await trialsToday(admin);
  if (used === null) return { available: false, used: TRIAL_DAILY_CAP };
  return { available: used < TRIAL_DAILY_CAP, used };
}

/** The anonymous session plus a nameless profile, shared by both entry points. */
async function anonymousSession(): Promise<{ id: string } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) return { error: error?.message ?? "Could not start a session." };

  const { error: profileErr } = await supabase.from("user_profiles").insert({
    id: data.user.id,
    display_name: "",
    initials: "",
    is_guest: true,
  });
  if (profileErr) return { error: "Could not set up your session." };

  return { id: data.user.id };
}

/**
 * Host side. Makes the room so there is a code to read out.
 *
 * createStudyRoomAction is reused verbatim, which is what puts this account
 * in the doctor's seat: it sets doctor and host on the insert, so
 * setRoomRolesAction — which refuses a guest the doctor slot — is never
 * involved.
 */
export async function createTrialRoomAction(): Promise<TrialStart> {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Something went wrong at our end. Please try again." };

  const used = await trialsToday(admin);
  if (used === null) return { error: "Something went wrong at our end. Please try again." };
  if (used >= TRIAL_DAILY_CAP) return { capped: true, error: TRIAL_CAP_MESSAGE };

  const session = await anonymousSession();
  if ("error" in session) return { error: session.error };

  const room = await createStudyRoomAction(TRIAL_STATION);
  if (room.error || !room.roomId || !room.roomCode) {
    return { error: room.error ?? "Could not set up the room. Please try again." };
  }
  return { roomId: room.roomId, roomCode: room.roomCode };
}

/**
 * Friend side. Takes the code, checks it is a free-trial room with a seat,
 * and sits the joiner in the patient's chair.
 *
 * The patient is set here rather than left to the dropdowns, because this
 * flow knows the answer: the host is the doctor and the person joining is
 * the patient. It is written with the service-role client, since study_rooms
 * is the host's row and the joiner has no business updating it generally.
 */
export async function joinTrialRoomAction(code: string): Promise<TrialStart> {
  const roomCode = code.trim().toUpperCase();
  if (roomCode.length !== 6) return { error: "That code should be six characters." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Something went wrong at our end. Please try again." };

  const { data: room } = await admin
    .from("study_rooms")
    .select("id, host_user_id, patient_user_id, current_station_number")
    .eq("room_code", roomCode)
    .maybeSingle<{
      id: string;
      host_user_id: string;
      patient_user_id: string | null;
      current_station_number: number | null;
    }>();

  if (!room) return { error: "No room with that code. Check it and try again." };

  /*
    Only a free-trial room, and only through this door.

    A trial room is one whose host is a guest-flagged account — no paid room
    can be, because setRoomRolesAction refuses a guest the doctor slot. The
    check matters: without it this action is an unauthenticated way into any
    study room in the product, given six characters.
  */
  const { data: hostProfile } = await admin
    .from("user_profiles")
    .select("is_guest")
    .eq("id", room.host_user_id)
    .maybeSingle<{ is_guest: boolean }>();

  if (!hostProfile?.is_guest || room.current_station_number !== TRIAL_STATION) {
    return { error: "That code is not a free-trial room." };
  }
  if (room.patient_user_id) return { error: "Someone has already joined that room." };

  const session = await anonymousSession();
  if ("error" in session) return { error: session.error };

  const { error: joinErr } = await admin
    .from("room_participants")
    .upsert({ room_id: room.id, user_id: session.id }, { onConflict: "room_id,user_id" });
  if (joinErr) return { error: "Could not join the room. Please try again." };

  const { error: seatErr } = await admin
    .from("study_rooms")
    .update({ patient_user_id: session.id })
    .eq("id", room.id);
  if (seatErr) return { error: "Could not take the patient's seat. Please try again." };

  return { roomId: room.id };
}

/** Names the caller. The second one to arrive is what starts the case. */
export async function setTrialNameAction(name: string): Promise<{ error?: string }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Please enter a name." };
  if (trimmed.length > 60) return { error: "That name is a bit long." };

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired. Start again." };

  const initials =
    trimmed.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "T";

  const { error } = await supabase
    .from("user_profiles")
    .update({ display_name: trimmed, initials })
    .eq("id", user.id);

  if (error) return { error: "Could not save your name." };
  return {};
}

/**
 * Who is in the room and whether they have named themselves.
 *
 * Polled rather than subscribed. It is two people waiting for each other for
 * a few seconds, and a realtime channel for that is machinery to maintain
 * for no gain — the room already opens a realtime connection of its own once
 * they are in the case.
 */
export async function trialRoomStatusAction(roomId: string): Promise<TrialStatus> {
  const admin = getSupabaseAdmin();
  if (!admin) return { gone: true };

  const { data: room } = await admin
    .from("study_rooms")
    .select("room_code, host_user_id, patient_user_id")
    .eq("id", roomId)
    .maybeSingle<{ room_code: string; host_user_id: string; patient_user_id: string | null }>();

  if (!room) return { gone: true };

  const ids = [room.host_user_id, room.patient_user_id].filter((v): v is string => !!v);
  const { data: profiles } = await admin
    .from("user_profiles")
    .select("id, display_name")
    .in("id", ids)
    .returns<{ id: string; display_name: string }[]>();

  const nameOf = (id: string | null) =>
    id ? (profiles ?? []).find((p) => p.id === id)?.display_name ?? "" : "";

  const hostName = nameOf(room.host_user_id);
  const guestName = nameOf(room.patient_user_id);

  return {
    roomCode: room.room_code,
    hostName,
    guestName,
    ready: !!hostName && !!guestName,
  };
}
