import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { StudyRoomProvider } from "./components/study-room/StudyRoomProvider";

// This layout reads the session, so nothing under /case-bank can be
// prerendered. Declared explicitly rather than relying on the cookies() call
// to opt out, because the try/catch below would swallow that signal.
export const dynamic = "force-dynamic";

export default async function CaseBankLayout({ children }: { children: React.ReactNode }) {
  // Identity is resolved here rather than per-page so it can feed the study
  // room session, which lives in this layout precisely because layouts survive
  // navigation. This layout also wraps /case-bank/login, /register and
  // /upgrade, so it must tolerate a logged-out user and must never redirect —
  // a redirect here would put the login page in a loop.
  let userId: string | null = null;
  let displayName = "";
  let initials = "?";

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("display_name,initials")
        .eq("id", user.id)
        .single<{ display_name: string; initials: string }>();
      displayName = profile?.display_name ?? user.email ?? "";
      initials = profile?.initials ?? "?";
    }
  } catch {
    // No session — the study room simply stays unavailable.
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "Inter, system-ui, sans-serif" }}>
      <StudyRoomProvider userId={userId} displayName={displayName} initials={initials}>
        {children}
      </StudyRoomProvider>
    </div>
  );
}
