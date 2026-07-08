"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function unlockBetatest(
  _prev: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.BETATEST_PASSWORD;

  if (!expected) return { error: "BETATEST_PASSWORD env var not configured." };
  if (password !== expected) return { error: "Incorrect password." };

  const cookieStore = await cookies();
  cookieStore.set("betatest_unlocked", "1", {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  redirect("/betatest");
}
