import { getSupabaseAdmin } from "@/lib/supabase";
import { sendAccessExpiryEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const admin = getSupabaseAdmin();
  if (!admin) return Response.json({ error: "Admin client unavailable" }, { status: 500 });

  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);

  // Find users whose access expires within 7 days and haven't been reminded yet
  const { data: rows } = await admin
    .from("user_access")
    .select("user_id, expires_at")
    .eq("has_programme", true)
    .gt("expires_at", new Date().toISOString())
    .lte("expires_at", in7Days.toISOString())
    .is("renewal_reminder_sent_at", null);

  if (!rows || rows.length === 0) {
    return Response.json({ sent: 0 });
  }

  let sent = 0;

  for (const row of rows) {
    // Get user email and name
    const { data: authUser } = await admin.auth.admin.getUserById(row.user_id);
    const email = authUser?.user?.email;
    if (!email) continue;

    const { data: profile } = await admin
      .from("user_profiles")
      .select("display_name")
      .eq("id", row.user_id)
      .single<{ display_name: string }>();

    const firstName = profile?.display_name?.split(" ")[0] ?? "there";

    const ok = await sendAccessExpiryEmail({
      to: email,
      firstName,
      expiresAt: row.expires_at,
    });

    if (ok) {
      await admin
        .from("user_access")
        .update({ renewal_reminder_sent_at: new Date().toISOString() })
        .eq("user_id", row.user_id);
      sent++;
    }
  }

  return Response.json({ sent });
}
