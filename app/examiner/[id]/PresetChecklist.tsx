"use client";

import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import { saveExaminerPresetsAction } from "../actions";
import { TONE, presetId, type ExaminerPreset, type PresetField, type Tone } from "@/lib/examiner-presets";
import { MAX_PRESETS_PER_FIELD } from "@/lib/examiner-presets-store";

/**
 * The colour of an unreviewed AI comment.
 *
 * Violet because the two colours already on these boxes are taken: green
 * is Did Well and amber is Could Improve, so an amber marker on an amber
 * box read as part of the tone rather than as a warning about the text.
 * This belongs to no half, which is the point.
 */
const AI_MARK = "#6D28D9";

const NAVY = "#333333";

/** Ticked preset id to the comment typed against it, which may be "". */
export type PresetSelection = Record<string, string>;

/**
 * A box as tall as what is in it.
 *
 * A textarea rather than an input, because an input is one line high and
 * nothing typed here is one line. The longest default preset is 95
 * characters, and a dictated detail is a spoken sentence — in this rail both
 * are three lines, and an input would show the middle of one with each end
 * scrolled out of sight.
 *
 * Enter makes a new line, and a pasted one is kept. A long phrase is easier
 * to read broken where you chose to break it than reflowed to the box, and
 * that is the examiner's call to make while they are writing.
 *
 * It is only a line break on the way OUT that would cause trouble: notes
 * reach the copy-editor one observation per line. That is handled once, at
 * the join — see oneLine in ExaminerReviewClient — rather than by refusing
 * the key here, which is the difference between a constraint the data has
 * and a constraint the typist has.
 *
 * resize and overflow are forced here rather than left to the caller's
 * classes. Without overflow hidden, scrollHeight reports the visible box and
 * the measurement below never grows; it is not a style choice, so it is not
 * the caller's to get wrong.
 */
function GrowingInput({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  style,
  dictate,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Marks the box for the dictation listener on the notepad container. */
  dictate?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Collapse first, or scrollHeight reports the box at its old height and
    // deleting a line would never shrink it. Same as NoteBox.
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      {...(dictate ? { "data-dictate": true } : {})}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      style={{ ...style, resize: "none", overflow: "hidden", fontFamily: "inherit" }}
    />
  );
}

/**
 * The tick list under a Did Well or Could Improve box.
 *
 * NOT TWO COLUMNS, and that is a departure from the screenshot this came
 * from. That form is full page width; this lives in the writing column
 * beside the marking — 360px when this was written, half the page now — and
 * "Offer the plan as a question rather than a statement, so shared decision
 * making is obvious" still does not want to share its line with a text box.
 * So the comment sits under its phrase instead, and only once the phrase is
 * ticked — which also keeps eight presets to eight lines until the examiner
 * actually starts using them.
 *
 * The free-text box the examiner already had stays where it was, below this.
 * This is an addition to it and not a replacement: the presets are for what
 * recurs, the box is for what does not.
 */
export const PresetChecklist = memo(function PresetChecklist({
  field,
  label,
  presets,
  selection,
  onSelectionChange,
  onPresetsChange,
  disabled,
  tone,
  collapsed,
  aiFilled,
}: {
  field: PresetField;
  label: string;
  presets: ExaminerPreset[];
  selection: PresetSelection;
  /*
    Both callbacks take the field back, which the parent already knows and
    this component is already holding.

    It reads like redundancy and it is the thing that makes memo possible.
    The caller used to close over the field — onSelectionChange={(s) =>
    onPickedChange(d.wellField, s)} — which is a new function on every
    render, so six tick lists of eight rows each rebuilt on every character
    typed into a note box above them. Handed the field back, the caller can
    pass one stable handler to all six.
  */
  onSelectionChange: (field: PresetField, next: PresetSelection) => void;
  onPresetsChange: (field: PresetField, next: ExaminerPreset[]) => void;
  disabled?: boolean;
  /** Which half of the notepad this is, for the wash on its boxes. */
  tone: Tone;
  /** Presets are hidden for this examiner. The heading still belongs to the
   *  box below it, so only the list goes. */
  collapsed?: boolean;
  /**
   * What the AI wrote against each ticked phrase, by preset id.
   *
   * The text rather than a flag, so "still unedited" is a comparison with
   * what is in the box right now. Nothing has to tell this component that an
   * edit happened; the next render simply stops matching.
   *
   * Keyed by id rather than scoped to this field because ids already carry
   * their field, and one map for all six lists is one object identity to
   * keep stable rather than six.
   */
  aiFilled?: Record<string, string>;
}) {
  const [editing, setEditing] = useState(false);

  /*
    Counted against the live list, not against the selection, which is the
    same filter the conversion uses — a tick whose preset has since been
    deleted contributes nothing to the report, so it is not reported here as
    if it did.
  */
  const tickedHere = presets.filter((p) => p.id in selection).length;

  function toggle(id: string) {
    const next = { ...selection };
    if (id in next) delete next[id];
    else next[id] = "";
    onSelectionChange(field, next);
  }

  function setComment(id: string, comment: string) {
    onSelectionChange(field, { ...selection, [id]: comment });
  }

  /*
    Hidden, but not silent.

    The heading stays, because it names the box underneath and without it the
    rail is six unlabelled text areas. And if anything is still ticked it
    says so: those phrases go into the report whether or not the list that
    produced them is on screen, and input you cannot see is worse than
    clutter. Nothing to say when nothing is ticked, which is the case for an
    examiner who has hidden these because they never use them.
  */
  if (collapsed) {
    return (
      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>
          {label}
        </span>
        {tickedHere > 0 && (
          <span className="text-[10px]" style={{ color: "rgba(51,51,51,0.35)" }}>
            · {tickedHere} ticked
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.4)" }}>
          {label}
        </span>
        {!disabled && (
          /* Faint on purpose. It is a thing you reach for now and then, not
             part of marking a consultation. */
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-[10px]"
            style={{ background: "none", border: "none", color: "rgba(51,51,51,0.35)", cursor: "pointer", textDecoration: "underline" }}
          >
            Edit presets
          </button>
        )}
      </div>

      {presets.length === 0 ? (
        <p className="text-[11px] italic m-0 mb-1.5" style={{ color: "rgba(51,51,51,0.3)" }}>
          No presets yet.
        </p>
      ) : (
        <div className="flex flex-col gap-0.5 mb-1.5">
          {presets.map((preset) => {
            const ticked = preset.id in selection;
            return (
              <div key={preset.id}>
                <label className="flex items-start gap-2 cursor-pointer" style={{ cursor: disabled ? "default" : "pointer" }}>
                  <input
                    type="checkbox"
                    checked={ticked}
                    disabled={disabled}
                    onChange={() => toggle(preset.id)}
                    style={{ marginTop: 3, accentColor: NAVY, flexShrink: 0 }}
                  />
                  {/* pre-wrap, because a preset may have been written across
                      two lines on purpose. Collapsing it here would show the
                      author something other than what they saved, and show it
                      differently again the next time they opened the editor. */}
                  <span className="text-[12px] leading-snug" style={{ color: ticked ? NAVY : "rgba(51,51,51,0.6)", whiteSpace: "pre-wrap" }}>
                    {preset.text}
                  </span>
                </label>
                {ticked && aiFilled?.[preset.id] !== undefined && aiFilled[preset.id] === (selection[preset.id] ?? "") && (
                  /*
                    The marker that does the actual work of keeping this
                    honest. It sits against the text rather than in a dialog
                    nobody reads by their fifth review, and it goes the
                    moment the examiner types into the box below, so what is
                    still marked at the end is exactly what nobody checked.
                  */
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.05em] mt-1"
                    style={{ marginLeft: 22, color: AI_MARK }}
                  >
                    AI wrote this — check it
                  </div>
                )}
                {ticked && (
                  <GrowingInput
                    // Dictation is handled by one listener on the notepad's
                    // container, which finds its target by this attribute —
                    // so these boxes get it without being wired for it,
                    // which they could not be: they do not exist until the
                    // box above them is ticked.
                    dictate
                    value={selection[preset.id] ?? ""}
                    disabled={disabled}
                    onChange={(v) => setComment(preset.id, v)}
                    placeholder="Add detail (optional)…"
                    className="rounded-md px-2 py-1 text-[11.5px] mt-1 mb-1"
                    style={{
                      marginLeft: 22,
                      width: "calc(100% - 22px)",
                      border: `1px solid ${TONE[tone].border}`,
                      // Amber left edge while it is still the AI's sentence,
                      // so the marked boxes are findable by scanning the
                      // column rather than by reading every label.
                      borderLeft: aiFilled?.[preset.id] !== undefined && aiFilled[preset.id] === (selection[preset.id] ?? "") ? `2px solid ${AI_MARK}` : `1px solid ${TONE[tone].border}`,
                      background: TONE[tone].bg,
                      color: NAVY,
                      outline: "none",
                      lineHeight: 1.45,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <EditPresetsDialog
          field={field}
          label={label}
          presets={presets}
          onClose={() => setEditing(false)}
          onSaved={(next) => {
            onPresetsChange(field, next);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
});

/**
 * Add, rename, delete and reorder, all as one saved list.
 *
 * Reorder is a drag, and a drag can only be expressed as the new order of
 * everything — so every change here edits a local copy and one Save writes
 * the whole list. It also means Cancel genuinely cancels.
 *
 * The arrows are not a lesser alternative to dragging. Native HTML5 drag is
 * mouse-only and does not exist on a touchscreen, so without them the
 * feature would be unavailable on a tablet and to anyone on a keyboard.
 */
function EditPresetsDialog({
  field,
  label,
  presets,
  onClose,
  onSaved,
}: {
  field: PresetField;
  label: string;
  presets: ExaminerPreset[];
  onClose: () => void;
  onSaved: (next: ExaminerPreset[]) => void;
}) {
  const [rows, setRows] = useState<ExaminerPreset[]>(presets);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dragFrom = useRef<number | null>(null);

  // Escape closes, and focus starts inside rather than wherever it was.
  const panelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function move(from: number, to: number) {
    if (from === to || to < 0 || to >= rows.length) return;
    const next = [...rows];
    const [picked] = next.splice(from, 1);
    next.splice(to, 0, picked);
    setRows(next);
  }

  function edit(index: number, text: string) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, text } : r)));
  }

  function remove(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function add() {
    /*
      A blank row with an id of its own.

      The id cannot be derived from the text the way the defaults are,
      because the text is empty and two blank rows would collide. It is
      derived once, here, and then never changes — so renaming a preset
      later does not untick it on a review someone is part way through.
    */
    const unique = `${field}:new-${Date.now()}-${rows.length}`;
    setRows((prev) => [...prev, { id: unique, text: "" }]);
  }

  async function save() {
    setError(null);
    const cleaned = rows.map((r) => ({ ...r, text: r.text.trim() })).filter((r) => r.text);
    setSaving(true);
    const result = await saveExaminerPresetsAction(field, cleaned);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSaved(cleaned);
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.35)", zIndex: 3000 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-label={`Edit presets: ${label}`}
        className="rounded-2xl w-full"
        style={{ background: "white", maxWidth: 560, maxHeight: "82vh", overflowY: "auto", outline: "none", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
      >
        <div className="px-6 pt-6 pb-3">
          <h2 className="font-display font-bold text-[16px] m-0" style={{ color: NAVY }}>
            Edit presets
          </h2>
          <p className="text-[12px] m-0 mt-1" style={{ color: "rgba(51,51,51,0.45)" }}>
            {label}. Drag to reorder, or use the arrows.
          </p>
        </div>

        <div className="px-6 flex flex-col gap-1.5">
          {rows.map((row, index) => (
            <div
              key={row.id}
              draggable
              onDragStart={() => { dragFrom.current = index; }}
              onDragOver={(e) => {
                e.preventDefault();
                const from = dragFrom.current;
                if (from === null || from === index) return;
                // Reordered as the pointer passes rather than on drop, so the
                // list under the cursor is the list that will be saved.
                move(from, index);
                dragFrom.current = index;
              }}
              onDragEnd={() => { dragFrom.current = null; }}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5"
              style={{ background: "rgba(51,51,51,0.03)", border: "1px solid rgba(51,51,51,0.08)" }}
            >
              <span
                aria-hidden
                title="Drag to reorder"
                style={{ cursor: "grab", color: "rgba(51,51,51,0.25)", fontSize: 13, lineHeight: 1, userSelect: "none" }}
              >
                ⠿
              </span>
              <GrowingInput
                value={row.text}
                onChange={(v) => edit(index, v)}
                placeholder="New preset…"
                className="flex-1 rounded-md px-2 py-1 text-[12.5px]"
                style={{ border: "1px solid rgba(51,51,51,0.15)", background: "white", color: NAVY, outline: "none", minWidth: 0, lineHeight: 1.45 }}
              />
              <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0}
                aria-label="Move up"
                style={{ background: "none", border: "none", cursor: index === 0 ? "default" : "pointer", color: "rgba(51,51,51,0.4)", opacity: index === 0 ? 0.3 : 1, fontSize: 12 }}>
                ↑
              </button>
              <button type="button" onClick={() => move(index, index + 1)} disabled={index === rows.length - 1}
                aria-label="Move down"
                style={{ background: "none", border: "none", cursor: index === rows.length - 1 ? "default" : "pointer", color: "rgba(51,51,51,0.4)", opacity: index === rows.length - 1 ? 0.3 : 1, fontSize: 12 }}>
                ↓
              </button>
              <button type="button" onClick={() => remove(index)}
                aria-label="Delete preset"
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(185,28,28,0.65)", fontSize: 12 }}>
                ✕
              </button>
            </div>
          ))}

          {rows.length === 0 && (
            <p className="text-[12px] italic m-0" style={{ color: "rgba(51,51,51,0.35)" }}>
              Nothing here yet.
            </p>
          )}
        </div>

        <div className="px-6 py-4 flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={add}
            disabled={rows.length >= MAX_PRESETS_PER_FIELD}
            className="text-[12px] font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(51,51,51,0.07)", border: "none", color: NAVY, cursor: rows.length >= MAX_PRESETS_PER_FIELD ? "default" : "pointer", opacity: rows.length >= MAX_PRESETS_PER_FIELD ? 0.4 : 1 }}
          >
            + Add preset
          </button>
          <div className="flex-1" />
          {error && <span className="text-[12px]" style={{ color: "#B91C1C" }}>{error}</span>}
          <button
            type="button"
            onClick={onClose}
            className="text-[12.5px]"
            style={{ background: "none", border: "none", color: "rgba(51,51,51,0.45)", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="text-[12.5px] font-bold px-4 py-2 rounded-lg"
            style={{ background: NAVY, border: "none", color: "white", cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Saving…" : "Save presets"}
          </button>
        </div>

        <div className="px-6 pb-5">
          <p className="text-[11px] m-0" style={{ color: "rgba(51,51,51,0.35)", lineHeight: 1.5 }}>
            Shared by every examiner. Changing the wording here does not change reports
            already sent.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Re-derives an id for a preset whose text was typed fresh. Exported for tests
 *  and for the seeding path; the dialog uses a timestamped id instead so that
 *  renaming never moves an id out from under a tick. */
export { presetId };
