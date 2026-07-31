"use client";

import { useActionState } from "react";
import Link from "next/link";
import { redeemWithSignupAction } from "./actions";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export function RedeemGuest() {
  const [state, formAction, pending] = useActionState(redeemWithSignupAction, {});

  return (
    <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 4px 24px rgba(51,51,51,0.07)" }}>
      <h1 className="font-display font-bold text-[20px] mb-1" style={{ color: DARK }}>
        Get your Case Bank access
      </h1>
      <p className="text-[13px] mb-6" style={{ color: "rgba(51,51,51,0.50)" }}>
        Enter your details and the code from the webinar — your account and access are set up in one step.
      </p>

      {state.error && (
        <div className="rounded-lg px-4 py-3 mb-4 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C" }}>
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.50)" }}>First name</label>
            <input
              name="first_name"
              type="text"
              required
              autoFocus
              placeholder="Jane"
              autoComplete="given-name"
              className="w-full rounded-lg px-4 py-2.5 text-[13.5px]"
              style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.50)" }}>Surname</label>
            <input
              name="last_name"
              type="text"
              placeholder="Smith"
              autoComplete="family-name"
              className="w-full rounded-lg px-4 py-2.5 text-[13.5px]"
              style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.50)" }}>Email</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg px-4 py-2.5 text-[13.5px]"
            style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }}
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.50)" }}>Password</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="At least 6 characters"
            className="w-full rounded-lg px-4 py-2.5 text-[13.5px]"
            style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }}
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.50)" }}>Webinar code</label>
          <input
            name="code"
            type="text"
            required
            placeholder="e.g. JULY2026"
            className="w-full rounded-lg px-4 py-2.5 text-[15px] font-mono tracking-widest uppercase"
            style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg py-3 font-display font-bold text-[14px] mt-1"
          style={{ background: DARK, color: "white", opacity: pending ? 0.6 : 1, cursor: pending ? "not-allowed" : "pointer" }}
        >
          {pending ? "Setting up your access…" : "Create account & unlock access →"}
        </button>
      </form>

      <p className="text-center text-[12px] mt-5" style={{ color: "rgba(51,51,51,0.40)" }}>
        Already have an account?{" "}
        <Link href="/login?next=/redeem" className="font-semibold no-underline" style={{ color: DARK }}>
          Sign in
        </Link>
      </p>

      <p className="text-center text-[11px] mt-3" style={{ color: "rgba(51,51,51,0.30)" }}>
        No email confirmation needed — access is instant.
      </p>
    </div>
  );
}
