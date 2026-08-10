"use client";

import { createContext, useContext, useState, type ReactNode, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { updateStationFieldAction, type EditableField as EditableFieldName } from "../inline-edit-actions";

// ── Admin-edit context ──────────────────────────────────────────────────────
// Wrap the case page's content in <AdminEditProvider> once; every EditableField
// below it can then show its pencil (or not, for regular subscribers) without
// threading isAdmin through every intermediate component.

interface AdminEditCtx {
  isAdmin: boolean;
  stationId: string;
}

const AdminEditContext = createContext<AdminEditCtx>({ isAdmin: false, stationId: "" });

export function AdminEditProvider({
  isAdmin,
  stationId,
  children,
}: {
  isAdmin: boolean;
  stationId: string;
  children: ReactNode;
}) {
  return <AdminEditContext.Provider value={{ isAdmin, stationId }}>{children}</AdminEditContext.Provider>;
}

function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function PencilButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Edit (admin only)"
      className="absolute -top-2 -right-2 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm"
      style={{ width: 22, height: 22, background: "#2563EB", color: "white", border: "none", cursor: "pointer", zIndex: 5 }}
    >
      <PencilIcon />
    </button>
  );
}

const editorBoxStyle: CSSProperties = {
  border: "1.5px solid #2563EB",
  borderRadius: 8,
  background: "rgba(37,99,235,0.05)",
};

function SaveCancelRow({
  saving,
  onSave,
  onCancel,
}: {
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={saving}
        onClick={onSave}
        className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white"
        style={{ background: "#2563EB", opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer", border: "none" }}
      >
        {saving ? "Saving…" : "Save"}
      </button>
      <button
        type="button"
        disabled={saving}
        onClick={onCancel}
        className="px-3 py-1.5 rounded-md text-[12px] font-semibold"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.6)", cursor: saving ? "not-allowed" : "pointer", border: "none" }}
      >
        Cancel
      </button>
    </div>
  );
}

// ── Text / one-per-line field ────────────────────────────────────────────────
// `value` is a plain string for a "text" field, or a string[] for a "lines"
// field (edited one item per line, exactly like the admin form's ArrayField).

export function EditableField({
  field,
  value,
  children,
}: {
  field: EditableFieldName;
  value: string | string[];
  children: ReactNode;
}) {
  const { isAdmin, stationId } = useContext(AdminEditContext);
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  if (!isAdmin) return <>{children}</>;

  const isLines = Array.isArray(value);
  const raw = isLines ? value.join("\n") : value;

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-lg p-2" style={editorBoxStyle}>
        {errorMsg && <p className="text-[12px] text-red-600 m-0">{errorMsg}</p>}
        <textarea
          autoFocus
          defaultValue={raw}
          onChange={(e) => setDraft(e.target.value)}
          rows={isLines ? Math.max(4, raw.split("\n").length + 1) : 4}
          className="w-full px-2.5 py-2 rounded-md border border-black/10 text-[14px] bg-white outline-none focus:border-blue-500 transition"
          style={{ color: "#1a1a1a" }}
        />
        <SaveCancelRow
          saving={saving}
          onCancel={() => {
            setEditing(false);
            setErrorMsg(null);
          }}
          onSave={async () => {
            setSaving(true);
            setErrorMsg(null);
            const res = await updateStationFieldAction(stationId, field, draft || raw);
            setSaving(false);
            if (res.error) {
              setErrorMsg(res.error);
              return;
            }
            setEditing(false);
            router.refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="group relative">
      {children}
      <PencilButton onClick={() => setEditing(true)} />
    </div>
  );
}

// ── Trainer Q&A pair editor ──────────────────────────────────────────────────

export type QAPair = { question: string; answer: string };

export function QAEditableField({ value, children }: { value: QAPair[]; children: ReactNode }) {
  const { isAdmin, stationId } = useContext(AdminEditContext);
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [rows, setRows] = useState<QAPair[]>(value);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAdmin) return <>{children}</>;

  if (!editing) {
    return (
      <div className="group relative">
        {children}
        <PencilButton
          onClick={() => {
            setRows(value);
            setEditing(true);
          }}
        />
      </div>
    );
  }

  const update = (i: number, patch: Partial<QAPair>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setRows([...rows, { question: "", answer: "" }]);
  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-3 rounded-lg p-3" style={editorBoxStyle}>
      {errorMsg && <p className="text-[12px] text-red-600 m-0">{errorMsg}</p>}
      {rows.length === 0 && <p className="text-[12px] text-black/40 m-0">No questions yet.</p>}
      {rows.map((r, i) => (
        <div key={i} className="rounded-md p-2.5 bg-white border border-black/10 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wide text-black/40">Q&amp;A #{i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-[11px] font-medium text-red-600/70"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Remove
            </button>
          </div>
          <input
            value={r.question}
            onChange={(e) => update(i, { question: e.target.value })}
            placeholder="Question"
            className="w-full px-2.5 py-1.5 rounded-md border border-black/10 text-[13px] outline-none focus:border-blue-500"
          />
          <textarea
            value={r.answer}
            onChange={(e) => update(i, { answer: e.target.value })}
            placeholder="Answer"
            rows={2}
            className="w-full px-2.5 py-1.5 rounded-md border border-black/10 text-[13px] outline-none focus:border-blue-500"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start px-3 py-1.5 rounded-md text-[12px] font-semibold"
        style={{ background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer" }}
      >
        + Add Q&amp;A
      </button>
      <SaveCancelRow
        saving={saving}
        onCancel={() => setEditing(false)}
        onSave={async () => {
          setSaving(true);
          setErrorMsg(null);
          const res = await updateStationFieldAction(stationId, "trainer_qa", JSON.stringify(rows));
          setSaving(false);
          if (res.error) {
            setErrorMsg(res.error);
            return;
          }
          setEditing(false);
          router.refresh();
        }}
      />
    </div>
  );
}
