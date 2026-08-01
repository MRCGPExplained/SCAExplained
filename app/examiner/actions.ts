"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getExaminerFromCookie } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendExaminerReportEmail } from "@/lib/email";

export async function examinerLoginAction(formData: FormData): Promise<void> {
  const passcode = String(formData.get("passcode") ?? "").trim();
  if (!passcode) redirect("/examiner?error=required");

  const admin = getSupabaseAdmin();
  if (!admin) redirect("/examiner?error=server");

  const { data: examiner } = await admin
    .from("examiners")
    .select("id")
    .eq("passcode", passcode)
    .single<{ id: string }>();

  if (!examiner) redirect("/examiner?error=incorrect");

  const cookieStore = await cookies();
  cookieStore.set("examiner_session", examiner.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/examiner");
}

export async function examinerLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("examiner_session");
  redirect("/examiner");
}

export async function submitExaminerReviewAction(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const examiner = await getExaminerFromCookie();
  if (!examiner) return { error: "Not authorised." };

  const admin = getSupabaseAdmin();
  if (!admin) return { error: "Server error." };

  const recordingId = String(formData.get("recordingId") ?? "").trim();
  const dgGrade = String(formData.get("dg_grade") ?? "").trim();
  const cmGrade = String(formData.get("cm_grade") ?? "").trim();
  const roGrade = String(formData.get("ro_grade") ?? "").trim();
  const dgComment = String(formData.get("dg_comment") ?? "").trim();
  const cmComment = String(formData.get("cm_comment") ?? "").trim();
  const roComment = String(formData.get("ro_comment") ?? "").trim();
  const overallComment = String(formData.get("overall_comment") ?? "").trim();
  const sendNow = formData.get("send_now") === "1";

  const validGrades = ["CF", "F", "P", "CP"];
  if (!validGrades.includes(dgGrade) || !validGrades.includes(cmGrade) || !validGrades.includes(roGrade)) {
    return { error: "All three domain grades are required." };
  }

  const updatePayload: Record<string, unknown> = {
    examiner_id: examiner.id,
    examiner_data_gathering: dgGrade,
    examiner_clinical_management: cmGrade,
    examiner_relating_to_others: roGrade,
    examiner_comment_data_gathering: dgComment || null,
    examiner_comment_clinical_management: cmComment || null,
    examiner_comment_relating_to_others: roComment || null,
    examiner_overall_comment: overallComment || null,
    examiner_reviewed_at: new Date().toISOString(),
    status: sendNow ? "sent" : "reviewed",
  };

  if (sendNow) {
    updatePayload.sent_to_candidate_at = new Date().toISOString();
  }

  const { error: updateErr } = await admin
    .from("station_recordings")
    .update(updatePayload)
    .eq("id", recordingId);

  if (updateErr) return { error: updateErr.message };

  if (sendNow) {
    const { data: rec } = await admin
      .from("station_recordings")
      .select("candidate_email, station_number, station_title, doctor_display_name")
      .eq("id", recordingId)
      .single<{
        candidate_email: string | null;
        station_number: number;
        station_title: string;
        doctor_display_name: string;
      }>();

    if (rec?.candidate_email) {
      const gradePts: Record<string, Record<string, number>> = {
        dg: { CF: 0, F: 1, P: 2, CP: 3 },
        cm: { CF: 0, F: 1.5, P: 3, CP: 4.5 },
        ro: { CF: 0, F: 1, P: 2, CP: 3 },
      };
      const total = (gradePts.dg[dgGrade] ?? 0) + (gradePts.cm[cmGrade] ?? 0) + (gradePts.ro[roGrade] ?? 0);

      await sendExaminerReportEmail({
        to: rec.candidate_email,
        candidateName: rec.doctor_display_name,
        stationNumber: rec.station_number,
        stationTitle: rec.station_title,
        dgGrade,
        cmGrade,
        roGrade,
        totalPts: total,
        dgComment,
        cmComment,
        roComment,
        overallComment,
      });
    }
  }

  return { success: true };
}
