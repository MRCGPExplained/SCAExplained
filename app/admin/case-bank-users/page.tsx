import { getSupabaseAdmin } from "@/lib/supabase";
import CaseBankUsersClient from "./CaseBankUsersClient";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { users: [] };

  const [authResult, profilesResult, accessResult, creditsResult] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from("user_profiles").select("id, display_name, initials, beta"),
    supabase.from("user_access").select("user_id, has_programme, expires_at, renewal_reminder_sent_at"),
    supabase.from("recording_credits").select("user_id, balance"),
  ]);

  const authUsers = (authResult.data as { users?: { id: string; email?: string; created_at: string }[] })?.users ?? [];
  const profiles = profilesResult.data ?? [];
  const access = accessResult.data ?? [];
  const credits = (creditsResult.data ?? []) as { user_id: string; balance: number }[];

  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const accessMap = new Map(access.map((a) => [a.user_id, a]));
  const creditsMap = new Map(credits.map((c) => [c.user_id, c.balance]));

  const users = authUsers.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    created_at: u.created_at,
    profile: profileMap.get(u.id) ? { ...profileMap.get(u.id)!, beta: profileMap.get(u.id)?.beta ?? false } : null,
    access: accessMap.get(u.id) ?? null,
    credits: creditsMap.get(u.id) ?? 0,
  }));

  const now = new Date();
  users.sort((a, b) => {
    const aActive = a.access && a.access.has_programme && new Date(a.access.expires_at) > now ? 1 : 0;
    const bActive = b.access && b.access.has_programme && new Date(b.access.expires_at) > now ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return { users };
}

export default async function CaseBankUsersPage() {
  const { users } = await getData();
  return <CaseBankUsersClient users={users} />;
}
