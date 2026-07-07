"use client";

import { useState, useTransition } from "react";
import { addBetaUserAction, removeBetaUserAction } from "../actions";
import type { BetaUser } from "./page";

export default function BetaUsersClient({ users }: { users: BetaUser[] }) {
  const [addError, setAddError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setAddError("");
    startTransition(async () => {
      const result = await addBetaUserAction(undefined, fd);
      if (result?.error) { setAddError(result.error); } else { window.location.reload(); }
    });
  }

  function handleRemove(id: string) {
    if (!confirm("Remove this user from beta access?")) return;
    startTransition(async () => {
      const result = await removeBetaUserAction(id);
      if (result?.error) alert(`Error: ${result.error}`);
      else window.location.reload();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-navy">Beta Users</h1>
          <p className="text-[13px] text-navy/50 mt-0.5">
            {users.length} user{users.length !== 1 ? "s" : ""} with beta access
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-navy/10 bg-white p-6 mb-6 max-w-[560px]">
        <h2 className="font-semibold text-[15px] text-navy mb-4">Add Beta User</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="user@example.com"
              className="w-full border border-navy/20 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-navy/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Note <span className="normal-case font-normal">(optional)</span></label>
            <input
              name="note"
              type="text"
              placeholder="e.g. testing recorded consultations"
              className="w-full border border-navy/20 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-navy/50"
            />
          </div>
          {addError && <p className="text-[13px] text-red-600">{addError}</p>}
          <div>
            <button
              type="submit"
              disabled={isPending}
              className="bg-navy text-white text-[13px] font-semibold px-5 py-2 rounded-lg hover:bg-[#F6D44B] hover:text-[#333333] transition disabled:opacity-50"
            >
              {isPending ? "Adding…" : "Add User"}
            </button>
          </div>
        </form>
      </div>

      {users.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
          <p className="text-[14px] text-navy/50">No beta users yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-navy/10 bg-white overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-navy/10 bg-navy/[0.03]">
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Email</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Note</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Added</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={i < users.length - 1 ? "border-b border-navy/[0.06]" : ""}>
                  <td className="px-5 py-3 font-semibold text-navy">
                    <span>{u.email}</span>
                    {!u.user_id && (
                      <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full align-middle" style={{ background: "rgba(51,51,51,0.08)", color: "rgba(51,51,51,0.45)" }}>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-navy/50 text-[12px]">{u.note ?? "—"}</td>
                  <td className="px-5 py-3 text-navy/40 text-[12px] whitespace-nowrap">
                    {new Date(u.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleRemove(u.id)}
                      disabled={isPending}
                      className="text-[12px] font-semibold text-red-600/70 hover:text-red-600 transition disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
