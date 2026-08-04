"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendConfirmationEmail, sendFeedbackEmail, sendVideoRequestEmail } from "@/lib/email";
import type { Highlight, HighlightColor } from "@/lib/case-bank-types";
import { isDailyCoEnabled, createDailyRoom, createDailyMeetingToken, deleteDailyRoom } from "@/lib/daily";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect(next);
}

export async function registerAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const scaDateRaw = String(formData.get("sca_date") ?? "").trim();
  const scaMonth = scaDateRaw ? new Date(scaDateRaw).getUTCMonth() + 1 : null;
  const scaYear = scaDateRaw ? new Date(scaDateRaw).getUTCFullYear() : null;
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password || !firstName || !lastName) {
    return { error: "First name, surname, email, and password are required." };
  }

  if (!scaDateRaw || !scaMonth || !scaYear) {
    return { error: "Please select your expected SCA date." };
  }

  if (new Date(scaDateRaw) <= new Date()) {
    return { error: "Your expected SCA date must be in the future." };
  }

  const displayName = `${firstName} ${lastName}`;
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scaexplained.com"}/auth/callback`,
    },
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Failed to create account. Try again." };

  const { error: profileErr } = await supabase.from("user_profiles").insert({
    id: data.user.id,
    display_name: displayName,
    initials: initials || "?",
    sca_month: scaMonth,
    sca_year: scaYear,
  });

  if (profileErr) console.error("[register] profile insert failed:", profileErr.message);

  redirect(`/register/check-email?email=${encodeURIComponent(email)}`);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Transfer host for any rooms this user owns before leaving
    const { data: hostedRooms } = await supabase
      .from("study_rooms")
      .select("id")
      .eq("host_user_id", user.id);

    for (const room of hostedRooms ?? []) {
      const { data: others } = await supabase
        .from("room_participants")
        .select("user_id")
        .eq("room_id", room.id)
        .neq("user_id", user.id);

      if (others && others.length > 0) {
        const newHost = others[Math.floor(Math.random() * others.length)];
        await supabase
          .from("study_rooms")
          .update({ host_user_id: newHost.user_id })
          .eq("id", room.id);
      }
    }

    // Remove from all rooms
    await supabase.from("room_participants").delete().eq("user_id", user.id);
  }

  await supabase.auth.signOut();
  redirect("/login");
}

// ── Stars ─────────────────────────────────────────────────────────────────────

export async function toggleStarAction(
  stationId: string,
  isCurrentlyStarred: boolean
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  if (isCurrentlyStarred) {
    await supabase
      .from("station_stars")
      .delete()
      .eq("user_id", user.id)
      .eq("station_id", stationId);
  } else {
    await supabase
      .from("station_stars")
      .insert({ user_id: user.id, station_id: stationId });
  }

  revalidatePath("/case-bank");
  return { success: true };
}

// ── Notes ─────────────────────────────────────────────────────────────────────

export async function saveNotesAction(
  stationId: string,
  content: string
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase.from("station_notes").upsert(
    {
      user_id: user.id,
      station_id: stationId,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,station_id" }
  );

  if (error) return { error: error.message };
  return { success: true };
}

// ── Reports ───────────────────────────────────────────────────────────────────

export async function submitReportAction(
  stationId: string,
  stationNumber: number,
  stationTitle: string,
  content: string
): Promise<ActionResult> {
  if (!content.trim()) return { error: "Report text is required." };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Fetch profile and send email first — DB insert is secondary
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name")
    .eq("id", user.id)
    .single<{ display_name: string }>();

  const emailSent = await sendFeedbackEmail({
    stationNumber,
    stationTitle,
    userName: profile?.display_name ?? user.email ?? "Unknown",
    message: content.trim(),
  });
  if (!emailSent) {
    console.error(`[feedback] Email failed to send for station #${stationNumber}`);
  }

  // Best-effort DB record — don't block on failure
  try {
    await supabase.from("station_reports").insert({
      station_id: stationId,
      user_id: user.id,
      content: content.trim(),
    });
  } catch {
    console.error("[feedback] DB insert failed");
  }

  return { success: true };
}

// ── Highlights ────────────────────────────────────────────────────────────────

export async function getStationHighlightsAction(
  stationId: string
): Promise<{ highlights: Highlight[]; lastColor: HighlightColor }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { highlights: [], lastColor: "yellow" };

  const [{ data: highlights }, { data: profile }] = await Promise.all([
    supabase
      .from("station_highlights")
      .select("id, container_key, start_offset, end_offset, color")
      .eq("user_id", user.id)
      .eq("station_id", stationId),
    supabase
      .from("user_profiles")
      .select("last_highlight_color")
      .eq("id", user.id)
      .single<{ last_highlight_color: HighlightColor | null }>(),
  ]);

  return {
    highlights: (highlights ?? []) as Highlight[],
    lastColor: profile?.last_highlight_color ?? "yellow",
  };
}

export async function createHighlightAction(
  stationId: string,
  containerKey: string,
  startOffset: number,
  endOffset: number,
  color: HighlightColor
): Promise<{ id?: string; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data, error } = await supabase
    .from("station_highlights")
    .insert({
      user_id: user.id,
      station_id: stationId,
      container_key: containerKey,
      start_offset: startOffset,
      end_offset: endOffset,
      color,
    })
    .select("id")
    .single<{ id: string }>();

  if (error) return { error: error.message };

  await supabase
    .from("user_profiles")
    .update({ last_highlight_color: color })
    .eq("id", user.id);

  return { id: data.id };
}

export async function deleteHighlightAction(highlightId: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("station_highlights")
    .delete()
    .eq("id", highlightId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

// ── Study rooms ───────────────────────────────────────────────────────────────

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export async function createStudyRoomAction(): Promise<
  ActionResult & { roomId?: string; roomCode?: string }
> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const roomCode = generateRoomCode();

  const { data: room, error } = await supabase
    .from("study_rooms")
    .insert({ room_code: roomCode, host_user_id: user.id })
    .select("id,room_code")
    .single<{ id: string; room_code: string }>();

  if (error || !room) return { error: error?.message ?? "Failed to create room." };

  // Add host as participant
  await supabase.from("room_participants").insert({
    room_id: room.id,
    user_id: user.id,
  });

  return { success: true, roomId: room.id, roomCode: room.room_code };
}

export async function joinStudyRoomAction(
  roomCode: string
): Promise<ActionResult & { roomId?: string }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: room } = await supabase
    .from("study_rooms")
    .select("id")
    .eq("room_code", roomCode.toUpperCase())
    .single<{ id: string }>();

  if (!room) return { error: "Room not found. Check the code and try again." };

  const { data: existing } = await supabase
    .from("room_participants")
    .select("user_id")
    .eq("room_id", room.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    const { count } = await supabase
      .from("room_participants")
      .select("user_id", { count: "exact", head: true })
      .eq("room_id", room.id);

    if ((count ?? 0) >= 4) {
      return { error: "Room is full — max 4 people (1 doctor, 1 patient, 2 observers)." };
    }
  }

  await supabase
    .from("room_participants")
    .upsert({ room_id: room.id, user_id: user.id }, { onConflict: "room_id,user_id" });

  return { success: true, roomId: room.id };
}

export async function leaveStudyRoomAction(
  roomId: string
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  await supabase
    .from("room_participants")
    .delete()
    .eq("room_id", roomId)
    .eq("user_id", user.id);

  return { success: true };
}

export async function claimHostAction(roomId: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Verify the caller is actually in the room
  const { data: participant } = await supabase
    .from("room_participants")
    .select("user_id")
    .eq("room_id", roomId)
    .eq("user_id", user.id)
    .single<{ user_id: string }>();

  if (!participant) return { error: "You are not in this room." };

  const { error } = await supabase
    .from("study_rooms")
    .update({ host_user_id: user.id })
    .eq("id", roomId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function requestVideoLessonAction(
  stationNumber: number,
  stationTitle: string,
  stationSubject: string,
  message: string
): Promise<ActionResult> {
  if (!message.trim()) return { error: "Message is required." };

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name")
    .eq("id", user.id)
    .single<{ display_name: string }>();

  try {
    await sendVideoRequestEmail({
      stationNumber,
      stationTitle,
      stationSubject,
      userName: profile?.display_name ?? user.email ?? "Unknown",
      message: message.trim(),
    });
  } catch {
    // Email failure doesn't fail the action
  }

  return { success: true };
}

export async function updateLastStationAction(stationNumber: number): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("user_profiles")
    .update({ last_station_number: stationNumber })
    .eq("id", user.id);
}

export async function transferHostAction(
  roomId: string,
  newHostUserId: string
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: room } = await supabase
    .from("study_rooms")
    .select("host_user_id")
    .eq("id", roomId)
    .single<{ host_user_id: string }>();

  if (!room || room.host_user_id !== user.id) return { error: "Only the host can transfer." };

  const { error } = await supabase
    .from("study_rooms")
    .update({ host_user_id: newHostUserId })
    .eq("id", roomId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function sendFriendRequestAction(
  emailOrName: string
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Look up target user by display_name in user_profiles
  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id,display_name")
    .ilike("display_name", emailOrName.trim());

  const target = profiles?.[0];
  if (!target) return { error: "User not found. They must have a Case Bank account." };
  if (target.id === user.id) return { error: "You can't add yourself." };

  const { error } = await supabase.from("friend_requests").insert({
    sender_id: user.id,
    receiver_id: target.id,
  });

  if (error) {
    if (error.code === "23505") return { error: "Friend request already sent." };
    return { error: error.message };
  }

  return { success: true };
}

export async function respondFriendRequestAction(
  requestId: string,
  accept: boolean
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  await supabase
    .from("friend_requests")
    .update({ status: accept ? "accepted" : "declined" })
    .eq("id", requestId)
    .eq("receiver_id", user.id);

  return { success: true };
}

// ── Recording ─────────────────────────────────────────────────────────────────

export async function getMostRecentRecordingForStation(stationNumber: number): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data } = await admin
    .from("station_recordings")
    .select("id")
    .eq("doctor_user_id", user.id)
    .eq("station_number", stationNumber)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data?.id ?? null;
}

export async function getRecordingCreditsAction(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  const { data } = await supabase
    .from("recording_credits")
    .select("balance")
    .eq("user_id", user.id)
    .single<{ balance: number }>();
  return data?.balance ?? 0;
}

async function checkRecordingBypass(email: string | undefined): Promise<boolean> {
  if (!email) return false;
  const admin = getSupabaseAdmin();
  if (!admin) return false;

  const { data: settings } = await admin
    .from("site_settings")
    .select("key, value")
    .in("key", ["recording_bypass_enabled", "recording_bypass_emails"]);

  const map = new Map((settings ?? []).map((s: { key: string; value: string }) => [s.key, s.value]));
  if (map.get("recording_bypass_enabled") !== "true") return false;

  const normalEmail = email.toLowerCase();

  const { data: examiner } = await admin
    .from("examiners")
    .select("id")
    .eq("email", normalEmail)
    .maybeSingle();
  if (examiner) return true;

  const bypassList = (map.get("recording_bypass_emails") ?? "")
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
  return bypassList.includes(normalEmail);
}

export async function getRecordingBypassAction(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return checkRecordingBypass(user?.email);
}

export async function startSoloRecordingAction(args: {
  stationNumber: number;
  stationTitle: string;
}): Promise<{ error?: string; recordingId?: string }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name")
    .eq("id", user.id)
    .single<{ display_name: string }>();

  const displayName = profile?.display_name ?? user.email ?? "Tester";

  const { data: recording, error: insertErr } = await admin
    .from("station_recordings")
    .insert({
      room_id: null,
      station_number: args.stationNumber,
      station_title: args.stationTitle,
      doctor_user_id: user.id,
      patient_user_id: user.id,
      doctor_display_name: displayName,
      patient_display_name: "Solo test",
      candidate_email: user.email ?? null,
      status: "uploading",
    })
    .select("id")
    .single<{ id: string }>();

  if (insertErr || !recording) return { error: "Could not create recording." };
  return { recordingId: recording.id };
}

export async function startRecordingAction(args: {
  roomId: string;
  stationNumber: number;
  stationTitle: string;
  doctorUserId: string;
  patientUserId: string;
  doctorDisplayName: string;
  patientDisplayName: string;
}): Promise<{ error?: string; recordingId?: string }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  const bypassed = await checkRecordingBypass(user.email);

  let credits: { balance: number } | null = null;

  if (!bypassed) {
    // Check and decrement credits
    const { data: creditsData } = await admin
      .from("recording_credits")
      .select("balance")
      .eq("user_id", user.id)
      .single<{ balance: number }>();

    if (!creditsData || creditsData.balance < 1) {
      return { error: "No recording credits remaining. Purchase more to continue." };
    }

    const { error: deductErr } = await admin
      .from("recording_credits")
      .update({
        balance: creditsData.balance - 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("balance", creditsData.balance);

    if (deductErr) return { error: "Could not deduct credit. Please try again." };
    credits = creditsData;
  }

  // Fetch candidate email for the report
  const { data: authUser } = await admin.auth.admin.getUserById(args.doctorUserId);

  // Create the recording row
  const { data: recording, error: insertErr } = await admin
    .from("station_recordings")
    .insert({
      room_id: args.roomId,
      station_number: args.stationNumber,
      station_title: args.stationTitle,
      doctor_user_id: args.doctorUserId,
      patient_user_id: args.patientUserId,
      doctor_display_name: args.doctorDisplayName,
      patient_display_name: args.patientDisplayName,
      candidate_email: authUser?.user?.email ?? null,
      status: "uploading",
    })
    .select("id")
    .single<{ id: string }>();

  if (insertErr || !recording) {
    if (!bypassed && credits) {
      // Refund the credit on failure
      await admin
        .from("recording_credits")
        .update({ balance: credits.balance, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
    }
    return { error: "Could not create recording." + (!bypassed ? " Credit refunded." : "") };
  }

  return { recordingId: recording.id };
}

/**
 * Called by the host when the synced start aborts because the live audio
 * call failed to connect for an essential participant (doctor or patient).
 * Refunds the credit startRecordingAction deducted and deletes the
 * never-actually-recorded row — the attempt is treated as if it never
 * happened, matching "give them back the credit" rather than leaving a
 * dead/empty recording behind.
 */
export async function cancelRecordingAction(recordingId: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server config error." };

  const bypassed = await checkRecordingBypass(user.email);

  if (!bypassed) {
    const { data: creditsData } = await admin
      .from("recording_credits")
      .select("balance")
      .eq("user_id", user.id)
      .single<{ balance: number }>();

    if (creditsData) {
      await admin
        .from("recording_credits")
        .update({ balance: creditsData.balance + 1, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
    }
  }

  await admin.from("station_recordings").delete().eq("id", recordingId);

  return { success: true };
}

// ── DailyCo live audio ──────────────────────────────────────────────────────────

export async function getDailyCoEnabledAction(): Promise<boolean> {
  return isDailyCoEnabled();
}

/**
 * Creates the shared DailyCo room for one recording. Called once, by whoever
 * starts the recording — the resulting room name/url is broadcast to the rest
 * of the room so everyone joins the same call rather than each creating one.
 */
export async function createDailyCallAction(
  recordingId: string
): Promise<{ roomName: string; roomUrl: string } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const room = await createDailyRoom(recordingId);
  if (!room) return { error: "Could not start live audio." };

  return { roomName: room.name, roomUrl: room.url };
}

/**
 * Issues a personal join token for an already-created room. Every
 * participant (including whoever created the room) calls this for
 * themselves before joining client-side.
 */
export async function getDailyTokenAction(
  roomName: string,
  userName: string,
  isOwner: boolean
): Promise<{ token: string } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const token = await createDailyMeetingToken(roomName, userName, isOwner);
  if (!token) return { error: "Could not join live audio." };

  return { token };
}

/** Best-effort cleanup — called once the recording stops. */
export async function endDailyCallAction(roomName: string): Promise<void> {
  await deleteDailyRoom(roomName);
}
