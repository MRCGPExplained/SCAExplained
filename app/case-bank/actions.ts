"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { sendConfirmationEmail, sendFeedbackEmail, sendVideoRequestEmail } from "@/lib/email";

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
