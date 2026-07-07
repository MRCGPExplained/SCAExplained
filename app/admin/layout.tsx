import Link from "next/link";
import { logout } from "./logout-action";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F3F0]">
      <nav className="bg-[#333333] px-8 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-white/[0.08]">
        <div className="flex items-center gap-8">
          <Link
            href="/admin"
            className="font-display font-bold text-[15px] no-underline text-[#F6D44B]"
          >
            SCA Admin
          </Link>
          <div className="flex gap-6">
            <Link href="/admin/homepage-videos" className="text-[13px] text-white/60 hover:text-white transition no-underline">Homepage Videos</Link>
            <Link href="/admin/live-sessions" className="text-[13px] text-white/60 hover:text-white transition no-underline">Free Live Sessions</Link>
            <Link href="/admin/video-course" className="text-[13px] text-white/60 hover:text-white transition no-underline">Skills Workshop</Link>
            <Link href="/admin/recorded-consultations" className="text-[13px] text-white/60 hover:text-white transition no-underline">Recorded Consultations</Link>
            <Link href="/admin/stations" className="text-[13px] text-white/60 hover:text-white transition no-underline">Stations</Link>
            <Link href="/admin/case-bank-users" className="text-[13px] text-white/60 hover:text-white transition no-underline">Users</Link>
            <Link href="/admin/promo-codes" className="text-[13px] text-white/60 hover:text-white transition no-underline">Promo Codes</Link>
            <Link href="/admin/beta-users" className="text-[13px] text-white/60 hover:text-white transition no-underline">Beta Users</Link>
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
