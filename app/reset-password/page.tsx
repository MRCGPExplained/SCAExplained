"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { endOtherSessions } from "@/lib/single-session";

const DARK = "#333333";
const YELLOW = "#F6D44B";

/**
 * How long to wait for the recovery session before calling the link spent.
 *
 * The session is not there at mount. The browser client has to read the URL
 * the redirect arrived with and exchange it, which is a round trip, so
 * getSession() on the first tick says "no" for a link that is perfectly
 * good. onAuthStateChange fires when it lands; this is only the backstop for
 * when it never does.
 */
const SESSION_GRACE_MS = 4000;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  /** null while still waiting; true once a session arrived; false once not. */
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  // One client for the page. Two would each hold their own listener for the
  // same cookie-backed session, which is twice the work for one answer.
  const supabaseRef = useRef<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  if (!supabaseRef.current) supabaseRef.current = createSupabaseBrowserClient();
  const supabase = supabaseRef.current;

  /*
    Is this link still good?

    A recovery link works once. Opening it a second time — going back to the
    email after the first tab has already done its job, which is exactly what
    happened to a real user on 3 November — gets "Email link is invalid or
    has expired" from Supabase's /verify, and lands here with no session.

    Until now the form rendered anyway, so the reply to a careful new
    password was whatever updateUser said about a missing session. Asking
    first means the page can say the one useful thing instead: the link is
    spent, here is how to get another.
  */
  useEffect(() => {
    let settled = false;
    const arrive = (ok: boolean) => {
      if (settled) return;
      settled = true;
      setSignedIn(ok);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) arrive(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) arrive(true);
    });
    const timer = setTimeout(() => arrive(false), SESSION_GRACE_MS);

    return () => {
      settled = true;
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setPending(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (error) { setError(error.message); return; }

    /*
      A new password ends the old devices.

      Two reasons, and the ordinary one is the stronger. Changing a password
      is how someone responds to losing control of an account, and a reset
      that leaves every other signed-in device exactly where it was does not
      do the one thing it was reached for.

      The other is that this closes a hole in the one-device rule. Signing in
      through the login form ends other sessions (app/case-bank/actions.ts),
      and so does /auth/callback — but only when it is handed a code or a
      token_hash to act on. A recovery that arrives without either falls
      through both branches, so the reset path enforced nothing: an account
      could come out of it signed in on two machines at once, which is what
      was actually found on a live account before this was added.

      Not fatal if it fails, the same as everywhere else it is called. The
      password has already been changed by this point, and erroring here
      would tell someone their reset had not worked when it had.
    */
    await endOtherSessions(supabase);

    setDone(true);
    setTimeout(() => router.push("/login"), 2500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block no-underline">
            <span className="font-display font-extrabold text-[22px]" style={{ color: DARK }}>
              SCA <span style={{ color: YELLOW }}>Focus</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 4px 24px rgba(51,51,51,0.07)" }}>
          <h1 className="font-display font-bold text-[20px] mb-1" style={{ color: DARK }}>
            {signedIn === false && !done ? "This link has already been used" : "Choose a new password"}
          </h1>
          <p className="text-[13px] mb-6" style={{ color: "rgba(51,51,51,0.5)" }}>
            {signedIn === false && !done
              ? "A reset link only works once, and only for a little while."
              : "At least 6 characters."}
          </p>

          {signedIn === null && !done ? (
            <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.45)" }}>Checking your link…</p>
          ) : signedIn === false && !done ? (
            /*
              Deliberately not an error box. Nothing has gone wrong with the
              account and nothing the person did was a mistake — the link has
              simply been spent, usually by this same link having already
              worked in another tab. The only thing that helps is the next
              step, so that is what the panel is.
            */
            <div className="flex flex-col gap-4">
              <p className="text-[13px] m-0" style={{ color: "rgba(51,51,51,0.6)", lineHeight: 1.6 }}>
                If you opened the link twice, the first one may already have signed you in — try
                the sign-in page before asking for another.
              </p>
              <Link
                href="/forgot-password"
                className="w-full rounded-lg py-3 font-display font-bold text-[14px] text-center no-underline"
                style={{ background: DARK, color: "white" }}
              >
                Send me a new link
              </Link>
              <Link
                href="/login"
                className="text-[12.5px] text-center no-underline"
                style={{ color: "rgba(51,51,51,0.45)" }}
              >
                Back to sign in
              </Link>
            </div>
          ) : done ? (
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
