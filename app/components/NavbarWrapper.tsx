"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function NavbarWrapper({
  isLoggedIn,
  displayName,
}: {
  isLoggedIn: boolean;
  displayName?: string | null;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  if (/^\/case-bank\/\d/.test(pathname)) return null;
  if (/^\/video-course\/.+/.test(pathname)) return null;
  return <Navbar isLoggedIn={isLoggedIn} displayName={displayName} />;
}
