import { getSupabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export type ExaminerRecord = {
  id: string;
  name: string;
  email: string;
};

// An "examiner" is anyone logged into a normal site account (Supabase auth)
// whose email is listed on the examiners table — no separate passcode needed.
export async function getExaminer(): Promise<ExaminerRecord | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  if (!user?.email) return null;

  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const { data, error } = await admin
    .from("examiners")
    .select("id, name, email")
    .ilike("email", user.email)
    .maybeSingle<ExaminerRecord>();

  // A failed lookup and "not an examiner" are the same value here — null — and
  // the UI renders that as "This account isn't registered as an examiner".
  // Log the difference, or a transient database error looks to the examiner
  // (and to whoever they report it to) like their access was revoked.
  if (error) console.error("[examiner-auth] lookup failed", error.message);

  return data ?? null;
}
