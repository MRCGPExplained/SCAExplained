"use server";

import { createHash } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface LoginState {
  error?: string;
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Password required." };

  // Check primary ADMIN_PASSWORD env var
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (adminPassword && password === adminPassword) {
    const hash = createHash("sha256").update(password).digest("hex");
    const jar = await cookies();
    jar.set("admin_session", hash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    redirect("/admin");
  }

  // Check additional DB admin passcodes
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data: rows } = await supabase
      .from("admin_passcodes")
      .select("passcode");
    const match = (rows ?? []).find((r: { passcode: string }) => r.passcode === password);
    if (match) {
      const hash = createHash("sha256").update(password).digest("hex");
      const jar = await cookies();
      jar.set("admin_session", hash, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      redirect("/admin");
    }
  }

  if (!adminPassword) return { error: "Admin password not configured." };
  return { error: "Incorrect password." };
}
