import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

/**
 * Both meters for the signed-in user.
 *
 * Fetched on demand by the study room when a take finishes transcribing and
 * the decision modal opens, rather than bolted onto the recording status
 * route the poller hits every four seconds. Credits belong to a person, not
 * to a recording, and a balance that is read once when a dialog opens does
 * not need re-reading fifteen times a minute for the whole consultation.
 */
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const [accessRes, creditsRes] = await Promise.all([
    admin
      .from("user_access")
      .select("ai_allowance, ai_uses_count")
      .eq("user_id", user.id)
      .maybeSingle<{ ai_allowance: number; ai_uses_count: number }>(),
    admin
      .from("gp_review_credits")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle<{ balance: number }>(),
  ]);

  // AI is granted rather than decremented, so what is left is the allowance
  // minus the lifetime count the grading pipeline keeps.
  const aiRemaining = Math.max(
    0,
    (accessRes.data?.ai_allowance ?? 0) - (accessRes.data?.ai_uses_count ?? 0)
  );

  return NextResponse.json({
    aiRemaining,
    gpRemaining: creditsRes.data?.balance ?? 0,
  });
}
