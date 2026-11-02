/**
 * The transcript as it is actually stored, and one clock to read it on.
 *
 * `station_recordings.transcript_raw` is Deepgram's `results.utterances`,
 * passed through without field-picking (app/api/recordings/[id]/process:131),
 * so every utterance carries a `words` array with per-word start and end
 * times. Two types in the codebase declare only `{ start, end }` for an
 * utterance — app/recordings/TimeAssessment.tsx and the DeepgramUtterance
 * cast in the pipeline — and both are narrower than the JSON they describe.
 * They are not wrong for what they do; they are the reason the word timings
 * looked absent. They are there, on every recording that has a transcript.
 *
 * `transcript_formatted` cannot stand in. It is built by the same pipeline at
 * :137-152 and rounds each utterance to `[m:ss]`, discarding the sub-second
 * precision and the word boundaries both.
 *
 * ONE CLOCK. The two tracks are transcribed by two separate Deepgram calls on
 * two separate files, so in principle each is relative to its own zero. In
 * practice both recorders start together and the data agrees: across every
 * transcribed consultation the two tracks' last words land within a few
 * seconds of each other (689.8 / 686.3, 719.9 / 709.9, and so on, all against
 * a ~12 minute consultation). DualTrackPlayer already assumes this when it
 * seeks the patient track to the doctor's position, and so does
 * TimeAssessment's single timeline. Merging the two is not a new assumption;
 * it is the one the app is already built on.
 */

export interface TranscriptWord {
  word: string;
  /** Deepgram's cased-and-punctuated form. Falls back to `word`. */
  punctuated_word?: string;
  start: number;
  end: number;
  confidence?: number;
}

export interface TranscriptUtterance {
  start: number;
  end: number;
  transcript?: string;
  words?: TranscriptWord[];
}

/** What the column holds. `spike` is written by the pipeline's spike path. */
export interface TranscriptTracks {
  doctor?: TranscriptUtterance[];
  patient?: TranscriptUtterance[];
  spike?: boolean;
}

export type Speaker = "Doctor" | "Patient";

export interface TimedWord {
  text: string;
  start: number;
  end: number;
}

export interface TimedTurn {
  speaker: Speaker;
  start: number;
  end: number;
  words: TimedWord[];
}

function turnsFor(speaker: Speaker, utterances: unknown): TimedTurn[] {
  if (!Array.isArray(utterances)) return [];
  const out: TimedTurn[] = [];

  for (const u of utterances as TranscriptUtterance[]) {
    // No words, no timings to highlight against. Dropped rather than rendered
    // untimed, so the caller's "is this usable" test is a single length check
    // instead of a per-turn one it would have to repeat everywhere.
    if (!Array.isArray(u?.words) || u.words.length === 0) continue;

    const words: TimedWord[] = [];
    for (const w of u.words) {
      const start = Number(w?.start);
      const end = Number(w?.end);
      const text = (w?.punctuated_word ?? w?.word ?? "").trim();
      if (!text || !Number.isFinite(start) || !Number.isFinite(end)) continue;
      words.push({ text, start, end: Math.max(end, start) });
    }
    if (!words.length) continue;

    out.push({
      speaker,
      start: Number.isFinite(u.start) ? u.start : words[0].start,
      end: Number.isFinite(u.end) ? u.end : words[words.length - 1].end,
      words,
    });
  }

  return out;
}

/**
 * Both tracks, in the order they were spoken.
 *
 * Returns an empty array for anything unusable — a spike row, a recording
 * from before utterances were kept, a malformed column — so a caller can fall
 * back to the formatted string on `length === 0` and never has to inspect the
 * shape itself.
 */
export function mergedTurns(raw: unknown): TimedTurn[] {
  if (!raw || typeof raw !== "object") return [];
  const tracks = raw as TranscriptTracks;
  if (tracks.spike) return [];

  return [...turnsFor("Doctor", tracks.doctor), ...turnsFor("Patient", tracks.patient)].sort(
    (a, b) => a.start - b.start || (a.speaker === "Doctor" ? -1 : 1)
  );
}

/**
 * Every word, sorted by when it was said, carrying the position it was
 * rendered at.
 *
 * Two indexes are needed because they are not the same order. Turns render
 * grouped by speaker turn; time runs across both speakers and they talk over
 * each other. `i` is where the word is on the page, the array order is when
 * it was said, and the search below walks the second to find the first.
 */
export interface WordCue {
  start: number;
  end: number;
  /** Index into the flat render order: the nth word span on the page. */
  i: number;
}

export function wordCues(turns: TimedTurn[]): WordCue[] {
  const cues: WordCue[] = [];
  let i = 0;
  for (const turn of turns) {
    for (const w of turn.words) {
      cues.push({ start: w.start, end: w.end, i: i++ });
    }
  }
  return cues.sort((a, b) => a.start - b.start);
}

/**
 * The word being spoken at `t`, as a render-order index, or -1 before the
 * first one.
 *
 * The last word that has started, with no check that it has also finished.
 * That is deliberate: a consultation is mostly pauses, and dropping the
 * highlight in every gap between words makes it strobe. Holding the last word
 * until the next one begins reads as a cursor resting where the speaker left
 * off, which is what it is.
 */
export function activeWordIndex(cues: WordCue[], t: number): number {
  if (!cues.length || t < cues[0].start) return -1;

  let lo = 0;
  let hi = cues.length - 1;
  let found = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (cues[mid].start <= t) {
      found = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return cues[found].i;
}
