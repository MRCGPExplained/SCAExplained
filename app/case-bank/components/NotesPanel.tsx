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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (content === initialContent) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      await saveNotesAction(stationId, content);
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
        placeholder="Your notes — visible only to you, even in a study room…"
        className="w-full min-h-[200px] px-4 py-3.5 text-[13px] leading-relaxed resize-y"
        style={{
          border: "none",
          outline: "none",
          color: "rgba(26,27,82,0.8)",
          background: "white",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      />

      {(content || saved) && (
        <div
          className="px-4 pb-2.5 text-[10px]"
          style={{ color: saved ? "#22C55E" : "rgba(26,27,82,0.35)" }}
        >
          {saved ? "Saved ✓" : "Auto-saved"}
        </div>
      )}
    </div>
  );
}
