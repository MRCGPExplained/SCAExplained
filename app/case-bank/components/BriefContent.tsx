"use client";

/**
 * The doctor's brief and the patient's story, as the case bank renders them.
 *
 * Lifted out of StationPageClient so the examiner's review page can show the
 * same briefs without importing that component, which drags in the study
 * room, the feedback modal, the model-consultation picker, two audio players
 * and the admin actions. Nothing here was rewritten in the move: these are
 * eleven patient sections and five doctor sections with their own styling,
 * and a recent-notes parser that handles three syntaxes, so a second
 * hand-written copy would have drifted from this one by the first edit.
 *
 * Both tolerate being rendered outside the case page. Highlightable falls
 * back to a plain span with no HighlightProvider above it, and EditableField
 * returns its children with no AdminEditProvider, so an examiner gets
 * read-only text with no highlighter and no edit pencils, which is right.
 *
 * The colours are the case bank's, not the examiner page's. Anything
 * embedding these owns the job of making that look deliberate.
 */

import type React from "react";
import type { BriefFields } from "@/lib/case-bank-types";
import { Highlightable } from "./Highlighter";
import { EditableField } from "./InlineEdit";

const NAVY = "#1F2937";
const LIGHT_BG = "#F3F2FB";

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1.5"
      style={{ color: "rgba(26,27,82,0.5)" }}
    >
      {children}
    </div>
  );
}

// Matches either a markdown-style [label](url) link or a bare https:// URL.
// Two copies: the global one for extracting all matches (matchAll clones it
// internally, so it's never mutated), and a non-global one for a plain
// existence check that doesn't touch lastIndex.
const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/\S+)/g;
const LINK_TEST_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/\S+)/;

// Splits text around links (markdown [label](url) or bare URLs) and renders
// them as clickable anchors. Used instead of Highlightable for lines that
// contain a link, since the highlight system's offsets are computed from
// plain text and a link would throw them off.
function renderWithLinks(text: string) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const [full, label, labelledUrl, bareUrl] = match;
    const start = match.index ?? 0;
    if (start > lastIndex) nodes.push(<span key={`t${i}`}>{text.slice(lastIndex, start)}</span>);
    const href = labelledUrl ?? bareUrl;
    nodes.push(
      <a
        key={`u${i}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#2563EB", textDecoration: "underline" }}
      >
        {label ?? href}
      </a>
    );
    lastIndex = start + full.length;
    i++;
  }
  if (lastIndex < text.length) nodes.push(<span key={`t${i}`}>{text.slice(lastIndex)}</span>);
  return nodes;
}

export function BulletList({ items, listKey }: { items: string[]; listKey?: string }) {
  return (
    <ul className="m-0 p-0 list-none flex flex-col gap-2">
      {items.map((item, i) => {
        const hasLink = LINK_TEST_PATTERN.test(item);
        return (
          <li key={i} className="flex gap-3 items-start">
            <span
              className="shrink-0 w-1.5 h-1.5 rounded-full mt-2"
              style={{ background: "rgba(31,41,55,0.25)" }}
            />
            {listKey && !hasLink ? (
              <Highlightable
                unitKey={`${listKey}-${i}`}
                text={item}
                className="text-[16px] leading-[1.65]"
                style={{ color: "rgba(26,27,82,0.8)" }}
              />
            ) : (
              <span className="text-[16px] leading-[1.65]" style={{ color: "rgba(26,27,82,0.8)" }}>
                {hasLink ? renderWithLinks(item) : item}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

type NoteSegment =
  | { type: "text"; lines: string[] }
  | { type: "table"; rows: string[][] }
  | { type: "heading"; text: string };

// Parses a block of Recent Notes lines into headings ("## Heading"),
// pipe-delimited tables, and plain-text paragraphs.
function parseNoteSegments(lines: string[]): NoteSegment[] {
  const segments: NoteSegment[] = [];
  let currentType: "text" | "table" | null = null;
  let currentLines: string[] = [];

  function flush() {
    if (currentType === "table") segments.push({ type: "table", rows: currentLines.map(l => l.split(" | ").map(c => c.trim())) });
    else if (currentType === "text") segments.push({ type: "text", lines: currentLines });
    currentLines = [];
    currentType = null;
  }

  for (const line of lines) {
    if (line.trim().startsWith("## ")) {
      flush();
      segments.push({ type: "heading", text: line.trim().slice(3).trim() });
      continue;
    }
    const isTableRow = line.includes(" | ");
    const wantType = isTableRow ? "table" : "text";
    if (currentType !== wantType) {
      flush();
      currentType = wantType;
    }
    currentLines.push(line);
  }
  flush();
  return segments;
}

function renderNoteSegment(seg: NoteSegment, key: string) {
  if (seg.type === "heading") {
    return (
      <div
        key={key}
        className="text-[11px] font-bold uppercase tracking-[0.06em] mt-1"
        style={{ color: "rgba(26,27,82,0.5)" }}
      >
        {seg.text}
      </div>
    );
  }
  if (seg.type === "table") {
    const [header, ...body] = seg.rows;
    return (
      <div key={key} className="overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(26,27,82,0.08)" }}>
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(26,27,82,0.04)" }}>
              {header.map((cell, j) => (
                <th key={j} className="text-left py-2 px-3 font-bold" style={{ color: "rgba(26,27,82,0.45)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid rgba(26,27,82,0.10)" }}>
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : "rgba(26,27,82,0.015)" }}>
                {row.map((cell, ci) => (
                  <td key={ci} className="py-2 px-3" style={{ color: "rgba(26,27,82,0.8)", fontSize: "13.5px", borderBottom: ri < body.length - 1 ? "1px solid rgba(26,27,82,0.06)" : "none" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Text segment — split on blank lines into paragraphs
  const paragraphs: string[] = [];
  let current: string[] = [];
  for (const line of seg.lines) {
    if (line.trim() === "") {
      if (current.length > 0) { paragraphs.push(current.join("\n")); current = []; }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) paragraphs.push(current.join("\n"));

  return (
    <div key={key} className="flex flex-col gap-2">
      {paragraphs.map((para, pi) => (
        <p key={pi} className="m-0 text-[15px] leading-[1.65]" style={{ whiteSpace: "pre-line" }}>
          <Highlightable
            unitKey={`recent_notes-${key}-${pi}`}
            text={para}
            style={{ color: "rgba(26,27,82,0.8)" }}
          />
        </p>
      ))}
    </div>
  );
}

function RecentNotesRenderer({ text }: { text: string }) {
  // Lines prefixed with "> " (markdown-style blockquote) are grouped into
  // shaded, bordered blocks — used to set an older colleague's note apart
  // from today's information. Consecutive quoted/unquoted lines each form
  // their own chunk, parsed and rendered independently.
  type Chunk = { quoted: boolean; lines: string[] };
  const chunks: Chunk[] = [];
  for (const rawLine of text.split("\n")) {
    const quoted = rawLine.trimStart().startsWith(">");
    const line = quoted ? rawLine.trimStart().replace(/^>\s?/, "") : rawLine;
    const last = chunks[chunks.length - 1];
    if (last && last.quoted === quoted) last.lines.push(line);
    else chunks.push({ quoted, lines: [line] });
  }

  return (
    <div className="flex flex-col gap-3">
      {chunks.map((chunk, ci) => {
        const segments = parseNoteSegments(chunk.lines);
        const rendered = segments.map((seg, si) => renderNoteSegment(seg, `${ci}-${si}`));
        if (!chunk.quoted) return rendered;
        return (
          <div
            key={ci}
            className="flex flex-col gap-3 rounded-lg px-4 py-3"
            style={{ background: "rgba(26,27,82,0.035)", borderLeft: "3px solid #2563EB" }}
          >
            {rendered}
          </div>
        );
      })}
    </div>
  );
}

export function DoctorBriefContent({ station }: { station: BriefFields }) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <Label>Patient</Label>
          <div className="text-[16px] font-bold" style={{ color: NAVY }}>
            {station.patient_name}
          </div>
          <div className="text-[16px]" style={{ color: "rgba(26,27,82,0.65)" }}>
            {station.patient_age}
          </div>
        </div>
        <div>
          <Label>Type</Label>
          <div className="text-[16px]" style={{ color: "rgba(26,27,82,0.8)" }}>
            {station.consultation_type}
          </div>
        </div>
      </div>
      {station.pmh.length > 0 && (
        <div>
          <Label>Past Medical History</Label>
          <EditableField field="pmh" value={station.pmh}>
            <BulletList items={station.pmh} listKey="pmh" />
          </EditableField>
        </div>
      )}
      {station.medications_and_allergies.length > 0 && (
        <div>
          <Label>Drug & Allergy History</Label>
          <EditableField field="medications_and_allergies" value={station.medications_and_allergies}>
            <BulletList items={station.medications_and_allergies} listKey="medications_and_allergies" />
          </EditableField>
        </div>
      )}
      {station.recent_notes && (
        <div>
          <Label>Recent Notes</Label>
          <EditableField field="recent_notes" value={station.recent_notes}>
            <RecentNotesRenderer text={station.recent_notes} />
          </EditableField>
        </div>
      )}
      <div>
        <Label>Reason for Consultation</Label>
        <EditableField field="reason_for_consultation" value={station.reason_for_consultation}>
          <p className="text-[16px] leading-[1.6]">
            <Highlightable unitKey="reason_for_consultation" text={station.reason_for_consultation} style={{ color: "rgba(26,27,82,0.8)" }} />
          </p>
        </EditableField>
      </div>
      {station.image_urls && station.image_urls.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {station.image_urls.map((item, idx) => {
            let record: { supabaseUrl?: string; originalUrl?: string; attributedTo?: string } = {};
            try {
              record = JSON.parse(item);
            } catch {
              record = { supabaseUrl: item };
            }
            const imgUrl = record.supabaseUrl || record.originalUrl || item;
            return (
              <div key={idx} className="flex flex-col gap-1.5">
                <img src={imgUrl} alt={`Station image ${idx + 1}`} className="w-full h-auto max-h-[500px] object-contain rounded-lg" />
                {record.attributedTo && (
                  <p className="text-[12px]" style={{ color: "rgba(26,27,82,0.50)" }}>
                    Image: {record.attributedTo}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Renders text where lines written as "Label: value" show the label in bold
// (used for Social History). Plain text with no such lines renders as a paragraph.
function LabelledText({ text, unitPrefix }: { text: string; unitPrefix: string }) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const rows = lines.map((line) => {
    const m = line.match(/^([^:\n]{1,24}):\s+(.+)$/);
    return m
      ? { label: m[1].trim() as string | null, value: m[2].trim() }
      : { label: null as string | null, value: line };
  });

  if (!rows.some((r) => r.label)) {
    return (
      <p className="text-[16px] leading-[1.65]">
        <Highlightable unitKey={unitPrefix} text={text} style={{ color: "rgba(26,27,82,0.8)" }} />
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((r, i) => (
        <p key={i} className="text-[16px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }}>
          {r.label && (
            <span className="font-semibold" style={{ color: "rgba(26,27,82,0.6)" }}>
              {r.label}:{" "}
            </span>
          )}
          <Highlightable unitKey={`${unitPrefix}-${i}`} text={r.value} style={{ color: "rgba(26,27,82,0.8)" }} />
        </p>
      ))}
    </div>
  );
}

export function PatientStoryContent({ station }: { station: BriefFields }) {
  return (
    <div className="flex flex-col gap-4">
      {/* The dilemma — the case's central tension and how the patient should play it */}
      {station.dilemma && (
        <div
          className="rounded-lg p-4"
          style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.35)" }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: "#C2410C" }}>
            The Dilemma
          </div>
          <EditableField field="dilemma" value={station.dilemma}>
            <p className="text-[16px] leading-[1.6]">
              <Highlightable unitKey="dilemma" text={station.dilemma} style={{ color: "rgba(26,27,82,0.8)" }} />
            </p>
          </EditableField>
        </div>
      )}

      {/* Presenting complaint — opening statement + if asked further (grey box) */}
      <div className="rounded-lg p-4 flex flex-col gap-3" style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.08)" }}>
        <div>
          <Label>Opening Statement</Label>
          <EditableField field="opening_statement" value={station.opening_statement}>
            <p className="text-[16px] leading-[1.65] italic">
              &ldquo;<Highlightable unitKey="opening_statement" text={station.opening_statement} style={{ color: "rgba(26,27,82,0.8)" }} />&rdquo;
            </p>
          </EditableField>
        </div>
        <div>
          <Label>If Asked to Explain Further</Label>
          <EditableField field="if_asked_further" value={station.if_asked_further}>
            <p className="text-[16px] leading-[1.65]">
              <Highlightable unitKey="if_asked_further" text={station.if_asked_further} style={{ color: "rgba(26,27,82,0.8)" }} />
            </p>
          </EditableField>
        </div>
      </div>

      {/* Only if directly asked */}
      {station.only_if_asked.length > 0 && (
        <div
          className="rounded-lg p-4"
          style={{
            background: "rgba(246,212,75,0.08)",
            border: "1px solid rgba(246,212,75,0.25)",
          }}
        >
          <div
            className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2.5"
            style={{ color: "#854D0E" }}
          >
            ⚠ Only Say Below If Directly Asked
          </div>
          <EditableField field="only_if_asked" value={station.only_if_asked}>
            <ul className="m-0 p-0 list-none flex flex-col gap-2">
              {station.only_if_asked.map((item, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span
                    className="shrink-0 w-1.5 h-1.5 rounded-full mt-2 opacity-40"
                    style={{ background: NAVY }}
                  />
                  <Highlightable
                    unitKey={`only_if_asked-${i}`}
                    text={item}
                    className="text-[16px] leading-[1.6]"
                    style={{ color: "rgba(26,27,82,0.8)" }}
                  />
                </li>
              ))}
            </ul>
          </EditableField>
        </div>
      )}

      {/* ICE — three blue column boxes */}
      <div className="grid grid-cols-3 gap-2.5">
        {(
          [
            ["Ideas", "ice_ideas", station.ice_ideas],
            ["Concerns", "ice_concerns", station.ice_concerns],
            ["Expectations", "ice_expectations", station.ice_expectations],
          ] as const
        ).map(([label, key, value]) => (
          <div key={label} className="rounded-lg p-3" style={{ background: "#EFF6FF" }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: "rgba(26,27,82,0.5)" }}>
              {label}
            </div>
            <EditableField field={key} value={value}>
              <p className="text-[16px] leading-[1.55]">
                <Highlightable unitKey={key} text={value} style={{ color: "rgba(26,27,82,0.8)" }} />
              </p>
            </EditableField>
          </div>
        ))}
      </div>

      {/* Background — social history + PMH + medications & allergies (grey box) */}
      <div className="rounded-lg p-4 flex flex-col gap-3.5" style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.08)" }}>
        <div>
          <Label>Social History</Label>
          <EditableField field="social_history" value={station.social_history}>
            <LabelledText text={station.social_history} unitPrefix="social_history" />
          </EditableField>
        </div>
        {station.pmh && station.pmh.length > 0 && (
          <div>
            <Label>Past Medical History</Label>
            <EditableField field="pmh" value={station.pmh}>
              <ul className="m-0 p-0 list-none flex flex-col gap-2">
                {station.pmh.map((item, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2 opacity-40" style={{ background: NAVY }} />
                    <Highlightable unitKey={`story_pmh-${i}`} text={item} className="text-[16px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }} />
                  </li>
                ))}
              </ul>
            </EditableField>
          </div>
        )}
        {station.medications_and_allergies && station.medications_and_allergies.length > 0 && (
          <div>
            <Label>Medications &amp; Allergies</Label>
            <EditableField field="medications_and_allergies" value={station.medications_and_allergies}>
              <ul className="m-0 p-0 list-none flex flex-col gap-2">
                {station.medications_and_allergies.map((item, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2 opacity-40" style={{ background: NAVY }} />
                    <Highlightable unitKey={`story_meds-${i}`} text={item} className="text-[16px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }} />
                  </li>
                ))}
              </ul>
            </EditableField>
          </div>
        )}
      </div>

      {/* Questions for the doctor — own grey box */}
      {station.question_for_doctor && station.question_for_doctor.length > 0 && (
        <div className="rounded-lg p-4" style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.08)" }}>
          <Label>{station.question_for_doctor.length > 1 ? "Questions for the Doctor" : "Question for the Doctor"}</Label>
          <EditableField field="question_for_doctor" value={station.question_for_doctor}>
            <ul className="m-0 p-0 list-none flex flex-col gap-2">
              {station.question_for_doctor.map((q, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2 opacity-40" style={{ background: NAVY }} />
                  <Highlightable unitKey={`question_for_doctor-${i}`} text={q} className="text-[16px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }} />
                </li>
              ))}
            </ul>
          </EditableField>
        </div>
      )}

      {/* Scenarios — own grey box */}
      {station.scenarios && station.scenarios.length > 0 && (
        <div className="rounded-lg p-4" style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.08)" }}>
          <Label>Specific Scenarios</Label>
          <EditableField field="scenarios" value={station.scenarios}>
            <ul className="m-0 p-0 list-none flex flex-col gap-2">
              {station.scenarios.map((s, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span
                    className="shrink-0 text-[12px] font-bold mt-px"
                    style={{ color: NAVY }}
                  >
                    {i + 1}.
                  </span>
                  <Highlightable
                    unitKey={`scenarios-${i}`}
                    text={s}
                    className="text-[16px] leading-[1.6]"
                    style={{ color: "rgba(26,27,82,0.8)" }}
                  />
                </li>
              ))}
            </ul>
          </EditableField>
        </div>
      )}
    </div>
  );
}
