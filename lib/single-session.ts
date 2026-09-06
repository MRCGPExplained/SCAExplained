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

/** The session_id claim, read from the access token without a network call. */
function sessionIdFrom(accessToken: string): string | null {
  const payload = accessToken.split(".")[1];
  if (!payload) return null;
  try {
    const json = Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const claims = JSON.parse(json) as { session_id?: string };
    return claims.session_id ?? null;
  } catch {
    return null;
  }
}

/**
 * Whether the caller's session has been revoked by a later sign-in elsewhere.
 *
 * Called only where a consultation begins, never on a page load. Ending other
 * sessions does not reach a device that already holds a valid access token, so
 * that device keeps working until the token expires. For browsing, an hour of
 * grace costs nothing. For starting a consultation it costs a Deepgram
 * transcription, a Daily room and a Sonnet grading, which is the whole reason
 * an account gets shared.
 *
 * Fails open. A database hiccup must not stop a paying candidate consulting,
 * and the thing being protected is a margin rather than anything sensitive.
 */
export async function sessionWasRevoked(
  supabase: SupabaseClient,
  admin: SupabaseClient
): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return false;

  const sessionId = sessionIdFrom(session.access_token);
  if (!sessionId) return false;

  const { data, error } = await admin.rpc("session_is_live", { p_session_id: sessionId });
  if (error) {
    console.error(`[auth] session check failed, allowing: ${error.message}`);
    return false;
  }
  return data === false;
}

/** What the candidate is told when their session has been taken over. */
export const SESSION_TAKEN_OVER =
  "You have been signed in on another device. Please sign in again here to continue.";
