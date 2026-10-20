import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendAccessExpiryEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * The renewal nudge, which vercel.json has been calling every morning at 09:00
 * since it was written and which has never existed until now. The cron fired,
 * got a 404, and nobody was ever reminded that their access was about to end.
 *
 * It reads the plan columns, not the programme ones. sendAccessExpiryEmail was
 * written against has_programme/expires_at, which the three plans replaced with
 * has_case_bank/case_bank_expires_at, so a route built from the old column
 * names would have run clean and still emailed nobody.
 *
 * One reminder per purchase. renewal_reminder_sent_at is the record that it
 * went, and every path that grants or extends access sets it back to null, so
 * buying again arms the next one.
 */

/** How long before expiry to send. Far enough out to act on, close enough to
 *  be about this exam rather than the next one. */
const NUDGE_WINDOW_DAYS = 14;

/** A cron that emails customers is not something to leave open to the web.
 *  Vercel sends this header when CRON_SECRET is set in the project. */
function authorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    // Loud, because the failure mode is silence: no secret means no reminders,
    // and nothing else in the app would ever surface that.
    console.error(
      "[cron/nudge] refused. Set CRON_SECRET in the Vercel project or no renewal reminder will ever send."
    );
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "No admin client." }, { status: 500 });

  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() + NUDGE_WINDOW_DAYS);

  const { data: due, error } = await supabase
    .from("user_access")
    .select("user_id, case_bank_expires_at")
    .eq("has_case_bank", true)
    .is("renewal_reminder_sent_at", null)
    .gt("case_bank_expires_at", now.toISOString())
    .lte("case_bank_expires_at", cutoff.toISOString())
    .returns<{ user_id: string; case_bank_expires_at: string }[]>();

  if (error) {
    console.error("[cron/nudge] could not read user_access:", error.message);
    return NextResponse.json({ error: "Query failed." }, { status: 500 });
  }

  if (!due?.length) return NextResponse.json({ considered: 0, sent: 0 });

  let sent = 0;
  const failed: string[] = [];

  for (const row of due) {
    const [{ data: authUser }, { data: profile }] = await Promise.all([
      supabase.auth.admin.getUserById(row.user_id),
      supabase
        .from("user_profiles")
        .select("display_name")
        .eq("id", row.user_id)
        .single<{ display_name: string | null }>(),
    ]);

    const email = authUser?.user?.email;
    if (!email) {
      failed.push(row.user_id);
      continue;
    }

    const ok = await sendAccessExpiryEmail({
      to: email,
      // display_name is all there is; the first word of it is the closest
      // thing to a first name, and "there" reads better than an empty space.
      firstName: profile?.display_name?.trim().split(/\s+/)[0] || "there",
      expiresAt: row.case_bank_expires_at,
    });

    if (!ok) {
      failed.push(row.user_id);
      continue;
    }

    // Stamped only after the send succeeded, so a Resend outage means the
    // reminder goes tomorrow rather than never.
    const { error: stampErr } = await supabase
      .from("user_access")
      .update({ renewal_reminder_sent_at: new Date().toISOString() })
      .eq("user_id", row.user_id);

    if (stampErr) {
      // Sent but not recorded: they get a second one tomorrow. Worth logging,
      // not worth failing the run over.
      console.error("[cron/nudge] sent but could not stamp", row.user_id, stampErr.message);
    }

    sent++;
  }

  if (failed.length) console.error("[cron/nudge] failed for", failed.length, "user(s):", failed.join(", "));

  return NextResponse.json({ considered: due.length, sent, failed: failed.length });
}
