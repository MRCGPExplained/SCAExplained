"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import type { Highlight, HighlightColor } from "@/lib/case-bank-types";
import { HIGHLIGHT_COLORS } from "@/lib/case-bank-types";
import { createHighlightAction, deleteHighlightAction, getStationHighlightsAction } from "../actions";

const COLOR_ORDER: HighlightColor[] = ["red", "orange", "yellow", "green", "blue", "violet", "pink"];

type PickerState =
  | { mode: "create"; unitKey: string; start: number; end: number; x: number; y: number; overlappingIds: string[] }
  | { mode: "edit"; unitKey: string; highlightId: string; x: number; y: number }
  | null;

interface HighlightContextValue {
  getHighlights: (unitKey: string) => Highlight[];
  openCreatePicker: (unitKey: string, start: number, end: number, rect: DOMRect) => void;
  openEditPicker: (unitKey: string, highlightId: string, rect: DOMRect) => void;
}

const HighlightContext = createContext<HighlightContextValue | null>(null);

export function useHighlightContext() {
  return useContext(HighlightContext);
}

export function HighlightProvider({
  stationId,
  children,
}: {
  stationId: string;
  children: React.ReactNode;
}) {
  const [byUnit, setByUnit] = useState<Record<string, Highlight[]>>({});
  const [lastColor, setLastColor] = useState<HighlightColor>("yellow");
  const [picker, setPicker] = useState<PickerState>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getStationHighlightsAction(stationId).then(({ highlights, lastColor: last }) => {
      const map: Record<string, Highlight[]> = {};
      for (const h of highlights) {
        if (!map[h.container_key]) map[h.container_key] = [];
        map[h.container_key].push(h);
      }
      setByUnit(map);
      setLastColor(last);
    });
  }, [stationId]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPicker(null);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setPicker(null);
    }
    if (picker) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [picker]);

  const getHighlights = useCallback((unitKey: string) => byUnit[unitKey] ?? [], [byUnit]);

  const openCreatePicker = useCallback(
    (unitKey: string, start: number, end: number, rect: DOMRect) => {
      const existing = byUnit[unitKey] ?? [];
      const overlapping = existing.filter((h) => h.start_offset < end && h.end_offset > start);
      setPicker({
        mode: "create",
        unitKey,
        start,
        end,
        x: rect.left + rect.width / 2,
        y: rect.top,
        overlappingIds: overlapping.map((h) => h.id),
      });
    },
    [byUnit]
  );

  const openEditPicker = useCallback((unitKey: string, highlightId: string, rect: DOMRect) => {
    setPicker({
      mode: "edit",
      unitKey,
      highlightId,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }, []);

  async function handlePickColor(color: HighlightColor) {
    if (!picker) return;
    window.getSelection()?.removeAllRanges();

    if (picker.mode === "create") {
      const { unitKey, start, end, overlappingIds } = picker;
      setByUnit((prev) => ({
        ...prev,
        [unitKey]: (prev[unitKey] ?? []).filter((h) => !overlappingIds.includes(h.id)),
      }));
      for (const id of overlappingIds) deleteHighlightAction(id);

      const result = await createHighlightAction(stationId, unitKey, start, end, color);
      if (result.id) {
        setByUnit((prev) => ({
          ...prev,
          [unitKey]: [
            ...(prev[unitKey] ?? []),
            { id: result.id!, container_key: unitKey, start_offset: start, end_offset: end, color },
          ],
        }));
      }
      setLastColor(color);
    } else {
      const { unitKey, highlightId } = picker;
      const existing = (byUnit[unitKey] ?? []).find((h) => h.id === highlightId);
      if (!existing) {
        setPicker(null);
        return;
      }
      setByUnit((prev) => ({
        ...prev,
        [unitKey]: (prev[unitKey] ?? []).map((h) => (h.id === highlightId ? { ...h, color } : h)),
      }));
      await deleteHighlightAction(highlightId);
      const result = await createHighlightAction(stationId, unitKey, existing.start_offset, existing.end_offset, color);
      if (result.id) {
        setByUnit((prev) => ({
          ...prev,
          [unitKey]: (prev[unitKey] ?? []).map((h) => (h.id === highlightId ? { ...h, id: result.id! } : h)),
        }));
      }
      setLastColor(color);
    }
    setPicker(null);
  }

  async function handleRemove() {
    if (!picker) return;
    if (picker.mode === "create") {
      const { unitKey, overlappingIds } = picker;
      if (overlappingIds.length === 0) {
        setPicker(null);
        return;
      }
      setByUnit((prev) => ({
        ...prev,
        [unitKey]: (prev[unitKey] ?? []).filter((h) => !overlappingIds.includes(h.id)),
      }));
      for (const id of overlappingIds) deleteHighlightAction(id);
    } else {
      const { unitKey, highlightId } = picker;
      setByUnit((prev) => ({
        ...prev,
        [unitKey]: (prev[unitKey] ?? []).filter((h) => h.id !== highlightId),
      }));
      await deleteHighlightAction(highlightId);
    }
    window.getSelection()?.removeAllRanges();
    setPicker(null);
  }

  const showRemove = picker?.mode === "edit" || (picker?.mode === "create" && picker.overlappingIds.length > 0);

  return (
    <HighlightContext.Provider value={{ getHighlights, openCreatePicker, openEditPicker }}>
      {children}
      {picker && (
        <div
          ref={pickerRef}
          className="fixed z-50 flex items-center gap-1.5 rounded-full px-2.5 py-2 shadow-lg"
          style={{
            left: picker.x,
            top: picker.y - 46,
            transform: "translateX(-50%)",
            background: "white",
            border: "1px solid rgba(26,27,82,0.12)",
          }}
        >
          {COLOR_ORDER.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handlePickColor(color)}
              className="w-5 h-5 rounded-full transition-transform hover:scale-125"
              style={{
                background: HIGHLIGHT_COLORS[color],
                border: color === lastColor ? "2px solid rgba(26,27,82,0.55)" : "1px solid rgba(26,27,82,0.15)",
                cursor: "pointer",
              }}
              aria-label={`Highlight ${color}`}
            />
          ))}
          {showRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="ml-1 w-5 h-5 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
              style={{ background: "rgba(26,27,82,0.08)", border: "none", cursor: "pointer", color: "rgba(26,27,82,0.6)" }}
              aria-label="Remove highlight"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      )}
    </HighlightContext.Provider>
  );
}

function getOffsetWithin(container: Node, node: Node, offset: number): number {
  const range = document.createRange();
  range.selectNodeContents(container);
  try {
    range.setEnd(node, offset);
  } catch {
    return 0;
  }
  return range.toString().length;
}

export function Highlightable({
  unitKey,
  text,
  className,
  style,
}: {
  unitKey: string;
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ctx = useHighlightContext();
  const containerRef = useRef<HTMLSpanElement>(null);

  if (!ctx) return <span className={className} style={style}>{text}</span>;

  const highlights = ctx.getHighlights(unitKey);

  function handleMouseUp() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed || !containerRef.current) return;
    const range = sel.getRangeAt(0);
    if (!containerRef.current.contains(range.commonAncestorContainer)) return;

    const start = getOffsetWithin(containerRef.current, range.startContainer, range.startOffset);
    const end = getOffsetWithin(containerRef.current, range.endContainer, range.endOffset);
    if (start === end) return;

    const rect = range.getBoundingClientRect();
    ctx!.openCreatePicker(unitKey, Math.min(start, end), Math.max(start, end), rect);
  }

  const sorted = [...highlights].sort((a, b) => a.start_offset - b.start_offset);
  const segments: { text: string; highlight: Highlight | null }[] = [];
  let cursor = 0;
  for (const h of sorted) {
    const s = Math.max(0, Math.min(h.start_offset, text.length));
    const e = Math.max(0, Math.min(h.end_offset, text.length));
    if (s > cursor) segments.push({ text: text.slice(cursor, s), highlight: null });
    if (e > s) segments.push({ text: text.slice(s, e), highlight: h });
    cursor = Math.max(cursor, e);
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlight: null });

  return (
    <span ref={containerRef} onMouseUp={handleMouseUp} className={className} style={{ ...style, cursor: "text" }}>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              ctx!.openEditPicker(unitKey, seg.highlight!.id, rect);
            }}
            style={{
              background: HIGHLIGHT_COLORS[seg.highlight.color],
              color: "inherit",
              borderRadius: "2px",
              padding: "0 1px",
              cursor: "pointer",
            }}
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </span>
  );
}
