"use client";

import { useEffect, useRef, useCallback } from "react";
import type { TimerPhase } from "@/lib/case-bank-types";
import { PHASE_DURATIONS } from "@/lib/case-bank-types";

const NAVY = "#1F2937";
const YELLOW = "#F6D44B";

const BTN_CLASS = "rounded-lg px-3 py-1.5 text-[12px] font-semibold disabled:opacity-40";
const btnStyle = (disabled?: boolean) => ({
  background: "transparent",
  border: "1px solid rgba(26,27,82,0.15)",
  color: "rgba(26,27,82,0.5)",
  cursor: disabled ? ("not-allowed" as const) : ("pointer" as const),
});

export function Timer({
  phase,
  timeLeft,
  running,
  isHost,
  locked,
  startBlockedReason,
  onStart,
  onStop,
  onSkipPreread,
  onReset,
  onTick,
  onPhaseComplete,
}: {
  phase: TimerPhase;
  timeLeft: number;
  running: boolean;
  isHost: boolean;
  /**
   * True while a recording is in progress. Start, Skip and Reset are disabled —
   * the consultation must be seen through. Stop is deliberately exempt: it is
   * the one way out, and the note below promises it.
   */
  locked?: boolean;
  /**
   * Set when the clock cannot be started at all — in a room with no station
   * open, or with the roles unfilled. Start and Skip are disabled and the
   * reason is shown, because in a room the clock is what begins a recorded
   * consultation, and running it toward one that cannot happen is worse than
   * not running it.
   */
  startBlockedReason?: string | null;
  onStart: () => void;
  onStop: () => void;
  onSkipPreread: () => void;
  onReset: () => void;
  onTick: (newTime: number) => void;
  onPhaseComplete: () => void;
}) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Wall-clock anchor for the current run: {startMs, startTimeLeft}. The
  // countdown derives remaining time from real elapsed time rather than
  // decrementing a counter, so it stays correct even when the tab/screen was
  // backgrounded and setInterval ticks were throttled or frozen (the cause of
  // the phone-vs-computer drift). It also re-syncs the instant the tab
  // becomes visible again.
  const anchorRef = useRef<{ startMs: number; startTimeLeft: number } | null>(null);
  const timeLeftRef = useRef(timeLeft);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onPhaseComplete);
  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onPhaseComplete;
  });

  // Track timeLeft, and re-anchor when an external change (reset / skip /
  // host re-sync) moves it off the anchored trajectory by more than ~2s. Our
  // own per-second updates match the prediction, so they never re-anchor.
  useEffect(() => {
    timeLeftRef.current = timeLeft;
    const a = anchorRef.current;
    if (running && a) {
      const predicted = a.startTimeLeft - (Date.now() - a.startMs) / 1000;
      if (Math.abs(predicted - timeLeft) > 2) {
        anchorRef.current = { startMs: Date.now(), startTimeLeft: timeLeft };
      }
    }
  }, [timeLeft, running]);

  useEffect(() => {
    if (!running) {
      anchorRef.current = null;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    if (!anchorRef.current) {
      anchorRef.current = { startMs: Date.now(), startTimeLeft: timeLeftRef.current };
    }
    const tick = () => {
      const a = anchorRef.current;
      if (!a) return;
      const elapsed = (Date.now() - a.startMs) / 1000;
      const newTime = Math.max(0, Math.round(a.startTimeLeft - elapsed));
      if (newTime <= 0) onCompleteRef.current();
      else onTickRef.current(newTime);
    };
    intervalRef.current = setInterval(tick, 1000);
    const onVis = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [running, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  const isOrange = phase === "CONSULT" && timeLeft <= 120;
  const totalDuration = PHASE_DURATIONS[phase];
  const progress = (timeLeft / totalDuration) * 100;

  const phaseLabel = phase === "PREREAD" ? "Preparation" : "Consultation";

  const borderColor = isOrange ? "#F97316" : "rgba(31,41,55,0.15)";
  // Full strength whether or not the clock is moving. Dimming it while stopped
  // was tried and read as disabled rather than paused — the number is the one
  // thing on this card that always matters.
  const digitColor = isOrange ? "#F97316" : NAVY;
  const labelColor = isOrange ? "#F97316" : "rgba(31,41,55,0.4)";
  const barColor = isOrange ? "#F97316" : NAVY;

  return (
    <div
      className="rounded-2xl px-5 py-4 text-center"
      style={{
        background: "white",
        border: `2px solid ${borderColor}`,
        transition: "border-color 0.5s",
      }}
    >
      {/* Phase label */}
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: labelColor, transition: "color 0.5s" }}>
        {phaseLabel}
      </div>

      {/* Time digits */}
      <div
        className="font-display font-extrabold text-[32px] tracking-[0.04em]"
        style={{ color: digitColor, transition: "color 0.5s" }}
      >
        {mins}:{secs}
      </div>

      {/* Progress bar */}
      <div
        className="h-[3px] rounded-full my-2 overflow-hidden"
        style={{ background: "rgba(26,27,82,0.08)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: barColor,
            transition: "width 1s linear, background 0.5s",
          }}
        />
      </div>

      {/* Controls */}
      {isHost && (
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <div className="flex gap-1.5 justify-center">
            {/*
              What is offered depends on the phase, because the two phases are
              not the same kind of clock. The pre-read is preparation: it can be
              paused, resumed and skipped. The consultation is the assessment:
              it runs its 12 minutes or the candidate ends it early, and there
              is nothing in between. Skip is therefore only ever rendered in
              PREREAD, and Stop only ever in CONSULT.
            */}
            {phase === "PREREAD" ? (
              <>
                <button
                  onClick={() => (running ? onStop() : onStart())}
                  // Pausing a run already under way is never blocked — only
                  // beginning one is.
                  disabled={locked || (!running && !!startBlockedReason)}
                  title={!running && startBlockedReason ? startBlockedReason : undefined}
                  className={BTN_CLASS}
                  style={btnStyle(locked || (!running && !!startBlockedReason))}
                >
                  {running ? "Pause" : "Start"}
                </button>
                <button
                  onClick={onSkipPreread}
                  disabled={locked || !!startBlockedReason}
                  title={startBlockedReason ?? undefined}
                  className={BTN_CLASS}
                  style={btnStyle(locked || !!startBlockedReason)}
                >
                  Skip
                </button>
                <button onClick={onReset} disabled={locked} className={BTN_CLASS} style={btnStyle(locked)}>
                  Reset
                </button>
              </>
            ) : running ? (
              // While a recording is live, the panel's Stop is the only correct
              // way out — it ends the recorder and the clock together, behind a
              // confirmation. A second Stop here would stop only the clock and
              // leave the recorder running, so the note below points there
              // instead.
              locked ? null : (
                <button onClick={() => onStop()} className={BTN_CLASS} style={btnStyle(false)}>
                  Stop
                </button>
              )
            ) : (
              <button onClick={onReset} disabled={locked} className={BTN_CLASS} style={btnStyle(locked)}>
                Reset
              </button>
            )}
          </div>
          {locked ? (
            <p className="text-[10px] font-semibold" style={{ color: "#F97316" }}>
              Recording in progress: use Stop to end it early
            </p>
          ) : startBlockedReason && phase === "PREREAD" && !running ? (
            // Said here rather than only on the disabled button, so the host
            // knows what is missing before reaching for a control that will not
            // respond.
            <p className="text-[10px] font-semibold text-center" style={{ color: "rgba(26,27,82,0.45)" }}>
              {startBlockedReason}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
