"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function examinerLoginAction(formData: FormData) {
  const passcode = String(formData.get("passcode") ?? "").trim();
  if (!passcode) return { error: "Passcode required." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server error." };

  const { data: examiner } = await admin
    .from("examiners")
    .select("id")
    .eq("passcode", passcode)
    .single<{ id: string }>();

  if (!examiner) return { error: "Incorrect passcode." };

  const cookieStore = await cookies();
  cookieStore.set("examiner_session", examiner.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect("/examiner");
}

export async function examinerLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("examiner_session");
  redirect("/examiner/login");
}
