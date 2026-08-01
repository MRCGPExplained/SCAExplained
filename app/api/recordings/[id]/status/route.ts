import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id: recordingId } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const { data } = await admin
    .from("station_recordings")
    .select(
      "status, ai_data_gathering, ai_clinical_management, ai_relating_to_others, examiner_data_gathering, examiner_clinical_management, examiner_relating_to_others, sent_to_candidate_at"
    )
    .eq("id", recordingId)
    .or(`doctor_user_id.eq.${user.id},patient_user_id.eq.${user.id}`)
    .single();

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(data);
}
