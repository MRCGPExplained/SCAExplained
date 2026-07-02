import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { CaseBankNav } from "./components/CaseBankNav";

export const dynamic = "force-dynamic";

export default async function CaseBankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let navProps: { displayName: string; initials: string; expiresAt: string | null } | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const [{ data: profile }, { data: access }] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("display_name,initials")
          .eq("id", user.id)
          .single<{ display_name: string; initials: string }>(),
        supabase
          .from("user_access")
          .select("expires_at")
          .eq("user_id", user.id)
          .eq("has_programme", true)
          .gt("expires_at", new Date().toISOString())
          .single<{ expires_at: string }>(),
      ]);

      navProps = {
        displayName: profile?.display_name ?? user.email ?? "",
        initials: profile?.initials ?? "?",
        expiresAt: access?.expires_at ?? null,
      };
    }
  } catch {
    // No session — login/register/purchase pages render without nav
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "Inter, system-ui, sans-serif" }}>
      {navProps && (
        <CaseBankNav
          displayName={navProps.displayName}
          initials={navProps.initials}
          expiresAt={navProps.expiresAt}
        />
      )}
      {children}
    </div>
  );
}
