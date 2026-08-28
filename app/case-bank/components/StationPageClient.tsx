"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Station } from "@/lib/case-bank-types";
import { StudyRoomPanel } from "./StudyRoom";
import { StudyRoomTimer } from "./study-room/StudyRoomTimer";
import { useStudyRoomStatus } from "./study-room/context";
import { FeedbackModal } from "./ReportModal";
import { HighlightProvider, Highlightable } from "./Highlighter";
import { AdminEditProvider, EditableField, QAEditableField } from "./InlineEdit";
import { toggleStarAction, updateLastStationAction } from "../actions";
import { toggleStationPublishedAction } from "../inline-edit-actions";
import {
  getTrainerInsightAudioUploadUrlAction,
  confirmTrainerInsightAudioUploadAction,
  deleteTrainerInsightAudioAction,
} from "@/app/admin/actions";
import { AudioRecordUpload } from "@/app/components/AudioRecordUpload";

const NAVY = "#1F2937";
const YELLOW = "#F6D44B";
const LIGHT_BG = "#F3F2FB";

// ── Tabs ──────────────────────────────────────────────────────────────────────

type TabKey = "brief" | "story" | "data" | "management" | "explanation" | "insight" | "audio";

const TABS: { key: TabKey; label: string }[] = [
  { key: "brief", label: "Doctor's Brief" },
  { key: "story", label: "Patient's Story" },
  { key: "data", label: "Data Gathering" },
  { key: "management", label: "Management" },
  { key: "explanation", label: "Example Conversation" },
  { key: "insight", label: "Trainer Insight" },
  { key: "audio", label: "Sample Consultation" },
];

// ── Content helpers ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1.5"
      style={{ color: "rgba(26,27,82,0.5)" }}
    >
      {children}
    </div>
  );
}

// Trainer Insight audio: a short recording shown above Trainer Q&A. Admins
// get inline upload/replace/remove controls right here on the case page, in
// addition to the same controls on the /admin station form.
function TrainerInsightAudio({
  stationId,
  audioUrl,
  isAdmin,
}: {
  stationId: string;
  audioUrl: string | null;
  isAdmin: boolean;
}) {
  const router = useRouter();

  async function handleUpload(file: File): Promise<{ url?: string; error?: string }> {
    const urlResult = await getTrainerInsightAudioUploadUrlAction(stationId, file.name);
    if ("error" in urlResult) return { error: urlResult.error };
    const uploadRes = await fetch(urlResult.signedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "audio/webm" },
    });
    if (!uploadRes.ok) return { error: "Upload failed — try again." };
    const confirmResult = await confirmTrainerInsightAudioUploadAction(stationId, urlResult.path);
    if ("error" in confirmResult) return { error: confirmResult.error };
    router.refresh();
    return { url: confirmResult.audioUrl };
  }

  async function handleDelete(): Promise<{ error?: string }> {
    const result = await deleteTrainerInsightAudioAction(stationId);
    if (!result.error) router.refresh();
    return result;
  }

  if (!isAdmin && !audioUrl) return null;

  if (!isAdmin) {
    return <audio controls src={audioUrl!} className="w-full" style={{ borderRadius: 8, outline: "none" }} />;
  }

  return <AudioRecordUpload currentUrl={audioUrl} onUpload={handleUpload} onDelete={handleDelete} />;
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

function BulletList({ items, listKey }: { items: string[]; listKey?: string }) {
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

function DoctorBriefContent({ station }: { station: Station }) {
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

// Renders the Example Explanation. If the text is written as a Doctor/Patient
// dialogue (lines prefixed "Doctor:" / "Patient:") it renders as a styled
// script; otherwise it falls back to a prose block.
function ExplanationBody({ text }: { text: string }) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const turns: { speaker: "Doctor" | "Patient"; text: string }[] = [];
  for (const line of lines) {
    const m = line.match(/^(Doctor|Patient)\s*:\s*(.*)$/i);
    if (m) {
      const speaker: "Doctor" | "Patient" = /^d/i.test(m[1]) ? "Doctor" : "Patient";
      const last = turns[turns.length - 1];
      // Merge consecutive lines from the same speaker so a run never renders
      // as two back-to-back labels.
      if (last && last.speaker === speaker) last.text += " " + m[2];
      else turns.push({ speaker, text: m[2] });
    } else if (turns.length) {
      turns[turns.length - 1].text += " " + line;
    }
  }

  if (turns.length < 2) {
    return (
      <p className="text-[16px] leading-[1.85]" style={{ whiteSpace: "pre-line", color: "#1a1a1a" }}>
        <Highlightable unitKey="example_explanation" text={text} style={{ color: "#1a1a1a" }} />
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {turns.map((t, i) => (
        <p key={i} className="text-[16px] leading-[1.75]" style={{ color: "#1a1a1a" }}>
          <span style={{ fontWeight: 700 }}>{t.speaker}:</span>{" "}
          <Highlightable unitKey={`example_explanation-${i}`} text={t.text} style={{ color: "#1a1a1a" }} />
        </p>
      ))}
    </div>
  );
}

function PatientStoryContent({ station }: { station: Station }) {
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

// ── Main component ─────────────────────────────────────────────────────────────

export function StationPageClient({
  station,
  totalStations,
  prevStationNumber,
  nextStationNumber,
  initialStarred,
  isAdmin = false,
}: {
  station: Station;
  totalStations: number;
  prevStationNumber: number | null;
  nextStationNumber: number | null;
  initialStarred: boolean;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [isStationNavPending, startStationNav] = useTransition();
  const [stationNavDirection, setStationNavDirection] = useState<"prev" | "next" | null>(null);


  const [starred, setStarred] = useState(initialStarred);
  const [published, setPublished] = useState(station.published);
  const [publishPending, setPublishPending] = useState(false);
  const [manualRoomOpen, setManualRoomOpen] = useState(false);
  // Landed here via a room invite link (?joinRoom=<id>) — the join itself
  // already happened server-side, and the provider reads the param directly.
  // This only strips it from the URL so a refresh doesn't re-trigger it.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("joinRoom")) return;
    url.searchParams.delete("joinRoom");
    router.replace(url.pathname + url.search, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [starPending, setStarPending] = useState(false);
  const visibleTabs = TABS.filter((t) => {
    if (t.key === "audio") return !!station.audio_url;
    // Admins always see explanation/insight so they have somewhere to add the
    // first bit of content; subscribers only see them once populated.
    if (t.key === "explanation") return isAdmin || !!station.example_explanation?.trim();
    if (t.key === "insight") return isAdmin || !!station.trainer_insight_audio_url || (station.trainer_qa?.length ?? 0) > 0;
    return true;
  });
  // Remember the open tab per station so a refresh lands back where you were.
  // A lazy initialiser (not an effect) avoids a hydration flash to "brief"
  // before snapping to the saved tab.
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (typeof window === "undefined") return "brief";
    const saved = sessionStorage.getItem(`stationTab:${station.id}`) as TabKey | null;
    return saved && visibleTabs.some((t) => t.key === saved) ? saved : "brief";
  });
  useEffect(() => {
    sessionStorage.setItem(`stationTab:${station.id}`, activeTab);
  }, [station.id, activeTab]);

  // Room state now lives in the study-room session, which outlives this page.
  const { inRoom, iAmHost, hostName: roomHostName, isRecordingActive, registerStation } =
    useStudyRoomStatus();

  // Tell the session which station is on screen. The number comes from the URL
  // on the provider's side; this supplies the title, which only the page knows.
  useEffect(() => {
    registerStation(station.number, station.title);
  }, [station.number, station.title, registerStation]);

  // The panel opens itself whenever you're in a room, and can also be toggled
  // open manually while you're not.
  const showRoom = manualRoomOpen || inRoom;

  // Guests follow the host, so only the host navigates. Nobody navigates during
  // a recording: the voice call now survives it, but changing the case under a
  // live consultation should not be possible.
  const canNavigateStations = (!inRoom || iAmHost) && !isRecordingActive;

  // Station jump
  const [jumpOpen, setJumpOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState("");

  async function handleToggleStar() {
    if (starPending) return;
    setStarPending(true);
    setStarred((v) => !v);
    await toggleStarAction(station.id, starred);
    setStarPending(false);
  }

  async function handleTogglePublished() {
    if (publishPending) return;
    const next = !published;
    if (!next && !window.confirm("Hide this station from the case bank? Only admins will still be able to view it.")) return;
    setPublishPending(true);
    setPublished(next);
    const result = await toggleStationPublishedAction(station.id, next);
    if (result?.error) setPublished(!next);
    setPublishPending(false);
  }

  // Persist last-visited station — Supabase for cross-device, localStorage as immediate fallback
  useEffect(() => {
    localStorage.setItem("lastCaseBankStation", String(station.number));
    updateLastStationAction(station.number);
  }, [station.number]);

  function handleStationJump() {
    const n = parseInt(jumpValue, 10);
    if (!isNaN(n) && n >= 1 && n <= totalStations) {
      setJumpOpen(false);
      setJumpValue("");
      router.push(`/case-bank/${n}`);
    }
  }

  const goToStation = useCallback(
    (stationNumber: number, direction: "prev" | "next") => {
      setStationNavDirection(direction);
      startStationNav(() => {
        router.push(`/case-bank/${stationNumber}`);
      });
    },
    [router]
  );

  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif", minHeight: "100vh" }}>

      {/* Top nav */}
      <div
        className="flex flex-wrap items-center justify-between px-6 py-2.5 gap-2"
        style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-3.5">
          <Link
            href="/case-bank"
            className="text-[12px] no-underline"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            ← Case Bank
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <div className="flex items-center gap-1">
            {canNavigateStations && prevStationNumber && (
              <button
                onClick={() => goToStation(prevStationNumber, "prev")}
                disabled={isStationNavPending}
                style={{
                  background: "none",
                  border: "none",
                  color: isStationNavPending && stationNavDirection === "prev" ? "white" : "rgba(255,255,255,0.45)",
                  cursor: isStationNavPending ? "default" : "pointer",
                  padding: "2px 6px",
                  fontSize: "14px",
                  lineHeight: 1,
                  opacity: isStationNavPending && stationNavDirection !== "prev" ? 0.35 : 1,
                }}
              >
                ←
              </button>
            )}
            {!canNavigateStations ? (
              <span className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
                Station {station.number} / {totalStations}
              </span>
            ) : jumpOpen ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleStationJump();
                    if (e.key === "Escape") { setJumpOpen(false); setJumpValue(""); }
                  }}
                  autoFocus
                  placeholder={String(station.number)}
                  className="rounded-md px-2 py-1 text-[12px] text-center w-[52px]"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                  / {totalStations}
                </span>
                <button
                  onClick={() => { setJumpOpen(false); setJumpValue(""); }}
                  className="text-[12px]"
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setJumpOpen(true)}
                className="text-[12px] font-semibold rounded-md"
                style={{
                  background: "none",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.65)",
                  cursor: "pointer",
                  padding: "3px 10px",
                }}
              >
                Station {station.number} / {totalStations}
              </button>
            )}
            {canNavigateStations && nextStationNumber && (
              <button
                onClick={() => goToStation(nextStationNumber, "next")}
                disabled={isStationNavPending}
                style={{
                  background: "none",
                  border: "none",
                  color: isStationNavPending && stationNavDirection === "next" ? "white" : "rgba(255,255,255,0.45)",
                  cursor: isStationNavPending ? "default" : "pointer",
                  padding: "2px 6px",
                  fontSize: "14px",
                  lineHeight: 1,
                  opacity: isStationNavPending && stationNavDirection !== "next" ? 0.35 : 1,
                }}
              >
                →
              </button>
            )}
            {isStationNavPending && (
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Loading…
              </span>
            )}
            {inRoom && !iAmHost && (
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>
                {roomHostName ?? "Host"} is navigating
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setManualRoomOpen((v: boolean) => !v)}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={showRoom ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="11" rx="3"/>
              <path d="M5 10a7 7 0 0 0 14 0"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
              <line x1="9" y1="21" x2="15" y2="21"/>
            </svg>
            Study Room
          </button>

          <button
            onClick={handleToggleStar}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {starred ? "Starred" : "Star"}
          </button>

          {isAdmin && (
            <button
              onClick={handleTogglePublished}
              disabled={publishPending}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold"
              style={{
                background: published ? "transparent" : "rgba(217,119,6,0.15)",
                border: `1.5px solid ${published ? "rgba(255,255,255,0.25)" : "rgba(217,119,6,0.4)"}`,
                color: published ? "rgba(255,255,255,0.6)" : "#F6C453",
                cursor: publishPending ? "default" : "pointer",
                opacity: publishPending ? 0.6 : 1,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {published ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.4 18.4 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                )}
              </svg>
              {published ? "Published" : "Hidden"}
            </button>
          )}

          <button
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Feedback
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="4"/>
              <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/>
              <line x1="19.07" y1="4.93" x2="14.83" y2="9.17"/>
              <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
              <line x1="19.07" y1="19.07" x2="14.83" y2="14.83"/>
            </svg>
            Help
          </button>

        </div>
      </div>

      {/* Tab strip */}
      <div style={{ background: "white", borderBottom: "1px solid rgba(31,41,55,0.10)" }}>
        <div className="max-w-[1300px] mx-auto px-6 flex items-end">
          {visibleTabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="py-2.5 px-4 text-[12.5px] transition-colors whitespace-nowrap"
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: active ? `2px solid ${YELLOW}` : "2px solid transparent",
                  marginBottom: "-1px",
                  cursor: "pointer",
                  color: active ? NAVY : "rgba(31,41,55,0.40)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1300px] mx-auto px-6 py-6">
        <div
          className="grid gap-5 items-start"
          style={{ gridTemplateColumns: "1fr 240px" }}
        >
          {/* Tab content */}
          <div className="rounded-xl bg-white px-6 py-5" style={{ border: "1px solid rgba(31,41,55,0.10)" }}>
            <AdminEditProvider isAdmin={isAdmin} stationId={station.id}>
            <HighlightProvider stationId={station.id}>
            {activeTab === "brief" && <DoctorBriefContent station={station} />}
            {activeTab === "story" && <PatientStoryContent station={station} />}
            {activeTab === "data" && (
              <EditableField field="data_gathering" value={station.data_gathering}>
                <BulletList items={station.data_gathering} listKey="data_gathering" />
              </EditableField>
            )}
            {activeTab === "management" && (
              <EditableField field="management" value={station.management}>
                <BulletList items={station.management} listKey="management" />
              </EditableField>
            )}
            {activeTab === "explanation" && (
              <EditableField field="example_explanation" value={station.example_explanation}>
                <ExplanationBody text={station.example_explanation} />
              </EditableField>
            )}
            {activeTab === "insight" && (
              <div className="flex flex-col gap-6">
                {(!!station.trainer_insight_audio_url || isAdmin) && (
                  <TrainerInsightAudio
                    stationId={station.id}
                    audioUrl={station.trainer_insight_audio_url}
                    isAdmin={isAdmin}
                  />
                )}
                {((station.trainer_qa?.length ?? 0) > 0 || isAdmin) && (
                  <div
                    style={
                      station.trainer_insight_audio_url
                        ? { borderTop: "1px solid rgba(26,27,82,0.08)", paddingTop: "1.25rem" }
                        : undefined
                    }
                  >
                    <Label>Common Questions</Label>
                    <QAEditableField value={station.trainer_qa ?? []}>
                      <div className="flex flex-col gap-4">
                        {(station.trainer_qa ?? []).map((qa, i) => (
                          <div
                            key={i}
                            className="rounded-lg p-4"
                            style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.08)" }}
                          >
                            <p className="text-[15px] font-semibold mb-1.5" style={{ color: NAVY }}>
                              <Highlightable unitKey={`trainer_qa_q-${i}`} text={qa.question} style={{ color: NAVY }} />
                            </p>
                            <p className="text-[15.5px] leading-[1.7]" style={{ color: "rgba(26,27,82,0.8)", whiteSpace: "pre-line" }}>
                              <Highlightable unitKey={`trainer_qa_a-${i}`} text={qa.answer} style={{ color: "rgba(26,27,82,0.8)" }} />
                            </p>
                          </div>
                        ))}
                      </div>
                    </QAEditableField>
                  </div>
                )}
                {/* Internal note — admins only, never rendered for candidates. */}
                {isAdmin && (
                  <div
                    className="rounded-lg p-4"
                    style={{
                      background: "rgba(246,212,75,0.13)",
                      border: "1px solid rgba(246,212,75,0.55)",
                      borderTop: "1px solid rgba(246,212,75,0.55)",
                    }}
                  >
                    <div
                      className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1.5 flex items-center gap-1.5"
                      style={{ color: "rgba(133,77,14,0.85)" }}
                    >
                      Admin Note
                      <span className="font-medium normal-case tracking-normal opacity-70">
                        · only visible to admins
                      </span>
                    </div>
                    <EditableField field="admin_note" value={station.admin_note ?? ""}>
                      {station.admin_note?.trim() ? (
                        <p
                          className="text-[15px] leading-[1.7] m-0"
                          style={{ color: "rgba(87,52,10,0.95)", whiteSpace: "pre-line" }}
                        >
                          {station.admin_note}
                        </p>
                      ) : (
                        <p className="text-[14px] italic m-0" style={{ color: "rgba(133,77,14,0.55)" }}>
                          No note yet — use the pencil to add one.
                        </p>
                      )}
                    </EditableField>
                  </div>
                )}
              </div>
            )}
            {activeTab === "audio" && station.audio_url && (
              <div className="flex flex-col gap-5">
                <audio
                  controls
                  src={station.audio_url}
                  className="w-full"
                  style={{ borderRadius: "8px", outline: "none" }}
                />
                {station.audio_notes && (
                  <p className="text-[16px] leading-[1.8]" style={{ color: "rgba(26,27,82,0.8)", whiteSpace: "pre-line" }}>
                    {station.audio_notes}
                  </p>
                )}
              </div>
            )}
            </HighlightProvider>
            </AdminEditProvider>
          </div>

          {/* Timer + study room */}
          <div className="sticky top-4 flex flex-col gap-3">
            <div>
              <StudyRoomTimer />
              {inRoom && !iAmHost && (
                <p className="text-center text-[11px] mt-1.5" style={{ color: "rgba(31,41,55,0.4)" }}>
                  Timer controlled by {roomHostName ?? "host"}
                </p>
              )}
            </div>

            <div style={{ display: showRoom ? undefined : "none" }}>
              <StudyRoomPanel />
            </div>
          </div>
        </div>
      </div>

      {showFeedback && (
        <FeedbackModal
          stationId={station.id}
          stationNumber={station.number}
          stationTitle={station.title}
          onClose={() => setShowFeedback(false)}
        />
      )}

      {showHelp && (
        <FeedbackModal
          stationId={station.id}
          stationNumber={station.number}
          stationTitle={station.title}
          onClose={() => setShowHelp(false)}
          kind="help"
        />
      )}


    </main>
  );
}
