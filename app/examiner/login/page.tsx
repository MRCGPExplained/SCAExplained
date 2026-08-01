"use client";

import { useActionState } from "react";
import { examinerLoginAction } from "./actions";

const NAVY = "#1A1B52";

export default function ExaminerLoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string }, formData: FormData) => {
      const result = await examinerLoginAction(formData);
      return result ?? { error: undefined };
    },
    { error: undefined } as { error?: string }
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#F3F2FB" }}
    >
      <div
        className="w-full max-w-[360px] rounded-2xl p-8"
        style={{ background: "white", border: "1px solid rgba(26,27,82,0.1)" }}
      >
        <div
          className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1"
          style={{ color: "rgba(26,27,82,0.4)" }}
        >
          SCA Explained
        </div>
        <h1
          className="font-display font-extrabold text-[22px] mb-1"
          style={{ color: NAVY }}
        >
          Examiner Portal
        </h1>
        <p className="text-[13px] mb-7" style={{ color: "rgba(26,27,82,0.5)" }}>
          Enter your passcode to continue.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          <input
            name="passcode"
            type="password"
            placeholder="Passcode"
            autoComplete="current-password"
            required
            className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
            style={{
              border: "1.5px solid rgba(26,27,82,0.15)",
              background: "#F3F2FB",
              color: NAVY,
              fontFamily: "inherit",
            }}
          />

          {state.error && (
            <p className="text-[12px] text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 rounded-xl text-[14px] font-bold"
            style={{
              background: NAVY,
              color: "white",
              border: "none",
              cursor: pending ? "not-allowed" : "pointer",
              opacity: pending ? 0.6 : 1,
            }}
          >
            {pending ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
