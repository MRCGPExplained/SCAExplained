import { createHash } from "crypto";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

function sha256hex(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

// Mirrors the admin_session check in middleware.ts / app/admin/login/actions.ts,
// so any page can ask "is the current visitor an admin?" without redirecting.
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value ?? "";
  if (!session) return false;

  const pw = process.env.ADMIN_PASSWORD ?? "";
  if (pw && session === sha256hex(pw)) return true;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data: rows } = await supabase
      .from("examiners")
      .select("passcode")
      .eq("is_admin", true);
    for (const row of (rows ?? []) as { passcode: string }[]) {
      if (row.passcode && session === sha256hex(row.passcode)) return true;
    }
  }
  return false;
}
