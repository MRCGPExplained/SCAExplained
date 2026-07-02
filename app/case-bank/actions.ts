"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { sendConfirmationEmail } from "@/lib/email";

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
  const displayName = String(formData.get("display_name") ?? "").trim();

  if (!email || !password || !displayName) {
    return { error: "Name, email, and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Failed to create account. Try again." };

  const words = displayName.trim().split(/\s+/);
  const initials = words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  await supabase.from("user_profiles").insert({
    id: data.user.id,
    display_name: displayName,
    initials: initials || "?",
  });

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
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

// ── Attempts ──────────────────────────────────────────────────────────────────

export async function recordAttemptAction(
  stationId: string
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  await supabase
    .from("station_attempts")
    .insert({ user_id: user.id, station_id: stationId })
    .then(() => {});
  // on conflict do nothing via RLS / unique constraint is fine here

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

  await supabase.from("station_reports").insert({
    station_id: stationId,
    user_id: user.id,
    content: content.trim(),
  });

  // Email notification to admin
  try {
    await sendConfirmationEmail({
      to: "mrcgpexplained@outlook.com",
      customerName: "SCA Explained Admin",
      eventTitle: `Station Report: #${stationNumber} — ${stationTitle}`,
      ticketName: "Station Issue Report",
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      zoomLink: null,
    });
  } catch {
    // Email failure doesn't fail the report
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
