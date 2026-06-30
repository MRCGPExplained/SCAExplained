"use client";

import { deleteEvent } from "./actions";

export function DeleteButton({ id, label }: { id: string; label: string }) {
  async function handleDelete() {
    if (!confirm(`Delete "${label}"? This also deletes all its bookings and cannot be undone.`)) return;
    const result = await deleteEvent(id);
    if (result.error) alert(`Error: ${result.error}`);
    else window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-[12px] font-semibold text-red-600/70 hover:text-red-600 transition"
    >
      Delete
    </button>
  );
}
