"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setPending(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => router.push("/login"), 2500);
  }

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
          <h1 className="font-display font-bold text-[20px] mb-1" style={{ color: DARK }}>Choose a new password</h1>
          <p className="text-[13px] mb-6" style={{ color: "rgba(51,51,51,0.5)" }}>At least 6 characters.</p>

          {done ? (
            <div className="rounded-lg px-4 py-3 text-[13px]" style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", color: "#166534" }}>
              Password updated. Redirecting you to sign in…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-lg px-4 py-3 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C" }}>
                  {error}
                </div>
              )}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.5)" }}>New password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoFocus autoComplete="new-password" className="w-full rounded-lg px-4 py-2.5 text-[13.5px]" style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }} />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.5)" }}>Confirm password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" className="w-full rounded-lg px-4 py-2.5 text-[13.5px]" style={{ border: "1.5px solid rgba(51,51,51,0.15)", color: DARK, background: "#F3F2F0", outline: "none" }} />
              </div>
              <button type="submit" disabled={pending} className="w-full rounded-lg py-3 font-display font-bold text-[14px]" style={{ background: DARK, color: "white", opacity: pending ? 0.6 : 1, cursor: pending ? "not-allowed" : "pointer" }}>
                {pending ? "Saving…" : "Set new password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
