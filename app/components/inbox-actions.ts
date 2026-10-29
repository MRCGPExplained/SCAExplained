"use server";

import { getCurrentUser } from "@/lib/current-user";
import { getSupabaseAdmin } from "@/lib/supabase";
import { loadInbox, type Inbox } from "@/lib/inbox";

/**
 * The envelope's contents, fetched when it is opened.
 *
 * The count beside the envelope is server-rendered with the page, and the root
 * layout does not re-run on client-side navigation — so that number is a hint
 * from whenever the tab last loaded. Opening the envelope asks again, which is
 * the moment it has to be right.
 *
 * Scoped to the signed-in user by this action, not by an argument. A user id
 * in the parameters would be a user id the browser could change.
 */
export async function fetchInboxAction(): Promise<Inbox> {
  const user = await getCurrentUser();
  // No session is genuinely an empty inbox, not a failure: the navbar does
  // not render the envelope at all when logged out.
  if (!user) return { messages: [], unread: 0, failed: false };

  const admin = getSupabaseAdmin();
  // Missing server config IS a failure, and must not render as "nothing yet".
  if (!admin) {
    console.error("[inbox] no admin client");
    return { messages: [], unread: 0, failed: true };
  }

  return loadInbox(admin, user.id);
}

/**
 * Mark one reply read, when the candidate opens it in the envelope.
 *
 * A GP review gets this for free: opening the report is a page load, and that
 * page stamps candidate_viewed_at. A reply has no page — it reads in place —
 * so expanding it is the only moment that can count as having seen it.
 *
 * Scoped by `.eq("user_id", user.id)` as well as by id, so a reply id taken
 * from someone else cannot be marked read on their behalf. The admin client
 * bypasses RLS, which is exactly why that clause is not optional.
 */
export async function markReplyReadAction(reportId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const admin = getSupabaseAdmin();
  if (!admin) return;

  const { error } = await admin
    .from("station_reports")
    .update({ reply_viewed_at: new Date().toISOString() })
    .eq("id", reportId)
    .eq("user_id", user.id);

  // Not fatal — they have read it either way, and the badge simply comes back
  // next time. Worth a line so a recurring failure is findable.
  if (error) console.error("[inbox] could not mark reply read", reportId, error.message);
}
