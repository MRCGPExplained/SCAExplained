"use client";

import { useState, useEffect, useRef } from "react";
import { saveNotesAction } from "../actions";

const NAVY = "#1A1B52";

export function NotesPanel({
  stationId,
  initialContent,
}: {
  stationId: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (content === initialContent) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      /*
        The result is checked, which it was not before.

        saveNotesAction returns { error } rather than throwing, as every
        supabase-js call in this project does, so awaiting it and then setting
        "Saved ✓" announced success whatever came back. That mattered more
        than it looks: the station_notes table does not exist, so every save
        this panel has ever attempted has failed, and the panel said it had
        saved each time.

        Nobody has seen it, because nothing mounts this component. If anything
        ever does, it now says what happened.
      */
      const res = await saveNotesAction(stationId, content);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setError(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content, stationId, initialContent]);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)" }}
    >
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(26,27,82,0.08)" }}
      >
        <span
          className="text-[11px] font-bold uppercase tracking-[0.06em]"
          style={{ color: NAVY }}
        >
          My Notes
        </span>
        <span className="text-[10px]" style={{ color: "rgba(26,27,82,0.35)" }}>
          Private to you
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Your notes: visible only to you, even in a study group…"
        className="w-full min-h-[200px] px-4 py-3.5 text-[13px] leading-relaxed resize-y"
        style={{
          border: "none",
          outline: "none",
          color: "rgba(26,27,82,0.8)",
          background: "white",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      />

      {(content || saved || error) && (
        <div
          className="px-4 pb-2.5 text-[10px]"
          style={{ color: error ? "#B91C1C" : saved ? "#22C55E" : "rgba(26,27,82,0.35)" }}
        >
          {error ? `Not saved: ${error}` : saved ? "Saved ✓" : "Auto-saved"}
        </div>
      )}
    </div>
  );
}
