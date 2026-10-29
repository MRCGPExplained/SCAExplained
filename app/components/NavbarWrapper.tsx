"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function NavbarWrapper({
  isLoggedIn,
  displayName,
  unreadReports = 0,
  reviewsWaiting = null,
  feedbackWaiting = null,
}: {
  isLoggedIn: boolean;
  displayName?: string | null;
  unreadReports?: number;
  reviewsWaiting?: number | null;
  feedbackWaiting?: number | null;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  if (/^\/case-bank\/((\d)|sample)/.test(pathname)) return null;
  if (/^\/video-course\/.+/.test(pathname)) return null;
  // The returns above hide the whole navbar inside a station, a video
  // course and the admin area — so the envelope cannot flash a badge over a
  // running twelve-minute consultation. That is deliberate, not incidental.
  return (
    <Navbar
      isLoggedIn={isLoggedIn}
      displayName={displayName}
      unreadReports={unreadReports}
      reviewsWaiting={reviewsWaiting}
      feedbackWaiting={feedbackWaiting}
    />
  );
}
