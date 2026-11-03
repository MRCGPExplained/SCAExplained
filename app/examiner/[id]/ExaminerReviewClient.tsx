"use client";

import { memo, useState, useRef, useEffect, useCallback, useActionState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitExaminerReviewAction, generateOverallCommentAction, grammarCheckAction } from "../actions";
import DualTrackPlayer from "@/app/components/DualTrackPlayer";
import RetryPipelineButton from "../RetryPipelineButton";
import ExaminerSkills from "./ExaminerSkills";
import TranscriptKaraoke from "./TranscriptKaraoke";
import { PresetChecklist, type PresetSelection } from "./PresetChecklist";
import { useDictation } from "./useDictation";
import { PRESET_FIELDS, type ExaminerPreset, type PresetField } from "@/lib/examiner-presets";
import type { PresetMap } from "@/lib/examiner-presets-store";
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
            ? "px-2 py-1 rounded-md text-[11.5px] font-bold transition"
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
  title, badge, defaultOpen = true, openWhen, bg, children,
}: {
  title: string;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  /**
   * Opens the section when this turns true, wherever it was before.
   *
   * For a section that starts closed because it is empty and then has
   * something put into it by something other than the examiner — a generated
   * draft, a restored one. Without it, pressing Convert drops text into a
   * collapsed box and reads as nothing having happened.
   *
   * It only ever opens. Closing is the examiner's to do, and a section that
   * shut itself because a field went briefly empty would be worse than one
   * that stayed open.
   */
  openWhen?: boolean;
  bg?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (openWhen) setOpen(true);
  }, [openWhen]);
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
}

export default function ExaminerReviewClient({ recording: rec, turns, presets: initialPresets, doctorAudioUrl, patientAudioUrl, voiceNoteUrl, aiSkills, examinerSkills, skillLabels }: Props) {
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
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const fit = () => {
      const top = el.getBoundingClientRect().top;
      // A floor, so that a short window leaves something usable rather than
      // collapsing the rail to nothing.
      el.style.maxHeight = `${Math.max(240, window.innerHeight - top - 12)}px`;
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
    A ticked phrase is a note like any other.

    The preset text goes in as the examiner wrote it, with whatever they
    typed against it joined on after a dash — one line per observation, the
    same shape the typed notes arrive in, which is what oneLine guarantees.
    The copy-editor prompt already forbids rephrasing and synonym-swapping,
    which is what protects a phrase that was curated once and is meant to
    read the same way every time.

    Presets first, then the free text. They are the recurring points and tend
    to be the ones worth leading on; anything typed by hand is specific to
    this consultation and reads better after them.
  */
  const notesFor = useCallback((field: PresetField, raw: string): string => {
    const selection = picked[field] ?? {};
    const ticked = (presets[field] ?? [])
      .filter((p) => p.id in selection)
      .map((p) => {
        const phrase = oneLine(p.text);
        const comment = oneLine(selection[p.id] ?? "");
        return comment ? `${phrase} — ${comment}` : phrase;
      });
    return [...ticked, ...bulletLines(raw)].join("\n");
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
  const handlePickedChange = useCallback(
    (field: PresetField, selection: PresetSelection) =>
      setPicked((prev) => ({ ...prev, [field]: selection })),
    []
  );
  const handlePresetsChange = useCallback(
    (field: PresetField, next: ExaminerPreset[]) =>
      setPresets((prev) => ({ ...prev, [field]: next })),
    []
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
      if (res.text) setOverallComment(res.text);
      else setAiGenError(res.error ?? "Failed");
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

  const allCommentsSet = dgComment.trim().length > 0 && cmComment.trim().length > 0 && roComment.trim().length > 0;
  const canSubmit = !!dgGrade && !!cmGrade && !!roGrade && allCommentsSet;

  const [state, formAction, pending] = useActionState(submitExaminerReviewAction, {});
  const [showSuccess, setShowSuccess] = useState(false);
  /** Send has been asked for once and is waiting to be confirmed. */
  const [confirmingSend, setConfirmingSend] = useState(false);
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

            The rail track is minmax(0,360px) rather than a flat 360px so that
            it gives way instead of forcing a horizontal scrollbar when there
            is not room for both columns. Still two columns, as asked; just
            narrower ones.
          */}
          {/*
            Above the columns, not inside one.

            It names the consultation, which is true of the whole page, so it
            was the one thing in the left column that was not about the left
            column — and it pushed the score bar, the first thing you reach
            for, a card's height down. Full width also lets the roster sit on
            one line instead of wrapping in a 768px track.
          */}
          <div className="rounded-2xl p-6 mb-5" style={{ background: NAVY, color: "white" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-1 opacity-50">
              Station {rec.station_number}
            </div>
            <h1 className="font-display font-extrabold text-[22px] mb-3">{rec.station_title}</h1>
            <div className="flex items-center gap-4 text-[12px] opacity-60 flex-wrap">
              <span>Doctor: {rec.doctor_display_name}</span>
              <span>Patient: {rec.patient_display_name}</span>
              <span>{new Date(rec.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" })}</span>
              {isSent && <span style={{ color: "#86efac" }}>✓ Report already sent</span>}
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-5 items-start">

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

                It is a card, not a column: a third track would have cost the
                main column about 260px of its ~768px, and the domain cards,
                the four-button grade rows and the transcript all live there.
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

                This bar replaced a read-only "DG: 2/3 · CM: 3/4.5" line. The
                points are still here, just beside the buttons that set them.
              */}
              <div className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                  {DOMAINS.map((d) => (
                    <div key={d.key} className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.06em]"
                        style={{ color: "rgba(51,51,51,0.4)" }}
                        title={d.label}
                      >
                        {d.short}
                      </span>
                      <GradeSelector name={`${d.key}_grade`} value={d.grade} onChange={d.setGrade} compact disabled={isSent} />
                      <span className="text-[10px] tabular-nums" style={{ color: "rgba(51,51,51,0.3)" }}>
                        {d.points !== null ? `${d.points}/${d.max}` : `—/${d.max}`}
                      </span>
                    </div>
                  ))}
                </div>
                <span className="font-extrabold text-[20px] tabular-nums" style={{ color: NAVY }}>
                  {totalPts !== null ? `${totalPts} / 10.5` : "— / 10.5"}
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

                {/* AI pipeline — always available, on every attempt */}
                <div className="rounded-xl px-4 py-3 mb-4 text-[12px] flex flex-col gap-3" style={{ background: "rgba(51,51,51,0.05)", border: "1px solid rgba(51,51,51,0.1)", color: "rgba(51,51,51,0.5)" }}>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span>
                      {hasAi
                        ? "AI pre-assessment complete. Re-running replaces the AI grades below."
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

                {/* Domain cards — flat, full width, AI context inline */}
                <div className="flex flex-col gap-4 mb-4">
                  {DOMAINS.map(({ key, label, max, grade, comment, setComment, commentName, aiGrade, aiComment }) => (
                    <div
                      key={key}
                      className="rounded-2xl overflow-hidden"
                      style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
                    >
                      {/* Card header */}
                      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(51,51,51,0.07)" }}>
                        <span className="text-[14px] font-bold" style={{ color: NAVY }}>{label}</span>
                        <div className="flex items-center gap-2">
                          {grade && <GradeBadge grade={grade} />}
                          <span className="text-[11px]" style={{ color: "rgba(51,51,51,0.35)" }}>
                            {grade ? `${pts(grade, key)} / ${max} pts` : `max ${max} pts`}
                          </span>
                        </div>
                      </div>

                      {/* AI context inline */}
                      {(aiGrade || aiComment) && (
                        <div className="px-5 py-3" style={{ background: "rgba(51,51,51,0.03)", borderBottom: "1px solid rgba(51,51,51,0.06)" }}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.35)" }}>AI Pre-Assessment</span>
                            {aiGrade && <GradeBadge grade={aiGrade} />}
                          </div>
                          {aiComment && (
                            <p className="text-[12.5px] leading-relaxed m-0" style={{ color: "rgba(51,51,51,0.6)" }}>{aiComment}</p>
                          )}
                        </div>
                      )}

                      {/* The comment only. The grade for this domain is set
                          in the score bar at the top of the column, where it
                          stays in view while the audio plays. */}
                      <div className="px-5 pb-5 pt-4 flex flex-col gap-3">
                        <AutoTextarea
                          name={commentName}
                          value={comment}
                          onChange={setComment}
                          placeholder="Add a comment…"
                          disabled={isSent}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <ExaminerSkills
                  recordingId={rec.id}
                  aiSkills={aiSkills}
                  examinerSkills={examinerSkills}
                  labels={skillLabels}
                  disabled={isSent}
                />

                {/*
                  Transcript.

                  Open by default now that it is a fixed-height scroll box
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
                {/* Overall Comment */}
                <div className="mb-4">
                  {/*
                    Closed while it is empty, which for most of a review it
                    is. Note-taking and comment-writing happen one after the
                    other, not together: the examiner jots in the notepad
                    throughout and the comment appears at the end. An empty
                    190px box sitting above the notepad all that time is the
                    single biggest thing pushing the rail past the height of
                    the window.

                    openWhen covers the two ways text arrives without the
                    examiner opening anything: Convert writing a draft, and a
                    draft restored from the last session, which lands after
                    mount and so cannot be caught by defaultOpen.
                  */}
                  <Accordion
                    title="Overall Comment"
                    defaultOpen={!!overallComment}
                    openWhen={!!overallComment}
                  >
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
                        what submits this, because this one unmounts when the
                        accordion closes. */}
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
                  </Accordion>
                </div>

                {/*
                  Its own block, not a section inside the Overall Comment
                  accordion above. It sits directly under the voice note
                  either way, and this way collapsing that accordion cannot
                  take the notepad with it — a notepad you have to go and
                  reopen is not one you write in as you go.
                */}
                {!isSent && (
                  <Notepad
                    notes={assist}
                    recordingId={rec.id}
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
                  />
                )}
            </aside>

          </div>
        </form>

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

/** Set when this examiner has hidden the tick lists. Deliberately one key for
 *  the whole browser rather than one per recording — see the toggle. */
const PRESETS_HIDDEN_KEY = "sca_examiner_presets_hidden";

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
function NoteBox({ value, onChange, onKeyDown }: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
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
        background: "white",
        border: "1px solid rgba(51,51,51,0.12)",
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
 * Stacked rather than the dialog's three-by-two grid. The rail is 360px, so
 * two columns would be about 165px each, which is not a width anyone types a
 * sentence in.
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
  recordingId, hasNotes, willOverwrite, pending, error, onConvert,
}: {
  notes: AssistNotes;
  /** Only so a dictation can be costed against the review it was spoken into. */
  recordingId: string;
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
}) {
  const [confirming, setConfirming] = useState(false);
  const [dictateError, setDictateError] = useState<string | null>(null);
  const dictation = useDictation(recordingId, setDictateError);

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
  const [showPresets, setShowPresets] = useState(true);
  useEffect(() => {
    try {
      setShowPresets(window.localStorage.getItem(PRESETS_HIDDEN_KEY) !== "1");
    } catch {
      // Storage blocked. Shown is the right fallback and the toggle still
      // works for this page.
    }
  }, []);

  function togglePresets() {
    setShowPresets((prev) => {
      const next = !prev;
      try {
        if (next) window.localStorage.removeItem(PRESETS_HIDDEN_KEY);
        else window.localStorage.setItem(PRESETS_HIDDEN_KEY, "1");
      } catch {
        // It just will not be remembered past this page.
      }
      return next;
    });
  }

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

  const box = (k: keyof AssistNotes) => (
    <NoteBox value={notes[k]} onChange={set(k)} onKeyDown={key(k)} />
  );

  const DOMAINS: {
    label: string;
    well: keyof AssistNotes;
    improve: keyof AssistNotes;
    wellField: PresetField;
    improveField: PresetField;
  }[] = [
    { label: "Data Gathering", well: "dgWell", improve: "dgImprove", wellField: "dg_well", improveField: "dg_improve" },
    { label: "Clinical Management", well: "cmWell", improve: "cmImprove", wellField: "cm_well", improveField: "cm_improve" },
    { label: "Relating to Others", well: "roWell", improve: "roImprove", wellField: "ro_well", improveField: "ro_improve" },
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
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.07em] m-0" style={{ color: "rgba(51,51,51,0.45)" }}>
          Notepad
        </h3>
        {/* Same faint treatment as Edit presets. It is a thing you set once
            and then forget, not part of marking a consultation. */}
        <button
          type="button"
          onClick={togglePresets}
          className="text-[10px]"
          style={{ background: "none", border: "none", color: "rgba(51,51,51,0.35)", cursor: "pointer", textDecoration: "underline", flexShrink: 0 }}
        >
          {showPresets ? "Hide presets" : "Show presets"}
        </button>
      </div>

      {/*
        The only sign that dictation exists, so it says the key when idle
        rather than only appearing once something is happening. It doubles as
        the recording indicator, which has to be visible anyway: a page that
        is quietly holding the microphone open should say so.
      */}
      <p className="text-[10.5px] m-0 mb-2.5" style={{ color: dictateError ? "#B91C1C" : "rgba(51,51,51,0.4)" }}>
        {dictateError
          ? dictateError
          : dictation.state === "listening"
          ? "● Listening — let go of / to stop"
          : dictation.state === "transcribing"
          ? "Transcribing…"
          : "Hold / in any box to dictate"}
      </p>

      <button
        type="button"
        disabled={!hasNotes || pending}
        onClick={() => {
          if (willOverwrite && !confirming) { setConfirming(true); return; }
          setConfirming(false);
          onConvert();
        }}
        className="w-full rounded-lg py-2 text-[12.5px] font-bold mb-1.5"
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
          className="w-full text-[11.5px] mb-1.5"
          style={{ background: "none", border: "none", color: "rgba(51,51,51,0.5)", cursor: "pointer" }}
        >
          Cancel, keep what is written
        </button>
      )}

      {error && <p className="text-[11px] m-0 mb-2" style={{ color: "#B91C1C" }}>{error}</p>}
      {!hasNotes && !error && (
        <p className="text-[11px] m-0 mb-2" style={{ color: "rgba(51,51,51,0.4)" }}>
          Write at least one note first.
        </p>
      )}

      <div className="flex flex-col gap-3 mt-3">
        {DOMAINS.map((d) => (
          <div key={d.label}>
            <div className="text-[12px] font-bold mb-1.5" style={{ color: NAVY }}>{d.label}</div>

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
              collapsed={!showPresets}
            />
            {box(d.well)}

            <div className="mt-2.5">
              <PresetChecklist
                field={d.improveField}
                label="Could improve"
                presets={presets[d.improveField] ?? NO_PRESETS}
                selection={picked[d.improveField] ?? NO_SELECTION}
                onSelectionChange={onPickedChange}
                onPresetsChange={onPresetsChange}
                disabled={disabled}
                collapsed={!showPresets}
              />
              {box(d.improve)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

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
