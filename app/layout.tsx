import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { NavbarWrapper } from "./components/NavbarWrapper";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["700", "800"], display: "swap" });

export const metadata: Metadata = {
  title: "SCA Explained — Learn What Scores Marks in the SCA",
  description: "Premium SCA coaching for GP trainees. Free training, live practice sessions, and the SCA Explained Programme.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let isLoggedIn = false;
  let displayName: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      isLoggedIn = true;
      const { data: profile } = await supabase.from("user_profiles").select("display_name").eq("id", user.id).single();
      displayName = profile?.display_name ?? null;
    }
  } catch {
    // unauthenticated or no session — navbar renders logged-out state
  }

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-navy">
        <NavbarWrapper isLoggedIn={isLoggedIn} displayName={displayName} />
        {children}
      </body>
    </html>
  );
}
