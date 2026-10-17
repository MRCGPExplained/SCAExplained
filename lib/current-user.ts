import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

/**
 * The signed-in user, verified once per request.
 *
 * `supabase.auth.getUser()` is a network call: it asks the Auth server to
 * verify the JWT rather than trusting the cookie, which is exactly why it is
 * the right call to make and exactly why making it three times to render one
 * page was worth removing. A case-bank page used to verify in the root layout,
 * again in the page, and a third time inside `isAdmin()` — three round trips
 * for one answer that cannot change mid-render.
 *
 * `cache()` is scoped to a single React render pass, so this dedupes within one
 * request and nothing more. A later request verifies again, and a Server Action
 * — its own request — verifies again too, which is the behaviour you want:
 * nothing here lets a revoked session survive into the next thing the user
 * does. It is also what makes this safe where swapping to `getSession()` would
 * not be, since that reads the cookie without checking it.
 *
 * Next's own authentication guide prescribes this shape
 * (node_modules/next/dist/docs/01-app/02-guides/authentication.md).
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    // No session, or auth unreachable. Callers treat both as logged out, which
    // is what they did individually before this was shared.
    return null;
  }
});
