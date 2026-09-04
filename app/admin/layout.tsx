import Link from "next/link";
import { logout } from "./logout-action";
import { isAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

/**
 * The authoritative admin gate.
 *
 * It used to live only in middleware, which meant middleware had to fail
 * closed here — and when its Supabase call degraded, real admins were told
 * "This account isn't listed as an admin", a permissions message for what was
 * actually an infrastructure problem. Checking here instead runs the same
 * lookup on the Node runtime, which is the path the rest of the app already
 * uses successfully, and lets middleware degrade harmlessly like every other
 * protected area.
 *
 * This deliberately renders instead of redirecting: /admin/login sits inside
 * this layout, so a redirect would loop.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth
      .getUser()
      .catch(() => ({ data: { user: null } }));

    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="w-full max-w-[380px]">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-navy/40 mb-1">
            SCA Focus
          </p>
          <h1 className="font-display font-extrabold text-[28px] text-navy mb-6">Admin</h1>

          {user ? (
            <>
              <p className="text-[13.5px] text-navy/70 mb-1">
                Signed in as <strong>{user.email}</strong>.
              </p>
              <p className="text-[13.5px] text-navy/55 mb-6 leading-relaxed">
                This account isn&apos;t listed as an admin. Ask an existing admin to add
                your email under Examiners, or sign out and try a different account.
              </p>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full bg-navy text-white text-[14px] font-bold py-3 rounded-xl hover:bg-navy/90 transition cursor-pointer"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-[13.5px] text-navy/55 mb-6">
                Sign in with your usual account to access admin.
              </p>
              <a
                href="/login?next=%2Fadmin"
                className="block text-center bg-navy text-white text-[14px] font-bold py-3 rounded-xl hover:bg-navy/90 transition no-underline"
              >
                Sign in
              </a>
            </>
          )}

          <Link
            href="/"
            className="block mt-6 text-center text-[12px] text-navy/35 no-underline hover:text-navy/60"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F3F0]" style={{ "--color-navy": "#333333" } as React.CSSProperties}>
      <nav className="bg-[#333333] px-8 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-white/[0.08]">
        <div className="flex items-center gap-8">
          <Link
            href="/admin"
            className="font-display font-bold text-[15px] no-underline text-[#F6D44B]"
          >
            SCA Admin
          </Link>
          <div className="flex gap-6">
            <Link href="/admin/stations" className="text-[13px] text-white/60 hover:text-white transition no-underline">Stations</Link>
            <Link href="/admin/case-guide" className="text-[13px] text-white/60 hover:text-white transition no-underline">Guide</Link>
            <Link href="/admin/case-bank-users" className="text-[13px] text-white/60 hover:text-white transition no-underline">Users</Link>
            <Link href="/admin/examiners" className="text-[13px] text-white/60 hover:text-white transition no-underline">Examiners</Link>
            <Link href="/admin/api-settings" className="text-[13px] text-white/60 hover:text-white transition no-underline">API Settings</Link>
            <Link href="/admin/skills" className="text-[13px] text-white/60 hover:text-white transition no-underline">Skills</Link>
            <Link href="/admin/feedback" className="text-[13px] text-white/60 hover:text-white transition no-underline">Feedback &amp; Help</Link>
            <Link href="/admin/webinar" className="text-[13px] text-white/60 hover:text-white transition no-underline">Webinar</Link>
            <Link href="/admin/testimonials" className="text-[13px] text-white/60 hover:text-white transition no-underline">Testimonials</Link>
            <Link href="/admin/economics" className="text-[13px] text-white/60 hover:text-white transition no-underline">Economics</Link>
            <Link href="/admin/cleanup" className="text-[13px] text-white/60 hover:text-white transition no-underline">Cleanup</Link>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/" className="text-[12px] text-white/35 hover:text-white/70 transition no-underline">
            ← Live site
          </Link>
          <form action={logout}>
            <button type="submit" className="text-[12px] text-white/35 hover:text-white/70 transition cursor-pointer">
              Logout
            </button>
          </form>
        </div>
      </nav>
      <div className="px-8 py-8 max-w-[1200px] mx-auto">{children}</div>
    </div>
  );
}
