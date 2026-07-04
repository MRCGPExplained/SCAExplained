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
  onStart: () => void;
  onPause: () => void;
  onSkipPreread: () => void;
  onReset: () => void;
  onTick: (newTime: number) => void;
  onPhaseComplete: () => void;
}) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        onTick(timeLeft - 1);
      }, 1000);
    } else if (running && timeLeft === 0) {
      onPhaseComplete();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, timeLeft, onTick, onPhaseComplete]);

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
        <div className="flex gap-1.5 justify-center mt-2">
          <button
            onClick={running ? onPause : onStart}
            className="rounded-lg px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: "transparent",
              border: "1px solid rgba(26,27,82,0.15)",
              color: "rgba(26,27,82,0.5)",
              cursor: "pointer",
            }}
          >
            {running ? "Pause" : "Start"}
          </button>
          {phase === "PREREAD" && (
            <button
              onClick={onSkipPreread}
              className="rounded-lg px-3 py-1.5 text-[12px] font-semibold"
              style={{
                background: "transparent",
                border: "1px solid rgba(26,27,82,0.15)",
                color: "rgba(26,27,82,0.5)",
                cursor: "pointer",
              }}
            >
              Skip
            </button>
          )}
          <button
            onClick={onReset}
            className="rounded-lg px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: "transparent",
              border: "1px solid rgba(26,27,82,0.15)",
              color: "rgba(26,27,82,0.5)",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
