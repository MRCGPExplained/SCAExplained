"use client";

import { useState, useTransition } from "react";
import { changePasswordAction } from "./actions";

const DARK = "#333333";

export function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirm) {
      setMessage({ text: "Passwords don't match.", ok: false });
      return;
    }
    startTransition(async () => {
      const result = await changePasswordAction(newPassword);
      if (result.error) {
        setMessage({ text: result.error, ok: false });
      } else {
        setMessage({ text: "Password updated.", ok: true });
        setOpen(false);
        setNewPassword("");
        setConfirm("");
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl p-4 text-[14px] font-semibold text-left transition-colors"
        style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", color: "rgba(51,51,51,0.55)", cursor: "pointer" }}
      >
        Change password →
      </button>
    );
  }

  return (
    <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)" }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-4" style={{ color: "rgba(51,51,51,0.4)" }}>Change Password</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full rounded-lg px-4 py-2.5 text-[13.5px]"
          style={{ border: "1px solid rgba(51,51,51,0.15)", outline: "none", fontFamily: "inherit", color: DARK, background: "#F3F2FB" }}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full rounded-lg px-4 py-2.5 text-[13.5px]"
          style={{ border: "1px solid rgba(51,51,51,0.15)", outline: "none", fontFamily: "inherit", color: DARK, background: "#F3F2FB" }}
        />
        {message && (
          <p className="text-[12.5px]" style={{ color: message.ok ? "#16A34A" : "#B91C1C" }}>{message.text}</p>
        )}
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg px-4 py-2 text-[13px] font-semibold"
            style={{ background: DARK, color: "white", cursor: isPending ? "default" : "pointer", opacity: isPending ? 0.6 : 1 }}
          >
            {isPending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setMessage(null); setNewPassword(""); setConfirm(""); }}
            className="rounded-lg px-4 py-2 text-[13px] font-semibold"
            style={{ background: "rgba(51,51,51,0.07)", color: "rgba(51,51,51,0.6)", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
