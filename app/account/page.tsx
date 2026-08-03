import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/case-bank/actions";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("user_profiles").select("display_name").eq("id", user.id).single();

  const displayName = profile?.display_name ?? null;

  return (
    <div className="min-h-screen px-6 pt-12 pb-16" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[480px] mx-auto">
        <h1 className="font-display font-extrabold text-[28px] mb-8" style={{ color: DARK }}>Account</h1>

        <div className="flex flex-col gap-3">
          {/* Profile */}
          <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)" }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-3" style={{ color: "rgba(51,51,51,0.4)" }}>Profile</p>
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-[12px]" style={{ color: "rgba(51,51,51,0.45)" }}>Name</p>
                <p className="text-[15px] font-semibold" style={{ color: DARK }}>{displayName ?? "—"}</p>
              </div>
              <div>
                <p className="text-[12px]" style={{ color: "rgba(51,51,51,0.45)" }}>Email</p>
                <p className="text-[15px] font-semibold" style={{ color: DARK }}>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Change password */}
          <ChangePasswordForm />

          {/* Sign out */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full bg-white hover:bg-[rgba(246,212,75,0.10)] rounded-2xl p-4 text-[14px] font-semibold text-left transition-colors"
              style={{ border: "1px solid rgba(51,51,51,0.10)", color: "rgba(51,51,51,0.55)", cursor: "pointer" }}
            >
              Sign out →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
