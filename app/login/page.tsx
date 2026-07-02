"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/app/case-bank/actions";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block no-underline">
            <span className="font-display font-extrabold text-[22px]" style={{ color: "#1A1B52" }}>
              SCA <span style={{ color: "#F6D44B" }}>Explained</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)", boxShadow: "0 4px 24px rgba(26,27,82,0.07)" }}>
          <h1 className="font-display font-bold text-[20px] mb-1" style={{ color: "#1A1B52" }}>Sign in</h1>
          <p className="text-[13px] mb-6" style={{ color: "rgba(26,27,82,0.5)" }}>
            No account?{" "}
            <Link href="/register" className="font-semibold no-underline" style={{ color: "#1A1B52" }}>
              Sign up
            </Link>
          </p>

          <form action={formAction}>
            <input type="hidden" name="next" value={next} />

            {state.error && (
              <div className="rounded-lg px-4 py-3 mb-4 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C" }}>
                {state.error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(26,27,82,0.5)" }}>Email</label>
              <input name="email" type="email" required autoComplete="email" className="w-full rounded-lg px-4 py-2.5 text-[13.5px]" style={{ border: "1.5px solid rgba(26,27,82,0.15)", color: "#1A1B52", background: "#F3F2FB", outline: "none" }} />
            </div>

            <div className="mb-6">
              <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(26,27,82,0.5)" }}>Password</label>
              <input name="password" type="password" required autoComplete="current-password" className="w-full rounded-lg px-4 py-2.5 text-[13.5px]" style={{ border: "1.5px solid rgba(26,27,82,0.15)", color: "#1A1B52", background: "#F3F2FB", outline: "none" }} />
            </div>

            <button type="submit" disabled={pending} className="w-full rounded-lg py-3 font-display font-bold text-[14px] transition-opacity" style={{ background: "#1A1B52", color: "white", opacity: pending ? 0.6 : 1, cursor: pending ? "not-allowed" : "pointer" }}>
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
