"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { registerAction } from "@/app/case-bank/actions";

const DARK = "#333333";
const YELLOW = "#F6D44B";

function RegisterForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [state, formAction, pending] = useActionState(registerAction, {});
  const [formKey, setFormKey] = useState(0);

  // Reset form (clear all inputs) whenever an error comes back
  useEffect(() => {
    if (state.error) setFormKey((k) => k + 1);
  }, [state.error]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-2xl p-8" style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 4px 24px rgba(51,51,51,0.07)" }}>
      <h1 className="font-display font-bold text-[20px] mb-1" style={{ color: DARK }}>Create account</h1>
      <p className="text-[13px] mb-6" style={{ color: "rgba(51,51,51,0.5)" }}>
        Already have one?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold no-underline" style={{ color: DARK }}>
          Sign in
        </Link>
      </p>

      {state.error && (
        <div className="rounded-lg px-4 py-3 mb-4 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C" }}>
          {state.error}
        </div>
      )}

      <form key={formKey} action={formAction}>
        <input type="hidden" name="next" value={next} />

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.5)" }}>First name</label>
            <input name="first_name" type="text" required placeholder="Jane" autoComplete="given-name" className="w-full rounded-lg px-4 py-2.5 text-[13.5px]" style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.5)" }}>Surname</label>
            <input name="last_name" type="text" required placeholder="Smith" autoComplete="family-name" className="w-full rounded-lg px-4 py-2.5 text-[13.5px]" style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.5)" }}>Email</label>
          <input name="email" type="email" required autoComplete="email" className="w-full rounded-lg px-4 py-2.5 text-[13.5px]" style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }} />
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.5)" }}>Password</label>
          <input name="password" type="password" required autoComplete="new-password" className="w-full rounded-lg px-4 py-2.5 text-[13.5px]" style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }} />
        </div>

        <div className="mb-6">
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.5)" }}>Expected SCA date</label>
          <input
            name="sca_date"
            type="date"
            required
            min={today}
            className="w-full rounded-lg px-4 py-2.5 text-[13.5px]"
            style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }}
          />
        </div>

        <button type="submit" disabled={pending} className="w-full rounded-lg py-3 font-display font-bold text-[14px] transition-opacity" style={{ background: DARK, color: "white", opacity: pending ? 0.6 : 1, cursor: pending ? "not-allowed" : "pointer" }}>
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
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
        <Suspense fallback={<div className="rounded-2xl p-8" style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)" }} />}>
          <RegisterForm />
        </Suspense>
        <p className="text-center text-[12px] mt-6" style={{ color: "rgba(51,51,51,0.4)" }}>
          After signing up you&apos;ll be able to access your content.
        </p>
      </div>
    </div>
  );
}
