import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server component / server action client — anon key + user JWT from cookies.
// Import this ONLY in server components, server actions, and route handlers.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components can't set cookies — safe to ignore
          }
        },
      },
    }
  );
}
