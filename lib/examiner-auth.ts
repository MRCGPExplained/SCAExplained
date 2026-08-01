import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

export type ExaminerRecord = {
  id: string;
  name: string;
  email: string;
};

export async function getExaminerFromCookie(): Promise<ExaminerRecord | null> {
  const cookieStore = await cookies();
  const examinerId = cookieStore.get("examiner_session")?.value ?? "";
  if (!examinerId) return null;

  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const { data } = await admin
    .from("examiners")
    .select("id, name, email")
    .eq("id", examinerId)
    .single<ExaminerRecord>();

  return data ?? null;
}
