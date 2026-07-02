"use client";

import { Fragment, useState, useTransition } from "react";
import {
  createCaseBankUser,
  grantUserAccess,
  revokeUserAccess,
  deleteCaseBankUser,
} from "../actions";

type UserAccess = {
  has_video_course: boolean;
  has_case_bank: boolean;
  expires_at: string;
} | null;

export type CaseBankUser = {
  id: string;
  email: string;
  created_at: string;
  profile: { id: string; display_name: string; initials: string } | null;
  access: UserAccess;
};

function defaultExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toISOString().slice(0, 10);
}

function AccessBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${active ? "bg-green-50 text-green-700" : "bg-navy/10 text-navy/40"}`}
    >
      {active ? label : "—"}
    </span>
  );
}

export default function CaseBankUsersClient({ users }: { users: CaseBankUser[] }) {
  const [showCreate, setShowCreate] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createLoading, startCreate] = useTransition();
  const [openGrant, setOpenGrant] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const now = new Date().toISOString();
  const activeCount = users.filter(
    (u) => u.access && u.access.expires_at > now && (u.access.has_video_course || u.access.has_case_bank)
  ).length;

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setCreateError("");
    startCreate(async () => {
      const result = await createCaseBankUser(undefined, fd);
      if (result?.error) {
        setCreateError(result.error);
      } else {
        setShowCreate(false);
        window.location.reload();
      }
    });
  }

  function handleGrant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const userId = fd.get("user_id") as string;
    startTransition(async () => {
      const result = await grantUserAccess(undefined, fd);
      if (result?.error) {
        alert(`Error: ${result.error}`);
      } else {
        setOpenGrant(null);
        window.location.reload();
      }
    });
  }

  function handleRevoke(userId: string) {
    if (!confirm("Remove all access for this user?")) return;
    startTransition(async () => {
      const result = await revokeUserAccess(userId);
      if (result?.error) alert(`Error: ${result.error}`);
      else window.location.reload();
    });
  }

  function handleDelete(userId: string, email: string) {
    if (!confirm(`Permanently delete "${email}" and all their data?\n\nThis removes their account, notes, stars, progress and cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteCaseBankUser(userId);
      if (result?.error) alert(`Error: ${result.error}`);
      else window.location.reload();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-navy">Case Bank Users</h1>
          <p className="text-[13px] text-navy/50 mt-0.5">
            {users.length} registered · {activeCount} with active access
          </p>
        </div>
        <button
          onClick={() => { setShowCreate((v) => !v); setCreateError(""); }}
          className="bg-navy text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-navy/90 transition"
        >
          {showCreate ? "Cancel" : "+ Create User"}
        </button>
      </div>

      {showCreate && (
        <div className="rounded-2xl border border-navy/10 bg-white p-6 mb-6">
          <h2 className="font-semibold text-[15px] text-navy mb-4">Create Case Bank User</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Email</label>
              <input name="email" type="email" required autoComplete="off" className="w-full border border-navy/20 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-navy/50" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Temporary Password</label>
              <input name="password" type="text" required minLength={8} autoComplete="new-password" placeholder="Min 8 characters" className="w-full border border-navy/20 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-navy/50" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Display Name</label>
              <input name="display_name" type="text" required placeholder="e.g. Sarah Johnson" className="w-full border border-navy/20 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-navy/50" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Initials (2 chars)</label>
              <input name="initials" type="text" required maxLength={2} placeholder="e.g. SJ" className="w-full border border-navy/20 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-navy/50" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Access Expires</label>
              <input name="expires_at" type="date" defaultValue={defaultExpiry()} className="w-full border border-navy/20 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-navy/50" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-[13px] text-navy cursor-pointer">
                <input name="grant_access" type="checkbox" value="true" defaultChecked className="rounded" />
                Grant case bank access on creation
              </label>
            </div>
            {createError && <p className="col-span-2 text-[13px] text-red-600">{createError}</p>}
            <div className="col-span-2 flex justify-end">
              <button type="submit" disabled={createLoading} className="bg-navy text-white text-[13px] font-semibold px-5 py-2 rounded-lg hover:bg-navy/90 transition disabled:opacity-50">
                {createLoading ? "Creating…" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {users.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
          <p className="text-[14px] text-navy/50">No case bank users yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-navy/10 bg-white overflow-x-auto">
          <table className="w-full text-[13px] min-w-[900px]">
            <thead>
              <tr className="border-b border-navy/10 bg-navy/[0.03]">
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">User</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Email</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Joined</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Video Course</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Case Bank</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Expires</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                const isGrantOpen = openGrant === user.id;
                const isLast = i === users.length - 1;
                const rowBorder = !isLast || isGrantOpen ? "border-b border-navy/[0.06]" : "";
                const accessActive = user.access && user.access.expires_at > now;
                const hasVideo = accessActive && user.access!.has_video_course;
                const hasCaseBank = accessActive && user.access!.has_case_bank;

                return (
                  <Fragment key={user.id}>
                    <tr className={rowBorder}>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {user.profile ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                              {user.profile.initials}
                            </div>
                            <span className="font-semibold text-navy">{user.profile.display_name}</span>
                          </div>
                        ) : (
                          <span className="text-navy/40 italic text-[12px]">No profile</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-navy/70">
                        <a href={`mailto:${user.email}`} className="no-underline hover:underline text-navy/70">{user.email}</a>
                      </td>
                      <td className="px-5 py-3 text-navy/50 whitespace-nowrap text-[12px]">
                        {new Date(user.created_at).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-5 py-3">
                        <AccessBadge active={!!hasVideo} label="Active" />
                      </td>
                      <td className="px-5 py-3">
                        <AccessBadge active={!!hasCaseBank} label="Active" />
                      </td>
                      <td className="px-5 py-3 text-navy/50 text-[12px] whitespace-nowrap">
                        {user.access ? new Date(user.access.expires_at).toLocaleDateString("en-GB") : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setOpenGrant(isGrantOpen ? null : user.id)}
                            className="text-[12px] font-semibold text-navy/60 hover:text-navy transition"
                          >
                            Grant Access
                          </button>
                          {user.access && (
                            <button
                              onClick={() => handleRevoke(user.id)}
                              disabled={isPending}
                              className="text-[12px] font-semibold text-orange-600/70 hover:text-orange-600 transition disabled:opacity-40"
                            >
                              Revoke
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user.id, user.email)}
                            disabled={isPending}
                            className="text-[12px] font-semibold text-red-600/70 hover:text-red-600 transition disabled:opacity-40"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isGrantOpen && (
                      <tr className={!isLast ? "border-b border-navy/[0.06]" : ""}>
                        <td colSpan={7} className="px-5 py-3 bg-navy/[0.02]">
                          <form onSubmit={handleGrant} className="flex items-end gap-3 flex-wrap">
                            <input type="hidden" name="user_id" value={user.id} />
                            <div>
                              <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Product</label>
                              <select name="product" className="border border-navy/20 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-navy/50">
                                <option value="case_bank">Case Bank</option>
                                <option value="video_course">Video Course</option>
                                <option value="bundle">Both (Bundle)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wide mb-1">Expires</label>
                              <input
                                name="expires_at"
                                type="date"
                                required
                                defaultValue={user.access ? user.access.expires_at.slice(0, 10) : defaultExpiry()}
                                className="border border-navy/20 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-navy/50"
                              />
                            </div>
                            <button type="submit" disabled={isPending} className="bg-navy text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-navy/90 transition disabled:opacity-50">
                              Grant
                            </button>
                            <button type="button" onClick={() => setOpenGrant(null)} className="text-[12px] text-navy/40 hover:text-navy/70 transition">
                              Cancel
                            </button>
                          </form>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
