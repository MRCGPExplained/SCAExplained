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

export interface TrialStart {
  error?: string;
  /** True when the day's cap is spent, so the page can sell instead of apologise. */
  capped?: boolean;
  roomId?: string;
  roomCode?: string;
}

/**
 * How many free consultations have started today.
 *
 * FAILS CLOSED, which is the opposite of the fair-use count in
 * app/case-bank/actions.ts and the difference is deliberate. That one guards
 * a customer who has paid, so a broken query must not lock them out of what
 * they bought. This one guards a free giveaway against an unbounded bill, and
 * a broken query must not turn the cap off. When in doubt, a paying customer
 * gets through and a free one does not.
 *
 * Counts rows rather than keeping a counter, because a counter is a new table
 * and DDL is refused on this project. It also means the count is of
 * consultations that really started, not of buttons that were pressed.
 */
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

/** Whether another free consultation can start right now. Exported so the
 *  tutorial can check before taking somebody through four screens. */
export async function trialCapacityAction(): Promise<{ available: boolean; used: number }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { available: false, used: TRIAL_DAILY_CAP };

  const used = await trialsToday(admin);
  if (used === null) return { available: false, used: TRIAL_DAILY_CAP };
  return { available: used < TRIAL_DAILY_CAP, used };
}

/**
 * Starts a trial: an anonymous account, and a study room on the free station
 * with that account as doctor.
 *
 * THE TRIAL USER HAS TO BE THE DOCTOR, which is the one thing the existing
 * guest machinery will not do — setRoomRolesAction refuses a guest-flagged
 * account the doctor slot. It is never called here. createStudyRoomAction
 * makes the creator the doctor and the host on the insert itself, with no
 * guest check, so creating the room IS the role assignment and the refusal is
 * never reached. Nothing in the paid path changes.
 *
 * The profile is written with is_guest true on purpose, even though this
 * person is the doctor. It drives the room UI, it is what the panel reads to
 * show who is a visitor, and the trial genuinely is one. The consequence —
 * that touching a role picker would hand their doctor slot away — is handled
 * in the UI, which does not offer the pickers on a trial.
 */
export async function startTrialAction(name: string): Promise<TrialStart> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Please enter your name." };
  if (trimmed.length > 60) return { error: "That name is a bit long." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Something went wrong at our end. Please try again." };

  // Checked before the account is made, so a capped day does not leave a
  // trail of anonymous users behind it.
  const used = await trialsToday(admin);
  if (used === null) return { error: "Something went wrong at our end. Please try again." };
  if (used >= TRIAL_DAILY_CAP) return { capped: true, error: TRIAL_CAP_MESSAGE };

  const supabase = await createSupabaseServerClient();
  const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
  if (signInError || !signInData.user) {
    return { error: signInError?.message ?? "Could not start a session." };
  }

  const initials =
    trimmed
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "T";

  const { error: profileErr } = await supabase.from("user_profiles").insert({
    id: signInData.user.id,
    display_name: trimmed,
    initials,
    is_guest: true,
  });
  if (profileErr) return { error: "Could not set up your session." };

  // Reused verbatim: it reads the session we just created, inserts the room
  // with this user as doctor and host, adds them to room_participants, and
  // rolls the room back if that second insert fails.
  const room = await createStudyRoomAction(TRIAL_STATION);
  if (room.error || !room.roomId || !room.roomCode) {
    return { error: room.error ?? "Could not set up the room. Please try again." };
  }

  return { roomId: room.roomId, roomCode: room.roomCode };
}
