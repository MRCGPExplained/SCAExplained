"use client";

import { useActionState } from "react";
import { unlockBetatest } from "./actions";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(unlockBetatest, {});

  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <div className="w-full max-w-[360px] rounded-2xl p-8 bg-white" style={{ border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 4px 24px rgba(51,51,51,0.07)" }}>
        <h1 className="font-display font-bold text-[20px] mb-1" style={{ color: DARK }}>AI Roleplay</h1>
        <p className="text-[13px] mb-6" style={{ color: "rgba(51,51,51,0.5)" }}>Enter the access code to continue.</p>

        {state.error && (
          <div className="rounded-lg px-4 py-3 mb-4 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C" }}>
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <input
            name="password"
            type="password"
            required
            placeholder="Access code"
            autoFocus
            className="w-full rounded-lg px-4 py-2.5 text-[13.5px]"
            style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }}
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg py-3 font-display font-bold text-[14px]"
            style={{ background: DARK, color: "white", opacity: pending ? 0.6 : 1, cursor: pending ? "not-allowed" : "pointer" }}
          >
            {pending ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
