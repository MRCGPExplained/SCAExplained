"use client";

import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  createStudyRoomAction,
  joinStudyRoomAction,
  ensureRoomParticipantAction,
  leaveStudyRoomAction,
  setRoomRolesAction,
  startRecordingAction,
  cancelRecordingAction,
  getMostRecentRecordingForStation,
  getDailyCoEnabledAction,
  createDailyCallAction,
  getDailyTokenAction,
  endDailyCallAction,
  removeParticipantAction,
} from "../../actions";
import type { DailyCall } from "@daily-co/daily-js";
import type { StudyRoom, ChatMessage, TimerPhase } from "@/lib/case-bank-types";
import { PHASE_DURATIONS, DEBRIEF_DURATION_SECONDS } from "@/lib/case-bank-types";
import { StudyRoomDock } from "./StudyRoomDock";
import { createRecordingLogger } from "@/lib/recording-logger";
import { uploadRecordingAudio } from "@/lib/upload-recording-audio";
import { useWakeLock } from "@/lib/use-wake-lock";
import {
  StudyRoomStatusProvider,
  StudyRoomTimerProvider,
  StudyRoomValueProvider,
  type Participant,
  type RecordingState,
  type ReviewStage,
  type StudyRoomStatusValue,
  type StudyRoomTimerValue,
  type StudyRoomValue,
} from "./context";

const { logStatus, logError, logDuration } = createRecordingLogger("study-room");

const DAILY_JOIN_TIMEOUT_MS = 5000;

/**
 * Inlined at build time. The study room is the only thing here that needs
 * Supabase in the browser, and it now renders on every page — so where the app
 * is running without these (a local checkout with no keys), it should quietly
 * do nothing rather than take every page down with it.
 */
const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Absolute ceiling on following one take through the pipeline. The per-attempt
 * budget is the grading route's own maxDuration, but waiting for the partner's
 * upload legitimately restarts that budget — twenty minutes is where "they are
 * still uploading" stops being a plausible explanation.
 */
const GIVE_UP_AFTER_MS = 20 * 60 * 1000;

/** Waits for a promise, but never longer than `ms` — used so a slow/failed
 * DailyCo join can delay the synced start briefly without ever blocking it. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | void> {
  return Promise.race([promise, new Promise<void>((resolve) => setTimeout(resolve, ms))]);
}

interface StudyRoomProviderProps {
  userId: string | null;
  displayName: string;
  initials: string;
  children: ReactNode;
}

/**
 * Owns the whole study-room session: the realtime channel, the DailyCo voice
 * call, participants, chat, recording, and the shared timer.
 *
 * It is mounted in app/layout.tsx — the root layout — rather than in the
 * station page, because layouts survive navigation ("On navigation, layouts
 * preserve state, remain interactive, and do not rerender" — Next.js docs). The
 * station page and the panel below it remount on every station change; this
 * does not, so the channel and the live call stay up while the case content
 * swaps. It sits at the root rather than under /case-bank so that opening a
 * report, the dashboard or an account page does not end the session either:
 * the only thing that ends it is Leave, or signing out.
 */
export function StudyRoomProvider({
  userId: serverUserId,
  displayName: serverDisplayName,
  initials: serverInitials,
  children,
}: StudyRoomProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Identity is settled in the browser, with the server's view as the starting
   * point. It cannot just be the prop: this provider is mounted in the root
   * layout, and "Layouts do not rerender on navigation"
   * (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md:240
   * — confirmed by instrumenting the layout and watching a client-side
   * navigation not re-run it). So the prop is whatever was true at the last
   * full page load: signing in at /login and being sent on to the case bank
   * would leave it saying "logged out", and the study room would stay
   * unavailable until a refresh; signing out would leave it still naming the
   * user who had gone, with their room and their microphone still live.
   *
   * onAuthStateChange is the only thing that sees either event as it happens.
   */
  const [userId, setUserId] = useState<string | null>(serverUserId);
  const [displayName, setDisplayName] = useState(serverDisplayName);
  const [initials, setInitials] = useState(serverInitials);

  // The current station comes from the URL, not from props — the provider sits
  // above the dynamic segment, and usePathname is the documented way for a
  // client component to track it. null on /case-bank, /login, /register.
  const stationNumber = useMemo(() => {
    const m = /^\/case-bank\/(\d+)(?:\/|$)/.exec(pathname ?? "");
    return m ? parseInt(m[1], 10) : null;
  }, [pathname]);

  // The page registers the human-readable title for the station it rendered.
  // Stored with its number so a stale title can never be attached to a
  // recording started in the frame before the page caught up.
  const stationMetaRef = useRef<{ number: number; title: string } | null>(null);
  const registerStation = useCallback((number: number, title: string) => {
    stationMetaRef.current = { number, title };
  }, []);
  const stationTitle =
    stationMetaRef.current?.number === stationNumber ? stationMetaRef.current.title : undefined;

  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [joinError, setJoinError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hostNameState, setHostNameState] = useState<string | null>(null);
  // userIds currently connected to the realtime channel (presence) — used to
  // flag a doctor/patient who has dropped out as "(disconnected)".
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [rolesSaving, setRolesSaving] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentHostIdRef = useRef<string | null>(null);
  /**
   * One stable client for the life of the session — the channel cleanup calls
   * supabase.removeChannel(), so this must not be a fresh object each render.
   *
   * Built in the browser only, and only when the app is actually configured for
   * Supabase. This provider is mounted in the root layout now, so it renders on
   * every page including the marketing pages; createBrowserClient throws
   * outright when the public env vars are absent, which used to cost only the
   * study room and would now cost every page in the app. It is not gated on
   * there being a user, because watching for someone signing *in* is exactly
   * what it is needed for. Assigning into a ref during render is pure
   * memoisation, and every read below is inside an effect or a callback.
   */
  const supabaseRef = useRef<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  if (typeof window !== "undefined" && SUPABASE_CONFIGURED && !supabaseRef.current) {
    supabaseRef.current = createSupabaseBrowserClient();
  }
  const supabase = supabaseRef.current as ReturnType<typeof createSupabaseBrowserClient>;

  /**
   * Re-read on every navigation, which is the only signal that reliably arrives.
   *
   * `onAuthStateChange` below does not see logging in or out in this app: both
   * are server actions (`logoutAction` calls `signOut()` on the *server*
   * client), and the browser client emits SIGNED_OUT only from its own
   * `_removeSession`, which nothing here reaches. The prop cannot report them
   * either — the root layout does not re-render on navigation. What does happen
   * is that the server action rewrites the auth cookies and the app navigates,
   * and `getSession()` reads those cookies, so checking it as the path changes
   * catches both. Client components do re-render on navigation, so this runs.
   */
  useEffect(() => {
    const client = supabaseRef.current;
    if (!client) return;
    let active = true;
    client.auth.getSession().then(({ data, error }) => {
      // A null session with an error is not a sign-out. When a token refresh
      // fails retryably the library returns no session, keeps the stored one,
      // emits nothing — and caches that failure for a minute, so every
      // navigation in that window looks the same. Acting on it would tear down
      // a live consultation, discard its audio, and forget the room id that
      // would have let it be rejoined, all because of one bad request. A real
      // sign-out has no error to report; a fatal auth failure clears the
      // session itself and arrives on the subscription below.
      if (!active || error) return;
      setUserId(data.session?.user?.id ?? null);
    });
    return () => { active = false; };
  }, [pathname]);

  // Still worth subscribing to: token refreshes, and a sign-out performed in
  // another tab, neither of which involve a navigation here.
  useEffect(() => {
    const client = supabaseRef.current;
    if (!client) return;
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Whoever it turned out to be is not who the server rendered for, so their
  // name has to be fetched — it goes on chat messages and on the participant
  // list. Existing values are kept if the row has nothing better, which is what
  // a guest account looks like before it has picked a name.
  useEffect(() => {
    const client = supabaseRef.current;
    if (!client || !userId || userId === serverUserId) return;
    client
      .from("user_profiles")
      .select("display_name,initials")
      .eq("id", userId)
      .single<{ display_name: string | null; initials: string | null }>()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
        if (data?.initials) setInitials(data.initials);
      });
  }, [userId, serverUserId]);

  // ── Recording state ──────────────────────────────────────────────────────────
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(null);
  const [myRecordingRole, setMyRecordingRole] = useState<"doctor" | "patient" | null>(null);
  const [recordingError, setRecordingError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingCutoffRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hostStopCutoffRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // True while startLocalRecording's async setup (getUserMedia → MediaRecorder)
  // is in flight — mediaRecorderRef.current is still null during this window.
  const recorderStartingRef = useRef(false);
  // True if stop was requested while the recorder wasn't ready yet — honored
  // the instant it becomes ready, instead of being silently dropped.
  const pendingStopRef = useRef(false);
  // Set when the session is being torn down under a live recorder (sign-out):
  // release the microphone, but do not try to upload into a session that has
  // just been destroyed.
  const abandonRecordingRef = useRef(false);

  // ── Review pipeline ──────────────────────────────────────────────────────────
  // Deliberately separate from `recordingState`. That one is about this
  // browser's microphone and ends when its blob lands; this one is about the
  // server's work on the finished take and outlives it by a minute or so. The
  // panel needs both at once: the Record button back for the next station, and
  // the last station still visibly being marked.
  const [reviewStage, setReviewStage] = useState<ReviewStage | null>(null);
  const [reviewRecordingId, setReviewRecordingId] = useState<string | null>(null);
  /**
   * Whether the take currently being followed was one I recorded as doctor.
   *
   * Separate from myRecordingRole, which describes the LIVE take and is
   * cleared by resetForNextTake the moment the three-minute debrief closes.
   * The decision modal was gated on that, so a transcription slower than the
   * debrief found the role already null and silently downgraded the ask to a
   * chip: the candidate was never offered AI, GP or discard for a take they
   * had just recorded. This latch belongs to the recording, not the session,
   * so it survives the reset and is cleared only when the review is dismissed.
   */
  const [reviewMineAsDoctor, setReviewMineAsDoctor] = useState(false);
  // Guards against two poll loops running at once — a re-render, a rejoin, or
  // an observer receiving the host's relay must not start a second one.
  const pollingRecordingRef = useRef<string | null>(null);

  const iAmHost = room ? room.host_user_id === userId : false;
  const [recentReportId, setRecentReportId] = useState<string | null>(null);

  // ── Timer ──────────────────────────────────────────────────────────────────
  // Lifted here from the station page. It is room state (the host drives it and
  // guests follow), and keeping it above the remount boundary is what stops the
  // broadcast ref being orphaned every time the page re-renders a new station.
  const [timerPhase, setTimerPhase] = useState<TimerPhase>("PREREAD");
  const [timeLeft, setTimeLeft] = useState(PHASE_DURATIONS.PREREAD);
  const [timerRunning, setTimerRunning] = useState(false);
  const broadcastTimerRef = useRef<((phase: TimerPhase, timeLeft: number, running: boolean) => void) | null>(null);
  const timerStateRef = useRef<{ phase: TimerPhase; timeLeft: number; running: boolean }>({
    phase: "PREREAD",
    timeLeft: PHASE_DURATIONS.PREREAD,
    running: false,
  });
  useEffect(() => {
    timerStateRef.current = { phase: timerPhase, timeLeft, running: timerRunning };
  }, [timerPhase, timeLeft, timerRunning]);

  /**
   * The realtime channel is built once per room and its handlers would
   * otherwise close over the render that created them — freezing `iAmHost`,
   * `myRecordingRole`, `dailyRoomName` and every function they call for the
   * whole life of the room. Until now a station navigation remounted the panel
   * often enough to hide that; with the session persisting it would not.
   *
   * Every handler is therefore a one-line trampoline through this ref, which is
   * rewritten on every render, so they always run against current state.
   */
  const latest = useRef({} as {
    userId: string | null;
    iAmHost: boolean;
    myRecordingRole: "doctor" | "patient" | null;
    applyTimer: (phase: TimerPhase, timeLeft: number, running: boolean) => void;
    followStation: (target: number) => void;
    shouldFollowHost: () => boolean;
    refreshParticipants: (roomId: string) => void;
    refreshRoom: (roomId: string) => void;
    endDebrief: () => void;
    startDebrief: () => void;
    markTakeFinished: (takeId: string | null) => void;
    stopRecording: (stopAt?: number) => void;
    activeRecordingId: string | null;
    reviewRecordingId: string | null;
    joinDailyCall: (roomName: string, roomUrl: string) => Promise<boolean>;
    leaveDailyCall: () => Promise<void>;
    startLocalRecording: (recordingId: string, role: "doctor" | "patient") => Promise<void>;
    stopLocalRecording: () => void;
    cancelRecordingDueToDailyFailure: (recordingId: string, why?: string) => Promise<void>;
  });

  // Doctor and patient come straight from the synced room row. The doctor is
  // always the host.
  const doctorUserId = room?.doctor_user_id ?? null;
  const patientUserId = room?.patient_user_id ?? null;
  const rolesReady = !!doctorUserId && !!patientUserId;
  const myAssignedRole = doctorUserId === userId ? "doctor" : patientUserId === userId ? "patient" : null;

  // One-time tip (mobile only): when you're made doctor/patient, recommend a
  // long screen timeout so the phone doesn't sleep mid-consultation.
  const [showScreenTip, setShowScreenTip] = useState(false);
  const [dontShowScreenTip, setDontShowScreenTip] = useState(false);
  const prevAssignedRoleRef = useRef<string | null>(null);
  useEffect(() => {
    const prev = prevAssignedRoleRef.current;
    prevAssignedRoleRef.current = myAssignedRole;
    if (myAssignedRole && !prev && typeof window !== "undefined") {
      const dismissed = localStorage.getItem("sca_hide_screentime_tip") === "1";
      const isMobile = window.matchMedia?.("(pointer: coarse)")?.matches;
      if (!dismissed && isMobile) setShowScreenTip(true);
    }
  }, [myAssignedRole]);

  function dismissScreenTip() {
    if (dontShowScreenTip && typeof window !== "undefined") {
      localStorage.setItem("sca_hide_screentime_tip", "1");
    }
    setShowScreenTip(false);
  }

  // ── Post-recording debrief window ──────────────────────────────────────────
  // Recording stops sharp at 12 minutes, but the voice call stays open a bit
  // longer so the two candidates can talk through the station before the
  // room closes — this window is separate from (and outlives) the recording.
  const [debriefSecondsLeft, setDebriefSecondsLeft] = useState<number | null>(null);
  const debriefIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debriefTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The two halves of "this take is over" — see finishTakeIfReady below.
  const debriefClosedRef = useRef(true);
  const takeFinishedRef = useRef(false);

  // Keep the screen awake for the whole active session (recording + debrief),
  // so a phone doesn't idle out and suspend the mic mid-consultation.
  useWakeLock(
    recordingState === "starting" ||
      recordingState === "recording" ||
      recordingState === "uploading" ||
      debriefSecondsLeft !== null
  );

  /**
   * Roles are locked while a session is actually under way — the clock running,
   * a recording in progress, or the debrief still open — and free the rest of
   * the time. Anyone in the room can set them; nothing here is host-only.
   *
   * It used to additionally require PREREAD and a full three minutes on the
   * clock, which locked people out of a room where nothing was happening. It
   * fell hardest on guests: the host re-announces the timer whenever someone
   * joins, so a clock left anywhere but pristine locked every guest out on
   * arrival, and the message told them to "reset the timer" using a control
   * only the host is shown. A consultation that had merely ended, rather than
   * been reset, did the same to everyone.
   */
  const sessionIdle =
    !timerRunning &&
    recordingState === "idle" &&
    debriefSecondsLeft === null;

  // ── Timer handlers ─────────────────────────────────────────────────────────
  // Only the host persists timer state; guests receive it by broadcast and by
  // the postgres_changes UPDATE handler.
  /**
   * Why starting the clock would not lead to a recorded consultation, or null
   * when it would. In a room the timer is not a stopwatch — it is the only way
   * a session begins — so anything that would leave it running toward nothing
   * refuses up front and says what is missing, rather than counting down three
   * minutes and then quietly doing nothing at the end of them.
   *
   * Null outside a room: solo practice has no roles to set and nothing to
   * record, and there the clock really is just a clock.
   */
  const startBlockedReason: string | null = !room
    ? null
    : stationNumber === null
      ? "Open a station to start a session."
      : // The debrief is the trap here. After a take stops, recordingState sits
        // at "done" and the call stays open for three minutes — and the normal
        // rhythm is "stop, quick chat, next station". Start was not blocked in
        // that window and `startWillRecord` was false, so pressing it skipped
        // the confirmation and ran a full twelve-minute consultation with no
        // room, no recorder and no error: a whole station done twice over.
        recordingState !== "idle" || debriefSecondsLeft !== null
        ? "Finish the last consultation first. End the call to start another."
        : !rolesReady
          ? "Set a doctor and a patient before starting."
          : doctorUserId === patientUserId
            ? "Doctor and patient must be different people."
            : null;

  /** True when pressing Start will end in a recorded, graded consultation. */
  function startWillRecord() {
    return (
      !!room &&
      iAmHost &&
      !startBlockedReason &&
      recordingState === "idle" &&
      timerPhase === "PREREAD"
    );
  }

  async function handleTimerStart() {
    // The button is disabled in this state, so this is the belt to that braces —
    // and the thing that makes the refusal true rather than merely displayed.
    if (startBlockedReason) {
      setRecordingError(startBlockedReason);
      return;
    }
    // The notice that used to sit on the Record button moves here, because this
    // is now the only thing anyone presses: three minutes later the call places
    // itself and the consultation records. Asked once per run — resuming a
    // paused pre-read does not ask again, and a reset arms it for the next one.
    if (startWillRecord() && !startAcknowledgedRef.current) {
      setShowStartWarning(true);
      return;
    }
    setTimerRunning(true);
    broadcastTimerRef.current?.(timerPhase, timeLeft, true);
    if (room && iAmHost) {
      const startedAt = new Date(
        Date.now() - (PHASE_DURATIONS[timerPhase] - timeLeft) * 1000
      ).toISOString();
      await supabase
        .from("study_rooms")
        // The phase goes with it. Guests re-derive the clock from this row, and
        // an anchor written against a stale timer_phase is read against the
        // wrong duration — starting a 3-minute pre-read against a leftover
        // CONSULT showed the guest a 12-minute consultation running.
        .update({
          timer_phase: timerPhase,
          timer_started_at: startedAt,
          timer_paused_at: null,
          timer_paused_remaining: null,
        })
        .eq("id", room.id);
    }
  }

  /**
   * Halts the clock where it stands. The two `timer_paused_*` columns are what
   * a late joiner reads to land on a stopped clock rather than a running one,
   * so they are still written — they now mean "stopped at", which is the same
   * row shape. In PREREAD this is a pause and Start resumes from `timeLeft`;
   * in CONSULT the UI offers no way back, so it ends the consultation.
   */
  async function handleTimerStop(at?: number) {
    // Read the clock from the ref, not from this render's closure. Two of the
    // callers are long-lived: the panel's Stop button comes through a memo that
    // does not depend on timeLeft, and the 12-minute cutoff is a setTimeout
    // registered back when the consultation started. Either would otherwise
    // stop the clock at whatever it read minutes ago and broadcast that to
    // everyone — the consultation appearing to jump back to 12:00 as it ends.
    const stopAt = at ?? timerStateRef.current.timeLeft;
    const phase = timerStateRef.current.phase;
    setTimerRunning(false);
    setTimeLeft(stopAt);
    broadcastTimerRef.current?.(phase, stopAt, false);
    if (room && iAmHost) {
      await supabase
        .from("study_rooms")
        .update({ timer_phase: phase, timer_paused_at: new Date().toISOString(), timer_paused_remaining: stopAt })
        .eq("id", room.id);
    }
  }

  /**
   * Moves the clock to a running consultation and persists an anchor a late
   * joiner can rebuild from. Both callers below need exactly this: skipping the
   * pre-read, and pressing Record.
   */
  async function beginConsultation(extra: Record<string, unknown> = {}) {
    const startedAt = new Date().toISOString();
    setTimerPhase("CONSULT");
    setTimeLeft(PHASE_DURATIONS.CONSULT);
    setTimerRunning(true);
    broadcastTimerRef.current?.("CONSULT", PHASE_DURATIONS.CONSULT, true);
    if (room && iAmHost) {
      await supabase
        .from("study_rooms")
        .update({
          timer_phase: "CONSULT",
          // Was written as null here, which is the row shape for "not started".
          // The host's own UPDATE echo then re-derived running=false and froze
          // the consultation it had just started, for everyone in the room.
          timer_started_at: startedAt,
          timer_paused_at: null,
          timer_paused_remaining: null,
          ...extra,
        })
        .eq("id", room.id);
    }
  }

  // Skip is only ever offered in PREREAD (see Timer.tsx) — the consultation
  // itself cannot be skipped, only stopped early.
  async function handleSkipPreread() {
    // Blocked on the same terms as Start. Skipping is a way of starting sooner,
    // not a way around the checks — otherwise it would be the back door to the
    // unrecorded consultation Start just refused to begin.
    if (startBlockedReason) {
      setRecordingError(startBlockedReason);
      return;
    }
    // Skipping is the pre-read ending early, not a way past the consultation —
    // it goes through exactly the same door, so the call still connects and the
    // recording still starts.
    await enterConsultation({ timer_skipped_preread: true });
  }

  const [showStartWarning, setShowStartWarning] = useState(false);
  const startAcknowledgedRef = useRef(false);

  function confirmStart() {
    startAcknowledgedRef.current = true;
    setShowStartWarning(false);
    handleTimerStart();
  }

  function cancelStart() {
    setShowStartWarning(false);
  }

  /** Local reset + broadcast only — no DB write. Used on station change. */
  function resetTimerLocal() {
    setTimerPhase("PREREAD");
    setTimeLeft(PHASE_DURATIONS.PREREAD);
    setTimerRunning(false);
    // Back to the top means the next Start is a new run, and gets the notice.
    startAcknowledgedRef.current = false;
    broadcastTimerRef.current?.("PREREAD", PHASE_DURATIONS.PREREAD, false);
  }

  /**
   * The row half of a reset. Split from the local half because the
   * station-change effect needs to clear the row too — a reset that only
   * changed this browser left the old station's phase and anchor in the row for
   * the next write to echo back to every guest as a live consultation.
   */
  async function persistTimerReset() {
    if (!room || !iAmHost) return;
    await supabase
      .from("study_rooms")
      .update({
        timer_phase: "PREREAD",
        timer_started_at: null,
        timer_paused_at: null,
        timer_paused_remaining: null,
        timer_skipped_preread: false,
      })
      .eq("id", room.id);
  }

  async function handleTimerReset() {
    resetTimerLocal();
    await persistTimerReset();
  }

  const handleTick = useCallback((newTime: number) => {
    setTimeLeft(newTime);
  }, []);

  /**
   * The pre-read is over, however it ended — run out or skipped.
   *
   * This is where a session starts. There is no Record button any more: the
   * host presses Start, the three minutes of preparation run, and the moment
   * they are up the voice call is placed and the consultation begins recording
   * as soon as it connects. `handleConfirmRecord` already had that order — it
   * waits for the call before starting the clock — so the pre-read simply took
   * over as its trigger.
   *
   * Only the host can start a recording, and only with both roles filled. Any
   * other client reaching the end of the pre-read — a guest whose clock got
   * there first, a room with nobody assigned, someone practising alone — just
   * moves to the consultation. A plain clock is the honest fallback; leaving it
   * stalled at the end of the pre-read would not be.
   */
  const enteringConsultationRef = useRef(false);

  async function enterConsultation(extra: Record<string, unknown> = {}) {
    // Re-entrant by nature: Timer calls onPhaseComplete on every tick while the
    // clock sits at zero, and placing the call takes a few seconds. Without
    // this the second tick would find recordingState already "starting", fall
    // through to the plain branch, and start the twelve minutes before anyone
    // was connected.
    if (enteringConsultationRef.current) return;
    enteringConsultationRef.current = true;
    try {
      // Checked again here, not only when Start was pressed. The pre-read is
      // three minutes long and the host can wander in them — open the station
      // list, read a report — and nothing resets a run already counting down.
      // Arriving at the end of it off the case meant the room rolled into a
      // twelve-minute consultation that could never be recorded, which is the
      // thing Start refuses to begin in the first place.
      if (room && iAmHost && startBlockedReason) {
        logStatus("pre-read ended but the session can no longer start", { startBlockedReason });
        setRecordingError(startBlockedReason);
        resetTimerLocal();
        return;
      }

      const canRecord =
        !!room &&
        iAmHost &&
        rolesReady &&
        doctorUserId !== patientUserId &&
        stationNumber !== null &&
        recordingState === "idle";

      if (canRecord) {
        // Hold the clock at the end of the pre-read while the call is placed.
        // beginConsultation restarts it against a fresh anchor the moment the
        // consultation actually begins, so nothing is lost by stopping here —
        // and a clock left running at 00:00 keeps firing this handler.
        setTimerRunning(false);
        let started = false;
        try {
          started = await handleConfirmRecord(extra);
        } catch (err) {
          // Every await in there is a network call, and a dropped connection
          // during the pre-read used to escape as an unhandled rejection with
          // recordingState stranded at "starting" — a state with no banner and
          // no Try Again, which left the roles locked and every later Start
          // refused. There is no recovering from that without rejoining.
          logError("starting the consultation", err);
          setRecordingState("error");
          setRecordingError("Could not start the consultation. Please try again.");
        }
        if (started) return;
        // It tried and could not — expired access, the session taken over on
        // another device, the recording row refused, the network. The error is
        // already on screen; what must not follow it is twelve minutes of
        // consultation that nothing is recording.
        logStatus("recording could not start — not running an unrecorded consultation");
        resetTimerLocal();
        return;
      }
      await beginConsultation(extra);
    } finally {
      enteringConsultationRef.current = false;
    }
  }

  async function handlePhaseComplete() {
    if (timerPhase === "PREREAD") {
      await enterConsultation();
    } else {
      // The tick that reaches zero calls this instead of onTick, so without an
      // explicit 0 the clock stops on 00:01 and stays there.
      await handleTimerStop(0);
    }
  }

  // Reset the timer whenever the station actually changes. The page used to do
  // this with a first-render guard, which only worked because it remounted;
  // now that this state persists, compare against the previous station instead.
  // Navigating to the list (stationNumber null) is not a station change, so it
  // returns before touching the ref — 5 → list → 5 correctly does not reset.
  const prevStationRef = useRef<number | null>(null);
  useEffect(() => {
    if (stationNumber === null) return;
    const prev = prevStationRef.current;
    prevStationRef.current = stationNumber;
    if (prev === null || prev === stationNumber) return;
    // The host resets the row as well as its own clock. A local-only reset left
    // the old station's timer_phase and timer_started_at sitting in the row,
    // and the very next write to it — the current_station_number update below,
    // or a chat message via the room_activity trigger — echoed that back to
    // every guest as a live consultation on a case the host had already left.
    // Guests do not reset at all: the host's row is the truth, and a guest that
    // wiped its own clock had no way to get it back mid-consultation.
    if (!room || iAmHost) {
      // set-state-in-effect is the point here: the URL is the external system
      // this effect exists to synchronise the clock with, and there is no
      // render-time answer to "did the station just change" once the provider
      // stopped remounting.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetTimerLocal();
      persistTimerReset();
    }
  }, [stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSetRoles(nextDoctor: string, nextPatient: string | null) {
    if (!room || !sessionIdle) return;
    setRolesSaving(true);
    setRecordingError("");
    // Optimistic local update; realtime UPDATE will confirm for everyone.
    setRoom((prev) =>
      prev ? { ...prev, doctor_user_id: nextDoctor, patient_user_id: nextPatient, host_user_id: nextDoctor } : prev
    );
    currentHostIdRef.current = nextDoctor;
    // `finally`, because rolesSaving disables both selects: a request that
    // rejects rather than returning an error would otherwise latch them shut
    // for the rest of the session with no way back.
    try {
      const result = await setRoomRolesAction(room.id, nextDoctor, nextPatient);
      if (result.error) {
        setRecordingError(result.error);
        refreshParticipants(room.id);
      }
    } catch (err) {
      logError("setRoomRoles", err, { roomId: room.id });
      setRecordingError("Could not save roles. Please try again.");
      refreshParticipants(room.id);
    } finally {
      setRolesSaving(false);
    }
  }

  async function handleRemoveParticipant(targetUserId: string, targetName: string) {
    if (!room) return;
    if (!confirm(`Remove ${targetName} from the room?`)) return;
    const result = await removeParticipantAction(room.id, targetUserId);
    if (result.error) {
      setRecordingError(result.error);
      return;
    }
    refreshParticipants(room.id);
  }

  // ── DailyCo live audio (headless — no visible UI, audio plays in the background) ──
  const [dailyCoEnabled, setDailyCoEnabled] = useState(false);
  const [dailyRoomName, setDailyRoomName] = useState<string | null>(null);
  const [dailyConnecting, setDailyConnecting] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [dailyFailed, setDailyFailed] = useState(false);
  // Signalling dropped but the SDK is still trying. Distinct from failed: a
  // blip that recovers in two seconds should not read as a dead call.
  const [dailyReconnecting, setDailyReconnecting] = useState(false);
  // Distinguishes "no call yet" from "the call ended". Without it the ended
  // state is also the initial state, so every take opened with a few seconds
  // of "Call ended" while the room was still being created.
  const [callEnded, setCallEnded] = useState(false);
  const dailyCallRef = useRef<DailyCall | null>(null);
  const dailyAudioElsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const dailyPrewarmingRef = useRef(false);

  // Only asked once there is a room to ask on behalf of. This provider now sits
  // in the root layout, so an unconditional fetch here would be a server round
  // trip on every page in the app, for every visitor, signed in or not — and
  // the answer is only ever read by the prewarm and the recording path below.
  useEffect(() => {
    if (!room) return;
    getDailyCoEnabledAction().then(setDailyCoEnabled);
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Warm up mic access as soon as you're in the room — before recording
  // starts — so the actual join later is instant instead of prompting for
  // permission (or showing DailyCo's own device-check screen) mid-consult.
  useEffect(() => {
    if (!room || !dailyCoEnabled || dailyPrewarmingRef.current) return;
    dailyPrewarmingRef.current = true;
    prewarmDailyCall();
  }, [room?.id, dailyCoEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // Best-effort cleanup if the panel unmounts mid-call (e.g. navigating away).
  // dailyCallRef is read fresh inside the closure since it's set lazily,
  // long after this effect's setup — only the Map itself is safe to capture
  // early since that reference never changes, just its contents.
  useEffect(() => {
    const audioEls = dailyAudioElsRef.current;
    return () => {
      audioEls.forEach((el) => el.remove());
      audioEls.clear();
      dailyCallRef.current?.destroy();
      if (debriefIntervalRef.current) clearInterval(debriefIntervalRef.current);
      if (debriefTimeoutRef.current) clearTimeout(debriefTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!room || stationNumber === null) return;
    getMostRecentRecordingForStation(stationNumber).then(setRecentReportId);
  }, [room?.id, stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ref so channel callbacks always read the latest stationNumber without
  // needing the channel effect to re-run.
  const stationNumberRef = useRef(stationNumber);
  useEffect(() => {
    stationNumberRef.current = stationNumber;
  }, [stationNumber]);

  // Guests follow the host. This provider is not remounted by the navigation
  // it triggers, so there is no stale re-read to defend against — the old
  // sessionStorage anti-bounce guard has been removed with the remount that
  // made it necessary. (It would also have become permanent: it was only ever
  // cleared on a room change, so a guest would stop following the host back to
  // any station they had previously left.)
  const lastFollowRef = useRef<{ target: number; at: number } | null>(null);
  function followStation(target: number) {
    // Two routes can ask for the same move at once — the join effect and the
    // list-arrival effect both fire when a guest lands on /case-bank with a
    // room already restored. Pushing twice is not harmful, but it puts a
    // duplicate entry in history that Back then has to be pressed through.
    const last = lastFollowRef.current;
    if (last && last.target === target && Date.now() - last.at < 2000) return;
    lastFollowRef.current = { target, at: Date.now() };
    router.push(`/case-bank/${target}`);
  }

  // True while the room being set came from sessionStorage rather than a
  // deliberate join, so the join effect knows not to navigate.
  const restoredFromStorageRef = useRef(false);

  /**
   * Signing out ends the session too. This provider is mounted in the root
   * layout now, and logging out is a client-side navigation to /login — which
   * no longer unmounts anything, so without this the dock kept floating over
   * the login page: room code, participant count, live chat and a running clock,
   * on a realtime channel still tracking presence under a revoked token.
   *
   * The local half of the teardown only. The server session is already gone, so
   * there is nothing left to tell the room with.
   */
  const hadUserRef = useRef(false);
  useEffect(() => {
    if (userId) {
      hadUserRef.current = true;
      return;
    }
    if (!hadUserRef.current) return;
    // `userId` is the browser's own auth state, not the server's guess, so a
    // null here means the session really has gone rather than that one request
    // failed to resolve it.
    hadUserRef.current = false;
    logStatus("signed out — clearing study room session");
    sessionStorage.removeItem("studyRoomId");
    clearSession({ abandonRecording: true });
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set once a guest has actually landed on a station in this room. Before
  // that, a `navigate` broadcast is how an invite link finds its way to the
  // right case, so it must be followed from wherever the guest landed.
  // Set once we have been seen in the participant list of the current room.
  const wasParticipantRef = useRef(false);
  const hasLandedRef = useRef(false);
  useEffect(() => {
    if (room && stationNumber !== null) hasLandedRef.current = true;
    if (!room) hasLandedRef.current = false;
  }, [room?.id, stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Following the host is the point of the room, but only while the guest is
   * actually reading a case. Now that the session survives leaving /case-bank,
   * an ungated follow would yank someone off their dashboard, their account, or
   * the report they had just opened. Off a station page they keep their place;
   * the dock tells them where the host went.
   */
  function shouldFollowHost() {
    return stationNumberRef.current !== null || !hasLandedRef.current;
  }

  /**
   * Arriving at the station list while your group is mid-case means joining
   * them on it. Stepping back to the list *from* that case does not — that is
   * someone going to browse, and bouncing them straight out would make the
   * list unreachable for a guest for as long as they were in a room.
   *
   * Only the list. A guest on their dashboard, their account or a report they
   * opened is somewhere they chose to be for reasons of their own, and the
   * room has no business moving them.
   */
  const prevPathRef = useRef<string | null>(null);
  const browsingListRef = useRef(false);
  useEffect(() => {
    const prev = prevPathRef.current;
    const navigated = prev !== pathname;
    prevPathRef.current = pathname;

    // Back on a case: whatever they were browsing for, they are done.
    if (stationNumber !== null) {
      browsingListRef.current = false;
      return;
    }
    if (pathname !== "/case-bank" || !room || iAmHost) return;

    // Distinguishing a navigation from a re-render matters: this effect also
    // re-runs when the host changes station, and without the check that would
    // read as a fresh arrival and yank a browsing guest out of the list.
    if (navigated && /^\/case-bank\/\d+(?:\/|$)/.test(prev ?? "")) {
      logStatus("guest stepped back to the list — not following the host");
      browsingListRef.current = true;
      return;
    }
    if (browsingListRef.current) return;

    const target = room.current_station_number;
    if (target !== null && target !== undefined) followStation(target);
  }, [pathname, room?.id, room?.current_station_number, iAmHost, stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Re-read the room row.
   *
   * Roles live on study_rooms and used to reach the other device through
   * exactly one Realtime UPDATE frame, with nothing to fall back on. The
   * writer updates itself optimistically, so whoever made the change always
   * saw it work; the reader got one chance and, if it missed, stayed wrong
   * until some unrelated write to the same row happened to carry the current
   * roles along with it. A chat message would fix it. That is why it looked
   * like a delay rather than a failure.
   *
   * Every other piece of shared state already had a repair: the host
   * re-announces the timer and the station on reconnect, and participants are
   * re-read. Roles were the only one without. This is that repair.
   */
  const refreshRoom = useCallback(async (roomId: string) => {
    const { data, error } = await supabase
      .from("study_rooms")
      .select("*")
      .eq("id", roomId)
      .single();
    if (error || !data) return;
    // Whole row, like the Realtime handler, so anything else that drifted
    // comes back with it.
    setRoom(data);
  }, [supabase]);

  const refreshParticipants = useCallback(async (roomId: string) => {
    const { data } = await supabase
      .from("room_participants")
      .select("user_id,joined_at,muted")
      .eq("room_id", roomId)
      .returns<{ user_id: string; joined_at: string; muted: boolean }[]>();

    if (!data) return true;

    const profileIds = data.map((p) => p.user_id);
    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("id,display_name,initials,is_guest")
      .in("id", profileIds)
      .returns<{ id: string; display_name: string; initials: string; is_guest: boolean }[]>();

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );

    // Always read from ref — never from a potentially stale closure over `room`
    const hostId = currentHostIdRef.current;

    const plist: Participant[] = data.map((p) => {
      const prof = profileMap.get(p.user_id);
      return {
        userId: p.user_id,
        displayName: prof?.display_name ?? "Unknown",
        initials: prof?.initials ?? "?",
        isHost: hostId ? p.user_id === hostId : false,
        isSelf: p.user_id === userId,
        isGuest: prof?.is_guest ?? false,
        muted: p.muted,
        joinedAt: p.joined_at,
      };
    });

    // Order: host first, then others, self last
    plist.sort((a, b) => {
      if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
      if (a.isSelf !== b.isSelf) return a.isSelf ? 1 : -1;
      return 0;
    });

    setParticipants(plist);
    setHostNameState(plist.find((p) => p.isHost)?.displayName ?? null);

    // Returned so callers can tell whether the caller is still in the room.
    // Being removed is otherwise invisible from inside the room: the panel
    // keeps rendering off local state and the only sign is your own name
    // quietly leaving the list.
    const stillHere = plist.some((p) => p.isSelf);
    if (stillHere) wasParticipantRef.current = true;
    return stillHere;
  }, [supabase, userId]);

  // On join/rejoin: seed currentHostIdRef, and send the guest to the host's
  // station if they aren't already there.
  // Timer is NOT restored from DB — it resets to PREREAD on every station change,
  // and live sync happens via broadcast only.
  useEffect(() => {
    if (!room) return;
    currentHostIdRef.current = room.host_user_id;
    // Not on a restore. Joining a room is a request to be taken to the case;
    // reloading a page you were already on is not, and now that the session
    // outlives /case-bank that page could be your dashboard or a report.
    if (restoredFromStorageRef.current) {
      restoredFromStorageRef.current = false;
      return;
    }
    if (!iAmHost && room.current_station_number && room.current_station_number !== stationNumberRef.current) {
      followStation(room.current_station_number);
    }
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!room || !userId) return;

    const channel = supabase.channel(`room:${room.id}`, {
      config: {
        broadcast: { ack: false },
        presence: { key: userId },
      },
    });
    channelRef.current = channel;

    // Room state changes (timer sync + navigate sync for guests)
    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "study_rooms", filter: `id=eq.${room.id}` },
      (payload) => {
        const updated = payload.new as StudyRoom;
        // Keep ref in sync with DB truth; refresh participants immediately on host change
        if (updated.host_user_id && updated.host_user_id !== currentHostIdRef.current) {
          currentHostIdRef.current = updated.host_user_id;
          refreshParticipants(room.id);
        }
        setRoom(updated);

        const isGuest = updated.host_user_id !== userId;

        // Guests only. The host is the source of truth for the clock, and it
        // receives its own UPDATEs here — re-deriving from the row would let a
        // stale column overwrite the live countdown. That matters more than it
        // looks: a `before update` trigger touches this row on every chat
        // message (supabase/room_activity_tracking.sql), so an ungated apply
        // re-derives the timer on every client each time anyone types.
        if (isGuest) {
          const phase = updated.timer_phase as TimerPhase;
          let nextTimeLeft: number;
          let running: boolean;

          if (updated.timer_paused_at && updated.timer_paused_remaining !== null) {
            nextTimeLeft = updated.timer_paused_remaining;
            running = false;
          } else if (updated.timer_started_at && !updated.timer_paused_at) {
            const elapsed = Math.floor(
              (Date.now() - new Date(updated.timer_started_at).getTime()) / 1000
            );
            nextTimeLeft = Math.max(0, PHASE_DURATIONS[phase] - elapsed);
            running = true;
          } else {
            nextTimeLeft = PHASE_DURATIONS[phase];
            running = false;
          }

          latest.current.applyTimer(phase, nextTimeLeft, running);
        }

        // Station: guests follow host, unless they have stepped off the case
        if (
          isGuest &&
          updated.current_station_number &&
          updated.current_station_number !== stationNumberRef.current &&
          latest.current.shouldFollowHost()
        ) {
          latest.current.followStation(updated.current_station_number);
        }
      }
    );

    // Participant changes
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "room_participants", filter: `room_id=eq.${room.id}` },
      () => {
        refreshParticipants(room.id).then((stillHere) => {
          // Only once we have seen ourselves in the list, so an insert that has
          // not landed yet cannot read as a removal and eject us from a room
          // we are in the middle of joining.
          if (stillHere || !wasParticipantRef.current) return;
          logStatus("removed from the room — clearing the saved session");
          // The saved id goes too. Without that, a refresh would hand the room
          // straight back: the restore path repairs a missing participant row,
          // which is right when the row was lost and wrong when it was taken
          // away, and it cannot tell the difference on its own.
          sessionStorage.removeItem("studyRoomId");
          clearSession();
          setJoinError("You were removed from the study group.");
        });
      }
    );

    // Chat — new messages from other participants via postgres realtime
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "room_messages", filter: `room_id=eq.${room.id}` },
      (payload) => {
        const m = payload.new as { id: string; user_id: string; display_name: string; message: string; created_at: string };
        if (m.user_id === userId) return; // sender already added optimistically
        setMessages((prev) => [
          ...prev,
          {
            id: m.id,
            from: m.display_name,
            fromSelf: false,
            text: m.message,
            time: new Date(m.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    );

    // Guest receives timer state from host broadcasts
    channel.on("broadcast", { event: "timer" }, ({ payload }) => {
      const { phase, timeLeft, running } = payload as { phase: TimerPhase; timeLeft: number; running: boolean };
      if (!latest.current.iAmHost) {
        latest.current.applyTimer(phase, timeLeft, running);
      }
    });

    // Presence sync fires whenever anyone joins or leaves — refresh participant
    // list and recompute who is actually connected right now.
    channel.on("presence", { event: "sync" }, () => {
      setConnectedIds(new Set(Object.keys(channel.presenceState())));
      latest.current.refreshParticipants(room.id);
    });

    // Host re-announces station + timer whenever a new guest joins the channel
    channel.on("presence", { event: "join" }, () => {
      if (!latest.current.iAmHost) return;
      channel.send({ type: "broadcast", event: "navigate", payload: { stationNumber: stationNumberRef.current } });
      channel.send({ type: "broadcast", event: "timer", payload: timerStateRef.current });
    });

    // Host transfer — update ref immediately so refreshParticipants reads the new host
    channel.on("broadcast", { event: "host-change" }, ({ payload }) => {
      const { newHostUserId } = payload as { newHostUserId: string };
      currentHostIdRef.current = newHostUserId;
      setRoom((prev) => prev ? { ...prev, host_user_id: newHostUserId } : prev);
      latest.current.refreshParticipants(room.id);
    });

    // Recording: all participants receive start signal
    channel.on("broadcast", { event: "recording-start" }, ({ payload }) => {
      const { recordingId, doctorUserId, patientUserId, dailyRoomName, dailyRoomUrl } = payload as {
        recordingId: string;
        doctorUserId: string;
        patientUserId: string;
        dailyRoomName?: string;
        dailyRoomUrl?: string;
      };
      // A new recording always wins — force-end any debrief still counting
      // down from a previous take before joining the new call. Harmless
      // no-op if there was nothing to end.
      latest.current.endDebrief();
      setActiveRecordingId(recordingId);
      setRecordingState("starting");
      // A guest's banner is only ever cleared by the host today, so without
      // this a failure message from the last attempt sits over the whole of the
      // next consultation.
      setRecordingError("");
      logStatus("recording-start received", { recordingId, iAmHost: latest.current.iAmHost, dailyRoom: dailyRoomName ?? null });
      // Non-host participants: join the shared live audio call first (or
      // time out) so the mic recorder starts in sync with it, then start
      // their own mic if they're doctor or patient.
      if (!latest.current.iAmHost) {
        (async () => {
          let dailyOk = true;
          if (dailyRoomName && dailyRoomUrl) {
            const t0 = Date.now();
            const joined = await withTimeout(latest.current.joinDailyCall(dailyRoomName, dailyRoomUrl), DAILY_JOIN_TIMEOUT_MS);
            dailyOk = joined === true;
            logDuration(dailyOk ? "guest DailyCo join succeeded" : "guest DailyCo join failed/timed out", t0);
            if (!dailyOk) setDailyFailed(true);
          }
          const amEssential = latest.current.userId === doctorUserId || latest.current.userId === patientUserId;
          if (!dailyOk && amEssential) {
            // Voice call is required for this room but failed to connect for
            // me — tell the host so they can cancel and refund, rather than
            // starting my mic recorder into a consult no one can hear.
            logStatus("broadcasting voice-call-failed", { recordingId });
            channelRef.current?.send({ type: "broadcast", event: "voice-call-failed", payload: { recordingId } });
            return;
          }
          setRecordingState("recording");
          logStatus("phase → recording (guest)", { role: latest.current.userId === doctorUserId ? "doctor" : latest.current.userId === patientUserId ? "patient" : "observer" });
          // Mute observers during the graded consult — only doctor/patient
          // should be audible. The debrief unmutes everyone again.
          dailyCallRef.current?.setLocalAudio(amEssential);
          if (latest.current.userId === doctorUserId) {
            setMyRecordingRole("doctor");
            await latest.current.startLocalRecording(recordingId, "doctor");
          } else if (latest.current.userId === patientUserId) {
            setMyRecordingRole("patient");
            await latest.current.startLocalRecording(recordingId, "patient");
          }
        })();
      }
    });

    // Recording: stop signal
    channel.on("broadcast", { event: "recording-stop" }, () => {
      logStatus("recording-stop received");
      latest.current.stopLocalRecording();
      latest.current.startDebrief();
      if (latest.current.myRecordingRole === null) latest.current.markTakeFinished(latest.current.activeRecordingId);
    });

    // Pipeline progress, relayed by the host. Observers are not doctor or
    // patient, so RLS keeps them off the recording row and the status route
    // 404s for them — this is the only way they see the take being marked.
    // Anyone polling for themselves already has a better source, so they ignore
    // it rather than letting a relayed stage arrive out of order.
    channel.on("broadcast", { event: "review-stage" }, ({ payload }) => {
      const { recordingId, stage } = payload as { recordingId: string; stage: ReviewStage };
      if (latest.current.myRecordingRole !== null) return;
      setReviewRecordingId(recordingId);
      setReviewMineAsDoctor(false);
      setReviewStage(stage);
    });

    // The host closed the call early. Their action deleted the DailyCo room
    // out from under everyone, so the only thing left to do here is stop
    // counting down toward a close that has already happened.
    channel.on("broadcast", { event: "debrief-ended" }, () => {
      logStatus("debrief ended by the host");
      latest.current.endDebrief();
    });

    // A doctor/patient participant's voice call failed to connect — only the
    // host (who holds the credit) acts on this, cancelling for everyone.
    channel.on("broadcast", { event: "voice-call-failed" }, ({ payload }) => {
      if (!latest.current.iAmHost) return;
      const { recordingId, reason } = payload as { recordingId: string; reason?: string };
      logStatus("voice-call-failed received (host)", { recordingId, reason });
      latest.current.cancelRecordingDueToDailyFailure(recordingId, reason);
    });

    // Recording was cancelled (voice call failed for an essential
    // participant) — everyone unwinds back to idle.
    channel.on("broadcast", { event: "recording-cancelled" }, ({ payload }) => {
      const { reason } = payload as { reason?: string };
      logStatus("recording-cancelled received", { reason });
      latest.current.stopLocalRecording();
      latest.current.leaveDailyCall();
      setRecordingState("error");
      setRecordingError(reason ?? "Recording was cancelled. The voice call failed to connect.");
      setActiveRecordingId(null);
      setMyRecordingRole(null);
    });

    // Guest listens for host station changes
    channel.on("broadcast", { event: "navigate" }, ({ payload }) => {
      const { stationNumber: target } = payload as { stationNumber: number };
      if (!latest.current.iAmHost && target && target !== stationNumberRef.current && latest.current.shouldFollowHost()) {
        latest.current.followStation(target);
      }
    });

    channel.subscribe(async (status) => {
      logStatus("realtime channel status", { status });
      if (status === "SUBSCRIBED") {
        await channel.track({ userId, displayName, initials });
        latest.current.refreshParticipants(room.id);
        latest.current.refreshRoom(room.id);
        if (latest.current.iAmHost) {
          if (stationNumberRef.current !== null) {
            channel.send({
              type: "broadcast",
              event: "navigate",
              payload: { stationNumber: stationNumberRef.current },
            });
          }
          // Announce current timer state (covers auto-start and late-joining guests)
          channel.send({ type: "broadcast", event: "timer", payload: timerStateRef.current });
        }
      }
    });

    return () => {
      broadcastTimerRef.current = null;
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wire or clear the timer broadcaster whenever the host role lands on or
  // leaves this user. Kept separate from the channel effect so a host handover
  // mid-session rewires it without tearing the channel down.
  useEffect(() => {
    if (iAmHost && channelRef.current) {
      const ch = channelRef.current;
      broadcastTimerRef.current = (phase, timeLeft, running) => {
        ch.send({ type: "broadcast", event: "timer", payload: { phase, timeLeft, running } });
      };
    } else if (!iAmHost) {
      broadcastTimerRef.current = null;
    }
  }, [iAmHost, room?.id]);

  // Host: write current station to DB whenever room loads or station changes.
  // Guests receive it via the postgres_changes UPDATE subscription below.
  // The result MUST be consumed — a Supabase query builder is lazy and never
  // issues the request unless it's awaited or .then()'d. Without this the row
  // stayed frozen at whatever station the room was created on, so every guest
  // remount re-read that stale value and navigated back to it mid-journey.
  useEffect(() => {
    if (!room || !iAmHost) return;
    // Only when there is a station to record. The host stepping off a case —
    // to their dashboard, to a report — is not the room moving off it, and
    // writing null here erased the case everyone else was still reading: the
    // dock's link back is the only route a guest has now that they are no
    // longer dragged along, and an invite arriving at that moment would be
    // sent to the station list instead of the case.
    if (stationNumber === null) return;
    supabase
      .from("study_rooms")
      .update({ current_station_number: stationNumber, last_activity_at: new Date().toISOString() })
      .eq("id", room.id)
      .then(({ error }) => {
        if (error) logError("update current_station_number", error, { stationNumber });
      });
  }, [room?.id, stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // Host: broadcast station change via the existing channel whenever stationNumber changes.
  // This handles App Router navigation which updates props in-place without remounting
  // the component, so the channel subscription effect (which only fires on room?.id
  // change) won't re-run. The SUBSCRIBED callback covers the initial broadcast on join.
  useEffect(() => {
    if (!room || !iAmHost || !channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "navigate",
      payload: { stationNumber },
    });
  }, [stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load persisted messages when room is joined
  useEffect(() => {
    if (!room) return;
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    supabase
      .from("room_messages")
      .select("id, user_id, display_name, message, created_at")
      .eq("room_id", room.id)
      .gt("created_at", cutoff)
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data }) => {
        if (!data) return;
        setMessages(
          data.map((m) => ({
            id: m.id,
            from: m.display_name,
            fromSelf: m.user_id === userId,
            text: m.message,
            time: new Date(m.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          }))
        );
      });
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-rejoin a saved room. Also accepts the ?joinRoom= URL param, which is
  // how a landing from a room invite link arrives.
  //
  // Deliberately not a mount-only effect. Both halves of the invite flow reach
  // the station by client-side navigation — the gateway pushes after a guest
  // signs in, and the logged-in branch server-redirects — and this provider no
  // longer remounts for either, so a mount-only effect would never see the
  // param and the invitee would land on the case outside the room they had just
  // joined. Re-running is safe: it returns immediately unless there is an id to
  // act on and no room yet.
  useEffect(() => {
    if (!userId) return;
    const stored = sessionStorage.getItem("studyRoomId");
    const invited = new URLSearchParams(window.location.search).get("joinRoom");
    const savedId = stored ?? invited;
    if (!savedId || room) return;
    sessionStorage.setItem("studyRoomId", savedId);
    supabase
      .from("study_rooms")
      .select("*")
      .eq("id", savedId)
      .single<StudyRoom>()
      .then(({ data }) => {
        if (!data) return;
        // Set beside setRoom, not before the query: a room that has since been
        // deleted would otherwise leave the flag raised for the next genuine
        // join, which would then skip the navigation that join is for.
        //
        // An invite link asks to be taken to the host's case; reloading a page
        // you were already on does not. A reload also counts as having landed,
        // so a guest who refreshes on their dashboard is not then treated as a
        // newcomer and pulled onto whatever station the host is reading.
        restoredFromStorageRef.current = !invited;
        if (!invited) hasLandedRef.current = true;
        // A reload on the station list is someone who was deliberately
        // browsing it. browsingListRef is a ref and does not survive the
        // reload, so without this the arrival logic reads the restore as a
        // fresh arrival and pulls them onto the host's case — the one thing
        // the step-back exception exists to prevent.
        if (!invited && window.location.pathname === "/case-bank") {
          browsingListRef.current = true;
        }
        setRoom(data);
        // Being able to read the room is not the same as being in it. This is
        // the path an invite link arrives on, and the one that adopts a room
        // out of sessionStorage, neither of which has proved membership here.
        ensureRoomParticipantAction(data.id).then((r) => {
          if (r.error) logError("ensure participant", r.error, { roomId: data.id });
        });
      });
  }, [userId, pathname]); // eslint-disable-line react-hooks/exhaustive-deps


  /** Plays a remote participant's audio track through a hidden <audio> element — headless mode renders nothing itself. */
  function handleDailyTrackStarted(ev: { participant: { local: boolean; session_id: string } | null; track: MediaStreamTrack; type: string }) {
    if (ev.type !== "audio" || !ev.participant || ev.participant.local) return;
    const key = ev.participant.session_id;
    const existing = dailyAudioElsRef.current.get(key);
    if (existing) existing.remove();

    const audioEl = document.createElement("audio");
    audioEl.autoplay = true;
    audioEl.srcObject = new MediaStream([ev.track]);
    audioEl.style.display = "none";
    document.body.appendChild(audioEl);
    dailyAudioElsRef.current.set(key, audioEl);
  }

  function handleDailyTrackStopped(ev: { participant: { session_id: string } | null; type: string }) {
    if (ev.type !== "audio" || !ev.participant) return;
    const el = dailyAudioElsRef.current.get(ev.participant.session_id);
    if (el) {
      el.remove();
      dailyAudioElsRef.current.delete(ev.participant.session_id);
    }
  }

  // Recovery net: if a remote participant has a playable audio track that we're
  // not currently playing (e.g. their producer dropped and came back after a
  // network blip or the mic resumed), (re)attach it. Covers cases where a
  // clean "track-started" didn't fire — the situation behind the mid-call
  // "producer not found" audio drop.
  function attachRemoteAudio(participant: {
    local: boolean;
    session_id: string;
    tracks?: { audio?: { state?: string; persistentTrack?: MediaStreamTrack } };
  } | null) {
    if (!participant || participant.local) return;
    const audio = participant.tracks?.audio;
    if (audio?.state !== "playable" || !audio.persistentTrack) return;
    const key = participant.session_id;
    const existing = dailyAudioElsRef.current.get(key);
    const currentId = existing?.srcObject instanceof MediaStream ? existing.srcObject.getTracks()[0]?.id : null;
    if (existing && currentId === audio.persistentTrack.id) return; // already playing this track
    existing?.remove();
    const audioEl = document.createElement("audio");
    audioEl.autoplay = true;
    audioEl.srcObject = new MediaStream([audio.persistentTrack]);
    audioEl.style.display = "none";
    document.body.appendChild(audioEl);
    dailyAudioElsRef.current.set(key, audioEl);
    logStatus("re-attached remote audio", { session: key });
  }

  async function getOrCreateDailyCall(): Promise<DailyCall | null> {
    if (dailyCallRef.current) return dailyCallRef.current;
    const DailyIframe = (await import("@daily-co/daily-js")).default;
    const call = DailyIframe.createCallObject({ subscribeToTracksAutomatically: true });
    call.on("track-started", handleDailyTrackStarted as never);
    call.on("track-stopped", handleDailyTrackStopped as never);
    // Recovery + observability for mid-call audio drops.
    call.on("participant-updated", ((ev: { participant: Parameters<typeof attachRemoteAudio>[0] }) => attachRemoteAudio(ev.participant)) as never);
    call.on("error", ((e: unknown) => {
      // Fatal: the call is over, whatever the badge was saying a moment ago.
      logError("DailyCo error", e);
      setCallConnected(false);
      setDailyReconnecting(false);
      setDailyConnecting(false);
      setDailyFailed(true);
    }) as never);
    call.on("nonfatal-error", ((e: unknown) => logError("DailyCo nonfatal-error", e)) as never);
    // The call ending is the event the indicator was missing. Without it
    // `callConnected` stayed true for the life of the tab — so the panel went
    // on claiming "Call Connected" over a call that had been torn down, which
    // is the one moment someone actually looks at it.
    call.on("left-meeting", (() => {
      logStatus("DailyCo left meeting");
      setCallEnded(true);
      setCallConnected(false);
      setDailyReconnecting(false);
      setDailyConnecting(false);
    }) as never);
    call.on("network-connection", ((e: unknown) => {
      const ev = e as { type?: string; event?: string };
      logStatus("DailyCo network-connection", ev as Record<string, unknown>);
      // Only the signaling channel speaks for the call as a whole; a p2p or sfu
      // blip is about one peer's media and recovers on its own.
      if (ev.type && ev.type !== "signaling") return;
      if (ev.event === "interrupted") setDailyReconnecting(true);
      else if (ev.event === "connected") setDailyReconnecting(false);
    }) as never);
    dailyCallRef.current = call;
    return call;
  }

  /** Warms up mic access well before recording starts, so the real join is instant. */
  async function prewarmDailyCall() {
    const t0 = Date.now();
    try {
      const call = await getOrCreateDailyCall();
      await call?.startCamera({ startVideoOff: true, startAudioOff: false });
      logDuration("DailyCo mic prewarm", t0);
    } catch (err) {
      // best-effort — worst case the permission prompt just happens at join time instead
      logError("DailyCo mic prewarm", err);
    }
  }

  async function joinDailyCall(roomName: string, roomUrl: string): Promise<boolean> {
    setDailyConnecting(true);
    setDailyFailed(false);
    setDailyReconnecting(false);
    setCallEnded(false);
    const t0 = Date.now();
    try {
      const tokenResult = await getDailyTokenAction(roomName, displayName, iAmHost);
      if ("error" in tokenResult) {
        logError("getDailyTokenAction", tokenResult.error, { roomName });
        setDailyFailed(true);
        return false;
      }
      const call = await getOrCreateDailyCall();
      if (!call) {
        logError("getOrCreateDailyCall", "returned null", { roomName });
        setDailyFailed(true);
        return false;
      }
      setDailyRoomName(roomName);
      await call.join({ url: roomUrl, token: tokenResult.token });
      setCallConnected(true);
      logDuration("DailyCo join", t0);
      return true;
    } catch (err) {
      // best-effort — recording continues locally regardless of live audio
      logError("DailyCo join", err, { roomName });
      setCallConnected(false);
      setDailyFailed(true);
      return false;
    } finally {
      setDailyConnecting(false);
    }
  }

  async function leaveDailyCall() {
    const call = dailyCallRef.current;
    if (call) {
      try {
        await call.leave();
        logStatus("DailyCo call left");
      } catch (err) {
        // best-effort — recording/upload flow doesn't depend on this
        logError("DailyCo leave", err);
      }
    }
    dailyAudioElsRef.current.forEach((el) => el.remove());
    dailyAudioElsRef.current.clear();
    setDailyConnecting(false);
    setCallConnected(false);
    setDailyReconnecting(false);
    setCallEnded(false);
    setDailyFailed(false);
    setDailyRoomName(null);
  }

  function clearDebriefTimers() {
    if (debriefIntervalRef.current) {
      clearInterval(debriefIntervalRef.current);
      debriefIntervalRef.current = null;
    }
    if (debriefTimeoutRef.current) {
      clearTimeout(debriefTimeoutRef.current);
      debriefTimeoutRef.current = null;
    }
  }

  // Recording has just stopped — start the debrief window instead of
  // closing the call immediately, so both candidates get a moment to talk
  // through the station before it ends.
  function startDebrief() {
    logStatus("debrief window started", { seconds: DEBRIEF_DURATION_SECONDS });
    // Everyone in the call — observers included — can talk freely during the
    // debrief, so make sure this participant's mic is live regardless of its
    // state during the recording.
    dailyCallRef.current?.setLocalAudio(true);
    clearDebriefTimers();
    debriefClosedRef.current = false;
    setDebriefSecondsLeft(DEBRIEF_DURATION_SECONDS);
    debriefIntervalRef.current = setInterval(() => {
      setDebriefSecondsLeft((s) => (s !== null ? Math.max(0, s - 1) : s));
    }, 1000);
    debriefTimeoutRef.current = setTimeout(() => {
      logStatus("debrief window ended — closing call");
      endDebrief();
    }, DEBRIEF_DURATION_SECONDS * 1000);
  }

  // Actually closes the call, whether the debrief window ran out or someone
  // ended it early.
  /**
   * Ends the debrief for everyone, not just the person who pressed it.
   *
   * The host closing the call deletes the DailyCo room, which ejects all three
   * participants — but nothing told the other two. Their counter carried on
   * saying "call closes in 2:41" while they talked into a call that no longer
   * existed. The host is the only one who can end it for the room, so only the
   * host announces it.
   */
  function endDebriefForEveryone() {
    if (iAmHost) {
      channelRef.current?.send({ type: "broadcast", event: "debrief-ended", payload: {} });
    }
    endDebrief();
  }

  function endDebrief() {
    clearDebriefTimers();
    setDebriefSecondsLeft(null);
    if (iAmHost && dailyRoomName) endDailyCallAction(dailyRoomName);
    leaveDailyCall();
    debriefClosedRef.current = true;
    finishTakeIfReady(latest.current.activeRecordingId);
  }

  /**
   * Hands the room back for another station. `recordingState` used to terminate
   * at "done" with nothing on any path setting it back to "idle" short of
   * leaving the room entirely, so the Record button never returned and
   * `sessionIdle` stayed false — which also left the role selects locked and
   * made the "Reset the timer to change them" note beside them unactionable.
   *
   * Everything the last take left behind goes with it. The review stage does
   * not: the server is still working on that take, and its Review link is the
   * only route the candidate has back to the report.
   */
  function resetForNextTake() {
    logStatus("resetting for next take");
    if (hostStopCutoffRef.current) {
      clearTimeout(hostStopCutoffRef.current);
      hostStopCutoffRef.current = null;
    }
    audioChunksRef.current = [];
    pendingStopRef.current = false;
    takeFinishedRef.current = false;
    setRecordingState("idle");
    setActiveRecordingId(null);
    setMyRecordingRole(null);
    setRecordingError("");
  }

  /**
   * The take is over once the call has closed *and* this browser has finished
   * with its own audio. Those two land in either order — a slow upload can
   * outlast the three-minute debrief, and a short consultation is uploaded long
   * before it — so each side records that it is done and asks whether the other
   * already was, rather than assuming it is last.
   *
   * Scoped to a recording id because "either order" also spans takes: a patient
   * whose upload outlives the debrief can still be uploading station 5 when the
   * host starts station 6. Unscoped, that upload's completion would run the
   * reset against the *live* take and empty the buffer its recorder was filling
   * — losing the whole track, silently.
   */
  /** True if `takeId` refers to something older than the take now in progress. */
  function isStaleTake(takeId: string | null) {
    const live = latest.current.activeRecordingId;
    if (takeId === null) return false;
    // No live take means the session has been reset or torn down since this one
    // started — the room may not even be the same room any more. An upload
    // settling into that is every bit as stale as one settling into the next
    // take, so `live === null` counts too.
    return live === null || takeId !== live;
  }

  function finishTakeIfReady(takeId: string | null) {
    if (isStaleTake(takeId)) return;
    if (!debriefClosedRef.current || !takeFinishedRef.current) return;
    resetForNextTake();
  }

  /** This browser has nothing left to do with the given take's audio. */
  function markTakeFinished(takeId: string | null) {
    // Checked before anything is written, not after: a station-5 upload landing
    // during station 6 must not mark the *live* take finished, nor drop the
    // panel to "done" over a consultation that is still being recorded.
    if (isStaleTake(takeId)) {
      logStatus("late finish ignored — a newer take is live", { takeId, live: latest.current.activeRecordingId });
      return;
    }
    takeFinishedRef.current = true;
    setRecordingState("done");
    finishTakeIfReady(takeId);
  }

  /**
   * Host-only. Voice call failed to connect for an essential (doctor/patient)
   * participant — abort the whole attempt: refund the credit, delete the
   * never-recorded row, tell everyone to unwind, and clean up the DailyCo
   * room. Called either for the host's own failed join, or in response to a
   * guest's voice-call-failed broadcast.
   */
  async function cancelRecordingDueToDailyFailure(recordingId: string, why?: string) {
    logStatus("cancelling recording", { recordingId, why: why ?? "voice call failed" });
    if (dailyRoomName) endDailyCallAction(dailyRoomName);
    const result = await cancelRecordingAction(recordingId);
    if (result.error) logError("cancelRecordingAction", result.error, { recordingId });
    const reason = result.error ?? why ?? "There was an issue connecting the voice call. Please try again.";

    channelRef.current?.send({
      type: "broadcast",
      event: "recording-cancelled",
      payload: { reason },
    });

    stopLocalRecording();
    leaveDailyCall();
    // The consultation never happened, so nothing about it should still be
    // running: the clock was started by beginConsultation a moment ago, and the
    // 12-minute cutoff is armed. Left alone, that cutoff outlives the cancelled
    // attempt and fires into whatever take is running twelve minutes later,
    // ending it early.
    if (hostStopCutoffRef.current) {
      clearTimeout(hostStopCutoffRef.current);
      hostStopCutoffRef.current = null;
    }
    handleTimerReset();
    setRecordingState("error");
    setRecordingError(reason);
    setActiveRecordingId(null);
    setMyRecordingRole(null);
  }

  async function startLocalRecording(recordingId: string, role: "doctor" | "patient") {
    recorderStartingRef.current = true;
    pendingStopRef.current = false; // fresh attempt — clear any stale flag
    // Likewise. It is only cleared in `onstop`, which never runs when the
    // session was torn down with no recorder live — so signing out between
    // takes would otherwise leave it raised and throw away the *next* take's
    // audio without a word.
    abandonRecordingRef.current = false;
    const t0 = Date.now();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        logStatus("local recorder stopped", { role, abandoned: abandonRecordingRef.current });
        stream.getTracks().forEach((t) => t.stop());
        // Signing out ends the session with the recorder still running. The
        // microphone has to be released either way — that is the line above —
        // but there is no longer an authenticated session to upload into, so
        // the attempt would only fail loudly at someone who has already left.
        if (abandonRecordingRef.current) {
          abandonRecordingRef.current = false;
          audioChunksRef.current = [];
          return;
        }
        uploadRecording(recordingId, role);
      };
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      recorderStartingRef.current = false;
      logDuration(`local recorder ready (${role})`, t0);

      // A stop signal arrived while we were still setting up — honor it now
      // instead of letting the recorder run with no way left to stop it.
      if (pendingStopRef.current) {
        pendingStopRef.current = false;
        logStatus("pending stop honored — recorder was mid-setup when stop arrived", { role });
        recorder.stop();
        return;
      }

      // Hard cutoff — recording never exceeds the 12-minute consult window,
      // regardless of whether the host remembers to stop it.
      recordingCutoffRef.current = setTimeout(() => {
        logStatus("12-minute auto-cutoff fired", { role });
        stopLocalRecording();
      }, PHASE_DURATIONS.CONSULT * 1000);
    } catch (err) {
      logError("getUserMedia (local recorder)", err, { role });
      recorderStartingRef.current = false;
      pendingStopRef.current = false;
      setRecordingState("error");
      setRecordingError("Microphone access denied. Please allow microphone access and try again.");

      // And stop the whole take, rather than only this browser.
      //
      // Only the doctor and the patient ever reach here, and the pipeline needs
      // both their tracks before it will start. Failing quietly meant the
      // consultation ran its full twelve minutes, one track uploaded, the other
      // never arrived, and the partner watched a spinner until it timed out and
      // claimed the marking had failed. Nobody got a report and nobody was told
      // why. A missing microphone is worse than the failed voice call this path
      // was built for — that at least still records — so it takes the same
      // route: refund the credit, delete the row, unwind everyone.
      const who = role === "doctor" ? "The doctor" : "The patient";
      const reason = `${who} could not start their microphone, so the consultation was not recorded. Allow microphone access and try again.`;
      if (latest.current.iAmHost) {
        await latest.current.cancelRecordingDueToDailyFailure(recordingId, reason);
      } else {
        channelRef.current?.send({
          type: "broadcast",
          event: "voice-call-failed",
          payload: { recordingId, reason },
        });
      }
    }
  }

  function stopLocalRecording() {
    if (recordingCutoffRef.current) {
      clearTimeout(recordingCutoffRef.current);
      recordingCutoffRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      logStatus("stopping local recorder", { state: mediaRecorderRef.current.state });
      mediaRecorderRef.current.stop();
    } else if (recorderStartingRef.current) {
      // Recorder isn't ready yet — remember to stop it the moment it is.
      logStatus("stop requested before recorder was ready — queued as pending");
      pendingStopRef.current = true;
    } else {
      logStatus("stop requested but no recorder exists (observer or not yet started)");
    }
  }

  /**
   * Follows a finished take through the server pipeline so the panel can show
   * where it has got to instead of a single "sent" that is true the moment our
   * own blob lands and says nothing for the minute after it.
   *
   * Polling rather than realtime: `station_recordings` is not in the
   * `supabase_realtime` publication, and adding it is a migration deployed
   * separately from this code. The two stages the poll distinguishes are not
   * separate statuses either — the pipeline writes the transcript as a
   * checkpoint partway through `processing`, so its presence is what tells
   * transcribing from marking.
   */
  async function pollReviewStage(recordingId: string) {
    if (pollingRecordingRef.current === recordingId) return;
    pollingRecordingRef.current = recordingId;

    // Everything this loop does is gated on still being the current poll. It
    // outlives the thing that started it — a take, and potentially the room —
    // and without this a loop left over from a room you had left would keep
    // writing stages and, if you were host of the next room, broadcast a link
    // to a recording nobody there was part of.
    const stillMine = () => pollingRecordingRef.current === recordingId;

    const publish = (stage: ReviewStage) => {
      if (!stillMine()) return;
      // The id goes with the stage. They are set in different places —
      // reviewRecordingId when an upload starts, the stage when the poll
      // learns something — and a poll still following take 5 while take 6
      // started uploading would otherwise put take 5's "Review ✓" on a link
      // pointing at take 6, which has no report yet.
      setReviewRecordingId(recordingId);
      setReviewMineAsDoctor(latest.current.myRecordingRole === "doctor");
      setReviewStage(stage);
      // Observers cannot read the row (RLS admits only doctor and patient) and
      // the status route 404s for them, so the host relays what it learns.
      if (latest.current.iAmHost) {
        channelRef.current?.send({
          type: "broadcast",
          event: "review-stage",
          payload: { recordingId, stage },
        });
      }
    };

    const t0 = Date.now();
    // Two clocks, because there are two waits and only one of them is the
    // pipeline's. `deadline` matches the grading route's own maxDuration and is
    // measured from when that route can actually start — it only starts once
    // BOTH tracks have landed, so whichever candidate uploads first would
    // otherwise spend its whole budget waiting for the other. `waitingUntil`
    // bounds that other wait, because a partner who denied their microphone or
    // closed their tab never uploads at all, and this loop now outlives every
    // navigation.
    let deadline = Date.now() + 300_000;
    const waitingUntil = t0 + GIVE_UP_AFTER_MS;
    let consecutiveErrors = 0;
    try {
      while (stillMine() && Date.now() < deadline) {
        let s: {
          status: string;
          has_transcript: boolean;
          audio_complete: boolean;
          ai_error: string | null;
          ai_data_gathering: string | null;
        };
        try {
          const res = await fetch(`/api/recordings/${recordingId}/status`);
          // 404 means this participant is neither doctor nor patient. Nothing
          // to poll for; the host's relay is their only source.
          if (res.status === 404) {
            logStatus("review poll stopped — not a candidate on this recording", { recordingId });
            return;
          }
          if (!res.ok) throw new Error(`status ${res.status}`);
          s = await res.json();
          consecutiveErrors = 0;
        } catch (err) {
          // A dropped connection is not a failed pipeline. Keep trying, the way
          // the other pollers in this codebase do, and only give up once the
          // server has been unreachable for the better part of a minute.
          consecutiveErrors += 1;
          logError("review poll tick (retrying)", err, { recordingId, consecutiveErrors });
          if (consecutiveErrors >= 10) {
            publish("failed");
            return;
          }
          await new Promise((r) => setTimeout(r, 4000));
          continue;
        }

        // Thrown away on purpose. Nothing to wait for and nothing to link to.
        if (s.status === "discarded") {
          logStatus("review poll stopped — take discarded", { recordingId });
          return;
        }

        const inFlight =
          s.status === "uploading" || s.status === "processing" ||
          s.status === "transcribed" || s.status === "grading";

        if (!inFlight) {
          // "ai_graded" is written on success and on failure alike, so status
          // cannot be the signal on its own. ai_error is: a failed run sets it,
          // and a run that never graded because Deepgram is switched off leaves
          // it clear — that report still exists and is worth linking to.
          if (!s.ai_error) {
            logDuration("review pipeline completed", t0);
            publish("review");
          } else {
            logError("review pipeline failed", s.ai_error, { recordingId });
            publish("failed");
          }
          return;
        }

        // Transcribed and waiting on the doctor. Keep polling, because the
        // answer arrives as a status change, but stop counting this against
        // the pipeline's budget: the clock that matters now is a person's,
        // and they may take minutes or never come back. Giving up here is
        // silent rather than "failed" — nothing has gone wrong, and the same
        // three choices are still on /recordings whenever they return.
        if (s.status === "transcribed") {
          publish("decide");
          if (Date.now() > waitingUntil) {
            logStatus("review poll stopped — still waiting on a decision", {
              recordingId,
              waitedSeconds: Math.round((Date.now() - t0) / 1000),
            });
            return;
          }
          deadline = Date.now() + 300_000;
          await new Promise((r) => setTimeout(r, 4000));
          continue;
        }

        if (!s.audio_complete) {
          publish("uploading");
          if (Date.now() > waitingUntil) {
            logStatus("review poll gave up — the other track never arrived", {
              recordingId,
              waitedSeconds: Math.round((Date.now() - t0) / 1000),
            });
            publish("failed");
            return;
          }
          // The pipeline's clock has not started, so neither should its budget.
          deadline = Date.now() + 300_000;
        } else if (s.status === "grading") publish("marking");
        else publish("transcribing");

        await new Promise((r) => setTimeout(r, 4000));
      }
      if (stillMine()) {
        logStatus("review poll gave up — still processing on the server", {
          recordingId,
          waitedSeconds: Math.round((Date.now() - t0) / 1000),
        });
        publish("failed");
      }
    } finally {
      if (stillMine()) pollingRecordingRef.current = null;
    }
  }

  async function uploadRecording(recordingId: string, role: "doctor" | "patient") {
    // Guarded, because this can run after the take it belongs to is over. The
    // recorder's onstop is a queued task, so a cancelled recording or a Leave
    // pressed mid-setup reaches here having already settled the session — and
    // an ungated "uploading" would overwrite that with a state nothing later
    // clears, leaving no Record button, no Stop, and no Try Again.
    const stale = isStaleTake(recordingId);
    if (!stale) {
      setRecordingState("uploading");
      setReviewRecordingId(recordingId);
      setReviewMineAsDoctor(latest.current.myRecordingRole === "doctor");
      setReviewStage("uploading");
    }
    const t0 = Date.now();
    try {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      logStatus("upload starting", { role, sizeKB: Math.round(blob.size / 1024) });
      await uploadRecordingAudio(recordingId, role, blob);
      logDuration(`upload (${role})`, t0);
      // The upload outlives its take: it can still be in flight when the next
      // one starts, or when the room is left altogether. Neither the reset nor
      // the poll belongs to anyone but this take — a poll started after a
      // teardown would re-arm itself past the cancellation and, in a later
      // room, broadcast a link to a recording nobody there was part of.
      if (isStaleTake(recordingId)) {
        logStatus("upload landed after its take ended — not touching live state", { recordingId });
        return;
      }
      markTakeFinished(recordingId);
      pollReviewStage(recordingId);
    } catch (err) {
      logError("upload", err, { role });
      // The chip resolves only if it is still this take's chip — otherwise the
      // spinner it is showing would never clear. If a later take has claimed
      // it, or the room has been left, this failure is not the thing on screen
      // and saying so would replace a finished report's link with an older
      // take's failure.
      if (latest.current.reviewRecordingId === recordingId) setReviewStage("failed");
      // The *session* must not be dropped into "error" for a take that is over:
      // that hides the REC indicator and the Stop button over a consultation
      // that is still running and still being captured.
      if (isStaleTake(recordingId)) return;
      setRecordingState("error");
      setRecordingError("Upload failed. Please contact support.");
    }
  }

  async function handleConfirmRecord(timerExtra: Record<string, unknown> = {}): Promise<boolean> {
    if (!room || !iAmHost || !doctorUserId || !patientUserId || stationNumber === null) return false;
    if (doctorUserId === patientUserId) {
      setRecordingError("Doctor and patient must be different participants.");
      return false;
    }
    // Starting a new recording always wins — any leftover debrief call from
    // a previous take is closed immediately, no grace period.
    if (debriefSecondsLeft !== null) {
      logStatus("new recording starting — ending previous debrief call immediately");
      endDebrief();
    }
    setRecordingState("starting");
    setRecordingError("");
    logStatus("host starting recording", { stationNumber, doctorId: doctorUserId, patientId: patientUserId });

    const doctorPart = participants.find((p) => p.userId === doctorUserId);
    const patientPart = participants.find((p) => p.userId === patientUserId);

    const result = await startRecordingAction({
      roomId: room.id,
      stationNumber,
      stationTitle: stationTitle ?? `Station ${stationNumber}`,
      doctorUserId: doctorUserId,
      patientUserId: patientUserId,
      doctorDisplayName: doctorPart?.displayName ?? "Doctor",
      patientDisplayName: patientPart?.displayName ?? "Patient",
    });

    if (result.error) {
      logError("startRecordingAction", result.error);
      setRecordingState("error");
      setRecordingError(result.error);
      return false;
    }

    const recordingId = result.recordingId!;
    logStatus("recording row created", { recordingId });
    setActiveRecordingId(recordingId);
    // Stay in "starting" — not yet "recording" — until the synced start
    // below actually happens, so the UI doesn't claim REC prematurely.

    // Start the shared live audio call, if enabled — best-effort, never
    // blocks the recording itself if DailyCo is unavailable.
    let dailyRoom: { roomName: string; roomUrl: string } | null = null;
    if (dailyCoEnabled) {
      const dailyResult = await createDailyCallAction(recordingId);
      if (!("error" in dailyResult)) {
        dailyRoom = dailyResult;
        logStatus("DailyCo room created", { roomName: dailyResult.roomName });
      } else {
        logError("createDailyCallAction", dailyResult.error);
      }
    }

    // Notify all participants via broadcast
    channelRef.current?.send({
      type: "broadcast",
      event: "recording-start",
      payload: {
        recordingId,
        doctorUserId,
        patientUserId,
        dailyRoomName: dailyRoom?.roomName,
        dailyRoomUrl: dailyRoom?.roomUrl,
      },
    });
    logStatus("broadcast recording-start sent", { recordingId });

    // Wait for the live call to connect (or time out) before starting the
    // timer and the recorder, so all three begin in sync.
    if (dailyRoom) {
      const t0 = Date.now();
      const joined = await withTimeout(joinDailyCall(dailyRoom.roomName, dailyRoom.roomUrl), DAILY_JOIN_TIMEOUT_MS);
      logDuration(joined === true ? "host DailyCo join succeeded" : "host DailyCo join failed/timed out", t0);
      if (joined !== true) {
        setDailyFailed(true);
        const amEssential = userId === doctorUserId || userId === patientUserId;
        if (amEssential) {
          logStatus("host is essential participant — cancelling recording due to Daily failure");
          await cancelRecordingDueToDailyFailure(recordingId);
          return true;
        }
      }
    }

    setRecordingState("recording");
    logStatus("phase → recording (host)");

    // Only the doctor and patient should be audible during the graded
    // consult — mute observers (the debrief unmutes everyone again).
    const hostEssential = userId === doctorUserId || userId === patientUserId;
    dailyCallRef.current?.setLocalAudio(hostEssential);

    // Pressing Record *is* the start of the consultation, so the clock has to
    // agree with the 12-minute cutoff armed just below. This used to call
    // handleTimerReset(), which sends the display back to PREREAD 03:00 and
    // stops it — and because `locked` disables every control while recording,
    // the host had no way to restart it. The clock sat frozen at 03:00 for the
    // whole consultation.
    beginConsultation(timerExtra);

    // Hard cutoff — host broadcasts stop to the whole room at 12 minutes,
    // regardless of whether anyone remembers to click Stop.
    //
    // Through the trampoline, not directly: this closure is twelve minutes old
    // by the time it runs, and the local handleStopRecording it would otherwise
    // capture reads a `myRecordingRole` frozen at null — it is set two lines
    // below, after this. The stop would then take the observer branch and
    // declare the take finished while the doctor's audio was still uploading.
    // Zero, because the clock has run out by definition here.
    hostStopCutoffRef.current = setTimeout(() => {
      logStatus("12-minute host cutoff fired — broadcasting stop");
      latest.current.stopRecording(0);
    }, PHASE_DURATIONS.CONSULT * 1000);

    // Start this user's own microphone if they're doctor or patient
    if (userId === doctorUserId) {
      setMyRecordingRole("doctor");
      await startLocalRecording(recordingId, "doctor");
    } else if (userId === patientUserId) {
      setMyRecordingRole("patient");
      await startLocalRecording(recordingId, "patient");
    }
    return true;
  }

  function handleStopRecording(stopAt?: number) {
    logStatus("host stopping recording");
    if (hostStopCutoffRef.current) {
      clearTimeout(hostStopCutoffRef.current);
      hostStopCutoffRef.current = null;
    }
    channelRef.current?.send({
      type: "broadcast",
      event: "recording-stop",
      payload: {},
    });
    stopLocalRecording();
    // The consultation ended when the recording did, whether that was the
    // 12-minute cutoff or someone choosing to end early. Without this the
    // clock kept counting down over a session that was already over.
    handleTimerStop(stopAt);
    startDebrief();
    if (myRecordingRole === null) {
      // Host is observer — nothing to upload, so its take is over already
      markTakeFinished(activeRecordingId);
    }
  }

  async function handleShareReport() {
    if (!room || !recentReportId) return;
    const url = `${window.location.origin}/recordings/${recentReportId}`;
    window.open(url, "_blank");
    const text = `${displayName} shared their report for Station ${stationNumber} → ${url}`;
    const { data } = await supabase
      .from("room_messages")
      .insert({ room_id: room.id, user_id: userId, display_name: displayName, message: text })
      .select("id, created_at")
      .single();
    if (data) {
      setMessages((prev) => [...prev, {
        id: data.id,
        from: displayName,
        fromSelf: true,
        text,
        time: new Date(data.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      }]);
    }
  }

  /**
   * Reads the station through the ref, not through the closure. This is the
   * reason "create group" did nothing until you reloaded.
   *
   * This function is handed to the panel inside the roomValue memo below,
   * and that memo's dependency list does not include stationNumber. The
   * provider lives in the root layout, so it never remounts either. Arrive
   * at a case by client-side navigation — from the dashboard, or from the
   * case list — and nothing in that dependency list has changed, so the
   * panel is still holding the handleCreate captured while stationNumber
   * was null. The guard then returned before the request, before the
   * spinner, before any log: the button was simply dead. Reloading
   * recomputed the memo with a real station in scope, which is exactly why
   * a refresh "fixed" it, and a failed Join also fixed it because
   * joinError and loading ARE in that list — hence "many times" rather
   * than always.
   *
   * The ref is maintained by an effect on every stationNumber change, and
   * the provider does re-render on navigation (usePathname), so it is
   * current whichever copy of this function ends up running. The same file
   * already uses it this way for the channel callbacks.
   *
   * The try/finally is the other half: without it a server action that
   * threw left `loading` stuck true, and the button stayed disabled until
   * a reload.
   */
  async function handleCreate() {
    const station = stationNumberRef.current;
    if (station === null) {
      setJoinError("Open a case first. A study group always starts on a station.");
      return;
    }
    setLoading(true);
    setJoinError("");
    try {
      const result = await createStudyRoomAction(station);
      if (result.error || !result.room) {
        logError("createStudyRoomAction", result.error ?? "action returned no room");
        setJoinError(result.error ?? "Could not open the group. Please try again.");
        return;
      }
      logStatus("room created", { roomId: result.room.id });
      sessionStorage.setItem("studyRoomId", result.room.id);
      setRoom(result.room);
    } catch (err) {
      logError("createStudyRoomAction", err instanceof Error ? err.message : "threw");
      setJoinError("Could not open the group. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(code: string) {
    if (!code.trim()) return;
    setLoading(true);
    setJoinError("");
    const result = await joinStudyRoomAction(code.trim());
    if (result.error) {
      logError("joinStudyRoomAction", result.error, { code: code.trim() });
      setJoinError(result.error);
      setLoading(false);
      return;
    }
    // Same re-read, same silent failure as creating one — see handleCreate.
    if (!result.room) {
      logError("joinStudyRoomAction", "action returned no room");
      setJoinError("Could not open the group. Please try again.");
      setLoading(false);
      return;
    }
    logStatus("joined room", { roomId: result.room.id });
    sessionStorage.setItem("studyRoomId", result.room.id);
    setRoom(result.room);
    setLoading(false);
  }

  async function handleLeave() {
    if (!room) return;
    const others = participants.filter((p) => !p.isSelf);
    // Keep the doctor=host invariant when a role-holder leaves.
    if (iAmHost && others.length > 0) {
      // The leaver is the doctor (and therefore host) — hand the doctor/host
      // role to another participant so the room isn't left hostless.
      const newDoctor = others[Math.floor(Math.random() * others.length)].userId;
      const keepPatient = patientUserId && patientUserId !== newDoctor && patientUserId !== userId ? patientUserId : null;
      const result = await setRoomRolesAction(room.id, newDoctor, keepPatient);
      if (!result.error) {
        channelRef.current?.send({ type: "broadcast", event: "host-change", payload: { newHostUserId: newDoctor } });
      }
    } else if (patientUserId === userId && doctorUserId) {
      // The leaver is the patient — clear the patient slot.
      await setRoomRolesAction(room.id, doctorUserId, null);
    }
    await leaveStudyRoomAction(room.id);
    sessionStorage.removeItem("studyRoomId");

    await clearSession();
  }

  /**
   * Everything the session leaves in this tab, undone. The panel unmounting on
   * navigation used to do this by accident; now that the session persists,
   * anything left behind here leaks into the next room joined in this tab.
   *
   * Separate from handleLeave because there are two ways out and only one of
   * them can talk to the server: leaving a room tells the room about it first,
   * whereas signing out has already destroyed the session that would carry
   * such a call.
   */
  async function clearSession({ abandonRecording = false } = {}) {
    // Before the cutoff below is disarmed, because that timeout is the last
    // thing that would otherwise stop a running recorder — leaving the
    // microphone live, and its indicator lit, for the rest of the tab's life.
    if (abandonRecording) abandonRecordingRef.current = true;
    stopLocalRecording();
    // Nothing downstream should broadcast into the room being left. The channel
    // is not torn down until setRoom(null) below re-runs its effect, so a local
    // timer reset would otherwise send one last PREREAD to everyone still there.
    broadcastTimerRef.current = null;
    clearDebriefTimers();
    if (recordingCutoffRef.current) { clearTimeout(recordingCutoffRef.current); recordingCutoffRef.current = null; }
    if (hostStopCutoffRef.current) { clearTimeout(hostStopCutoffRef.current); hostStopCutoffRef.current = null; }
    // Stops the poll on its next tick: publish() and the loop both compare
    // against this, so nothing from the old take can write state or broadcast
    // into whatever room is joined next.
    pollingRecordingRef.current = null;
    debriefClosedRef.current = true;
    takeFinishedRef.current = false;
    hasLandedRef.current = false;
    wasParticipantRef.current = false;

    // State first, teardown second. `leaveDailyCall` has no timeout, and
    // everything visible — the dock, the channel, the clock — hangs off this
    // state. Behind the await, a slow call teardown kept a room on screen that
    // the user had already left or signed out of.
    setRoom(null);
    setParticipants([]);
    setMessages([]);
    setConnectedIds(new Set());
    setHostNameState(null);
    setRecentReportId(null);
    setRecordingState("idle");
    setActiveRecordingId(null);
    setMyRecordingRole(null);
    setRecordingError("");
    setDebriefSecondsLeft(null);
    setReviewStage(null);
    setReviewRecordingId(null);
    // The clock too. Left on a spent CONSULT it fails `sessionIdle`, which
    // locks the role selects in the *next* room until someone finds Reset.
    resetTimerLocal();

    await leaveDailyCall();
    dailyCallRef.current?.destroy();
    dailyCallRef.current = null;
    // Re-arm the mic prewarm, otherwise the next room joined in this tab gets
    // no warm mic and its permission prompt can outlast the join timeout.
    dailyPrewarmingRef.current = false;
  }

  async function sendChat(raw: string) {
    const text = raw.trim();
    if (!text || !room) return;
    const { data } = await supabase
      .from("room_messages")
      .insert({ room_id: room.id, user_id: userId, display_name: displayName, message: text })
      .select("id, created_at")
      .single();
    if (data) {
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          from: displayName,
          fromSelf: true,
          text,
          time: new Date(data.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }

  // Support/debug handle. Most of what can go wrong with a persistent session
  // (a stale prewarm guard, a cutoff timer left armed, a call object that
  // outlived its room) is invisible in the UI and obvious here.
  if (typeof window !== "undefined") {
    (window as unknown as { __studyRoom?: () => unknown }).__studyRoom = () => ({
      roomId: room?.id ?? null,
      iAmHost,
      stationNumber,
      recordingState,
      myRecordingRole,
      dailyRoomName,
      hasDailyCall: !!dailyCallRef.current,
      prewarmed: dailyPrewarmingRef.current,
      debriefSecondsLeft,
      armed: {
        recordingCutoff: !!recordingCutoffRef.current,
        hostStopCutoff: !!hostStopCutoffRef.current,
      },
      timer: timerStateRef.current,
      participants: participants.length,
    });
  }

  // Rewritten every render so the channel handlers registered once per room
  // always execute against current state rather than the render that built them.
  latest.current = {
    userId,
    iAmHost,
    myRecordingRole,
    applyTimer: (phase, nextTimeLeft, running) => {
      setTimerPhase(phase);
      setTimeLeft(nextTimeLeft);
      setTimerRunning(running);
    },
    followStation,
    shouldFollowHost,
    refreshParticipants,
    refreshRoom,
    endDebrief,
    startDebrief,
    markTakeFinished,
    stopRecording: handleStopRecording,
    activeRecordingId,
    reviewRecordingId,
    joinDailyCall,
    leaveDailyCall,
    startLocalRecording,
    stopLocalRecording,
    cancelRecordingDueToDailyFailure,
  };

  const statusValue = useMemo<StudyRoomStatusValue>(
    () => ({
      inRoom: !!room,
      iAmHost,
      roomId: room?.id ?? null,
      hostName: hostNameState,
      isRecordingActive: recordingState === "recording",
      hostStationNumber: room?.current_station_number ?? null,
      stationNumber,
      registerStation,
    }),
    [room, iAmHost, hostNameState, recordingState, stationNumber, registerStation]
  );

  const timerValue = useMemo<StudyRoomTimerValue>(
    () => ({
      phase: timerPhase,
      timeLeft,
      running: timerRunning,
      isTimerHost: !room || iAmHost,
      locked: recordingState === "recording",
      startBlockedReason,
      startWillRecord: startWillRecord(),
      start: handleTimerStart,
      stop: () => { handleTimerStop(); },
      skipPreread: handleSkipPreread,
      reset: handleTimerReset,
      tick: handleTick,
      phaseComplete: handlePhaseComplete,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timerPhase, timeLeft, timerRunning, room, iAmHost, recordingState, handleTick, startBlockedReason]
  );

  const roomValue = useMemo<StudyRoomValue>(
    () => ({
      userId,
      displayName,
      initials,
      room,
      participants,
      connectedIds,
      doctorUserId,
      patientUserId,
      myAssignedRole,
      rolesReady,
      sessionIdle,
      rolesSaving,
      iAmHost,
      loading,
      joinError,
      createRoom: handleCreate,
      joinRoom: handleJoin,
      leaveRoom: handleLeave,
      setRoles: handleSetRoles,
      removeParticipant: handleRemoveParticipant,
      messages,
      sendChat,
      recordingState,
      recordingError,
      clearRecordingError: () => { setRecordingState("idle"); setRecordingError(""); },
      showStartWarning,
      confirmStart,
      cancelStart,
      stopRecording: handleStopRecording,
      myRecordingRole,
      activeRecordingId,
      reviewStage,
      reviewRecordingId,
      reviewMineAsDoctor,
      dismissReviewStage: () => { setReviewStage(null); setReviewRecordingId(null); setReviewMineAsDoctor(false); },
      dailyConnecting,
      callConnected,
      dailyReconnecting,
      callEnded,
      dailyFailed,
      debriefSecondsLeft,
      endDebrief: endDebriefForEveryone,
      recentReportId,
      shareRecentReport: handleShareReport,
      showScreenTip,
      dontShowScreenTip,
      setDontShowScreenTip,
      dismissScreenTip,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      userId, displayName, initials, room, participants, connectedIds,
      doctorUserId, patientUserId, myAssignedRole, rolesReady, sessionIdle,
      rolesSaving, iAmHost, loading, joinError, messages, recordingState,
      recordingError, myRecordingRole, activeRecordingId, dailyConnecting,
      callConnected, dailyReconnecting, callEnded, dailyFailed, debriefSecondsLeft, recentReportId,
      showScreenTip, dontShowScreenTip, reviewStage, reviewRecordingId, showStartWarning,
    ]
  );

  return (
    <StudyRoomStatusProvider value={statusValue}>
      <StudyRoomTimerProvider value={timerValue}>
        <StudyRoomValueProvider value={roomValue}>
          {children}
          {/*
            The station page renders the room inline in its sidebar. Everywhere
            else it had no representation at all, which is what made stepping
            off a case feel like leaving: no clock, no chat, no participants and
            — the part that actually trapped people — no Leave button. The dock
            fills in exactly those pages, so the session is always visible and
            always exitable.
          */}
          {room && stationNumber === null && <StudyRoomDock />}
        </StudyRoomValueProvider>
      </StudyRoomTimerProvider>
    </StudyRoomStatusProvider>
  );
}
