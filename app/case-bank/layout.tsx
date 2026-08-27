import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { LayoutProbe } from "./components/LayoutProbe";

export default async function CaseBankLayout({ children }: { children: React.ReactNode }) {
  // Identity is resolved here rather than per-page so it can feed the
  // persistent study-room session. This layout also wraps /case-bank/login,
  // /register and /upgrade, so it must tolerate a logged-out user and must
  // never redirect — a redirect here would put the login page in a loop.
  let userId: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // no session — the study room simply stays unavailable
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "Inter, system-ui, sans-serif" }}>
      <LayoutProbe userId={userId} />
      {children}
    </div>
  );
}
