import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase access.
 *
 * Per the MVP (no auth), all database access happens on the server using the
 * service-role key. RLS is enabled with no public policies, so the anon key can
 * read nothing — this guarantees `zoom_link` can never leak to a client. The
 * service-role key MUST stay server-only; never import this from a Client
 * Component.
 *
 * The client is created lazily so the app can still build/boot (and render the
 * "no upcoming dates" state) before env vars are configured on Vercel.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing — DB calls will be skipped."
      );
    }
    return null;
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
