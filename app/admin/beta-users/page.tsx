import { getSupabaseAdmin } from "@/lib/supabase";
import BetaUsersClient from "./BetaUsersClient";

export const dynamic = "force-dynamic";

export type BetaUser = {
  id: string;
  user_id: string;
  email: string;
  note: string | null;
  created_at: string;
};

export default async function BetaUsersPage() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return <BetaUsersClient users={[]} />;

  const { data: rows } = await supabase
    .from("beta_users")
    .select("id, user_id, note, created_at")
    .order("created_at", { ascending: false });

  const authResult = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const authUsers = (authResult.data as { users?: { id: string; email?: string }[] })?.users ?? [];
  const emailMap = new Map(authUsers.map((u) => [u.id, u.email ?? ""]));

  const users: BetaUser[] = (rows ?? []).map((r) => ({
    id: r.id,
    user_id: r.user_id,
    email: emailMap.get(r.user_id) ?? r.user_id,
    note: r.note,
    created_at: r.created_at,
  }));

  return <BetaUsersClient users={users} />;
}
