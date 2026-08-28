import { getSupabaseAdmin } from "@/lib/supabase";
import ExaminersClient from "./ExaminersClient";

type BypassSettings = { enabled: boolean; emails: string };

export const dynamic = "force-dynamic";

type Examiner = { id: string; name: string; email: string; is_admin: boolean; created_at: string };
type ActivityRow = {
  id: string;
  station_number: number;
  station_title: string;
  doctor_display_name: string;
  examiner_reviewed_at: string | null;
  sent_to_candidate_at: string | null;
  status: string;
  examiner_id: string | null;
  examiner_paid_at: string | null;
};

export default async function ExaminersPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; examiner?: string }>;
}) {
  const { from, to, examiner: examinerFilter } = await searchParams;

  const supabase = getSupabaseAdmin();

  const [examinersResult, activityResult, bypassResult] = await Promise.all([
    supabase
      ? supabase.from("examiners").select("id, name, email, is_admin, created_at").order("name")
      : Promise.resolve({ data: [] }),
    supabase
      ? (() => {
          let q = supabase
            .from("station_recordings")
            .select("id, station_number, station_title, doctor_display_name, examiner_reviewed_at, sent_to_candidate_at, status, examiner_id, examiner_paid_at")
            .not("examiner_id", "is", null)
            .order("examiner_reviewed_at", { ascending: false })
            .limit(200);
          if (from) q = q.gte("examiner_reviewed_at", from);
          if (to) q = q.lte("examiner_reviewed_at", to + "T23:59:59Z");
          if (examinerFilter) q = q.eq("examiner_id", examinerFilter);
          return q;
        })()
      : Promise.resolve({ data: [] }),
    supabase
      ? supabase.from("site_settings").select("key, value").in("key", ["recording_bypass_enabled", "recording_bypass_emails"])
      : Promise.resolve({ data: [] }),
  ]);

  const examiners = (examinersResult.data ?? []) as Examiner[];
  const activity = (activityResult.data ?? []) as ActivityRow[];

  const settingsMap = new Map(
    ((bypassResult.data ?? []) as { key: string; value: string }[]).map((s) => [s.key, s.value])
  );
  const bypassSettings: BypassSettings = {
    enabled: settingsMap.get("recording_bypass_enabled") === "true",
    emails: settingsMap.get("recording_bypass_emails") ?? "",
  };

  return (
    <ExaminersClient
      examiners={examiners}
      activity={activity}
      filters={{ from: from ?? "", to: to ?? "", examiner: examinerFilter ?? "" }}
      bypassSettings={bypassSettings}
    />
  );
}
