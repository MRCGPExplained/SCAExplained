"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser client — import this in "use client" components only.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
