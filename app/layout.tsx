import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { NavbarWrapper } from "./components/NavbarWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Poppins 800 is the signature display weight; 700 used for sub-heads.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SCA Explained — Learn What Scores Marks in the SCA",
  description:
    "Premium SCA coaching for GP trainees. Free 'How To Get A Clear Pass' training and the small-group SCA Intensive — real consultations, examiner-style feedback, and a personalised improvement plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-navy">
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}
