"use client";

import { useActionState } from "react";
import Link from "next/link";
import { redeemCodeAction } from "./actions";

const DARK = "#333333";

export function RedeemLoggedIn() {
  const [state, formAction, pending] = useActionState(redeemCodeAction, {});

  return (
    <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 4px 24px rgba(51,51,51,0.07)" }}>
      {state.success ? (
        <div className="text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(34,197,94,0.10)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-display font-bold text-[20px] mb-2" style={{ color: DARK }}>Recording credits added!</h1>
          <p className="text-[14px] mb-6" style={{ color: "rgba(51,51,51,0.60)" }}>
            Use them to record consultations and get feedback from a GP examiner.
          </p>
          <Link
            href="/recordings"
            className="inline-block font-bold text-[14px] px-7 py-3 rounded-xl no-underline"
            style={{ background: DARK, color: "white" }}
          >
            View My Recordings →
          </Link>
        </div>
      ) : (
        <>
          <h1 className="font-display font-bold text-[20px] mb-1" style={{ color: DARK }}>Redeem a code</h1>
          <p className="text-[13px] mb-6" style={{ color: "rgba(51,51,51,0.50)" }}>
            Enter the code you received at the webinar.
          </p>

          {state.error && (
            <div className="rounded-lg px-4 py-3 mb-4 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C" }}>
              {state.error}
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.50)" }}>Access code</label>
              <input
                name="code"
                type="text"
                required
                autoFocus
                className="w-full rounded-lg px-4 py-2.5 text-[15px] font-mono tracking-widest uppercase"
                style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }}
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg py-3 font-display font-bold text-[14px]"
              style={{ background: DARK, color: "white", opacity: pending ? 0.6 : 1, cursor: pending ? "not-allowed" : "pointer" }}
            >
              {pending ? "Checking…" : "Redeem"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
