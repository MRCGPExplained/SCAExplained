import { isAdmin } from "@/lib/admin-auth";
import { getExaminer } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export interface BetatestAccess {
  allowed: boolean;
  loggedIn: boolean;
}

/**
 * Who may use the beta tools: admins, examiners, and any account flagged
 * `beta` on the admin Users page.
 *
 * This replaced a shared access code. The code never actually protected
 * anything on its own — every tool behind it already required a real logged-in
 * account to do anything — so it was one more secret to circulate for no gain.
 * These checks are the real gate, and they cost money when they fail open:
 * the tools here spend ElevenLabs, Deepgram, Claude and Daily credit.
 */
export async function getBetatestAccess(): Promise<BetatestAccess> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth
    .getUser()
    .catch(() => ({ data: { user: null } }));

  // Checked first because it also honours the /master passcode fail-safe,
  // which deliberately has no Supabase session behind it.
  if (await isAdmin()) return { allowed: true, loggedIn: !!user };

  if (!user) return { allowed: false, loggedIn: false };
  if (await getExaminer()) return { allowed: true, loggedIn: true };

  const admin = getSupabaseAdmin();
  if (!admin) return { allowed: false, loggedIn: true };

  const { data } = await admin
    .from("user_profiles")
    .select("beta")
    .eq("id", user.id)
    .maybeSingle<{ beta: boolean }>();

  return { allowed: !!data?.beta, loggedIn: true };
}
