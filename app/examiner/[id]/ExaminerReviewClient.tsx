"use client";

import { memo, useState, useRef, useEffect, useCallback, useActionState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitExaminerReviewAction, generateOverallCommentAction, grammarCheckAction, autofillTickedAction } from "../actions";
import DualTrackPlayer from "@/app/components/DualTrackPlayer";
import RetryPipelineButton from "../RetryPipelineButton";
import ExaminerSkills from "./ExaminerSkills";
import TranscriptKaraoke from "./TranscriptKaraoke";
import { AI_MARK, PresetChecklist, type PresetSelection } from "./PresetChecklist";
import { useDictation } from "./useDictation";
import { FIELD_LABEL, PRESET_FIELDS, TONE, type DomainHalfNotes, type ExaminerPreset, type PresetField, type Tone } from "@/lib/examiner-presets";
import type { PresetMap } from "@/lib/examiner-presets-store";
import type { StationMaterial } from "@/lib/case-bank-types";
import { DoctorBriefContent, PatientStoryContent } from "@/app/case-bank/components/BriefContent";
import type { TimedTurn } from "@/lib/transcript";
import { REVIEW_SENT_EVENT } from "@/lib/nav-events";
import type { SkillAnswer } from "@/lib/skill-framework";

const NAVY = "#333333";
const LIGHT_BG = "#FAFAF8";

type Grade = "CF" | "F" | "P" | "CP";
const GRADES: Grade[] = ["CF", "F", "P", "CP"];

const GRADE_STYLE: Record<Grade, { bg: string; color: string; label: string }> = {
  CF: { bg: "rgba(239,68,68,0.1)",  color: "#B91C1C", label: "Clear Fail" },
  F:  { bg: "rgba(245,158,11,0.1)", color: "#92400E", label: "Fail" },
  P:  { bg: "rgba(34,197,94,0.1)",  color: "#166534", label: "Pass" },
  CP: { bg: "rgba(59,130,246,0.1)", color: "#1D4ED8", label: "Clear Pass" },
};

const DOMAIN_MAX: Record<string, number> = { dg: 3, cm: 4.5, ro: 3 };

function pts(grade: Grade | "", domain: string): number | null {
  if (!grade) return null;
  const maps: Record<string, Record<Grade, number>> = {
    dg: { CF: 0, F: 1,   P: 2, CP: 3 },
    cm: { CF: 0, F: 1.5, P: 3, CP: 4.5 },
    ro: { CF: 0, F: 1,   P: 2, CP: 3 },
  };
  return maps[domain]?.[grade] ?? null;
}

function GradeBadge({ grade }: { grade: string }) {
  const s = GRADE_STYLE[grade as Grade];
  if (!s) return null;
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: s.bg, color: s.color }}>
      {grade}
    </span>
  );
}

function GradeSelector({ name, value, onChange, compact, disabled }: {
  name: string;
  value: Grade | "";
  onChange: (g: Grade) => void;
  /** Letters only. Twelve buttons share one line in the score bar, and
   *  "Clear Fail" three times over does not fit beside a transport. */
  compact?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className={compact ? "flex gap-1" : "flex gap-2 flex-wrap"}>
      {GRADES.map((g) => (
        <button
          key={g}
          type="button"
          disabled={disabled}
          onClick={() => onChange(g)}
          // The words move to a tooltip rather than being lost: CF and CP are
          // not self-explanatory to anyone who has not marked before.
          title={compact ? GRADE_STYLE[g].label : undefined}
          className={compact
            ? "px-1.5 py-1 rounded-md text-[11.5px] font-bold transition"
            : "px-3 py-1.5 rounded-lg text-[12px] font-bold transition"}
          style={{
            background: value === g ? GRADE_STYLE[g].bg : "rgba(51,51,51,0.05)",
            color: value === g ? GRADE_STYLE[g].color : "rgba(51,51,51,0.4)",
            border: value === g ? `1.5px solid ${GRADE_STYLE[g].color}30` : "1.5px solid transparent",
            cursor: disabled ? "default" : "pointer",
            // The chosen one stays legible; the rest recede, so a sent review
            // reads as a record rather than as a form you could still fill in.
            opacity: disabled && value !== g ? 0.35 : 1,
          }}
        >
          {g}
          {!compact && <span className="ml-1 font-normal text-[10px]">{GRADE_STYLE[g].label}</span>}
        </button>
      ))}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

function Accordion({
  title, badge, defaultOpen = true, bg, children,
}: {
  title: string;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  bg?: string;
  children: React.ReactNode;
}) {
  /*
    There was an openWhen prop here, to spring a collapsed section open when
    something other than the examiner put text in it. It existed for one
    caller — the Overall Comment accordion, which started closed because an
    empty 190px box above the notepad was the biggest thing pushing the rail
    past the window. That accordion is gone: the comment and the notes take
    turns in a half-width column now, so neither has to be folded away to
    make room for the other, and the machinery for unfolding it goes with it.
  */
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ background: bg ?? "white", border: `1px solid ${bg ? "rgba(245,158,11,0.18)" : "rgba(51,51,51,0.08)"}`, borderRadius: 16, overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4"
        style={{
          background: "none", border: "none", cursor: "pointer",
          borderBottom: open ? "1px solid rgba(51,51,51,0.07)" : "none",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-bold" style={{ color: NAVY }}>{title}</span>
          {badge}
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s", flexShrink: 0 }}>
          <path d="M4 6l4 4 4-4" stroke="rgba(51,51,51,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
}

type RecordingFull = {
  id: string;
  station_number: number;
  station_title: string;
  doctor_display_name: string;
  patient_display_name: string;
  started_at: string;
  status: string;
  transcript_formatted: string | null;
  ai_data_gathering: string | null;
  ai_clinical_management: string | null;
  ai_relating_to_others: string | null;
  ai_comment_data_gathering: string | null;
  ai_comment_clinical_management: string | null;
  ai_comment_relating_to_others: string | null;
  examiner_data_gathering: string | null;
  examiner_clinical_management: string | null;
  examiner_relating_to_others: string | null;
  examiner_comment_data_gathering: string | null;
  examiner_comment_clinical_management: string | null;
  examiner_comment_relating_to_others: string | null;
  examiner_overall_comment: string | null;
  sent_to_candidate_at: string | null;
  ai_error?: string | null;
};

interface Props {
  recording: RecordingFull;
  /** The transcript on one clock. Empty when there are no word timings. */
  turns: TimedTurn[];
  /** The shared tick lists, as stored. */
  presets: PresetMap;
  doctorAudioUrl: string | null;
  patientAudioUrl: string | null;
  voiceNoteUrl: string | null;
  aiSkills: SkillAnswer[];
  examinerSkills: SkillAnswer[] | null;
  skillLabels: Record<string, string>;
  /** The case behind the consultation, for the station modal. Null when the
   *  station_number matches no row, since the join has no foreign key. */
  station: StationMaterial | null;
}

export default function ExaminerReviewClient({ recording: rec, turns, presets: initialPresets, doctorAudioUrl, patientAudioUrl, voiceNoteUrl, aiSkills, examinerSkills, skillLabels, station }: Props) {
  const router = useRouter();

  /*
    The audio position, passed around without going through render.

    The player emits roughly sixty times a second while playing. Putting that
    in state would re-render this whole component — the grade buttons, the
    notepad, the three comment boxes — sixty times a second to move one
    highlight. So listeners register directly and the emitter walks them.

    Both callbacks are stable: the player holds onTime in a ref, and the
    transcript subscribes once for its lifetime. Neither would be true if
    these were rebuilt each render.
  */
  const timeListeners = useRef(new Set<(t: number) => void>());
  const emitTime = useCallback((t: number) => {
    for (const fn of timeListeners.current) fn(t);
  }, []);
  const subscribeTime = useCallback((fn: (t: number) => void) => {
    timeListeners.current.add(fn);
    return () => {
      timeListeners.current.delete(fn);
    };
  }, []);
  // Only so the transcript knows whether to follow along; a paused player
  // should leave the examiner's scroll position where they put it.
  const [audioPlaying, setAudioPlaying] = useState(false);
  const seekRef = useRef<((t: number) => void) | null>(null);
  /*
    Stable, because TranscriptKaraoke is memo'd and an inline arrow here
    would defeat it — the transcript would go back to rebuilding two thousand
    spans on every keystroke in every box on this page. No deps: it reads the
    ref, which is the reason the ref exists.
  */
  const handleSeek = useCallback((t: number) => seekRef.current?.(t), []);

  /*
    Spacebar plays and pauses, so marking does not need the mouse.

    Only when nothing that owns the key has focus. A space typed into a note
    box is a space — that is not negotiable, and it is why this is a focus
    test rather than the line-start test the "/" dictation key uses: a slash
    never starts a sentence, a space does nothing else but separate words.

    The focus-visible check is what makes buttons work both ways. A control
    the examiner TABBED to owns its own space key — that is how a keyboard
    user presses it, and stealing it would break the grade buttons for
    anyone not using a mouse. A control they merely CLICKED holds focus by
    accident, so the key belongs to the audio. Clicking a grade and then
    hitting space to resume is the normal case, and it works.

    preventDefault because space scrolls the page a screenful otherwise,
    which on a page this tall is the opposite of helpful.
  */
  const togglePlayRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code !== "Space" && e.key !== " ") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      /*
        One test, and it is the one Brandon asked for: is the examiner
        typing? If a text field has focus the space is a space. Everything
        else on this page yields the key to the audio.

        TWO CLEVERER VERSIONS WERE TRIED AND BOTH FAILED, MEASURED.

        Asking :focus-visible of whatever holds focus does not work: the
        body is focusable and pressing a key on it is exactly what promotes
        it, so the first space played and every space after it was
        swallowed. Asking it only of buttons does not work either — Chrome
        latches the heuristic for the session, so once the examiner has
        used the keyboard at all (which pressing space IS), a button they
        then click with the mouse still reports as keyboard-focused. Tested
        with a real click: space re-pressed the button instead of pausing.

        So buttons lose space on this page, and that is a deliberate cost
        rather than an oversight. Enter still activates every one of them,
        which is the other half of the platform convention and the half
        that keyboard users can rely on here. preventDefault below is what
        stops a focused button firing as well as the audio toggling.
      */
      const el = document.activeElement as HTMLElement | null;
      if (el) {
        const tag = el.tagName;
        // A select opens on space, and a contenteditable has no simple
        // notion of empty. Both keep the key.
        if (tag === "SELECT" || el.isContentEditable) return;
        if (tag === "INPUT" || tag === "TEXTAREA") {
          /*
            An EMPTY box yields the key.

            A space only ever separates things, so in a box with nothing in
            it there is nothing for it to do — no sentence starts with one
            and nothing here would keep it. That makes the key free exactly
            where the examiner is most likely to be sitting: clicked into
            the box they are about to write in, listening before they type.

            Emptiness is bulletLines', not the raw string's, so a box
            holding only the "• " the notepad put there counts as empty —
            the same test the rest of this file uses to decide whether a
            note box has anything in it.
          */
          const field = el as HTMLInputElement | HTMLTextAreaElement;
          if (bulletLines(field.value).length > 0) return;
        }
      }
      const toggle = togglePlayRef.current;
      if (!toggle) return;
      e.preventDefault();
      toggle();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  /*
    Sent in this tab, believed before the server component catches up.

    revalidatePath brings sent_to_candidate_at back and that is what really
    hides the buttons, but it is a round trip, and the gap between "sent" and
    the buttons going away is exactly where a second click lands.
  */
  const [justSent, setJustSent] = useState(false);
  const isSent = !!rec.sent_to_candidate_at || justSent;

  /*
    What the server sent, through the same ?? chain the boxes seed from.

    One function rather than six inline chains, because it is used three
    times — to seed the state, as the base a stored draft is checked against,
    and as the thing a draft is compared to in order to know whether there is
    anything unsaved. Those three had to agree, and six copied expressions
    would eventually not.
  */
  const seeded = seedSix(rec);

  const [dgGrade, setDgGrade] = useState<Grade | "">(seeded.dgGrade);
  const [cmGrade, setCmGrade] = useState<Grade | "">(seeded.cmGrade);
  const [roGrade, setRoGrade] = useState<Grade | "">(seeded.roGrade);
  const [dgComment, setDgComment] = useState(seeded.dgComment);
  const [cmComment, setCmComment] = useState(seeded.cmComment);
  const [roComment, setRoComment] = useState(seeded.roComment);
  const [overallComment, setOverallComment] = useState(rec.examiner_overall_comment ?? "");

  const [aiGenPending, startAiGen] = useTransition();
  const [grammarPending, startGrammar] = useTransition();
  const [previewPending, startPreview] = useTransition();
  const [aiGenError, setAiGenError] = useState("");

  /*
    The notepad.

    Kept across reloads, which it has to be now that it is always on screen.
    While these six boxes lived in a dialog they were a minute's work and
    losing them cost a minute; written up as the examiner listens, they are
    the record of a whole consultation, and a stray refresh or a back button
    would take the lot with nothing to recover from.

    localStorage rather than the database. These are working notes about what
    the comment should cover, not feedback anybody else reads, and the project
    already keeps this kind of thing per browser — see StationPageClient. It
    also needs no migration, which matters for something whose value is that
    it is there today.

    Keyed by recording, because an examiner works through a queue and notes
    from the last consultation appearing against the next one would be worse
    than losing them.
  */
  const notesKey = `sca_examiner_notepad_${rec.id}`;
  /*
    The lists are shared and the ticks are not.

    Editing a preset writes to site_settings and changes it for every
    examiner, so that lives in state only to keep the rail in step with the
    dialog without a reload. The ticks belong to one consultation and one
    person, and go to localStorage beside the notepad — the same place, for
    the same reason: a draft review should survive a refresh.
  */
  const picksKey = `sca_examiner_picks_${rec.id}`;
  const [presets, setPresets] = useState<PresetMap>(initialPresets);
  const [picked, setPicked] = useState<Record<PresetField, PresetSelection>>(() =>
    Object.fromEntries(PRESET_FIELDS.map((f) => [f, {}])) as Record<PresetField, PresetSelection>
  );

  const [assist, setAssist] = useState<AssistNotes>(EMPTY_NOTES);

  /*
    The overall comment is kept across reloads too, but it is not the same
    problem as the notepad.

    The notepad exists nowhere but the browser, so whatever is there is the
    truth. This field has a saved version in the database, and a draft can
    therefore be out of date rather than merely unsaved — if the examiner
    saves from another machine, or a second tab, the stored draft is older
    than what the candidate would be sent.

    So the draft records the saved text it was written on top of. It is
    restored only when that base still matches what the server just sent; if
    the saved comment has moved on since, the draft is from before that and
    is dropped. The database wins any disagreement, because it is the version
    that can actually reach a candidate.
  */
  const draftKey = `sca_examiner_overall_${rec.id}`;
  /*
    State, not read straight off the prop, because saving does not re-fetch
    this page. Left on the prop it would still say the pre-save text after a
    Save, every later edit would be stored against a base the server had
    moved past, and a reload would throw those edits away as stale. Advanced
    by hand when the save succeeds instead.
  */
  const [savedComment, setSavedComment] = useState(rec.examiner_overall_comment ?? "");

  /*
    The three grades and three domain comments, mirrored like everything else
    on this page.

    They were the only work here with no backstop. The notepad, the ticks and
    the overall-comment draft are all kept per recording for the reason set
    out above — "a stray refresh or a back button would take the lot" — and
    these six, which are the ones that actually gate Send, were plain state.
    Worse than a plain loss: coming back, the notepad and every tick are
    still there, so the page reads as "nothing was lost" while the grades and
    comments have quietly reverted to what the server last had.

    A database autosave is not available here. submitExaminerReviewAction
    rejects the whole call until all three grades are valid, which is exactly
    the half-finished window being protected, and it would churn status and
    examiner_reviewed_at on every keystroke.

    Stored with its base, like the overall comment and for the same reason:
    the database has a version of these that can move on. The draft is
    restored only if every base field still matches what the server just
    sent; if any has changed the whole record is dropped, because a
    per-field merge would let half a stale review through.
  */
  const sixKey = `sca_examiner_review_${rec.id}`;
  /** The six as the server last had them. Advanced by hand on save, because
   *  saving does not re-fetch this page. */
  const [savedSix, setSavedSix] = useState<SixFields>(seeded);
  /** The restore has run. The writer below must not touch storage before it
   *  does, or the mount render erases the draft it is about to read. */
  const [sixHydrated, setSixHydrated] = useState(false);
  const [sixRestored, setSixRestored] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(sixKey);
      if (raw) {
        /*
          A sent review is a record, not a draft.

          Restoring here put grades on screen that were never sent, under a
          header reading "Report already sent" and beside a banner saying
          they had been restored — so the page disagreed with the report in
          the candidate's inbox and looked confident about it. There is also
          nothing to restore FOR: every control is read-only from here on.
          The record is dropped rather than kept, because it can never be
          saved now.
        */
        if (rec.sent_to_candidate_at) {
          window.localStorage.removeItem(sixKey);
          setSixHydrated(true);
          return;
        }
        const saved = JSON.parse(raw) as { base?: Partial<SixFields>; draft?: Partial<SixFields> };
        if (saved.base && saved.draft && sameSix(saved.base, seeded)) {
          const d = saved.draft;
          setDgGrade((d.dgGrade ?? "") as Grade | "");
          setCmGrade((d.cmGrade ?? "") as Grade | "");
          setRoGrade((d.roGrade ?? "") as Grade | "");
          setDgComment(d.dgComment ?? "");
          setCmComment(d.cmComment ?? "");
          setRoComment(d.roComment ?? "");
          setSixRestored(true);
        } else {
          // Superseded by a save from somewhere else. The database wins, the
          // same way a stale overall-comment draft is dropped below.
          window.localStorage.removeItem(sixKey);
        }
      }
    } catch {
      // Unreadable or blocked. What the server sent is already on screen.
    }
    setSixHydrated(true);
    // seeded is this render's read of the props and would re-run this on
    // every revalidate; the restore belongs to mount alone.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sixKey]);

  useEffect(() => {
    if (!sixHydrated) return;
    const current: SixFields = { dgGrade, cmGrade, roGrade, dgComment, cmComment, roComment };
    try {
      // Once it is sent there is no draft to keep: the controls are
      // read-only and the record could never be saved from here.
      if (isSent) window.localStorage.removeItem(sixKey);
      else if (sameSix(current, savedSix)) window.localStorage.removeItem(sixKey);
      else window.localStorage.setItem(sixKey, JSON.stringify({ base: savedSix, draft: current }));
    } catch {
      // Storage full or blocked. The work is still on screen.
    }
  }, [sixHydrated, isSent, dgGrade, cmGrade, roGrade, dgComment, cmComment, roComment, savedSix, sixKey]);

  /*
    Keep the rail ending at the bottom of the window, wherever it currently
    starts. See the comment on the aside itself for why a CSS height cannot
    do this.
  */
  const railRef = useRef<HTMLElement>(null);
  /*
    The score bar is back inside the left column, so the rail is free to
    stick at 12 again.

    It spent a while full-width above both columns, which cost the rail the
    bar's height — the rail had to start below it. In the left track the two
    cannot collide however far the page scrolls, which is the arrangement
    this had originally, and the notepad gets those 64 pixels back.
  */
  const STICKY_TOP = 12;
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const fit = () => {
      // Measured where it actually sits, not where it will stick: before the
      // page has scrolled that far the rail starts further down, and a rail
      // sized for the stuck position would hang below the fold.
      const top = Math.max(el.getBoundingClientRect().top, STICKY_TOP);
      /*
        PAGE_FOOT is the page's own bottom padding (py-10), and leaving room
        for it is what keeps the rail off the score bar.

        A sticky element parks at the bottom of its containing block. At the
        very bottom of the page the rail's grid row ends 40px above the
        window — that padding — so a rail sized to (window − top − 12) is
        28px too tall to sit at its sticky offset, and parks 28px higher,
        with its head under the bar. Measured: exactly 20px of overlap.

        Padding does not fix it. On the grid it lands outside the grid areas
        and only makes the page taller, which moved max scroll by the same
        amount and made the overlap 100px; on the left column it makes the
        row taller and the document taller together, so the row still ends
        40px above the window. The rail simply has to be shorter.
      */
      const PAGE_FOOT = 40;
      // A floor, so that a short window leaves something usable rather than
      // collapsing the rail to nothing.
      el.style.maxHeight = `${Math.max(240, window.innerHeight - top - PAGE_FOOT - 12)}px`;
    };
    fit();
    window.addEventListener("scroll", fit, { passive: true });
    window.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("scroll", fit);
      window.removeEventListener("resize", fit);
    };
  }, []);

  // Read on mount rather than in useState's initialiser: this component is
  // server-rendered, and reaching for localStorage during render would make
  // the first client render disagree with the server's.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(picksKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Record<PresetField, PresetSelection>>;
        setPicked((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Same reasoning as the notepad below: nothing ticked is the right
      // fallback and there is nothing here an examiner could act on.
    }
  }, [picksKey]);

  useEffect(() => {
    try {
      const anything = PRESET_FIELDS.some((f) => Object.keys(picked[f] ?? {}).length > 0);
      if (anything) window.localStorage.setItem(picksKey, JSON.stringify(picked));
      else window.localStorage.removeItem(picksKey);
    } catch {
      // Storage full or blocked. The ticks are still on screen.
    }
  }, [picked, picksKey]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(notesKey);
      if (saved) setAssist({ ...EMPTY_NOTES, ...JSON.parse(saved) });
    } catch {
      // A quota error, private browsing, or something that is not JSON. An
      // empty notepad is the right fallback and there is nothing to tell the
      // examiner that they could act on.
    }
  }, [notesKey]);

  useEffect(() => {
    try {
      // Removed rather than stored empty, so clearing the notepad does not
      // leave a row behind for every consultation an examiner opens.
      if (Object.values(assist).some((v) => v.trim())) {
        window.localStorage.setItem(notesKey, JSON.stringify(assist));
      } else {
        window.localStorage.removeItem(notesKey);
      }
    } catch {
      /* See above. Losing the backup is not worth interrupting anyone over. */
    }
  }, [assist, notesKey]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw) as { base?: string; text?: string };
      if (typeof draft.text !== "string") return;
      // Written on top of a version that has since been superseded.
      if ((draft.base ?? "") !== savedComment) {
        window.localStorage.removeItem(draftKey);
        return;
      }
      if (draft.text !== savedComment) setOverallComment(draft.text);
    } catch {
      /* Unreadable or unavailable. The saved comment is already in state. */
    }
  }, [draftKey, savedComment]);

  useEffect(() => {
    try {
      // Nothing to keep once it matches what is saved — and clearing it is
      // what stops a stale draft outliving the save that caught up with it.
      if (overallComment === savedComment) window.localStorage.removeItem(draftKey);
      else window.localStorage.setItem(draftKey, JSON.stringify({ base: savedComment, text: overallComment }));
    } catch {
      /* As above. */
    }
  }, [overallComment, savedComment, draftKey]);
  // Stripped, not trimmed: a box holding only the bullet the dialog put there
  // on focus has nothing in it.
  /*
    A ticked phrase is NOT a note like any other, which is why these travel
    separately now.

    They used to be flattened together — preset, an em dash, then whatever
    was typed against it, all in one line, indistinguishable from a line the
    examiner typed by hand. That cost both of them. A curated phrase was
    exposed to the grammar pass it does not need, and a hand-typed line was
    protected by the no-rephrasing rule that exists to keep curated phrases
    word-perfect, so the roughest text on the page was the text the editor
    was least willing to touch.

    Presets first, then the free text. They are the recurring points and tend
    to be the ones worth leading on; anything typed by hand is specific to
    this consultation and reads better after them.
  */
  const notesFor = useCallback((field: PresetField, raw: string): DomainHalfNotes => {
    const selection = picked[field] ?? {};
    return {
      ticked: (presets[field] ?? [])
        .filter((p) => p.id in selection)
        .map((p) => ({ phrase: oneLine(p.text), note: oneLine(selection[p.id] ?? "") })),
      typed: bulletLines(raw),
    };
  }, [picked, presets]);

  /*
    Notepad is memo'd, so everything handed to it has to be stable.

    These three were inline arrows, which meant Notepad — six note boxes and
    six tick lists, forty-eight rows in all — re-rendered on every keystroke
    in every other box on the page. Measured on a real-length review, that
    was the single largest slice of the cost of typing a domain comment,
    larger than the two thousand transcript spans.

    Each dependency list says what the handler actually reads. An empty one
    is not a shortcut: these two only call setState with an updater, so they
    read nothing from the render that made them.
  */
  /*
    What the AI wrote against each ticked phrase, by preset id.

    The TEXT, not a boolean, and that is the whole trick. "Has the examiner
    edited this?" is then a comparison between what is in the box and what
    was put there, which needs no previous-value ref, no diffing in the
    change handler and no onEdit callback threaded through two components.
    It is also more honest than a flag: an examiner who edits and then undoes
    back to the AI's sentence is looking at the AI's sentence again, and the
    marker comes back.

    This is the part that actually keeps the feature honest. A dialog shown
    on every use is read once and clicked through for the rest of the
    examiner's life; a marker beside the text is in front of them while they
    read it, and what is still marked at the end is exactly what nobody has
    checked.
  */
  const [aiFilled, setAiFilled] = useState<Record<string, string>>({});

  /*
    Unchanged by the autofill feature, and that is the point of storing the
    AI's text rather than a flag: nothing here has to know the feature
    exists. Typing, dictating and unticking all arrive through this one
    handler, and all three stop the marker showing for free, because all
    three leave the box holding something other than what the AI put in it.
  */
  const handlePickedChange = useCallback(
    (field: PresetField, selection: PresetSelection) =>
      setPicked((prev) => ({ ...prev, [field]: selection })),
    []
  );
  /*
    Autofill: find the moment behind each ticked phrase that has no comment.

    Only empty ones. Overwriting something the examiner typed would be the
    feature taking back the judgement it is supposed to be supporting, and
    there would be no way to tell afterwards which sentences were theirs.
  */
  /*
    Whether the tick lists are on screen at all.

    Two ways of working, and neither is wrong: one examiner picks from the
    presets and types the exception, another types the lot and finds eight
    tick boxes above every box in the way. So it is a preference rather than
    a setting, and it belongs to the person.

    NOT KEYED BY RECORDING, unlike every other stored key in this file. The
    notes and the ticks are a draft of one review and must not follow the
    examiner to the next consultation; how they like the rail laid out is the
    opposite — having to hide the lists again on every review in the queue
    would make the toggle not worth having.

    Shown is the default, so the lists are not invisible to someone who has
    never heard of this button. Read on mount rather than in the initialiser,
    because this renders on the server first: reaching for localStorage
    during render is what makes a hydration mismatch.
  */
  const [showPresets, setShowPresets] = useState(RAIL_DEFAULTS.presets);
  useEffect(() => {
    try {
      setShowPresets(readRail(PRESETS_HIDDEN_KEY, RAIL_DEFAULTS.presets));
    } catch {
      // Storage blocked. Shown is the right fallback and the toggle still
      // works for this page.
    }
  }, []);

  const togglePresets = useCallback(() => {
    setShowPresets((prev) => {
      const next = !prev;
      writeRail(PRESETS_HIDDEN_KEY, next);
      return next;
    });
  }, []);

  /*
    And the same for the free-text boxes, for the examiner who works entirely
    from the tick lists.

    Hiding unmounts them, and that is safe rather than lucky: the boxes carry
    no `name` attribute, so none of the FormData trouble documented further up
    this file applies to them, and their text lives in `assist` in the parent
    and is written to localStorage from there. The proof is already on the
    page: this whole component unmounts every time the pill switches to
    Comment, and the notes come back.

    What is NOT safe is hiding them with CSS and leaving them mounted, or
    clearing `assist` on the way out. Neither is done here.
  */
  const [showFreeText, setShowFreeText] = useState(RAIL_DEFAULTS.freeText);
  useEffect(() => {
    try {
      setShowFreeText(readRail(FREE_TEXT_HIDDEN_KEY, RAIL_DEFAULTS.freeText));
    } catch {
      // As above: shown is the right fallback.
    }
  }, []);

  const toggleFreeText = useCallback(() => {
    setShowFreeText((prev) => {
      const next = !prev;
      writeRail(FREE_TEXT_HIDDEN_KEY, next);
      return next;
    });
  }, []);

  /*
    One dictation instance for the whole review.

    It lived in Notepad, which was right while the notepad was the only
    place you could dictate into. The Could Improve dialog renders outside
    the form, so a second instance would be a second MediaRecorder racing
    the first for the microphone and two "Listening" indicators disagreeing
    about whether anything is being recorded.
  */
  const [dictateError, setDictateError] = useState<string | null>(null);
  const dictation = useDictation(rec.id, setDictateError);

  /*
    Two stages, which is what was asked for, with one thing done quietly.

      warn    the warning, and what this will and will not do
      improve the ticked Could Improve phrases, for the examiner to dictate

    The Did Well generation fires as stage two OPENS, not when it closes. The
    stages are for the person; the call has no reason to wait behind them, and
    a few seconds of it land under the time spent dictating rather than under
    a spinner afterwards. By the time Done is pressed the boxes are usually
    already filled.
  */
  /*
    The detail box under each ticked phrase, closed.

    For the listening pass. Ticking is the fast part and every open box pushes
    the next tick further down the rail, so an examiner marking while the
    audio runs is chasing a moving target. Closed, the six lists are a column
    of phrases to click.

    Hiding does not unmount anything the examiner wrote: the text lives in
    `picked` in this component, and PresetChecklist stops rendering the box
    rather than clearing it.
  */
  const [showPresetInputs, setShowPresetInputs] = useState(RAIL_DEFAULTS.presetInputs);
  useEffect(() => {
    try {
      setShowPresetInputs(readRail(PRESET_INPUTS_HIDDEN_KEY, RAIL_DEFAULTS.presetInputs));
    } catch {
      // Shown is the right fallback, as with its two siblings.
    }
  }, []);

  const togglePresetInputs = useCallback(() => {
    setShowPresetInputs((prev) => {
      const next = !prev;
      writeRail(PRESET_INPUTS_HIDDEN_KEY, next);
      return next;
    });
  }, []);

  /*
    One domain at a time, from the pills beside the heading.

    NOT persisted, unlike the three layout toggles. Which domain you are
    working on belongs to the half hour you are in, not to how you like the
    rail laid out, and a filter that survived into the next review would hide
    two thirds of it from someone who had forgotten they set it.
  */
  const [domainOnly, setDomainOnly] = useState<"all" | "dg" | "cm" | "ro">("all");

  const [autofillStage, setAutofillStage] = useState<"warn" | "improve" | null>(null);
  // Stable, because Notepad is memo'd and an inline arrow here would rebuild
  // forty-eight tick rows on every keystroke in any box.
  const openAutofill = useCallback(() => setAutofillStage("warn"), []);
  const [autofillError, setAutofillError] = useState("");
  const [autofillPending, startAutofill] = useTransition();

  const runAutofill = useCallback(() => {
    setAutofillError("");
    const current = picked;
    /*
      DID WELL ONLY. Could improve ticks are not sent.

      Not a limitation waiting to be engineered away. A Did well phrase names
      something that happened, so there is a moment in the transcript to point
      at. A Could improve phrase is a negative, and evidence for a negative is
      an absence, and in a real consultation the candidate nearly always did
      something adjacent, briefly or in other words, so the absence overstates.

      Three ways of fixing it were tried and measured against two real
      consultations. Giving it the case marksheets produced two absence claims,
      both judged overstated by two independent readers: one said there was "no
      direct screening for ... bladder or bowel dysfunction" about a
      consultation containing "You're passing urine alright?". Giving it the
      AI's own comments, grades and skills produced one, also overstated.
      Telling it in the prompt to write only forward-looking recommendations
      and never to state what did not happen produced three lines, and all
      three stated what did not happen anyway, one of them asserting the
      patient had "bony metastatic disease", a diagnosis the transcript never
      mentions.

      Six of six verification passes, across every approach, called the
      absences wider than the truth. So this fills the half that works and
      leaves the other half to the examiner, which is where the audit of
      Brandon's own reviews says the examiner was adding the most anyway.
    */
    const items = PRESET_FIELDS.filter((f) => f.endsWith("_well")).flatMap((field) => {
      const selection = current[field] ?? {};
      const domain = FIELD_LABEL[field].split(" — ")[0];
      return (presets[field] ?? [])
        .filter((p) => p.id in selection && !(selection[p.id] ?? "").trim())
        .map((p) => ({ id: p.id, phrase: p.text, half: "well" as const, domain }));
    });

    if (items.length === 0) {
      setAutofillError("No ticked Did Well phrase is waiting for a comment.");
      return;
    }

    /*
      Timestamps where there are any. The prompt asks for them and they are
      the most useful part of an answer — "at 6:18" is the thing that saves
      the scroll back. The formatted string is the fallback for a recording
      transcribed before word timings were kept.
    */
    const transcript = turns.length
      ? turns
          .map((t) => {
            const m = Math.floor(t.start / 60);
            const s = Math.floor(t.start % 60).toString().padStart(2, "0");
            return `[${m}:${s}] ${t.speaker}: ${t.words.map((w) => w.text).join(" ")}`;
          })
          .join("\n")
      : rec.transcript_formatted ?? "";

    startAutofill(async () => {
      const res = await autofillTickedAction({
        transcript,
        items,
        // A pointer to where to look, named and labelled but never quotable.
        skills: aiSkills.map((s) => ({
          label: skillLabels[s.skill] ?? s.skill,
          rating: s.rating,
          improvement: s.improvement ?? undefined,
        })),
        // Already tailored to this consultation, which is why they are here.
        // The prompt may reuse the specifics in them and not the verdicts.
        aiDomains: [
          { domain: "Data Gathering", grade: rec.ai_data_gathering, comment: rec.ai_comment_data_gathering },
          { domain: "Clinical Management", grade: rec.ai_clinical_management, comment: rec.ai_comment_clinical_management },
          { domain: "Relating to Others", grade: rec.ai_relating_to_others, comment: rec.ai_comment_relating_to_others },
        ],
        recordingId: rec.id,
      });
      if (res.error || !res.filled) {
        setAutofillError(res.error ?? "Failed");
        return;
      }
      const filled = res.filled;
      const ids = Object.keys(filled);
      setPicked((prev) => {
        const next = { ...prev };
        for (const field of PRESET_FIELDS) {
          const selection = next[field] ?? {};
          let touched = false;
          const copy = { ...selection };
          for (const id of ids) {
            if (id in selection && !(selection[id] ?? "").trim()) {
              copy[id] = filled[id];
              touched = true;
            }
          }
          if (touched) next[field] = copy;
        }
        return next;
      });
      setAiFilled((marks) => {
        const next = { ...marks };
        for (const id of ids) next[id] = filled[id];
        return next;
      });

      /*
        Force the tick lists open, and clear the stored preference with them.

        Hidden, a PresetChecklist renders its label and nothing else: no
        comment boxes and no phrases to carry the (AI) marks. Autofilling into a
        collapsed list would put unreviewed machine text into the review with
        the one thing meant to flag it rendered nowhere, which is the exact
        failure this feature is built to avoid.

        Three things, because there are three ways to be looking elsewhere:
        the lists collapsed, the detail boxes closed, or the rail filtered to
        one domain. Any of them would leave text the AI wrote on screen
        nowhere, which is the failure this feature exists to avoid arriving
        by a side door.

        STATE ONLY. The stored preferences are deliberately left alone, which
        is Brandon's call and the right one: how he likes the rail laid out
        is a setting, and a one-off action has no business rewriting a
        setting. He opens the next review the way he asked to open it.

        I had been clearing them, worried that a reload mid-review would hide
        unchecked text again. That worry is handled better elsewhere and
        without touching anything of his: the (AI) mark now sits beside the
        phrase rather than under the box, so closing the boxes does not hide
        it, and a collapsed list carries the count in its summary. There is
        no arrangement of these three in which unchecked text is invisible.
      */
      setShowPresets(true);
      setShowPresetInputs(true);
      setDomainOnly("all");

      /*
        The dialog is NOT closed here. It is on stage two by now and the
        examiner is in the middle of dictating into it; closing the thing
        somebody is typing in, because a network call they cannot see has
        come back, would be the rudest possible way to deliver good news.

        No count of what was filled or skipped. I wanted one, on the grounds
        that a run which fills everything is the suspicious one, and Brandon
        cut it: the boxes themselves say which were filled, and a line of
        statistics above them is one more thing to read past. The (AI) marks
        carry the same information without being prose.
      */
    });
  }, [picked, presets, turns, aiSkills, skillLabels, rec]);

  const handlePresetsChange = useCallback(
    (field: PresetField, next: ExaminerPreset[]) =>
      setPresets((prev) => ({ ...prev, [field]: next })),
    []
  );

  /*
    Which half of the writing column is showing.

    Notes and the overall comment are used one after the other, never
    together — the examiner jots throughout and the comment appears at the
    end — which is what the Overall Comment accordion's own comment said
    when it was closed-by-default for the same reason. Two things used in
    sequence do not need to share a 360px column; they can take turns and
    have half the page each.

    Notes first, because that is where a review starts. A sent review has no
    notepad at all, so it opens on the comment, which is the only thing
    there is to look at.
  */
  const [railTab, setRailTab] = useState<"notes" | "comment">(
    rec.sent_to_candidate_at ? "comment" : "notes"
  );

  const handleConvert = useCallback(() => {
    setAiGenError("");
    startAiGen(async () => {
      /*
        Bullets off before it goes. The markers are a typing convenience; the
        model gets plain lines, one observation each, so nothing in the
        prompt invites a list back out of it.
      */
      const res = await generateOverallCommentAction({
        dgWell: notesFor("dg_well", assist.dgWell),
        dgImprove: notesFor("dg_improve", assist.dgImprove),
        cmWell: notesFor("cm_well", assist.cmWell),
        cmImprove: notesFor("cm_improve", assist.cmImprove),
        roWell: notesFor("ro_well", assist.roWell),
        roImprove: notesFor("ro_improve", assist.roImprove),
        stationTitle: rec.station_title,
        recordingId: rec.id,
      });
      if (res.text) {
        setOverallComment(res.text);
        // Straight to what was just written. Converting is the moment the
        // notes stop being the work and the comment starts, so the column
        // follows — the accordion this replaced sprang open for the same
        // reason, and leaving the examiner on the notes to go and find it
        // would be a click asking what they obviously want.
        setRailTab("comment");
      } else setAiGenError(res.error ?? "Failed");
    });
  }, [assist, notesFor, rec.station_title, rec.id, startAiGen]);

  // Convert is offered on ticks alone. Someone whose whole review is four
  // ticked phrases has said something, and the button has no business being
  // greyed out at them.
  /*
    Counted through the live list, the same way notesFor counts.

    It used to count raw keys of picked, which is not the same number: a tick
    whose preset has since been deleted — by this examiner in the Edit
    dialog, or by another, since the lists are shared — stays in the saved
    picks but resolves to nothing. The button therefore lit up for ticks the
    conversion would discard, and pressing it sent the model a prompt holding
    nothing but the station title, then wrote the reply over the comment, all
    behind a "Replace the comment?" confirm that made it look deliberate.

    Now the button, the "N ticked" badge in PresetChecklist and the notes
    that actually go out all ask the same question.
  */
  const assistHasNotes =
    Object.values(assist).some((v) => bulletLines(v).length > 0) ||
    PRESET_FIELDS.some((f) => (presets[f] ?? []).some((p) => p.id in (picked[f] ?? {})));

  function handlePreview() {
    startPreview(async () => {
      const fd = new FormData();
      fd.set("recordingId", rec.id);
      fd.set("dg_grade", dgGrade);
      fd.set("cm_grade", cmGrade);
      fd.set("ro_grade", roGrade);
      fd.set("dg_comment", dgComment);
      fd.set("cm_comment", cmComment);
      fd.set("ro_comment", roComment);
      fd.set("overall_comment", overallComment);
      fd.set("send_now", "0");
      await submitExaminerReviewAction({}, fd);
      /*
        Same tab. This opened the report with window.open(..., "_blank"), and
        a report in a new tab is the thing that was taken out of the
        candidate's side of the product for being confusing; it survived here.
        Nothing is lost by navigating: the line above has already saved the
        draft, so Back returns to the form with every grade and comment still
        on it.
      */
      router.push(`/recordings/${rec.id}`);
    });
  }

  const dgPts = pts(dgGrade, "dg");
  const cmPts = pts(cmGrade, "cm");
  const roPts = pts(roGrade, "ro");
  const totalPts = dgPts !== null && cmPts !== null && roPts !== null ? dgPts + cmPts + roPts : null;

  /*
    The three domains, once.

    Defined here rather than inline in the cards, because the grades are set
    in the score bar at the top and the comments are written in the cards
    below, and those two places have to agree about what a domain is. Two
    copies of this list would drift the first time one was edited.
  */
  const DOMAINS = [
    {
      key: "dg", short: "DG", label: "Data Gathering & Diagnosis", max: 3, points: dgPts,
      grade: dgGrade, setGrade: setDgGrade, comment: dgComment, setComment: setDgComment,
      commentName: "dg_comment" as const,
      aiGrade: rec.ai_data_gathering, aiComment: rec.ai_comment_data_gathering,
    },
    {
      key: "cm", short: "CM", label: "Clinical Management", max: 4.5, points: cmPts,
      grade: cmGrade, setGrade: setCmGrade, comment: cmComment, setComment: setCmComment,
      commentName: "cm_comment" as const,
      aiGrade: rec.ai_clinical_management, aiComment: rec.ai_comment_clinical_management,
    },
    {
      key: "ro", short: "RO", label: "Relating to Others", max: 3, points: roPts,
      grade: roGrade, setGrade: setRoGrade, comment: roComment, setComment: setRoComment,
      commentName: "ro_comment" as const,
      aiGrade: rec.ai_relating_to_others, aiComment: rec.ai_comment_relating_to_others,
    },
  ];

  /*
    How many of the three domain comments have something in them.

    It matters now that they live behind a fold. Send is gated on all three,
    so a collapsed section hiding an empty one would leave the examiner with
    a greyed-out Send and nothing on screen saying why. The count goes on the
    section's own header, and an incomplete set opens it.
  */
  const commentsWritten = DOMAINS.filter((d) => d.comment.trim().length > 0).length;
  const allCommentsSet = commentsWritten === 3;
  const canSubmit = !!dgGrade && !!cmGrade && !!roGrade && allCommentsSet;

  const [state, formAction, pending] = useActionState(submitExaminerReviewAction, {});
  const [showSuccess, setShowSuccess] = useState(false);
  /** Send has been asked for once and is waiting to be confirmed. */
  const [confirmingSend, setConfirmingSend] = useState(false);
  /** Which domain's comment is open in the dialog, by key, or none. */
  const [openDomain, setOpenDomain] = useState<string | null>(null);
  /*
    Which tab of the station modal is open, or none.

    Separate state from openDomain rather than one "what is open" union: the
    two modals are opened from different places for different reasons, and a
    shared slot is how you end up with the comment dialog closing because
    somebody clicked a notepad heading.
  */
  const [stationTab, setStationTab] = useState<StationTab | null>(null);
  /*
    The setter goes to Notepad as-is, with no useCallback around it.

    Something stable is required — Notepad is memo'd and an inline arrow here
    would rebuild it on every render, re-rendering forty-eight tick rows on
    every keystroke in every box. A setState setter already is stable, React
    guarantees it, so wrapping one in useCallback buys nothing and costs
    something: the compiler reported it could not preserve the memoization
    and skipped the component.
  */

  // One announcement per send. The effect below runs twice per state in
  // React's development double-invoke, and the navbar would count down twice.
  const announced = useRef(false);
  useEffect(() => {
    /*
      Any action landing disarms the send confirmation.

      Mostly this matters for the one that fails: an error returns the normal
      three buttons so the message can be read and the send retried
      deliberately, rather than leaving a primed Send sitting under the
      cursor. A question that stays asked stops being a question.
    */
    setConfirmingSend(false);
    if ("sent" in state && state.sent && !announced.current) {
      announced.current = true;
      setJustSent(true);
      window.dispatchEvent(new CustomEvent(REVIEW_SENT_EVENT, { detail: rec.id }));
    }
    if ("success" in state && state.success) {
      // What was just written is now what is saved, so the draft has caught
      // up with it and the base for anything typed next is this.
      setSavedComment(overallComment);
      // Same for the six. This is what clears the stored record, through the
      // writer's sameSix check, and what any later draft is measured against.
      setSavedSix({ dgGrade, cmGrade, roGrade, dgComment, cmComment, roComment });
      setSixRestored(false);
      setShowSuccess(true);
      const t = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(t);
    }
    // overallComment is deliberately not a dependency: this should run when a
    // save lands, not every time the box is typed in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const hasAi = rec.ai_data_gathering || rec.ai_clinical_management || rec.ai_relating_to_others;

  return (
    <div className="min-h-screen" style={{ background: LIGHT_BG }}>
      <div className="max-w-[1180px] mx-auto px-4 py-10">

        <div className="mb-6 flex items-center gap-4 flex-wrap">
          <Link href="/examiner" className="text-[12px] font-semibold" style={{ color: "rgba(51,51,51,0.45)", textDecoration: "none" }}>
            ← Review Queue
          </Link>
          {/*
            The case itself, for reference while marking, in its own tab so
            the half-written review is still here on the way back.

            A plain <a> rather than <Link>: this is a heavy page an examiner
            may never open, and prefetching it on hover would fetch the whole
            station every time the cursor crossed the header.

            It resolves by station number — /case-bank/[station_number] looks
            up stations.number, and station_recordings carries no station id
            to use instead. This is the candidate's view of the case: the
            marking notes are stripped from it (lib/case-bank-types,
            toCandidateStation) and are not shown to examiners anywhere.
          */}
          <a
            href={`/case-bank/${rec.station_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold"
            style={{ color: "rgba(51,51,51,0.45)", textDecoration: "none" }}
          >
            Open Station {rec.station_number} ↗
          </a>
        </div>

        <form action={formAction}>
          <input type="hidden" name="recordingId" value={rec.id} />

          {/*
            The overall comment travels as a hidden field, not as the textarea
            that shows it.

            That textarea lives inside the Overall Comment accordion, and an
            accordion unmounts its body — so collapsing it took the field out
            of the form. A Save or a Send then carried no overall_comment at
            all, the server read "" and wrote null, and the draft effect below
            removed the localStorage copy because the live state still matched
            what it thought had just been saved. Both copies of the comment,
            destroyed by tidying the rail — which the accordion's own comment
            recommends doing.

            Here it is outside every accordion and always submitted, whatever
            is open. The same pattern GradeSelector already uses for the
            grades, for the same reason: what the form sends should not depend
            on what is on screen.
          */}
          <input type="hidden" name="overall_comment" value={overallComment} />

          {/*
            The three domain comments travel the same way, for the same
            reason, and before they need to.

            Each is shown in two places now — the card and the modal behind
            the score bar's DG/CM/RO buttons — and a <textarea name="..."> in
            each would put two entries in the FormData. More to the point,
            the next step of this layout change collapses the cards into an
            accordion, and an accordion unmounts its body: exactly what wiped
            the overall comment. Lifting the fields out now means that step
            cannot repeat it.
          */}
          {DOMAINS.map((d) => (
            <input key={d.key} type="hidden" name={d.commentName} value={d.comment} />
          ))}

          {/*
            The form's default button. It does nothing a person can see, and
            it is load-bearing.

            Enter on a focused control implicitly submits the form, and the
            browser picks the FIRST submit button to do it with. A text input
            is not required for this: measured in Chrome, Enter on a preset
            tick box submits, and it submits with whatever that first button
            is. While the send confirmation is up, the only other submit in
            this form is "Yes, send the report" — so that key press sent the
            report to the candidate and the whole room, with no second click
            and nothing on screen having been pressed at all.

            First in the DOM, never disabled, always send_now=0. The visible
            buttons below are then free to change, appear and disappear
            without implicit submission ever being able to do more than save
            a draft.
          */}
          <button
            type="submit"
            name="send_now"
            value="0"
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
          />


          {/*
            Two columns, at every width.

            The right rail is where the examiner writes; the left is what they
            are writing about. Scrolling the marking form no longer takes the
            comment box off screen, so the overall comment can be composed
            while the domain cards and the transcript are still in view — which
            is the point of an overall comment.

            EQUAL TRACKS NOW, where the right one used to be 360px.

            The narrow rail had the width allocated backwards. Measured over
            the reviews written so far, a grade changed twice in nine and a
            domain comment twice in nine, while a long overall comment —
            1,719 characters on average — was written every time. The widest
            column held the thing edited least and the narrowest held the
            thing written most, because the rail had to fit the notepad AND
            the comment stacked on top of each other. They take turns now,
            so each gets half the page.

            minmax(0, 1fr) rather than 1fr on both: a plain 1fr floors at
            min-content, so a long transcript word or a wide preset would
            push the grid out and force a horizontal scrollbar.
          */}
          {/*
            Above the columns, not inside one.

            It names the consultation, which is true of the whole page, so it
            was the one thing in the left column that was not about the left
            column — and it pushed the score bar, the first thing you reach
            for, a card's height down. Full width also lets the roster sit on
            one line instead of wrapping in a 768px track.
          */}
          {/*
            Two lines: what the case is, then who was in it.

            It was three — the station number, the title and the roster each
            on their own — across a bar the full width of the page, so most
            of what it occupied was air. The number is four characters and
            belongs beside the title it numbers, not above it.

            items-baseline, so the small caps sit on the title's baseline
            rather than being centred against a 21px line and floating. The
            wrap is there for a title long enough to need the whole row; it
            then takes the second line and the roster the third, which is
            where it started and only for the cases that need it.
          */}
          <div className="rounded-2xl px-6 py-4 mb-4" style={{ background: NAVY, color: "white" }}>
            {/*
              Both halves open the case. Buttons rather than a wrapper with an
              onClick, so they are reachable by keyboard and announce
              themselves; type="button" because this header sits above the
              form and Enter on a submit-typed control once sent a report.

              Underlined rather than given a hover colour: this is white text
              on navy, where a tint change is close to invisible, and the
              DG/CM/RO buttons in the score bar already use an underline to
              mean the same thing.

              Plain text with no affordance when there is no station row to
              show, which is a value join that can miss rather than an error.
            */}
            <div className="flex items-baseline gap-3 flex-wrap">
              {station ? (
                <>
                  <button
                    type="button"
                    onClick={() => setStationTab("brief")}
                    title="Open the doctor's brief and the patient's story"
                    className="text-[11px] font-bold uppercase tracking-[0.07em] opacity-50 whitespace-nowrap"
                    style={{ background: "none", border: "none", padding: 0, color: "inherit", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                  >
                    Station {rec.station_number}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStationTab("brief")}
                    title="Open the doctor's brief and the patient's story"
                    className="font-display font-extrabold text-[21px] m-0 text-left"
                    style={{ background: "none", border: "none", padding: 0, color: "inherit", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 }}
                  >
                    {rec.station_title}
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-bold uppercase tracking-[0.07em] opacity-50 whitespace-nowrap">
                    Station {rec.station_number}
                  </span>
                  <h1 className="font-display font-extrabold text-[21px] m-0">{rec.station_title}</h1>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 text-[12px] opacity-60 flex-wrap mt-1.5">
              <span>Doctor: {rec.doctor_display_name}</span>
              <span>Patient: {rec.patient_display_name}</span>
              <span>{new Date(rec.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" })}</span>
              {isSent && <span style={{ color: "#86efac" }}>✓ Report already sent</span>}
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 items-start">

            <div className="min-w-0">

            {/*
              Score and transport, stuck together at the top.

              The player used to sit in the flow below this bar, which meant
              scrolling to the transcript scrolled the pause button away —
              and the transcript is the one place you most want to stop the
              audio. They share a card rather than being two sticky
              elements because two would need the second to know the height
              of the first, measured and re-measured on every resize, to
              stack without overlapping.

              IN THE LEFT COLUMN, and it is the notepad that decides that.
              Full width above both columns the bar read more comfortably,
              but the rail opposite then had to start below it, and that is
              64px off the length of the notepad — which is the thing being
              written in for most of a review. The two are in separate grid
              tracks here, so neither can slide under the other however far
              the page scrolls, and the rail sticks at 12 again.

              The per-domain points went to make it fit. At 564px twelve
              grade buttons, three labels, three point readouts and a total
              wrapped to two rows; the readouts were the only part saying
              something the grade beside them and the total at the end do not
              already say. The exact figure is still a hover away.
            */}
            <div
              className="rounded-2xl mb-5"
              style={{
                background: "white",
                border: "1px solid rgba(51,51,51,0.08)",
                position: "sticky",
                top: 12,
                zIndex: 20,
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              }}
            >
            {/*
              The grades live here, not in the cards.

              They are three rows of four buttons and they are needed on
              every review; the domain comments beneath them are long and,
              measured over the reviews written so far, changed about twice
              in nine. Keeping the small, always-needed control pinned and
              the large, rarely-touched one in the page is the right way
              round — and it puts the grade next to the running total, so
              the consequence of a click is visible in the same glance.

              This bar replaced a read-only "DG: 2/3 · CM: 3/4.5" line.
            */}
            <div className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-x-3 gap-y-2 flex-wrap">
                {DOMAINS.map((d) => (
                  <div key={d.key} className="flex items-center gap-1.5">
                    {/* The label is the way into the comment. The grades are
                        up here and the comments are not, so without this,
                        checking what you wrote means scrolling. It carries
                        the points too now they are off the bar: the one
                        place anyone would think to look for them. */}
                    <button
                      type="button"
                      onClick={() => setOpenDomain(d.key)}
                      className="text-[10px] font-bold uppercase tracking-[0.06em]"
                      style={{ background: "none", border: "none", padding: 0, color: "rgba(51,51,51,0.4)", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 }}
                      title={`${d.label} — ${d.points !== null ? `${d.points} of ${d.max} points` : `max ${d.max} points`}. Opens the comment.`}
                    >
                      {d.short}
                    </button>
                    <GradeSelector name={`${d.key}_grade`} value={d.grade} onChange={d.setGrade} compact disabled={isSent} />
                  </div>
                ))}
              </div>
              {/* The score is the number; the ceiling is a reminder, and it
                  does not need to be the same size as the thing it reminds
                  you about. Shrinking it is also most of what keeps this row
                  on one line at 564px. */}
              <span className="font-extrabold text-[20px] tabular-nums whitespace-nowrap" style={{ color: NAVY }}>
                {totalPts !== null ? totalPts : "—"}
                <span className="font-semibold text-[12px]" style={{ color: "rgba(51,51,51,0.35)" }}> / 10.5</span>
              </span>
            </div>

              {(doctorAudioUrl || patientAudioUrl) && (
                <div className="px-5 pb-4" style={{ borderTop: "1px solid rgba(51,51,51,0.07)", paddingTop: 12 }}>
                  <DualTrackPlayer
                    doctorUrl={doctorAudioUrl}
                    patientUrl={patientAudioUrl}
                    compact
                    onTime={emitTime}
                    onPlayingChange={setAudioPlaying}
                    seekRef={seekRef}
                    toggleRef={togglePlayRef}
                  />
                </div>
              )}
            </div>


                {/*
                  Said out loud, because a silent restore of six fields is
                  indistinguishable from the page having loaded normally, and
                  the one thing the examiner needs to know is that what is on
                  screen is NOT what the server has.

                  Directly under the score bar, which is where the restored
                  grades now are. It sat beside Save and Send, a full page
                  below the thing it was describing, which is a notice you
                  read after you have already acted on it.
                */}
                {sixRestored && !showSuccess && (
                  <p className="text-[12px] m-0 mb-4 px-1" style={{ color: "#92400e" }}>
                    Restored your unsaved grades and comments from this browser. Not saved yet.
                  </p>
                )}

                {/*
                  MOVE 3: the transcript first, everything else folded under
                  it.

                  This column used to open with three tall domain cards and a
                  skills table, and the transcript — the thing the examiner
                  actually reads while the audio plays — came fourth. The
                  order now matches how often each is used: the transcript is
                  the column, and the three sections below it are what you
                  reach for when you want them.

                  Folding these is only safe because the domain comments are
                  submitted by hidden fields at the top of the form. An
                  accordion unmounts its body, and a form field inside one
                  vanishing from the FormData is exactly what nulled the
                  overall comment.

                  Open by default, because it is a fixed-height scroll box
                  rather than a thousand lines pushed into the page: it cannot
                  bury what is under it, and a transcript that has to be
                  unfolded before it can follow the audio is a transcript that
                  does not follow the audio.

                  The karaoke version needs word timings. Recordings that have
                  none — a spike row, anything transcribed before utterances
                  were kept — fall back to the formatted string, which is the
                  same thing this always showed.
                */}
                {turns.length > 0 ? (
                  <div className="mb-4">
                    <Accordion title="Transcript" defaultOpen>
                      <TranscriptKaraoke
                        turns={turns}
                        subscribe={subscribeTime}
                        isPlaying={audioPlaying}
                        onSeek={handleSeek}
                      />
                    </Accordion>
                  </div>
                ) : rec.transcript_formatted ? (
                  <div className="mb-4">
                    <Accordion title="Transcript" defaultOpen={false}>
                      <TranscriptLines text={rec.transcript_formatted} />
                    </Accordion>
                  </div>
                ) : null}

                {/*
                  The three domain comments, together.

                  They were three full cards carrying a title, a grade badge,
                  a points line, the AI's paragraph and a box. The grade and
                  the points are in the score bar now and the AI's paragraph
                  has a section of its own, so what is left is the label and
                  the box — and three of those are one section, not three
                  cards.

                  It opens itself when any of them is empty. Send is gated on
                  all three, and a fold hiding the reason a button is grey is
                  the kind of thing that gets blamed on the button.
                */}
                <div className="mb-4">
                  <Accordion
                    title="Domain comments"
                    defaultOpen={commentsWritten < 3}
                    badge={
                      commentsWritten < 3 ? (
                        <span className="text-[11px] font-semibold" style={{ color: "#92400e" }}>
                          {commentsWritten} of 3 written
                        </span>
                      ) : undefined
                    }
                  >
                    <div className="flex flex-col gap-4">
                      {DOMAINS.map(({ key, label, max, grade, comment, setComment }) => (
                        <div key={key}>
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[13px] font-bold" style={{ color: NAVY }}>{label}</span>
                            {grade && <GradeBadge grade={grade} />}
                            <span className="text-[11px]" style={{ color: "rgba(51,51,51,0.35)" }}>
                              {grade ? `${pts(grade, key)} / ${max} pts` : `max ${max} pts`}
                            </span>
                          </div>
                          {/* No name: the hidden field at the top of the form
                              submits this, so this box is free to be folded
                              away or shown twice. */}
                          <AutoTextarea
                            value={comment}
                            onChange={setComment}
                            placeholder="Add a comment…"
                            disabled={isSent}
                          />
                        </div>
                      ))}
                    </div>
                  </Accordion>
                </div>

                {/*
                  What the model said, and the button that makes it say it
                  again.

                  The pipeline strip used to sit at the top of the column on
                  its own, reading "re-running replaces the AI grades below" —
                  which was true when the AI's paragraphs were below it. They
                  are in here with it now, which is where a control that
                  replaces them belongs.
                */}
                <div className="mb-4">
                  <Accordion title="AI pre-assessment" defaultOpen={false}>
                    <div className="rounded-xl px-4 py-3 mb-4 text-[12px] flex flex-col gap-3" style={{ background: "rgba(51,51,51,0.05)", border: "1px solid rgba(51,51,51,0.1)", color: "rgba(51,51,51,0.5)" }}>
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <span>
                          {hasAi
                            ? "AI pre-assessment complete. Re-running replaces the grades and comments here."
                            : rec.ai_error
                              ? "AI grading did not complete for this consultation. Running it again reuses the existing transcript, so it goes straight to grading."
                              : "No AI pre-assessment — transcription was disabled or the pipeline did not complete."}
                        </span>
                        <RetryPipelineButton recordingId={rec.id} hasExistingMark={!!hasAi} />
                      </div>
                      {rec.ai_error && (
                        <span className="text-[11px] font-mono px-2.5 py-2 rounded-lg" style={{ background: "rgba(185,28,28,0.06)", color: "#B91C1C", wordBreak: "break-word" }}>
                          {rec.ai_error}
                        </span>
                      )}
                    </div>

                    {hasAi ? (
                      <div className="flex flex-col gap-3">
                        {DOMAINS.map(({ key, label, aiGrade, aiComment }) => (
                          <div key={key}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[12px] font-bold" style={{ color: NAVY }}>{label}</span>
                              {aiGrade && <GradeBadge grade={aiGrade} />}
                            </div>
                            <p className="text-[12.5px] leading-relaxed m-0" style={{ color: "rgba(51,51,51,0.6)", whiteSpace: "pre-wrap" }}>
                              {aiComment || "No comment."}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </Accordion>
                </div>

                <div className="mb-4">
                  <Accordion title="Skills assessment" defaultOpen={false}>
                    <ExaminerSkills
                      recordingId={rec.id}
                      aiSkills={aiSkills}
                      examinerSkills={examinerSkills}
                      labels={skillLabels}
                      disabled={isSent}
                      bare
                    />
                  </Accordion>
                </div>

                {/* Error / success */}
                {"error" in state && state.error && (
                  <p className="text-[12px] text-red-600 mb-3">{state.error as string}</p>
                )}
                {showSuccess && (
                  <p className="text-[12px] mb-3" style={{ color: "#166534" }}>✓ Saved successfully.</p>
                )}
                {/* A failed email is not a failed review — the candidate has it in
                    their inbox on the site either way — but the GP who pressed Send
                    is the only person who can chase it, so it does not stay silent. */}
                {"warning" in state && state.warning && (
                  <p className="text-[12px] mb-3" style={{ color: "#92400e" }}>{state.warning as string}</p>
                )}

                {/*
                  Action buttons, or the question that stands in front of one
                  of them.

                  Sending is the only thing on this page that cannot be taken
                  back, and until now it was a single click on the third of
                  three equal buttons, immediately beside Save Draft. The
                  server guard stops a report going twice; nothing stopped one
                  going early.
                */}
                {!isSent && !confirmingSend && (
                  <div className="flex gap-2.5 flex-wrap">
                    <button
                      type="submit"
                      name="send_now"
                      value="0"
                      disabled={pending}
                      className="flex-1 rounded-xl py-3 text-[13px] font-bold"
                      style={{ background: "rgba(51,51,51,0.07)", border: "none", color: NAVY, cursor: "pointer", opacity: pending ? 0.5 : 1 }}
                    >
                      Save Draft
                    </button>
                    <button
                      type="button"
                      onClick={handlePreview}
                      disabled={previewPending || !canSubmit}
                      className="flex-1 rounded-xl py-3 text-[13px] font-bold"
                      style={{ background: "rgba(51,51,51,0.05)", border: "1px solid rgba(51,51,51,0.1)", color: "rgba(51,51,51,0.55)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, opacity: previewPending || !canSubmit ? 0.5 : 1 }}
                    >
                      {previewPending ? "Saving…" : "Preview Report"}
                      {!previewPending && (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5 }}>
                          <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    {/*
                      type="button": this one asks first. The submit that
                      actually sends is the armed button below, which is a
                      different element in a different place.
                    */}
                    <button
                      type="button"
                      onClick={() => setConfirmingSend(true)}
                      disabled={pending || !canSubmit}
                      className="flex-1 rounded-xl py-3 text-[13px] font-bold"
                      style={{ background: NAVY, border: "none", color: "white", cursor: "pointer", opacity: pending || !canSubmit ? 0.5 : 1 }}
                    >
                      {pending ? "Sending…" : "Send to Candidate"}
                    </button>
                  </div>
                )}

                {!isSent && confirmingSend && (
                  <div>
                    {/*
                      What the click does, not whether they are sure. "Are you
                      sure" is answered yes by reflex; a sentence naming who
                      receives this is the thing that stops a send that was
                      meant to be a save.

                      "everyone else who was in the room" rather than a list:
                      the observers are ids on the row and resolving them to
                      names is the send action's job, on the server. A number
                      this page guessed at would be worse than a phrase that
                      is always true.
                    */}
                    <p className="text-[12.5px] mb-2.5" style={{ color: NAVY, lineHeight: 1.5 }}>
                      This emails the report to {rec.doctor_display_name} and everyone else who was
                      in the room. It cannot be unsent.
                    </p>
                    {/*
                      Confirm on the LEFT, Cancel where Send used to be.

                      A confirmation that appears under the cursor is no
                      confirmation at all — a double click on Send would arm
                      it and then press it. With the order swapped, the second
                      click of a double lands on Cancel.

                      While this is up it is the only submit button anyone can
                      see, which is why the form opens with a hidden one. Enter
                      on a tick box submits via the FIRST submit button, and
                      for an hour that was this one. See the note at the top of
                      the form.
                    */}
                    <div className="flex gap-2.5 flex-wrap">
                      <button
                        type="submit"
                        name="send_now"
                        value="1"
                        disabled={pending || !canSubmit}
                        className="flex-1 rounded-xl py-3 text-[13px] font-bold"
                        style={{ background: NAVY, border: "none", color: "white", cursor: "pointer", opacity: pending || !canSubmit ? 0.5 : 1 }}
                      >
                        {pending ? "Sending…" : "Yes, send the report"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingSend(false)}
                        disabled={pending}
                        className="flex-1 rounded-xl py-3 text-[13px] font-bold"
                        style={{ background: "rgba(51,51,51,0.07)", border: "none", color: NAVY, cursor: "pointer", opacity: pending ? 0.5 : 1 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
            </div>

            {/*
              Sticky at top: 12, the same offset as the Station Score bar in
              the left column. They are in different grid tracks, so neither
              can slide under the other however far the page scrolls.

              self-start matters: without it the aside stretches to the row
              height and sticky has nothing to move within.
            */}
            {/*
              Scrolls inside itself, to a height measured from where it
              actually is.

              The rail holds the comment, the voice note and six notepad
              boxes, which together are taller than most screens, so it needs
              its own overflow: a sticky element taller than the viewport
              stops behaving like one.

              The height cannot be calc(100vh - 24px). That is right only once
              the rail has stuck to the top; before that it starts wherever
              the grid row does — measured at 145px down — so a full-viewport
              rail hung 121px below the fold and four of the six notepad boxes
              could not be seen, never mind clicked. Its own scrollbar was no
              help, because the part of it that was off-screen was the
              scrollbar's own lower half.

              So it is measured instead, on scroll and on resize, and always
              ends exactly at the bottom of the window.
            */}
            <aside
              ref={railRef}
              className="min-w-0 self-start overflow-y-auto"
              style={{ position: "sticky", top: 12 }}
            >
                {/*
                  Two panels, one at a time.

                  Unmounting rather than hiding is safe because none of this
                  state lives down here: the notes, the ticks and the comment
                  are all held by this component, and the comment's form
                  field is a hidden input at the top of the form. The panel
                  is a view; switching away from it loses nothing.

                  No pill on a sent review — there is no notepad to switch
                  to, so a two-way control with one dead half would be worse
                  than no control.
                */}
                {!isSent && (
                  <div className="flex p-1 rounded-xl mb-3" style={{ background: "rgba(51,51,51,0.06)" }}>
                    {([["notes", "Notes"], ["comment", "Comment"]] as const).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setRailTab(key)}
                        className="flex-1 rounded-lg py-1.5 text-[12px] font-bold flex items-center justify-center gap-1.5"
                        style={{
                          background: railTab === key ? "white" : "transparent",
                          color: railTab === key ? NAVY : "rgba(51,51,51,0.45)",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: railTab === key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                        }}
                      >
                        {label}
                        {/* A comment exists, said without switching to it —
                            the one thing you would otherwise flip across to
                            check. */}
                        {key === "comment" && !!overallComment.trim() && (
                          <span aria-label="written" style={{ width: 5, height: 5, borderRadius: 5, background: railTab === key ? NAVY : "rgba(51,51,51,0.3)" }} />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {railTab === "comment" && (
                  <div>
                    {!isSent && (
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <button
                          type="button"
                          disabled={grammarPending || !overallComment.trim()}
                          onClick={() => {
                            setAiGenError("");
                            startGrammar(async () => {
                              const res = await grammarCheckAction({ text: overallComment, recordingId: rec.id });
                              if (res.text) setOverallComment(res.text);
                              else setAiGenError(res.error ?? "Failed");
                            });
                          }}
                          className="px-3 py-1 rounded-lg text-[11px] font-semibold"
                          style={{ background: "rgba(51,51,51,0.07)", border: "none", color: NAVY, cursor: "pointer", opacity: grammarPending || !overallComment.trim() ? 0.5 : 1 }}
                        >
                          {grammarPending ? "Checking…" : "Grammar / Spellcheck"}
                        </button>
                      </div>
                    )}
                    {aiGenError && <p className="text-[11px] text-red-600 mb-2">{aiGenError}</p>}
                    {/* No name: the hidden field at the top of the form is
                        what submits this, because this one unmounts whenever
                        the other panel is showing. */}
                    <AutoTextarea
                      value={overallComment}
                      onChange={setOverallComment}
                      placeholder="Optional overall comment to the candidate…"
                      disabled={isSent}
                    />
                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(51,51,51,0.07)" }}>
                      <VoiceNoteSection
                        recordingId={rec.id}
                        initialUrl={voiceNoteUrl}
                        readOnly={isSent}
                      />
                    </div>
                  </div>
                )}

                {railTab === "notes" && !isSent && (
                  <Notepad
                    notes={assist}
                    presets={presets}
                    picked={picked}
                    onPickedChange={handlePickedChange}
                    onPresetsChange={handlePresetsChange}
                    disabled={isSent}
                    onChange={setAssist}
                    hasNotes={assistHasNotes}
                    willOverwrite={!!overallComment.trim()}
                    pending={aiGenPending}
                    error={aiGenError}
                    onConvert={handleConvert}
                    onOpenStation={station ? setStationTab : undefined}
                    onAutofill={isSent ? undefined : openAutofill}
                    aiFilled={aiFilled}
                    showPresets={showPresets}
                    onTogglePresets={togglePresets}
                    showFreeText={showFreeText}
                    onToggleFreeText={toggleFreeText}
                    showPresetInputs={showPresetInputs}
                    onTogglePresetInputs={togglePresetInputs}
                    domainOnly={domainOnly}
                    onDomainOnlyChange={setDomainOnly}
                    dictation={dictation}
                    dictateError={dictateError}
                  />
                )}
            </aside>

          </div>
        </form>

        {/* Outside the form: it is a view onto state the form already
            carries in its hidden fields, not a field of its own. */}
        {openDomain && (() => {
          const d = DOMAINS.find((x) => x.key === openDomain);
          if (!d) return null;
          return (
            <DomainCommentDialog
              label={d.label}
              aiGrade={d.aiGrade}
              aiComment={d.aiComment}
              value={d.comment}
              onChange={d.setComment}
              disabled={isSent}
              onClose={() => setOpenDomain(null)}
            />
          );
        })()}

        {/*
          Shown on every use, deliberately, and not relied on.

          A dialog that appears every time stops being read by about the
          fifth review, which is a fact about people rather than a fault in
          the wording. It is here because the first time matters and because
          the step should not be frictionless; the thing actually doing the
          work is the marker beside each filled comment.
        */}
        {autofillStage === "warn" && (
          <div
            className="fixed inset-0 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.35)", zIndex: 3000 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setAutofillStage(null);
            }}
          >
            <div
              role="dialog"
              aria-label="Autofill ticked phrases"
              className="rounded-2xl w-full"
              style={{ background: "white", maxWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
            >
              <div className="px-6 pt-6">
                <h2 className="font-display font-bold text-[16px] m-0 mb-3" style={{ color: "#B45309" }}>
                  Warning
                </h2>
                <p className="text-[13px] leading-relaxed m-0" style={{ color: "rgba(51,51,51,0.75)" }}>
                  This populates the ticked Did Well fields with AI comments. To ensure the honesty
                  of our product please carefully review and edit these comments to match your
                  honest assessment.
                </p>

                {/*
                  Why Could Improve is not offered, in one line.

                  The examiner will notice its absence and assume it is coming
                  later, so it is better to say it is not. The reason is
                  structural rather than a limitation to be engineered away:
                  Did Well asks where something is, Could Improve asks to
                  prove a negative. Three approaches were tried and all three
                  produced absence claims, most of them wider than the truth,
                  one of them inventing a diagnosis the consultation never
                  mentioned.
                */}
                <p className="text-[12.5px] leading-relaxed m-0 mt-3" style={{ color: "#92400E" }}>
                  Could Improve is left for you. The AI cannot reliably do this. It tends to invent
                  things.
                </p>

                {autofillError && (
                  <p className="text-[12px] m-0 mt-3" style={{ color: "#B91C1C" }}>{autofillError}</p>
                )}
              </div>
              <div className="px-6 py-5 flex gap-2 justify-end flex-wrap">
                <button
                  type="button"
                  onClick={() => setAutofillStage(null)}
                  className="rounded-lg px-4 py-2 text-[13px] font-bold"
                  style={{ background: "rgba(51,51,51,0.07)", color: NAVY, border: "none", cursor: autofillPending ? "default" : "pointer" }}
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Stage two and the call, in that order and in the same
                    // click. The examiner starts dictating while it runs.
                    setAutofillStage("improve");
                    runAutofill();
                  }}
                  className="rounded-lg px-4 py-2 text-[13px] font-bold"
                  style={{ background: NAVY, color: "white", border: "none", cursor: "pointer" }}
                >
                  Yes, I understand
                </button>
              </div>
            </div>
          </div>
        )}

        {autofillStage === "improve" && (
          <ImproveDialog
            presets={presets}
            picked={picked}
            onPickedChange={handlePickedChange}
            aiFilled={aiFilled}
            dictation={dictation}
            dictateError={dictateError}
            pending={autofillPending}
            error={autofillError}
            onConvert={handleConvert}
            willOverwrite={!!overallComment.trim()}
            onClose={() => setAutofillStage(null)}
          />
        )}

        {/* Same reasoning as above, and read-only besides: nothing in here is
            a field, so it has no business inside the form. */}
        {stationTab && station && (
          <StationDialog
            station={station}
            stationNumber={rec.station_number}
            recordedTitle={rec.station_title}
            initialTab={stationTab}
            onClose={() => setStationTab(null)}
          />
        )}

      </div>
    </div>
  );
}

function VoiceNoteSection({ recordingId, initialUrl, readOnly = false }: {
  recordingId: string;
  initialUrl: string | null;
  readOnly?: boolean;
}) {
  const [savedUrl, setSavedUrl] = useState<string | null>(initialUrl);
  const [phase, setPhase] = useState<"idle" | "recording" | "review" | "uploading" | "deleting">("idle");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [err, setErr] = useState("");
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  async function startRecording() {
    setErr("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setPhase("uploading");
        setErr("");
        try {
          const fd = new FormData();
          fd.append("audio", blob);
          fd.append("recordingId", recordingId);
          const res = await fetch("/api/recordings/voice-note", { method: "POST", body: fd });
          if (!res.ok) throw new Error("Upload failed");
          setSavedUrl(url);
          setBlobUrl(null);
          setPhase("idle");
        } catch {
          setErr("Failed to save. Try again.");
          setBlobUrl(url);
          setPhase("review");
        }
      };
      recorder.start();
      recRef.current = recorder;
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      setPhase("recording");
    } catch {
      setErr("Microphone access denied.");
    }
  }

  function stopRecording() { recRef.current?.stop(); }

  function discardRecording() {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setPhase("idle");
  }

  async function deleteNote() {
    if (!confirm("Delete this voice note?")) return;
    setPhase("deleting");
    setErr("");
    try {
      await fetch(`/api/recordings/voice-note?recordingId=${recordingId}`, { method: "DELETE" });
      if (savedUrl?.startsWith("blob:")) URL.revokeObjectURL(savedUrl);
      setSavedUrl(null);
    } catch {
      setErr("Failed to delete.");
    }
    setPhase("idle");
  }

  const hasSaved = !!savedUrl;
  const badge = hasSaved ? (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.1)", color: "#166534" }}>Recorded</span>
  ) : undefined;

  return (
    <Accordion title="Voice Note" badge={badge} defaultOpen={hasSaved}>
      {err && <p className="text-[12px] text-red-600 mb-3">{err}</p>}

      {/* Saved note player */}
      {hasSaved && phase !== "recording" && phase !== "review" && (
        <div className="mb-4">
          <div className="text-[11px] mb-2" style={{ color: "rgba(51,51,51,0.45)" }}>Your voice note</div>
          <audio src={savedUrl!} controls className="w-full" style={{ height: 36 }} />
          {!readOnly && (
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={startRecording}
                disabled={phase === "deleting"}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                style={{ background: "rgba(51,51,51,0.07)", border: "none", color: NAVY, cursor: "pointer" }}
              >
                Re-record
              </button>
              <button
                type="button"
                onClick={deleteNote}
                disabled={phase === "deleting"}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                style={{ background: "rgba(239,68,68,0.08)", border: "none", color: "#B91C1C", cursor: "pointer", opacity: phase === "deleting" ? 0.5 : 1 }}
              >
                {phase === "deleting" ? "Deleting…" : "Delete"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* No saved note yet */}
      {!hasSaved && phase === "idle" && !readOnly && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.5)" }}>
            Record an optional voice message for the candidate — useful for nuanced feedback that&apos;s hard to write.
          </p>
          <button
            type="button"
            onClick={startRecording}
            className="mt-1 flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold"
            style={{ background: "rgba(239,68,68,0.1)", border: "none", color: "#B91C1C", cursor: "pointer" }}
          >
            <span style={{ fontSize: 15 }}>⏺</span> Start Recording
          </button>
        </div>
      )}

      {/* Recording in progress */}
      {phase === "recording" && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", display: "inline-block", animation: "pulse 1s infinite" }} />
            <span className="text-[13px] font-mono font-bold" style={{ color: "#B91C1C" }}>{fmtTime(seconds)}</span>
            <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.45)" }}>Recording…</span>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold"
            style={{ background: "#B91C1C", border: "none", color: "white", cursor: "pointer" }}
          >
            Stop
          </button>
        </div>
      )}

      {/* Review before saving */}
      {phase === "review" && blobUrl && (
        <div>
          <div className="text-[11px] mb-2" style={{ color: "rgba(51,51,51,0.45)" }}>Upload failed — listen back or discard</div>
          <audio src={blobUrl} controls className="w-full mb-3" style={{ height: 36 }} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={async () => {
                setPhase("uploading");
                setErr("");
                try {
                  const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                  const fd = new FormData();
                  fd.append("audio", blob);
                  fd.append("recordingId", recordingId);
                  const res = await fetch("/api/recordings/voice-note", { method: "POST", body: fd });
                  if (!res.ok) throw new Error("Upload failed");
                  setSavedUrl(blobUrl!);
                  setBlobUrl(null);
                  setPhase("idle");
                } catch {
                  setErr("Failed to save. Try again.");
                  setPhase("review");
                }
              }}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white"
              style={{ background: NAVY, border: "none", cursor: "pointer" }}
            >
              Retry Save
            </button>
            <button
              type="button"
              onClick={discardRecording}
              className="px-4 py-2 rounded-xl text-[13px]"
              style={{ background: "none", border: "1px solid rgba(51,51,51,0.15)", color: "rgba(51,51,51,0.5)", cursor: "pointer" }}
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Uploading */}
      {phase === "uploading" && (
        <p className="text-[12px]" style={{ color: "rgba(51,51,51,0.5)" }}>Saving voice note…</p>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </Accordion>
  );
}

interface AssistNotes {
  dgWell: string; dgImprove: string;
  cmWell: string; cmImprove: string;
  roWell: string; roImprove: string;
}

/** The six fields that gate Send: three grades and three domain comments. */
type SixFields = {
  dgGrade: Grade | "";
  cmGrade: Grade | "";
  roGrade: Grade | "";
  dgComment: string;
  cmComment: string;
  roComment: string;
};

const SIX_KEYS: (keyof SixFields)[] = ["dgGrade", "cmGrade", "roGrade", "dgComment", "cmComment", "roComment"];

function seedSix(rec: RecordingFull): SixFields {
  return {
    dgGrade: (rec.examiner_data_gathering ?? rec.ai_data_gathering ?? "") as Grade | "",
    cmGrade: (rec.examiner_clinical_management ?? rec.ai_clinical_management ?? "") as Grade | "",
    roGrade: (rec.examiner_relating_to_others ?? rec.ai_relating_to_others ?? "") as Grade | "",
    dgComment: rec.examiner_comment_data_gathering ?? rec.ai_comment_data_gathering ?? "",
    cmComment: rec.examiner_comment_clinical_management ?? rec.ai_comment_clinical_management ?? "",
    roComment: rec.examiner_comment_relating_to_others ?? rec.ai_comment_relating_to_others ?? "",
  };
}

function sameSix(a: Partial<SixFields>, b: SixFields): boolean {
  return SIX_KEYS.every((k) => (a[k] ?? "") === b[k]);
}

/*
  Shared empties, so a missing field does not hand PresetChecklist a brand
  new [] or {} on every render and defeat the memo on it. Both maps are
  normally complete — defaultPresetMap fills all six, and picked is seeded
  with all six — so these are the fallback never being the thing that makes
  the rail slow.
*/
const NO_PRESETS: ExaminerPreset[] = [];
const NO_SELECTION: PresetSelection = {};

/** The marker the notes boxes show. Never leaves the notepad — see bulletLines. */
const BULLET = "• ";

/**
 * How the rail is laid out, per examiner, across every review.
 *
 * HOW A NEW EXAMINER STARTS: tick lists open, free-text boxes open, per-tick
 * detail boxes closed. The shape Brandon settled on in use rather than one
 * chosen up front.
 *
 * Only the detail boxes start closed, and they are the ones that earn it:
 * they appear and disappear as phrases are ticked, so during the listening
 * pass every open one pushes the next tick further down a rail the examiner
 * is clicking at speed. The free-text boxes do not move, so they cost
 * nothing to leave open and are where anything not covered by a phrase goes.
 *
 * STORED AS "1" OR "0", NOT AS PRESENCE. The old keys were named for the
 * hidden state and written only when hiding, so an absent key meant shown.
 * That stops working the moment a default is hidden: there is no way to tell
 * "never touched it" from "chose to show it". These store the state and fall
 * back to the default when absent, so a default can change later without
 * silently flipping what anyone chose.
 *
 * New names on purpose. Reusing the old ones with inverted meaning would read
 * an existing "hidden" as "shown" for the two examiners who have set them.
 *
 * Not keyed by recording. The notes and the ticks belong to one consultation;
 * how somebody likes the rail follows them to the next.
 */
const RAIL_DEFAULTS = { presets: true, freeText: true, presetInputs: false };

const PRESETS_HIDDEN_KEY = "sca_examiner_rail_presets";

const FREE_TEXT_HIDDEN_KEY = "sca_examiner_rail_free_text";

const PRESET_INPUTS_HIDDEN_KEY = "sca_examiner_rail_preset_inputs";

/**
 * The notepad card's tint, flattened, for the sticky domain labels.
 *
 * The card itself is rgba(51,51,51,0.04) over the page's LIGHT_BG, which is
 * fine until something inside it has to be opaque: a sticky label needs a
 * background the notes cannot scroll through, and the same rgba value would
 * composite a second time and read as a darker band sliding over the card.
 *
 * So this is that colour already resolved: 250,250,248 mixed 4% toward
 * 51,51,51. If LIGHT_BG or the card's tint changes, this has to be worked out
 * again, which is the cost of the only opaque thing in a translucent card.
 */
const NOTEPAD_BG = "#F2F2F0";

/** The stored rail preference, or the default when nothing is stored. */
function readRail(key: string, fallback: boolean): boolean {
  try {
    const v = window.localStorage.getItem(key);
    return v === null ? fallback : v === "1";
  } catch {
    // Storage blocked. The default is the right answer and the toggle still
    // works for this page.
    return fallback;
  }
}

function writeRail(key: string, shown: boolean) {
  try {
    window.localStorage.setItem(key, shown ? "1" : "0");
  } catch {
    // It just will not be remembered past this page.
  }
}

const EMPTY_NOTES: AssistNotes = {
  dgWell: "", dgImprove: "",
  cmWell: "", cmImprove: "",
  roWell: "", roImprove: "",
};

/**
 * The real content of a notes box, one observation per line.
 *
 * The bullets are a typing aid and nothing more: they are stripped here, so
 * what reaches the prompt is plain lines and what comes back is prose. Also
 * what decides whether a box counts as filled in — a box holding nothing but
 * a marker the examiner tabbed through is empty.
 *
 * Tolerant of "-" and "*" as well, because anyone used to writing notes will
 * paste a list in from somewhere else.
 */
function bulletLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.replace(/^\s*[•\-*]\s*/, "").trim())
    .filter(Boolean);
}

/**
 * A preset phrase, or the detail typed against it, as one line.
 *
 * Enter makes a new line in those boxes, because a long phrase is easier to
 * read broken where you chose to break it. Downstream it is not: notes reach
 * the copy-editor one observation per line — noteList in actions.ts splits on
 * "\n" and the prompt is told each line is a separate point. A break inside a
 * detail would therefore arrive as a second observation, orphaned from the
 * preset it belongs to and with no "— " to show what it was about.
 *
 * Rejoined with a space, not a semicolon or a full stop. The break is being
 * used for width, mid-thought, so a space gives back the sentence that was
 * typed; inventing punctuation would put a mark in the examiner's writing
 * that they did not make, which is the one thing this whole path exists to
 * avoid.
 */
function oneLine(value: string): string {
  return value.replace(/\s*\n+\s*/g, " ").trim();
}

/**
 * The notes AI Assist drafts from.
 *
 * One dialog rather than a sequence of six, which was the other shape
 * considered. Six prompts in a row is six clicks forward with no way back, no
 * sight of what you have already written, and no way to fill in only the two
 * that matter. All six on one screen is the same information and none of that.
 *
 * Nothing here is required, and nothing here is stored. These are working
 * notes about what the summary should cover; what the candidate reads is
 * whatever the examiner leaves in the comment box afterwards.
 */
/**
 * One notepad box. Grows with what is typed, and keeps its first line
 * bulleted.
 *
 * Its own component so each box can hold the ref the auto-grow needs — the
 * same measure-and-set that AutoTextarea uses for the comment box above.
 *
 * The first marker is added here, on change, rather than on focus. On focus
 * it was inserted with execCommand, which needs a settled selection inside
 * the element and did not reliably have one: the first thing typed into a box
 * came out unbulleted. Adding it the moment there is something to mark has no
 * such dependency, and the caret stays where React puts it, at the end of
 * what was just typed.
 */
function NoteBox({ value, onChange, onKeyDown, tone }: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Did Well or Could Improve, for the wash. See TONE. */
  tone: Tone;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Collapse first, or scrollHeight reports the old, taller box and the
    // field can only ever grow.
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      // Found by the dictation listener on the notepad container. See useDictation.
      data-dictate
      value={value}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw && !/^\s*[•\-*]/.test(raw) ? BULLET + raw : raw);
      }}
      onKeyDown={onKeyDown}
      rows={1}
      className="w-full rounded-lg px-2.5 py-1.5 text-[12.5px] outline-none focus:border-navy/40 resize-none overflow-hidden"
      style={{
        background: TONE[tone].bg,
        border: `1px solid ${TONE[tone].border}`,
        color: NAVY,
        lineHeight: 1.5,
        minHeight: "2.4rem",
        fontFamily: "inherit",
      }}
    />
  );
}

/**
 * The examiner's notepad: six boxes, always on screen, and the button that
 * turns them into the overall comment.
 *
 * It replaced a dialog behind an "AI Assist" button. The dialog asked the
 * examiner to recall the consultation once it was over; these boxes sit in
 * the rail the whole time, so observations go down as they happen. That makes
 * the notes the thing being written and the comment the thing derived from
 * them, which is the right way round.
 *
 * Stacked rather than the dialog's three-by-two grid. That was decided when
 * the rail was 360px and two columns would have been 165px each; the column
 * is half the page now, but two columns of it are still only about 280px,
 * which is not a width anyone types a sentence in. The extra width goes into
 * the boxes instead.
 *
 * MEMO'D, and the reason is measured rather than assumed. This subtree is
 * six textareas and six tick lists — forty-eight rows — and it has nothing
 * to do with the domain comment boxes in the other column. Left unmemo'd it
 * re-rendered on every character typed anywhere on the page, and on a
 * real-length review that was a bigger slice of the cost of a keystroke than
 * the two thousand transcript spans were. Its callbacks are useCallback'd at
 * the call site for the same reason; an inline arrow in any of them undoes
 * this.
 */
const Notepad = memo(function Notepad({
  notes, onChange, presets, picked, onPickedChange, onPresetsChange, disabled,
  hasNotes, willOverwrite, pending, error, onConvert, onOpenStation, onAutofill, aiFilled,
  showPresets, onTogglePresets, showFreeText, onToggleFreeText, showPresetInputs, onTogglePresetInputs, domainOnly, onDomainOnlyChange, dictation, dictateError,
}: {
  notes: AssistNotes;
  onChange: (n: AssistNotes) => void;
  presets: PresetMap;
  picked: Record<PresetField, PresetSelection>;
  onPickedChange: (field: PresetField, selection: PresetSelection) => void;
  onPresetsChange: (field: PresetField, next: ExaminerPreset[]) => void;
  /** Sent reviews are read-only, here as everywhere else on this page. */
  disabled: boolean;
  hasNotes: boolean;
  /** There is already a comment, which converting replaces. */
  willOverwrite: boolean;
  pending: boolean;
  error: string;
  onConvert: () => void;
  /** Opens the station modal on a domain's tab. Absent when the recording's
   *  station_number matched no row, which leaves the headings plain. */
  onOpenStation?: (tab: StationTab) => void;
  /** Opens the autofill warning. Absent once the review is sent. */
  onAutofill?: () => void;
  /** What the AI wrote against each ticked phrase, by preset id. The text,
   *  so the marker is a comparison rather than a flag someone has to clear. */
  aiFilled: Record<string, string>;
  /** The two layout toggles. Owned by the parent because autofill has to be
   *  able to force the tick lists back open, and an examiner cannot check
   *  what an AI wrote inside a list that is collapsed. */
  showPresets: boolean;
  onTogglePresets: () => void;
  showFreeText: boolean;
  onToggleFreeText: () => void;
  /** The per-tick detail boxes are closed, for a fast listening pass. */
  showPresetInputs: boolean;
  onTogglePresetInputs: () => void;
  /** Show one domain only. Not persisted: it belongs to this half hour. */
  domainOnly: "all" | "dg" | "cm" | "ro";
  onDomainOnlyChange: (d: "all" | "dg" | "cm" | "ro") => void;
  /** Lifted to the parent so the Could Improve dialog, which renders outside
   *  this component, can hold the same microphone rather than a second one. */
  dictation: ReturnType<typeof useDictation>;
  dictateError: string | null;
}) {
  const [confirming, setConfirming] = useState(false);


  const set = (k: keyof AssistNotes) => (v: string) => onChange({ ...notes, [k]: v });

  /*
    Enter starts a new bullet.

    Edits go through execCommand rather than through setState with the caret
    put back by hand. The obvious version does not work on a controlled
    textarea: writing the value moves the caret to 0, and restoring it from a
    requestAnimationFrame races React's re-render — measured, it lost every
    time, and the notes came out in reverse order. execCommand does the edit
    the way a keystroke would, so the browser owns the caret and native undo
    keeps working.
  */
  const key = (k: keyof AssistNotes) => (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const { selectionStart: start, selectionEnd: end, value } = el;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertText", false, "\n" + BULLET);
      return;
    }

    // Backspace on an empty bullet takes the whole line, rather than eating
    // the space inside the marker and leaving a stranded "•".
    if (e.key === "Backspace" && start === end) {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      if (start === lineStart + BULLET.length && value.slice(lineStart, start) === BULLET) {
        e.preventDefault();
        el.setSelectionRange(lineStart === 0 ? 0 : lineStart - 1, start);
        document.execCommand("delete");
      }
    }
  };

  const box = (k: keyof AssistNotes, tone: Tone) => (
    <NoteBox value={notes[k]} onChange={set(k)} onKeyDown={key(k)} tone={tone} />
  );

  const DOMAINS: {
    label: string;
    well: keyof AssistNotes;
    improve: keyof AssistNotes;
    wellField: PresetField;
    improveField: PresetField;
    /** Which tab of the station modal this heading opens, or null when the
     *  case bank has nothing to show for that domain. */
    tab: StationTab | null;
  }[] = [
    { label: "Data Gathering", well: "dgWell", improve: "dgImprove", wellField: "dg_well", improveField: "dg_improve", tab: "dg" },
    { label: "Clinical Management", well: "cmWell", improve: "cmImprove", wellField: "cm_well", improveField: "cm_improve", tab: "cm" },
    /* No tab. The case bank holds per-domain material for the first two
       domains and none at all for this one: marking_notes_relating_to_others
       is set on 2 of 246 stations. A heading that opened an empty panel would
       be worse than one that does not open. */
    { label: "Relating to Others", well: "roWell", improve: "roImprove", wellField: "ro_well", improveField: "ro_improve", tab: null },
  ];

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(51,51,51,0.04)", border: "1px solid rgba(51,51,51,0.08)" }}
      /*
        One set of handlers for every field in here.

        Capture, so the slash is settled before the note boxes' own Enter and
        Backspace handling sees the key. On the container rather than the
        fields because the per-preset detail inputs appear and disappear as
        boxes are ticked, and nothing that has to be attached to them would
        survive that.
      */
      onKeyDownCapture={dictation.onKeyDownCapture}
      onKeyUp={dictation.onKeyUp}
      onBlurCapture={dictation.onBlurCapture}
    >
      {/* No explanatory line under this. Six boxes headed "did well" and
          "could improve" explain themselves, and the sentence that was here
          cost 32px of a rail that has none to spare. */}
      {/*
        Heading and pills, with Convert directly under them, and the layout
        toggles alongside.

        Convert lives inside this row rather than below it because the
        toggle stack on the right is four lines tall and the heading was
        one, so anything after the row began four lines down with nothing
        in between. Putting Convert in the left column fills that gap with
        the button instead of air, and items-start is what lets the two
        columns be different heights.
      */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.07em] m-0" style={{ color: "rgba(51,51,51,0.45)" }}>
            Notepad
          </h3>
          {/*
            One domain at a time, for an examiner working through the rail
            domain by domain rather than top to bottom.

            Sits beside the heading rather than above the lists so it reads
            as what the notepad is showing, not as a fourth thing to fill in.
            The sticky headings are kept: these two answer different
            questions, this one "show me only this", those one "which am I
            in", and the sticky labels still do their job inside a filter.

            ALL is a pill rather than a second click on the active one.
            Clicking the thing that is already on to turn it off is a
            convention people learn, not one they guess, and the cost of
            guessing wrong here is two thirds of the notepad staying hidden.
          */}
          <div className="flex gap-1">
            {([["all", "All"], ["dg", "DG"], ["cm", "CM"], ["ro", "RTO"]] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => onDomainOnlyChange(key)}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  background: domainOnly === key ? NAVY : "rgba(51,51,51,0.06)",
                  color: domainOnly === key ? "white" : "rgba(51,51,51,0.45)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          disabled={!hasNotes || pending}
          onClick={() => {
            if (willOverwrite && !confirming) { setConfirming(true); return; }
            setConfirming(false);
            onConvert();
          }}
          /* Sized to its text, not to the column. It belongs with the pills
             above it rather than reading as a banner across the rail, and a
             full-width navy bar was the loudest thing on a page whose job is
             to be read. */
          className="rounded-lg px-4 py-2 text-[12.5px] font-bold mb-1.5"
          style={{
            background: NAVY, border: "none", color: "white",
            cursor: !hasNotes || pending ? "default" : "pointer",
            opacity: !hasNotes || pending ? 0.4 : 1,
          }}
        >
          {pending ? "Converting…" : confirming ? "Replace the comment?" : "Convert to Examiner Report"}
        </button>
  
        {/*
          Replacing a comment already written is the one thing here that cannot
          be undone, so it asks. Only when there is something to lose.
        */}
        {confirming && (
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="text-[11.5px] mb-1.5 ml-3"
            style={{ background: "none", border: "none", color: "rgba(51,51,51,0.5)", cursor: "pointer" }}
          >
            Cancel, keep what is written
          </button>
        )}
          </div>
        </div>
        {/* Same faint treatment as Edit presets. These are things you set
            once and then forget, not part of marking a consultation. Stacked
            rather than side by side: two underlined phrases on one line read
            as one sentence, and the rail has the vertical room where it has
            no horizontal room at all. */}
        <div className="flex flex-col items-end gap-0.5" style={{ flexShrink: 0 }}>
          {/* First, because it is the one that does something to the review
              rather than to the layout. Styled like its neighbours all the
              same: it is still a thing you reach for, not the main act. */}
          {onAutofill && (
            <button
              type="button"
              onClick={onAutofill}
              className="text-[10px]"
              style={{ background: "none", border: "none", color: "rgba(51,51,51,0.35)", cursor: "pointer", textDecoration: "underline", padding: 0 }}
            >
              Autofill Ticked
            </button>
          )}
          <button
            type="button"
            onClick={onTogglePresets}
            className="text-[10px]"
            style={{ background: "none", border: "none", color: "rgba(51,51,51,0.35)", cursor: "pointer", textDecoration: "underline", padding: 0 }}
          >
            {showPresets ? "Hide presets" : "Show presets"}
          </button>
          <button
            type="button"
            onClick={onToggleFreeText}
            className="text-[10px]"
            style={{ background: "none", border: "none", color: "rgba(51,51,51,0.35)", cursor: "pointer", textDecoration: "underline", padding: 0 }}
          >
            {showFreeText ? "Hide free text" : "Show free text"}
          </button>
          <button
            type="button"
            onClick={onTogglePresetInputs}
            className="text-[10px]"
            style={{ background: "none", border: "none", color: "rgba(51,51,51,0.35)", cursor: "pointer", textDecoration: "underline", padding: 0 }}
          >
            {showPresetInputs ? "Keep preset inputs hidden" : "Show preset inputs"}
          </button>
        </div>
      </div>

      {/*
        The only sign that dictation exists, so it says the key when idle
        rather than only appearing once something is happening. It doubles as
        the recording indicator, which has to be visible anyway: a page that
        is quietly holding the microphone open should say so.
      */}

      {error && <p className="text-[11px] m-0 mb-2" style={{ color: "#B91C1C" }}>{error}</p>}
      {!hasNotes && !error && (
        <p className="text-[11px] m-0 mb-2" style={{ color: "rgba(51,51,51,0.4)" }}>
          Write at least one note first.
        </p>
      )}

      <p className="text-[10.5px] m-0 mb-2.5" style={{ color: dictateError ? "#B91C1C" : "rgba(51,51,51,0.4)" }}>
        {dictateError
          ? dictateError
          : dictation.state === "listening"
          ? "● Listening — let go of / to stop"
          : dictation.state === "transcribing"
          ? "Transcribing…"
          : "Hold / in any box to dictate"}
      </p>

      <div className="flex flex-col gap-3 mt-3">
        {DOMAINS.filter((d) => domainOnly === "all" || d.wellField.startsWith(domainOnly)).map((d) => (
          <div key={d.label}>
            {/*
              Which domain you are in, without having to scroll back up for it.

              Sticky, not a side gutter and not an observer. The rail is its
              own scroll container, so a label with top: 0 pins to the top of
              the rail while its domain is on screen and leaves with it when
              the next one arrives, which is the question being asked. Nothing
              to go stale, no scroll listener, no horizontal space given up by
              a column that is the writing column.

              The negative margin takes the background out to the notepad
              card's own edge, and no further: the rail sets overflow-y, which
              makes its overflow-x auto as well, so anything hung outside that
              card would either be clipped or put a scrollbar inside the rail.
              The padding it cancels is the card's p-5.

              An opaque background is the load-bearing part. Without one the
              notes scroll through the label and both become unreadable, and
              the card's own tint is translucent, so this is the tint composited
              over the page behind it rather than the same rgba value again.
            */}
            <div
              className="text-[12px] font-bold -mx-5 px-5 pt-1 pb-1.5 mb-1.5"
              style={{ position: "sticky", top: 0, zIndex: 2, color: NAVY, background: NOTEPAD_BG }}
            >
              {/* The heading opens the case material for its domain, where
                  there is any. A button inside the sticky band rather than a
                  sticky button, so the opaque strip stays full width whether
                  or not this domain has anything to open. */}
              {d.tab && onOpenStation ? (
                <button
                  type="button"
                  onClick={() => onOpenStation(d.tab!)}
                  title={`Open the case material for ${d.label}`}
                  className="text-[12px] font-bold"
                  style={{ background: "none", border: "none", padding: 0, color: NAVY, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  {d.label}
                </button>
              ) : (
                d.label
              )}
            </div>

            {/* Tick list, then the free text under it. The presets carry what
                recurs; the box carries what does not, and every consultation
                has some of both. */}
            <PresetChecklist
              field={d.wellField}
              label="Did well"
              presets={presets[d.wellField] ?? NO_PRESETS}
              selection={picked[d.wellField] ?? NO_SELECTION}
              onSelectionChange={onPickedChange}
              onPresetsChange={onPresetsChange}
              disabled={disabled}
              tone="well"
              collapsed={!showPresets}
              hideInputs={!showPresetInputs}
              aiFilled={aiFilled}
            />
            {showFreeText && box(d.well, "well")}

            <div className="mt-2.5">
              <PresetChecklist
                field={d.improveField}
                label="Could improve"
                presets={presets[d.improveField] ?? NO_PRESETS}
                selection={picked[d.improveField] ?? NO_SELECTION}
                onSelectionChange={onPickedChange}
                onPresetsChange={onPresetsChange}
                disabled={disabled}
                tone="improve"
                collapsed={!showPresets}
              hideInputs={!showPresetInputs}
              aiFilled={aiFilled}
              />
              {showFreeText && box(d.improve, "improve")}
            </div>
          </div>
        ))}
      </div>


      {/* Both halves hidden leaves six domain labels and nothing to write in,
          which looks broken rather than chosen. The two buttons above are
          still there to undo it, so this only has to say what happened. */}
      {!showPresets && !showFreeText && (
        <p className="text-[11px] m-0 mt-3" style={{ color: "rgba(51,51,51,0.4)" }}>
          Both the tick lists and the free-text boxes are hidden. Nothing has been lost.
        </p>
      )}
    </div>
  );
});

/**
 * One domain's comment, reachable from the score bar.
 *
 * The grades moved to the top of the page and the comments did not, so
 * checking what you wrote about Data Gathering meant scrolling back down
 * past everything. The DG/CM/RO labels beside each grade open this instead:
 * the AI's paragraph for reference and your own comment, editable, at the
 * width a paragraph deserves rather than a card's.
 *
 * It edits the same state the card does — they are two views of one string,
 * which is safe because neither carries the form field any more. See the
 * hidden inputs at the top of the form.
 */
/**
 * Stage two: the Could Improve phrases, for the examiner to fill in their own
 * words while the Did Well search runs behind it.
 *
 * This exists because the honest answer to "can the AI do Could Improve" is
 * no, and a product that says so and then does nothing has only moved the
 * work without naming it. Asking here turns the one thing the machine cannot
 * do into the one moment the examiner is asked to do it, batched into a
 * single pass rather than scattered across six boxes in three domains.
 *
 * DICTATION IS THE POINT. These are spoken sentences, not typed ones, and
 * holding slash here has to work exactly as it does in the notepad. The
 * handlers come from the parent's single useDictation, so this dialog and the
 * notepad share one microphone and one indicator rather than racing for both.
 *
 * Only phrases with nothing written yet. A ticked phrase with no comment is
 * already a complete recommendation — "Try to ask ICE earlier" stands up on
 * its own — so blank is not an empty field, it is the general version, and
 * what is typed here is the version specific to this candidate.
 */
function ImproveDialog({
  presets, picked, onPickedChange, aiFilled, dictation, dictateError, pending, error, onConvert, willOverwrite, onClose,
}: {
  presets: PresetMap;
  picked: Record<PresetField, PresetSelection>;
  onPickedChange: (field: PresetField, next: PresetSelection) => void;
  aiFilled: Record<string, string>;
  dictation: ReturnType<typeof useDictation>;
  dictateError: string | null;
  pending: boolean;
  error: string;
  /** Runs the notepad Convert and flips the rail to the comment. */
  onConvert: () => void;
  /** An overall comment already exists, so Convert would replace it. */
  willOverwrite: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Not while the microphone is open: slash is held down to dictate and
      // Escape is how you abandon a sentence, not the whole dialog.
      if (e.key === "Escape" && dictation.state === "idle") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, dictation.state]);

  /*
    Frozen on mount. The list is "what was empty when the dialog opened", so a
    row cannot vanish from under the cursor the moment the first word of
    dictation lands in it.
  */
  const [rows] = useState(() => {
    const collect = (suffix: "_well" | "_improve") =>
      PRESET_FIELDS.filter((f) => f.endsWith(suffix)).flatMap((field) => {
        const selection = picked[field] ?? {};
        const domain = FIELD_LABEL[field].split(" — ")[0];
        return (presets[field] ?? [])
          .filter((p) => p.id in selection && !(selection[p.id] ?? "").trim())
          .map((p) => ({ field, id: p.id, phrase: p.text, domain }));
      });
    // The well side is exactly what runAutofill was given, computed the same
    // way from the same snapshot, so the left column lists what is in flight.
    return { well: collect("_well"), improve: collect("_improve") };
  });

  const [confirming, setConfirming] = useState(false);

  function setComment(field: PresetField, id: string, value: string) {
    onPickedChange(field, { ...(picked[field] ?? {}), [id]: value });
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.35)", zIndex: 3000 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && dictation.state === "idle") onClose();
      }}
    >
      <div
        role="dialog"
        aria-label="Could Improve, in your words"
        className="rounded-2xl w-full flex flex-col"
        style={{ background: "white", maxWidth: 1000, maxHeight: "88vh", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
        onKeyDownCapture={dictation.onKeyDownCapture}
        onKeyUp={dictation.onKeyUp}
        onBlurCapture={dictation.onBlurCapture}
      >
        <div className="px-6 pt-6 pb-3" style={{ flexShrink: 0 }}>
          <h2 className="font-display font-bold text-[16px] m-0 mb-2" style={{ color: NAVY }}>
            Did Well, filling. Could Improve, over to you.
          </h2>
          <p className="text-[10.5px] m-0" style={{ color: dictateError ? "#B91C1C" : "rgba(51,51,51,0.4)" }}>
            {dictateError
              ? dictateError
              : dictation.state === "listening"
              ? "● Listening — let go of / to stop"
              : dictation.state === "transcribing"
              ? "Transcribing…"
              : "Hold / in any box to dictate"}
          </p>
        </div>

        {/*
          Two columns, one per half, which is what makes the stage worth
          having. The left fills itself while the right is being dictated, so
          the wait is spent working rather than watching, and the two halves
          of a domain are read side by side instead of scrolled between.
        */}
        <div className="px-6 pb-2 grid gap-5" style={{ gridTemplateColumns: "1fr 1fr", overflowY: "auto", flex: 1, alignItems: "start" }}>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: "rgba(51,51,51,0.4)" }}>
              Did Well {pending && <span style={{ color: AI_MARK }}>· filling…</span>}
            </div>
            {rows.well.length === 0 ? (
              <p className="text-[12px] m-0" style={{ color: "rgba(51,51,51,0.4)" }}>
                Nothing ticked under Did Well was waiting for a comment.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {rows.well.map((r) => {
                  const value = picked[r.field]?.[r.id] ?? "";
                  const isAi = aiFilled[r.id] !== undefined && aiFilled[r.id] === value;
                  return (
                    <div key={r.id}>
                      <div className="text-[9.5px] font-bold uppercase tracking-[0.05em]" style={{ color: "rgba(51,51,51,0.3)" }}>
                        {r.domain}
                      </div>
                      <div className="text-[12px] font-semibold mb-1" style={{ color: NAVY }}>
                        {r.phrase}
                        {isAi && <span className="text-[10px] font-bold" style={{ color: AI_MARK, marginLeft: 5 }}>(AI)</span>}
                      </div>
                      <textarea
                        data-dictate
                        rows={2}
                        value={value}
                        onChange={(e) => setComment(r.field, r.id, e.target.value)}
                        placeholder={pending && !value ? "searching the transcript…" : "nothing found — add your own, or leave blank"}
                        className="w-full rounded-lg px-3 py-2 text-[12.5px] leading-relaxed outline-none"
                        style={{
                          border: `1px solid ${TONE.well.border}`,
                          background: TONE.well.bg,
                          color: NAVY,
                          resize: "vertical",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: "rgba(51,51,51,0.4)" }}>
              Could Improve
            </div>
            <p className="text-[11.5px] leading-relaxed m-0 mb-2" style={{ color: "rgba(51,51,51,0.5)" }}>
              Leave any blank and the phrase stands on its own as a general recommendation. What you
              add makes it specific to this candidate or station.
            </p>
            {rows.improve.length === 0 ? (
              <p className="text-[12px] m-0" style={{ color: "rgba(51,51,51,0.4)" }}>
                Nothing ticked under Could Improve is waiting for a comment.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {rows.improve.map((r) => (
                  <div key={r.id}>
                    <div className="text-[9.5px] font-bold uppercase tracking-[0.05em]" style={{ color: "rgba(51,51,51,0.3)" }}>
                      {r.domain}
                    </div>
                    <div className="text-[12px] font-semibold mb-1" style={{ color: NAVY }}>{r.phrase}</div>
                    <textarea
                      data-dictate
                      rows={2}
                      value={picked[r.field]?.[r.id] ?? ""}
                      onChange={(e) => setComment(r.field, r.id, e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-[12.5px] leading-relaxed outline-none"
                      style={{
                        border: `1px solid ${TONE.improve.border}`,
                        background: TONE.improve.bg,
                        color: NAVY,
                        resize: "vertical",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-between gap-3 flex-wrap" style={{ flexShrink: 0, borderTop: "1px solid rgba(51,51,51,0.07)" }}>
          <span className="text-[11px]" style={{ color: error ? "#B91C1C" : "rgba(51,51,51,0.45)" }}>
            {error
              ? error
              : pending
              ? "Filling the Did Well boxes…"
              : ""}
          </span>
          <div className="flex gap-2 flex-wrap">
            {/* Everything typed here is already in `picked`, so leaving is
                free: the boxes behind this dialog hold it, and the examiner
                can scrub the audio and come back. */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-[13px] font-bold"
              style={{ background: "rgba(51,51,51,0.07)", color: NAVY, border: "none", cursor: "pointer" }}
            >
              Return to transcript
            </button>
            {/*
              Straight on to the comment, for a review the examiner is
              already sure of.

              Two presses when there is a comment to lose. Convert replaces
              the overall comment outright, and from in here the examiner
              cannot see what is about to go: the notepad's own Convert asks
              first for exactly that reason, and a second door into the same
              action has no business being quieter than the first.

              Disabled while the search is running, because converting then
              would build the report out of the boxes it is still filling.
            */}
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (willOverwrite && !confirming) {
                  setConfirming(true);
                  return;
                }
                onConvert();
                onClose();
              }}
              className="rounded-lg px-4 py-2 text-[13px] font-bold"
              style={{
                background: confirming ? "#B45309" : NAVY,
                color: "white",
                border: "none",
                cursor: pending ? "default" : "pointer",
                opacity: pending ? 0.5 : 1,
              }}
            >
              {pending
                ? "Still filling…"
                : confirming
                ? "Replace the comment you have written?"
                : "Convert to report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The tabs of the station modal, in the order the case is read rather than
 * the order the review is written.
 *
 * The briefs come first because they are the case: what the candidate was
 * given and what the role-player was playing. What the station expected of
 * them follows. Which tab opens is set by where it was clicked from, so the
 * order here only decides what sits next to what.
 */
const STATION_TABS = [
  ["brief", "Doctor's Brief"],
  ["story", "Patient's Story"],
  ["dg", "Data Gathering"],
  ["cm", "Clinical Management"],
] as const;

type StationTab = (typeof STATION_TABS)[number][0];

/**
 * The case behind the consultation, without leaving the review.
 *
 * One modal with four tabs rather than a popup per label: every way in opens
 * the same thing on a different tab, which is one control to learn instead of
 * three, and it means the examiner can go from "what was she supposed to
 * reveal" to "what should have been gathered" without closing anything.
 *
 * The two bullet tabs are the case's own expected content. The two brief tabs
 * are the real case-bank components, imported rather than rewritten, so they
 * cannot drift from what the candidate and the role-player actually saw.
 *
 * What is NOT here: the example explanation, the key takeaways and the
 * marking notes. A model answer in front of someone mid-marking changes what
 * they mark against, and that was a deliberate call rather than an oversight.
 *
 * The briefs bring the case bank's own palette with them, which is a different
 * navy and a different tint from this page. Boxed on a plain white panel so
 * that reads as a quotation from elsewhere rather than as a styling mistake.
 */
function StationDialog({
  station, stationNumber, recordedTitle, initialTab, onClose,
}: {
  station: StationMaterial;
  stationNumber: number;
  /** The title stored on the recording, for the drift check below. */
  recordedTitle: string;
  initialTab: StationTab;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<StationTab>(initialTab);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
    The station is found by number, not by id, because station_recordings
    holds no station id. Nothing stops a case being rewritten after the
    consultation, and then this modal shows a brief the candidate never saw
    without saying so. The titles are the only evidence available: the
    recording snapshots one at the time, the station carries today's.
  */
  const titleDrifted = station.title.trim() !== recordedTitle.trim();

  const bullets = tab === "dg" ? station.data_gathering : station.management;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.35)", zIndex: 3000 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-label={`Station ${stationNumber}`}
        className="rounded-2xl w-full flex flex-col"
        style={{ background: "white", maxWidth: 820, maxHeight: "86vh", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
      >
        <div className="px-6 pt-6 pb-3" style={{ flexShrink: 0 }}>
          <div className="flex items-baseline gap-2 flex-wrap mb-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.07em]" style={{ color: "rgba(51,51,51,0.35)" }}>
              Station {stationNumber}
            </span>
            <h2 className="font-display font-bold text-[16px] m-0" style={{ color: NAVY }}>{station.title}</h2>
          </div>

          {titleDrifted && (
            <p className="text-[11px] m-0 mb-3 rounded-lg px-3 py-2" style={{ background: "rgba(245,158,11,0.1)", color: "#92400E" }}>
              This case has been edited since the consultation was recorded. It was called
              {" "}&ldquo;{recordedTitle}&rdquo; at the time, so what follows may not be what the candidate saw.
            </p>
          )}

          <div className="flex p-1 rounded-xl" style={{ background: "rgba(51,51,51,0.06)" }}>
            {STATION_TABS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className="flex-1 rounded-lg py-1.5 text-[12px] font-bold"
                style={{
                  background: tab === key ? "white" : "transparent",
                  color: tab === key ? NAVY : "rgba(51,51,51,0.45)",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: tab === key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-2" style={{ overflowY: "auto", flex: 1 }}>
          {(tab === "dg" || tab === "cm") && (
            bullets.length === 0 ? (
              <p className="text-[12.5px] m-0 py-4" style={{ color: "rgba(51,51,51,0.4)" }}>
                Nothing recorded against this domain for this case.
              </p>
            ) : (
              <ul className="m-0 pl-0 flex flex-col gap-2" style={{ listStyle: "none" }}>
                {bullets.map((b, i) => (
                  <li key={i} className="text-[13px] leading-relaxed flex gap-2.5" style={{ color: "rgba(51,51,51,0.8)" }}>
                    <span style={{ color: "rgba(51,51,51,0.3)", flexShrink: 0 }}>•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )
          )}

          {(tab === "brief" || tab === "story") && (
            <div className="rounded-xl px-4 py-3" style={{ background: "#F3F2FB" }}>
              {tab === "brief" ? <DoctorBriefContent station={station} /> : <PatientStoryContent station={station} />}
            </div>
          )}
        </div>

        <div className="px-6 py-4 flex justify-end" style={{ flexShrink: 0, borderTop: "1px solid rgba(51,51,51,0.07)" }}>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-[13px] font-bold"
            style={{ background: NAVY, color: "white", border: "none", cursor: "pointer" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function DomainCommentDialog({
  label, aiGrade, aiComment, value, onChange, disabled, onClose,
}: {
  label: string;
  aiGrade: string | null;
  aiComment: string | null;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    // Straight into the box: this is opened to read or to write, and a
    // caret already there saves the click that would otherwise follow.
    boxRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 160)}px`;
  }, [value]);

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
        role="dialog"
        aria-label={label}
        className="rounded-2xl w-full"
        style={{ background: "white", maxWidth: 680, maxHeight: "82vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
      >
        <div className="px-6 pt-6 pb-2 flex items-center gap-2">
          <h2 className="font-display font-bold text-[16px] m-0" style={{ color: NAVY }}>{label}</h2>
        </div>

        {(aiGrade || aiComment) && (
          <div className="mx-6 mb-4 rounded-xl px-4 py-3" style={{ background: "rgba(51,51,51,0.03)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.35)" }}>AI Pre-Assessment</span>
              {aiGrade && <GradeBadge grade={aiGrade} />}
            </div>
            {aiComment && (
              <p className="text-[12.5px] leading-relaxed m-0" style={{ color: "rgba(51,51,51,0.6)", whiteSpace: "pre-wrap" }}>{aiComment}</p>
            )}
          </div>
        )}

        <div className="px-6">
          <textarea
            ref={boxRef}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Add a comment…"
            className="w-full rounded-lg px-3 py-2 text-[13px] resize-none overflow-hidden"
            style={{ border: "1px solid rgba(51,51,51,0.12)", color: NAVY, background: LIGHT_BG, outline: "none", fontFamily: "inherit", lineHeight: 1.6, minHeight: 160 }}
          />
        </div>

        <div className="px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-[12.5px] font-bold px-4 py-2 rounded-lg"
            style={{ background: NAVY, border: "none", color: "white", cursor: "pointer" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function AutoTextarea({ name, value, onChange, placeholder, disabled }: {
  /** Omitted when something else submits the value — see the overall comment. */
  name?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full mt-3 rounded-lg px-3 py-2 text-[12.5px] resize-none overflow-hidden"
      style={{ border: "1px solid rgba(51,51,51,0.12)", color: NAVY, background: LIGHT_BG, outline: "none", fontFamily: "inherit", lineHeight: 1.6, minHeight: "4.5rem" }}
      disabled={disabled}
    />
  );
}

function TranscriptLines({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <div className="flex flex-col gap-2.5">
      {lines.map((line, i) => {
        const m = line.match(/^(\[\d+:\d+\])\s*(Doctor|Patient):\s*(.*)$/);
        if (!m) return <p key={i} className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.6)" }}>{line}</p>;
        const [, timestamp, speaker, speech] = m;
        return (
          <div key={i}>
            <span className="text-[11px] mr-1.5 font-mono" style={{ color: "rgba(51,51,51,0.3)" }}>{timestamp}</span>
            <span className="text-[12.5px] font-bold mr-1" style={{ color: NAVY }}>{speaker}:</span>
            <span className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.75)" }}>{speech}</span>
          </div>
        );
      })}
    </div>
  );
}
