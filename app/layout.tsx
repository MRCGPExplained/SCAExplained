import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { NavbarWrapper } from "./components/NavbarWrapper";
import { StudyRoomProvider } from "./case-bank/components/study-room/StudyRoomProvider";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getCurrentUser } from "@/lib/current-user";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["700", "800"], display: "swap" });

// Every real route in this app was already rendered on demand — the navbar
// above reads the session on all of them. Saying so explicitly covers the one
// shell that was still being prerendered, /_not-found, which now sits under the
// study room provider and so needs a request to build a Supabase client for.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SCA Focus: Learn What Scores Marks in the SCA",
  description: "Premium SCA coaching for GP trainees. Free training, live practice sessions, and the SCA Focus Programme.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let isLoggedIn = false;
  let displayName: string | null = null;
  // Identity for the study room, resolved here so the session can outlive any
  // navigation. `initials` is only needed by the room; the navbar ignores it.
  let userId: string | null = null;
  let initials = "?";

  try {
    const user = await getCurrentUser();
    if (user) {
      isLoggedIn = true;
      userId = user.id;
      const supabase = await createSupabaseServerClient();
      const { data: profile } = await supabase.from("user_profiles").select("display_name,initials").eq("id", user.id).single();
      // The email fallback is for the study room, which puts this name on chat
      // messages and on the DailyCo participant. A profile row can be missing —
      // registration logs and continues if the insert fails — and an empty name
      // there is worse than an email address.
      displayName = profile?.display_name ?? user.email ?? null;
      initials = profile?.initials ?? "?";
    }
  } catch {
    // unauthenticated or no session — navbar renders logged-out state and the
    // study room stays unavailable
  }

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-navy">
        {/*
          The study room wraps the whole app, not just /case-bank. A layout only
          survives navigation inside its own subtree, so mounting it lower meant
          that opening a report or the dashboard destroyed the room session —
          channel, call, recorder and all — without anyone having asked to
          leave. Nothing under here re-renders on the room's 1 Hz tick: the
          provider splits its state into three contexts and `children` is an
          already-rendered node it never touches.
        */}
        <StudyRoomProvider userId={userId} displayName={displayName ?? ""} initials={initials}>
          <NavbarWrapper isLoggedIn={isLoggedIn} displayName={displayName} />
          {children}
        </StudyRoomProvider>
      </body>
    </html>
  );
}
