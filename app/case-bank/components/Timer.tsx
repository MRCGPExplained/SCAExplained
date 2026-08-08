"use client";

import { useEffect, useRef, useCallback } from "react";
import type { TimerPhase } from "@/lib/case-bank-types";
import { PHASE_DURATIONS } from "@/lib/case-bank-types";

const NAVY = "#1F2937";
const YELLOW = "#F6D44B";

export function Timer({
  phase,
  timeLeft,
  running,
  isHost,
  locked,
  onStart,
  onPause,
  onSkipPreread,
  onReset,
  onTick,
  onPhaseComplete,
}: {
  phase: TimerPhase;
  timeLeft: number;
  running: boolean;
  isHost: boolean;
  /** While true (a recording is in progress), Pause and Reset are disabled — the consultation must be seen through. */
  locked?: boolean;
  onStart: () => void;
  onPause: () => void;
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
  const digitColor = isOrange ? "#F97316" : NAVY;

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
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: isOrange ? "#F97316" : "rgba(31,41,55,0.4)", transition: "color 0.5s" }}>
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
            background: isOrange ? "#F97316" : NAVY,
            transition: "width 1s linear, background 0.5s",
          }}
        />
      </div>

      {/* Controls */}
      {isHost && (
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <div className="flex gap-1.5 justify-center">
            <button
              onClick={running ? onPause : onStart}
              disabled={locked}
              className="rounded-lg px-3 py-1.5 text-[12px] font-semibold disabled:opacity-40"
              style={{
                background: "transparent",
                border: "1px solid rgba(26,27,82,0.15)",
                color: "rgba(26,27,82,0.5)",
                cursor: locked ? "not-allowed" : "pointer",
              }}
            >
              {running ? "Pause" : "Start"}
            </button>
            {phase === "PREREAD" && (
              <button
                onClick={onSkipPreread}
                disabled={locked}
                className="rounded-lg px-3 py-1.5 text-[12px] font-semibold disabled:opacity-40"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(26,27,82,0.15)",
                  color: "rgba(26,27,82,0.5)",
                  cursor: locked ? "not-allowed" : "pointer",
                }}
              >
                Skip
              </button>
            )}
            <button
              onClick={onReset}
              disabled={locked}
              className="rounded-lg px-3 py-1.5 text-[12px] font-semibold disabled:opacity-40"
              style={{
                background: "transparent",
                border: "1px solid rgba(26,27,82,0.15)",
                color: "rgba(26,27,82,0.5)",
                cursor: locked ? "not-allowed" : "pointer",
              }}
            >
              Reset
            </button>
          </div>
          {locked && (
            <p className="text-[10px] font-semibold" style={{ color: "#F97316" }}>
              Recording in progress — use Stop to end it early
            </p>
          )}
        </div>
      )}
    </div>
  );
}
