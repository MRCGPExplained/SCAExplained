import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { logout } from "../logout-action";

export const dynamic = "force-dynamic";

export default async function AdminAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-navy/40 mb-1">
            SCA Focus
          </p>
          <h1 className="font-display font-extrabold text-[28px] text-navy">
            Admin
          </h1>
        </div>

        {user ? (
          <>
            <p className="text-[13.5px] text-navy/70 mb-1">
              Signed in as <strong>{user.email}</strong>.
            </p>
            <p className="text-[13.5px] text-navy/55 mb-6 leading-relaxed">
              This account isn&apos;t listed as an admin. Ask an existing admin to
              add your email under Examiners, or sign out and try a different account.
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
              href={`/login?next=${encodeURIComponent(next ?? "/admin")}`}
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
    </main>
  );
}
