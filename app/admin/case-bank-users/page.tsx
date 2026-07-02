import { getSupabaseAdmin } from "@/lib/supabase";
import CaseBankUsersClient from "./CaseBankUsersClient";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { users: [] };

  const [authResult, profilesResult, accessResult] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from("user_profiles").select("id, display_name, initials"),
    supabase
      .from("user_access")
      .select("user_id, has_video_course, has_case_bank, expires_at"),
  ]);

  const authUsers = (authResult.data as { users?: { id: string; email?: string; created_at: string }[] })?.users ?? [];
  const profiles = profilesResult.data ?? [];
  const access = accessResult.data ?? [];

  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const accessMap = new Map(access.map((a) => [a.user_id, a]));

  const users = authUsers.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    created_at: u.created_at,
    profile: profileMap.get(u.id) ?? null,
    access: accessMap.get(u.id) ?? null,
  }));

  const now = new Date();
  users.sort((a, b) => {
    const aActive = a.access && new Date(a.access.expires_at) > now && (a.access.has_video_course || a.access.has_case_bank) ? 1 : 0;
    const bActive = b.access && new Date(b.access.expires_at) > now && (b.access.has_video_course || b.access.has_case_bank) ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return { users };
}

export default async function CaseBankUsersPage() {
  const { users } = await getData();
  return <CaseBankUsersClient users={users} />;
}
