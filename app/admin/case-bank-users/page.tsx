import { getSupabaseAdmin } from "@/lib/supabase";
import CaseBankUsersClient from "./CaseBankUsersClient";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { users: [] };

  const [authResult, profilesResult, accessResult, creditsResult] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from("user_profiles").select("id, display_name, initials, beta"),
    supabase.from("user_access").select("user_id, has_programme, expires_at, has_case_bank, case_bank_expires_at, renewal_reminder_sent_at, ai_allowance, ai_uses_count"),
    supabase.from("gp_review_credits").select("user_id, balance"),
  ]);

  const authUsers = (authResult.data as { users?: { id: string; email?: string; created_at: string }[] })?.users ?? [];
  const profiles = profilesResult.data ?? [];
  const access = accessResult.data ?? [];
  const credits = (creditsResult.data ?? []) as { user_id: string; balance: number }[];

  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const accessMap = new Map(access.map((a) => [a.user_id, a]));
  const creditsMap = new Map(credits.map((c) => [c.user_id, c.balance]));
  // AI is granted rather than decremented, so what is left is the allowance
  // minus the lifetime count the grading pipeline keeps.
  const aiMap = new Map(
    (access as { user_id: string; ai_allowance?: number; ai_uses_count?: number }[]).map((a) => [
      a.user_id,
      { allowance: a.ai_allowance ?? 0, used: a.ai_uses_count ?? 0 },
    ])
  );

  const users = authUsers.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    created_at: u.created_at,
    profile: profileMap.get(u.id) ? { ...profileMap.get(u.id)!, beta: profileMap.get(u.id)?.beta ?? false } : null,
    access: accessMap.get(u.id) ?? null,
    credits: creditsMap.get(u.id) ?? 0,
    ai: aiMap.get(u.id) ?? { allowance: 0, used: 0 },
  }));

  // Sorted on the case bank columns, which are what a plan grants. Sorting on
  // has_programme/expires_at put every plan customer below the retired
  // programme accounts, because a plan never sets either.
  const now = new Date();
  const liveUntil = (a: { has_case_bank?: boolean; case_bank_expires_at?: string | null } | null) =>
    a?.has_case_bank && a.case_bank_expires_at && new Date(a.case_bank_expires_at) > now ? 1 : 0;
  users.sort((a, b) => {
    const aActive = liveUntil(a.access);
    const bActive = liveUntil(b.access);
    if (aActive !== bActive) return bActive - aActive;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return { users };
}

export default async function CaseBankUsersPage() {
  const { users } = await getData();
  return <CaseBankUsersClient users={users} />;
}
