"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function NavbarWrapper({
  isLoggedIn,
  hasProgramme,
  displayName,
}: {
  isLoggedIn: boolean;
  hasProgramme: boolean;
  displayName?: string | null;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  if (pathname.startsWith("/case-bank")) return null;
  if (pathname.startsWith("/video-course")) return null;
  if (pathname.startsWith("/free-training")) return null;
  if (pathname.startsWith("/how-to-get-a-clear-pass")) return null;
  return <Navbar isLoggedIn={isLoggedIn} hasProgramme={hasProgramme} displayName={displayName} />;
}
