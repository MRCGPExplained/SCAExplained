"use client";

import { useActionState, useTransition } from "react";
import { createWebinarCodeAction, toggleWebinarCodeAction, deleteWebinarCodeAction } from "./actions";

export type WebinarCode = {
  id: string;
  code: string;
  label: string;
  active: boolean;
  access_days: number;
  use_count: number;
  created_at: string;
};

export default function WebinarCodesClient({ codes }: { codes: WebinarCode[] }) {
  const [state, formAction, pending] = useActionState(createWebinarCodeAction, {});
  const [isPending, startTransition] = useTransition();

  function handleToggle(id: string, active: boolean) {
    startTransition(async () => {
      const res = await toggleWebinarCodeAction(id, !active);
      if (res?.error) alert(res.error);
      else window.location.reload();
    });
  }

  function handleDelete(id: string, code: string) {
    if (!confirm(`Delete code "${code}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteWebinarCodeAction(id);
      window.location.reload();
    });
  }

  return (
    <div className="flex flex-col gap-8 max-w-[800px]">

      {/* Existing codes */}
      {codes.length === 0 ? (
        <p className="text-[13px] text-navy/40">No codes yet.</p>
      ) : (
        <div className="rounded-2xl border border-navy/10 bg-white overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-navy/10 bg-navy/[0.03]">
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-navy/50">Code</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-navy/50">Label</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-navy/50">Access</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-navy/50">Uses</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-navy/50">Status</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-navy/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c, i) => (
                <tr key={c.id} className={i < codes.length - 1 ? "border-b border-navy/[0.06]" : ""}>
                  <td className="px-5 py-3">
                    <span className="font-mono font-bold text-[14px] text-navy tracking-widest">{c.code}</span>
                  </td>
                  <td className="px-5 py-3 text-navy/70">{c.label}</td>
                  <td className="px-5 py-3 text-navy/60">{c.access_days} days</td>
                  <td className="px-5 py-3 text-navy/60 font-mono">{c.use_count}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggle(c.id, c.active)}
                      disabled={isPending}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition disabled:opacity-40 ${c.active ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-navy/10 text-navy/40 hover:bg-navy/20"}`}
                    >
                      {c.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      disabled={isPending}
                      className="text-[12px] font-semibold text-red-600/70 hover:text-red-600 transition disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create form */}
      <div>
        <h2 className="font-display font-bold text-[16px] text-navy mb-3">Create a code</h2>
        <form action={formAction} className="rounded-2xl border border-navy/10 bg-white p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-navy/55">Label</label>
              <input name="label" type="text" required placeholder="e.g. July 2026 Webinar" className="field" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-navy/55">Access Days</label>
              <input name="access_days" type="number" defaultValue="30" min="1" max="365" className="field" />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2 max-sm:col-span-1">
              <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-navy/55">Custom Code <span className="font-normal normal-case">(optional — leave blank to auto-generate)</span></label>
              <input name="code" type="text" placeholder="e.g. JULY2026" className="field uppercase" style={{ textTransform: "uppercase" }} />
            </div>
          </div>

          {state && "error" in state && state.error && (
            <p className="text-[13px] text-red-600">{state.error}</p>
          )}
          {state && "code" in state && state.code && (
            <div className="rounded-lg px-4 py-3 text-[13px]" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#15803d" }}>
              Code created: <span className="font-mono font-bold tracking-widest">{state.code as string}</span>
            </div>
          )}

          <button type="submit" disabled={pending} className="bg-navy text-white text-[14px] font-bold px-5 py-2.5 rounded-xl hover:bg-[#F6D44B] hover:text-[#333333] transition disabled:opacity-60 self-start">
            {pending ? "Creating…" : "Create Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
