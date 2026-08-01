import { getSupabaseAdmin } from "@/lib/supabase";
import ExaminersClient from "./ExaminersClient";

export const dynamic = "force-dynamic";

type Examiner = { id: string; name: string; email: string; passcode: string; created_at: string };
type ActivityRow = {
  id: string;
  station_number: number;
  station_title: string;
  doctor_display_name: string;
  examiner_reviewed_at: string | null;
  sent_to_candidate_at: string | null;
  status: string;
  examiner_id: string | null;
};

export default async function ExaminersPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; examiner?: string }>;
}) {
  const { from, to, examiner: examinerFilter } = await searchParams;

  const supabase = getSupabaseAdmin();

  const [examinersResult, activityResult] = await Promise.all([
    supabase
      ? supabase.from("examiners").select("id, name, email, passcode, created_at").order("name")
      : Promise.resolve({ data: [] }),
    supabase
      ? (() => {
          let q = supabase
            .from("station_recordings")
            .select("id, station_number, station_title, doctor_display_name, examiner_reviewed_at, sent_to_candidate_at, status, examiner_id")
            .not("examiner_id", "is", null)
            .order("examiner_reviewed_at", { ascending: false })
            .limit(200);
          if (from) q = q.gte("examiner_reviewed_at", from);
          if (to) q = q.lte("examiner_reviewed_at", to + "T23:59:59Z");
          if (examinerFilter) q = q.eq("examiner_id", examinerFilter);
          return q;
        })()
      : Promise.resolve({ data: [] }),
  ]);

  const examiners = (examinersResult.data ?? []) as Examiner[];
  const activity = (activityResult.data ?? []) as ActivityRow[];

  return (
    <ExaminersClient
      examiners={examiners}
      activity={activity}
      filters={{ from: from ?? "", to: to ?? "", examiner: examinerFilter ?? "" }}
    />
  );
}
