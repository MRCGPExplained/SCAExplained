import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { Swash } from "./components/Swash";
import Link from "next/link";

export const dynamic = "force-dynamic";

const NAVY = "#1A1B52";
const YELLOW = "#F6D44B";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  const buyHref = user ? "/programme" : "/register";

  return (
    <main className="bg-cream">
      {/* HERO */}
      <section className="px-10 pt-8 pb-20 max-md:px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 gap-[52px] items-center max-md:grid-cols-1">
          <div className="min-w-0">
            <h1 className="font-display text-navy mb-[26px]">
              <span className="block font-extrabold text-[46px] leading-[1.14] max-sm:text-[34px]">
                Perform Your Best On SCA.
              </span>
              <span className="block font-bold text-[30px] leading-[1.25] max-sm:text-[22px]">
                Know Exactly What <Swash>Scores Marks</Swash>
              </span>
            </h1>

            <p className="text-[15.5px] leading-[1.7] text-navy/[0.68] mb-4">
              Getting a Clear Pass isn&apos;t about knowing more medicine. It&apos;s about
              demonstrating a specific set of consultation skills, naturally under exam
              conditions. Exploring a patient&apos;s ICE without it feeling like a checklist.
              Sitting with diagnostic uncertainty and committing to a plan anyway. Handling
              patient emotion without losing structure. These are the skills RCGP examiners
              are scoring. That&apos;s exactly what we teach.
            </p>

            <p className="text-[15.5px] leading-[1.7] text-navy/[0.68] mb-[34px]">
              Start with{" "}
              <Link href="/free-training" className="font-bold text-navy no-underline border-b-2 border-yellow">
                How To Get A Clear Pass
              </Link>
              {" "}— our free recorded training covering exactly what examiners are looking for.
            </p>

            <Link
              href={buyHref}
              className="inline-block rounded-xl px-7 py-3.5 font-display font-bold text-[15px] no-underline transition-opacity hover:opacity-90"
              style={{ background: NAVY, color: "white" }}
            >
              Get started
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(26,27,82,0.18)] aspect-[4/3] bg-navy relative min-w-0 flex items-center justify-center max-md:hidden">
            <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(135deg, rgba(246,212,75,0.06) 0px, rgba(246,212,75,0.06) 2px, transparent 2px, transparent 18px)" }} />
            <span className="relative text-white/50 text-[13px] font-semibold tracking-[0.04em]">GP consultation photo — placeholder</span>
          </div>
        </div>
      </section>

      {/* THREE-TIER PRODUCT GRID */}
      <section className="px-10 pb-20 max-md:px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-navy/40 mb-2">How it works</p>
            <h2 className="font-display font-extrabold text-[26px] text-navy">The SCA Explained pathway</h2>
            <p className="text-[14px] text-navy/55 mt-2 max-w-[480px] mx-auto leading-[1.65]">
              Start free. Go deeper when you&apos;re ready.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">

            {/* Free */}
            <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)", boxShadow: "0 2px 12px rgba(26,27,82,0.06)" }}>
              <div className="px-7 pt-7 pb-5 flex flex-col flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full self-start mb-3" style={{ background: "rgba(26,27,82,0.07)", color: "rgba(26,27,82,0.55)" }}>Free</span>
                <h3 className="font-display font-extrabold text-[19px] mb-2" style={{ color: NAVY }}>How To Get A Clear Pass</h3>
                <p className="text-[13.5px] leading-[1.65] mb-5" style={{ color: "rgba(26,27,82,0.58)" }}>
                  Our recorded training covering exactly how the SCA is marked and what examiners are looking for.
                </p>
                <ul className="flex flex-col gap-2 mb-6">
                  {["Free to watch", "Registration required", "Foundation for everything"].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5" style={{ background: "rgba(26,27,82,0.08)", color: NAVY }}>✓</span>
                      <span className="text-[13px]" style={{ color: "rgba(26,27,82,0.70)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link href="/free-training" className="block w-full text-center rounded-xl py-3 font-display font-bold text-[14px] no-underline" style={{ background: NAVY, color: "white" }}>
                    Watch Free
                  </Link>
                </div>
              </div>
            </div>

            {/* Free+ */}
            <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)", boxShadow: "0 2px 12px rgba(26,27,82,0.06)" }}>
              <div className="px-7 pt-7 pb-5 flex flex-col flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full self-start mb-3" style={{ background: "rgba(26,27,82,0.07)", color: "rgba(26,27,82,0.55)" }}>Free+</span>
                <h3 className="font-display font-extrabold text-[19px] mb-2" style={{ color: NAVY }}>Monthly Live Practice Session</h3>
                <p className="text-[13.5px] leading-[1.65] mb-5" style={{ color: "rgba(26,27,82,0.58)" }}>
                  Join our monthly live session. Watch a real SCA consultation coached in real time, or put yourself forward as an active candidate.
                </p>
                <ul className="flex flex-col gap-2 mb-6">
                  {["Monthly on Zoom", "Active candidates coached live", "Observers always welcome"].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5" style={{ background: "rgba(26,27,82,0.08)", color: NAVY }}>✓</span>
                      <span className="text-[13px]" style={{ color: "rgba(26,27,82,0.70)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link href="/live-session" className="block w-full text-center rounded-xl py-3 font-display font-bold text-[14px] no-underline" style={{ background: NAVY, color: "white" }}>
                    Register for the Next Session
                  </Link>
                </div>
              </div>
            </div>

            {/* Paid — Programme */}
            <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: NAVY, boxShadow: "0 8px 32px rgba(26,27,82,0.22)" }}>
              <div className="px-7 pt-7 pb-5 flex flex-col flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full self-start mb-3" style={{ background: YELLOW, color: NAVY }}>The Programme — £60</span>
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
                  <Link href={buyHref} className="block w-full text-center rounded-xl py-3 font-display font-bold text-[14px] no-underline" style={{ background: YELLOW, color: NAVY }}>
                    Buy The Programme
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy border-t border-white/[0.08] px-10 py-[18px] flex items-center justify-between flex-wrap gap-2.5 max-md:px-6">
        <p className="text-xs text-white/40">For educational purposes only. © 2026 SCA Explained.</p>
        <div className="flex gap-5 flex-wrap">
          <Link href="/free-training" className="text-xs text-white/50 no-underline">Free Training</Link>
          <Link href="/live-session" className="text-xs text-white/50 no-underline">Live Session</Link>
          <Link href="/programme" className="text-xs text-white/50 no-underline">The Programme</Link>
          <Link href="/about" className="text-xs text-white/50 no-underline">About</Link>
          <a href="/faq" className="text-xs text-white/50 no-underline">FAQ</a>
          <a href="/privacy" className="text-[11px] text-white/30 no-underline">Privacy</a>
          <a href="/terms" className="text-[11px] text-white/30 no-underline">Terms</a>
        </div>
      </footer>
    </main>
  );
}
