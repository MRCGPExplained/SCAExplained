import { createHash } from "crypto";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

function sha256hex(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

// Two independent ways in, mirrored in middleware.ts:
// 1. The /master passcode fail-safe (master_session cookie) — works even if
//    Supabase auth or the examiners table is unavailable.
// 2. The normal path — logged into a regular site account (Supabase auth)
//    whose email is listed on the examiners table with is_admin = true.
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const masterSession = jar.get("master_session")?.value ?? "";
  const pw = process.env.ADMIN_PASSWORD ?? "";
  if (masterSession && pw && masterSession === sha256hex(pw)) return true;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  if (!user?.email) return false;

  const admin = getSupabaseAdmin();
  if (!admin) return false;

  const { data } = await admin
    .from("examiners")
    .select("id")
    .eq("is_admin", true)
    .ilike("email", user.email)
    .maybeSingle();

  return !!data;
}
