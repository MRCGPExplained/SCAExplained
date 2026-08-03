import { getSupabaseAdmin } from "@/lib/supabase";
import { WebinarClient } from "./WebinarClient";
import type { WebinarCode } from "../webinar-codes/WebinarCodesClient";

export const dynamic = "force-dynamic";

export default async function AdminWebinarPage() {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase
      .from("live_sessions")
      .delete()
      .lt("scheduled_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  }

  const [sessionsResult, codesResult] = await Promise.all([
    supabase
      ? supabase.from("live_sessions").select("id, zoom_url, scheduled_at, is_free").order("scheduled_at", { ascending: true })
      : Promise.resolve({ data: [] }),
    supabase
      ? supabase.from("webinar_codes").select("id, code, label, active, recording_credits, max_uses, use_count, expires_at, created_at").order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  return (
    <WebinarClient
      sessions={(sessionsResult.data ?? []) as { id: string; zoom_url: string; scheduled_at: string; is_free: boolean }[]}
      codes={(codesResult.data ?? []) as WebinarCode[]}
    />
  );
}
