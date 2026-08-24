"use server";

import { createHash } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface MasterLoginState {
  error?: string;
}

export async function masterLogin(
  _prev: MasterLoginState,
  formData: FormData
): Promise<MasterLoginState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Passcode required." };

  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminPassword) return { error: "Master passcode not configured." };
  if (password !== adminPassword) return { error: "Incorrect passcode." };

  const hash = createHash("sha256").update(password).digest("hex");
  const jar = await cookies();
  jar.set("master_session", hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/admin");
}
