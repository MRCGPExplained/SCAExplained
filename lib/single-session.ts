import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * One account, one signed-in device.
 *
 * Called straight after a successful sign-in, this revokes every other session
 * belonging to the account and leaves the one just created. Without it Supabase
 * keeps every refresh token it has ever issued, so a single set of credentials
 * works on unlimited devices at once and a shared login is indistinguishable
 * from a heavy user.
 *
 * Done with Supabase's own session scope rather than a session id checked on
 * each request, deliberately. A per-request lookup is what middleware used to
 * do here, and it is what caused the site-wide timeouts.
 *
 * Two things it does not do. Guests are never touched: an anonymous sign-in is
 * not an account and revoking those would break study rooms. And the other
 * device is not logged out instantly, because its access token stays valid
 * until it expires; it loses access at its next refresh.
 */
export async function endOtherSessions(supabase: SupabaseClient): Promise<void> {
  // Never fail a sign-in over this. A user who is in is in, and a stale session
  // surviving is a smaller problem than a login that errors.
  const { error } = await supabase.auth.signOut({ scope: "others" });
  if (error) console.error(`[auth] could not end other sessions: ${error.message}`);
}
