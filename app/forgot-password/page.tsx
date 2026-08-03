"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "./actions";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, {});

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block no-underline">
            <span className="font-display font-extrabold text-[22px]" style={{ color: DARK }}>
              SCA <span style={{ color: YELLOW }}>Explained</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 4px 24px rgba(51,51,51,0.07)" }}>
          <h1 className="font-display font-bold text-[20px] mb-1" style={{ color: DARK }}>Reset password</h1>
          <p className="text-[13px] mb-6" style={{ color: "rgba(51,51,51,0.5)" }}>
            Enter your email and we'll send you a reset link.
          </p>

          {"success" in state && state.success ? (
            <div className="rounded-lg px-4 py-3 text-[13px]" style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", color: "#166534" }}>
              Check your email — a reset link is on its way.
            </div>
          ) : (
            <form action={formAction} className="flex flex-col gap-4">
              {"error" in state && state.error && (
                <div className="rounded-lg px-4 py-3 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C" }}>
                  {state.error}
                </div>
              )}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.5)" }}>Email</label>
                <input name="email" type="email" required autoFocus autoComplete="email" className="w-full rounded-lg px-4 py-2.5 text-[13.5px]" style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }} />
              </div>
              <button type="submit" disabled={pending} className="w-full rounded-lg py-3 font-display font-bold text-[14px]" style={{ background: DARK, color: "white", opacity: pending ? 0.6 : 1, cursor: pending ? "not-allowed" : "pointer" }}>
                {pending ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          <p className="text-center text-[12px] mt-5" style={{ color: "rgba(51,51,51,0.4)" }}>
            <Link href="/login" className="font-semibold no-underline" style={{ color: DARK }}>Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
