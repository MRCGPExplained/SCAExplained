/**
 * Who was talking, and when.
 *
 * Every consultation already carries the answer: transcript_raw stores each
 * speaker's utterances separately, with a start and an end on every one and on
 * every word inside it. Nothing new is recorded and nothing is re-processed —
 * this reads a column that has been filled in since August.
 *
 * It is self-contained so it can come out in one piece: this file plus the
 * block that renders it in app/recordings/[id]/page.tsx.
 *
 * Measured on real consultations before it was built, which settled three
 * things that would otherwise have been guesses:
 *
 *   - Overlap between the two tracks is 1-4% of a real consultation, so
 *     attributing it one way or the other changes nothing anyone can see.
 *   - Silence is 16-26%, which is why it is worth a colour of its own rather
 *     than being the leftover.
 *   - The doctor talks for 56-72% of the time, and the spread between
 *     consultations is wide enough that the number distinguishes them.
 */

export interface Utterance {
  start: number;
  end: number;
}

export interface TranscriptRaw {
  doctor?: Utterance[];
  patient?: Utterance[];
}

type Who = "doctor" | "patient" | "silence";

export interface Segment {
  start: number;
  end: number;
  who: Who;
}

export interface Share {
  doctor: number;
  patient: number;
  silence: number;
}

export interface TimeAnalysis {
  /** First word to last word, not the full twelve minutes. Nobody runs the
   *  clock out, and a fixed 12:00 bar ends every consultation with an
   *  unexplained empty tail that reads as failure rather than as brevity. */
  spanSeconds: number;
  segments: Segment[];
  overall: Share;
  thirds: [Share, Share, Share];
  /** Seconds where both tracks carried speech at once. */
  overlapSeconds: number;
  /** Both microphones hearing the same person, rather than two people talking
   *  over each other. Above this the figures describe the room, not the
   *  consultation. */
  tracksUnreliable: boolean;
}

const OVERLAP_UNRELIABLE = 0.1;

function clean(list: Utterance[] | undefined): Utterance[] {
  return (list ?? [])
    .filter((u) => Number.isFinite(u.start) && Number.isFinite(u.end) && u.end > u.start)
    .sort((a, b) => a.start - b.start);
}

/** Sum of the parts of `spans` that fall inside [from, to). */
function within(spans: Segment[], who: Who, from: number, to: number): number {
  let total = 0;
  for (const s of spans) {
    if (s.who !== who) continue;
    const lo = Math.max(s.start, from);
    const hi = Math.min(s.end, to);
    if (hi > lo) total += hi - lo;
  }
  return total;
}

function shareOf(segments: Segment[], from: number, to: number): Share {
  const width = to - from;
  if (width <= 0) return { doctor: 0, patient: 0, silence: 0 };
  return {
    doctor: (within(segments, "doctor", from, to) / width) * 100,
    patient: (within(segments, "patient", from, to) / width) * 100,
    silence: (within(segments, "silence", from, to) / width) * 100,
  };
}

/**
 * Cuts the consultation into stretches where the answer to "who is talking"
 * does not change, so the bar and the percentages come from one pass and
 * cannot disagree with each other.
 *
 * Where both are talking the stretch is credited to the doctor. On a real
 * consultation that is one or two per cent of the time, and when a doctor and
 * a patient are speaking at once it is usually the doctor arriving over the
 * top of them — which is the thing this panel exists to show.
 */
export function analyseTime(raw: TranscriptRaw | null | undefined): TimeAnalysis | null {
  if (!raw) return null;
  const doctor = clean(raw.doctor);
  const patient = clean(raw.patient);
  if (doctor.length === 0 && patient.length === 0) return null;

  const all = [...doctor, ...patient];
  const from = Math.min(...all.map((u) => u.start));
  const to = Math.max(...all.map((u) => u.end));
  const spanSeconds = to - from;
  if (spanSeconds <= 0) return null;

  const edges = new Set<number>([from, to]);
  for (const u of all) {
    if (u.start > from && u.start < to) edges.add(u.start);
    if (u.end > from && u.end < to) edges.add(u.end);
  }
  const marks = [...edges].sort((a, b) => a - b);

  const speaking = (list: Utterance[], at: number) => list.some((u) => u.start <= at && u.end > at);

  const raw_segments: Segment[] = [];
  let overlapSeconds = 0;
  for (let i = 0; i < marks.length - 1; i++) {
    const a = marks[i];
    const b = marks[i + 1];
    if (b <= a) continue;
    const d = speaking(doctor, a);
    const p = speaking(patient, a);
    if (d && p) overlapSeconds += b - a;
    raw_segments.push({ start: a, end: b, who: d ? "doctor" : p ? "patient" : "silence" });
  }

  // Join neighbours that say the same thing, so the bar is a few hundred
  // elements rather than a few thousand.
  const segments: Segment[] = [];
  for (const s of raw_segments) {
    const last = segments[segments.length - 1];
    if (last && last.who === s.who && Math.abs(last.end - s.start) < 1e-6) last.end = s.end;
    else segments.push({ ...s });
  }

  const third = spanSeconds / 3;
  return {
    spanSeconds,
    segments,
    overall: shareOf(segments, from, to),
    thirds: [
      shareOf(segments, from, from + third),
      shareOf(segments, from + third, from + 2 * third),
      shareOf(segments, from + 2 * third, to),
    ],
    overlapSeconds,
    tracksUnreliable: overlapSeconds / spanSeconds > OVERLAP_UNRELIABLE,
  };
}

/* ── Rendering ───────────────────────────────────────────────────────────── */

const COLOUR: Record<Who, string> = {
  doctor: "#F6D44B",
  patient: "#0EA5E9",
  silence: "rgba(51,51,51,0.10)",
};

const NAVY = "#1A1B52";
const FAINT = "rgba(51,51,51,0.5)";

function clock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function pct(value: number): string {
  return `${Math.round(value)}%`;
}

function Key({ who, label }: { who: Who; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px]" style={{ color: FAINT }}>
      <span className="inline-block w-[9px] h-[9px] rounded-sm" style={{ background: COLOUR[who] }} />
      {label}
    </span>
  );
}

function ThirdRow({ label, share }: { label: string; share: Share }) {
  return (
    <div className="flex items-baseline gap-3 py-2" style={{ borderTop: "1px solid rgba(51,51,51,0.08)" }}>
      <span className="text-[12.5px] w-[92px] shrink-0" style={{ color: NAVY }}>{label}</span>
      <div className="flex-1 flex gap-5">
        <span className="text-[12.5px]" style={{ color: FAINT }}>
          Doctor <strong style={{ color: NAVY }}>{pct(share.doctor)}</strong>
        </span>
        <span className="text-[12.5px]" style={{ color: FAINT }}>
          Patient <strong style={{ color: NAVY }}>{pct(share.patient)}</strong>
        </span>
      </div>
    </div>
  );
}

export function TimeAssessment({ raw }: { raw: TranscriptRaw | null | undefined }) {
  const t = analyseTime(raw);
  if (!t) return null;

  return (
    <details
      className="rounded-2xl overflow-hidden mb-5"
      style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
    >
      <summary
        className="px-5 py-4 cursor-pointer select-none flex items-center justify-center gap-2"
        style={{ listStyle: "none" }}
      >
        {/* Stopwatch: body, hands, and the button on top. */}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
          <circle cx="8" cy="9.5" r="5.5" stroke={NAVY} strokeWidth="1.5" />
          <path d="M8 6.8V9.5L9.9 10.9" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.4 1.5h3.2" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 1.6V3.9" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-[12px] font-semibold" style={{ color: "rgba(51,51,51,0.5)" }}>
          Time Assessment
        </span>
      </summary>

      <div className="px-5 pt-4 pb-5" style={{ borderTop: "1px solid rgba(51,51,51,0.07)" }}>
        <p className="text-[12.5px] mb-3" style={{ color: FAINT }}>{clock(t.spanSeconds)}</p>

        {/* The consultation end to end. Each block sits where it happened, so
            the shape of the conversation is visible and not just its totals. */}
        <div
          className="flex w-full rounded-md overflow-hidden"
          style={{ height: 44, background: COLOUR.silence }}
          role="img"
          aria-label={`Doctor spoke ${pct(t.overall.doctor)} of the consultation, patient ${pct(
            t.overall.patient
          )}`}
        >
          {t.segments.map((s, i) => (
            <div
              key={i}
              style={{ flexGrow: s.end - s.start, flexBasis: 0, background: COLOUR[s.who] }}
              title={`${clock(s.start)} – ${clock(s.end)} · ${
                s.who === "silence" ? "neither" : s.who
              }`}
            />
          ))}
        </div>

        {/* Where the thirds below are measured from. Beneath the bar rather
            than drawn through it: a hairline inside a few hundred stripes is
            just another stripe, and disappears. */}
        <div className="relative w-full" style={{ height: 7 }}>
          <span className="absolute top-0" style={{ left: "33.333%", width: 2, height: 7, background: "rgba(51,51,51,0.45)", borderRadius: 1 }} />
          <span className="absolute top-0" style={{ left: "66.666%", width: 2, height: 7, background: "rgba(51,51,51,0.45)", borderRadius: 1 }} />
        </div>

        {/* Silence keeps its swatch so the grey is explained, but not a figure:
            it is the part of the consultation nobody is being asked about. */}
        <div className="flex gap-4 mt-2.5 mb-4 flex-wrap">
          <Key who="doctor" label={`Doctor ${pct(t.overall.doctor)}`} />
          <Key who="patient" label={`Patient ${pct(t.overall.patient)}`} />
          <Key who="silence" label="Silence" />
        </div>

        <ThirdRow label="First third" share={t.thirds[0]} />
        <ThirdRow label="Middle third" share={t.thirds[1]} />
        <ThirdRow label="Final third" share={t.thirds[2]} />

        {/* Not a judgement on the consultation — a warning that the figures
            above are describing a room rather than a conversation. It fires
            when both microphones carried speech at the same time for more than
            a tenth of it, which is what happens when the two of you record in
            the same room and each phone picks up both voices. */}
        {t.tracksUnreliable && (
          <p
            className="text-[12px] leading-[1.55] mt-4 pt-3"
            style={{ color: "#92400E", borderTop: "1px solid rgba(51,51,51,0.08)" }}
          >
            Both recordings carried speech at the same time for{" "}
            {pct((t.overlapSeconds / t.spanSeconds) * 100)} of this consultation, which usually means the two
            microphones were in one room and each picked up both voices. Treat the split above as unreliable
            for this one.
          </p>
        )}
      </div>
    </details>
  );
}
