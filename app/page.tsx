import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { Swash } from "./components/Swash";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  const buyHref = user ? "/programme" : "/register";

  return (
    <main style={{ background: "#FAFAF8" }}>
      {/* HERO */}
      <section className="px-10 pt-10 pb-20 max-md:px-6">
        <div className="max-w-[680px] mx-auto">
          <h1 className="font-display mb-[26px]" style={{ color: DARK }}>
            <span className="block font-extrabold text-[46px] leading-[1.14] max-sm:text-[34px]">
              Perform Your Best On SCA.
            </span>
            <span className="block font-bold text-[30px] leading-[1.25] max-sm:text-[22px]">
              Know Exactly What <Swash>Scores Marks</Swash>
            </span>
          </h1>

          <p className="text-[15.5px] leading-[1.7] mb-4" style={{ color: "rgba(51,51,51,0.68)" }}>
            Getting a Clear Pass isn&apos;t about knowing more medicine. It&apos;s about
            demonstrating a specific set of consultation skills, naturally under exam
            conditions. Exploring a patient&apos;s ICE without it feeling like a checklist.
            Sitting with diagnostic uncertainty and committing to a plan anyway. Handling
            patient emotion without losing structure. These are the skills RCGP examiners
            are scoring. That&apos;s exactly what we teach.
          </p>

          <p className="text-[15.5px] leading-[1.7] mb-[34px]" style={{ color: "rgba(51,51,51,0.68)" }}>
            Start with{" "}
            <Link href="/how-to-get-a-clear-pass" className="font-bold no-underline border-b-2 border-yellow" style={{ color: DARK }}>
              How To Get A Clear Pass
            </Link>
            {" "}— our free recorded training covering exactly what examiners are looking for.
          </p>

          <Link
            href={buyHref}
            className="inline-block rounded-xl px-7 py-3.5 font-display font-bold text-[15px] no-underline transition-opacity hover:opacity-90"
            style={{ background: DARK, color: "white" }}
          >
            Get started
          </Link>
        </div>
      </section>

      {/* THREE-TIER PRODUCT GRID */}
      <section className="px-10 pb-20 max-md:px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-[12px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "rgba(51,51,51,0.40)" }}>How it works</p>
            <h2 className="font-display font-extrabold text-[26px]" style={{ color: DARK }}>The SCA Explained pathway</h2>
            <p className="text-[14px] mt-2 max-w-[480px] mx-auto leading-[1.65]" style={{ color: "rgba(51,51,51,0.55)" }}>
              Start free. Go deeper when you&apos;re ready.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">

            {/* Free */}
            <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 2px 12px rgba(51,51,51,0.06)" }}>
              <div className="px-7 pt-7 pb-5 flex flex-col flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full self-start mb-3" style={{ background: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.55)" }}>Free</span>
                <h3 className="font-display font-extrabold text-[19px] mb-2" style={{ color: DARK }}>How To Get A Clear Pass</h3>
                <p className="text-[13.5px] leading-[1.65] mb-5" style={{ color: "rgba(51,51,51,0.58)" }}>
                  Our recorded training covering exactly how the SCA is marked and what examiners are looking for.
                </p>
                <ul className="flex flex-col gap-2 mb-6">
                  {["Free to watch", "No registration needed", "Foundation for everything"].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5" style={{ background: "rgba(51,51,51,0.08)", color: DARK }}>✓</span>
                      <span className="text-[13px]" style={{ color: "rgba(51,51,51,0.70)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link href="/how-to-get-a-clear-pass" className="block w-full text-center rounded-xl py-3 font-display font-bold text-[14px] no-underline" style={{ background: DARK, color: "white" }}>
                    Watch Free
                  </Link>
                </div>
              </div>
            </div>

            {/* Free+ */}
            <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 2px 12px rgba(51,51,51,0.06)" }}>
              <div className="px-7 pt-7 pb-5 flex flex-col flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full self-start mb-3" style={{ background: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.55)" }}>Free+</span>
                <h3 className="font-display font-extrabold text-[19px] mb-2" style={{ color: DARK }}>Monthly Live Practice Session</h3>
                <p className="text-[13.5px] leading-[1.65] mb-5" style={{ color: "rgba(51,51,51,0.58)" }}>
                  Join our monthly live session. Watch a real SCA consultation coached in real time, or put yourself forward as an active candidate.
                </p>
                <ul className="flex flex-col gap-2 mb-6">
                  {["Monthly on Zoom", "Active candidates coached live", "Observers always welcome"].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5" style={{ background: "rgba(51,51,51,0.08)", color: DARK }}>✓</span>
                      <span className="text-[13px]" style={{ color: "rgba(51,51,51,0.70)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link href="/live-session" className="block w-full text-center rounded-xl py-3 font-display font-bold text-[14px] no-underline" style={{ background: DARK, color: "white" }}>
                    Register for the Next Session
                  </Link>
                </div>
              </div>
            </div>

            {/* Paid — Programme */}
            <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: DARK, boxShadow: "0 8px 32px rgba(51,51,51,0.22)" }}>
              <div className="px-7 pt-7 pb-5 flex flex-col flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full self-start mb-3" style={{ background: YELLOW, color: DARK }}>The Programme — £60</span>
                <h3 className="font-display font-extrabold text-[19px] mb-2 text-white">The SCA Explained Programme</h3>
                <p className="text-[13.5px] leading-[1.65] mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  A system-by-system video course and 246 practice stations. Everything in one place.
                </p>
                <ul className="flex flex-col gap-2 mb-6">
                  {[
                    "System-by-system video course",
                    "246 fully-structured SCA stations",
                    "Real-time study rooms",
                    "90-day access",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5" style={{ background: "rgba(246,212,75,0.2)", color: YELLOW }}>✓</span>
                      <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.65)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link href={buyHref} className="block w-full text-center rounded-xl py-3 font-display font-bold text-[14px] no-underline" style={{ background: YELLOW, color: DARK }}>
                    Buy The Programme
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-10 py-[18px] flex items-center justify-between flex-wrap gap-2.5 max-md:px-6" style={{ background: DARK, borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>For educational purposes only. © 2026 SCA Explained.</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="text-[11px] no-underline" style={{ color: "rgba(255,255,255,0.40)" }}>Privacy</Link>
          <Link href="/terms" className="text-[11px] no-underline" style={{ color: "rgba(255,255,255,0.40)" }}>Terms</Link>
        </div>
      </footer>
    </main>
  );
}
