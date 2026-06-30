"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-navy/40 mb-1">
            SCA Explained
          </p>
          <h1 className="font-display font-extrabold text-[28px] text-navy">
            Admin
          </h1>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="rounded-lg border border-navy/15 bg-white px-3.5 py-3 text-sm text-navy outline-none focus:border-navy"
            />
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-[13px] text-red-700">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="bg-navy text-white text-[14px] font-bold py-3 rounded-xl hover:bg-navy/90 transition disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <a
          href="/"
          className="block mt-6 text-center text-[12px] text-navy/35 no-underline hover:text-navy/60"
        >
          ← Back to site
        </a>
      </div>
    </main>
  );
}
