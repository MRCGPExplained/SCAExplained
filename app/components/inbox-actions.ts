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
