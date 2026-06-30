import Link from "next/link";
import { logout } from "./logout-action";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4f3f0]">
      <nav className="bg-navy px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <Link
            href="/admin"
            className="font-display font-bold text-white text-[15px] no-underline"
          >
            SCA Admin
          </Link>
          <div className="flex gap-6">
            <Link
              href="/admin"
              className="text-[13px] text-white/70 hover:text-white transition no-underline"
            >
              Events
            </Link>
            <Link
              href="/admin/settings"
              className="text-[13px] text-white/70 hover:text-white transition no-underline"
            >
              Presets
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="text-[12px] text-white/40 hover:text-white/70 transition no-underline"
          >
            ← Live site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-[12px] text-white/40 hover:text-white/70 transition cursor-pointer"
            >
              Logout
            </button>
          </form>
        </div>
      </nav>
      <div className="px-8 py-8 max-w-[1200px] mx-auto">{children}</div>
    </div>
  );
}
