import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "No admin client" }, { status: 500 });

  const { data, error } = await admin
    .from("site_settings")
    .select("key, value")
    .in("key", ["deepgram_enabled", "vercel_plan", "ai_grading_prompt"]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const map = Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));

  return NextResponse.json({
    raw: map,
    resolved: {
      deepgramEnabled: map["deepgram_enabled"] === "true",
      vercelPlan: map["vercel_plan"] ?? "pro (default)",
      deepgramEnabledRawValue: map["deepgram_enabled"] ?? "(row missing)",
    },
  });
}
