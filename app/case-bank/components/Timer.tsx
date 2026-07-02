"use client";

import { useEffect, useRef, useCallback } from "react";
import type { TimerPhase } from "@/lib/case-bank-types";
import { PHASE_DURATIONS } from "@/lib/case-bank-types";

const NAVY = "#1A1B52";
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
  const isRed = phase === "CONSULT" && timeLeft <= 120;
  const totalDuration = PHASE_DURATIONS[phase];
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  const phaseLabel = phase === "PREREAD" ? "Pre-Read" : "Consultation";

  return (
    <div
      className="rounded-2xl px-5 py-4 text-center"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: `1.5px solid ${isRed ? "rgba(239,68,68,0.4)" : "transparent"}`,
        minWidth: 200,
        transition: "border-color 0.5s",
      }}
    >
      {/* Phase label */}
      <div
        className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1"
        style={{
          color:
            phase === "PREREAD" ? YELLOW : isRed ? "#EF4444" : "rgba(255,255,255,0.45)",
          transition: "color 0.5s",
        }}
      >
        {phaseLabel}
      </div>

      {/* Time digits */}
      <div
        className="font-display font-extrabold text-[30px] tracking-[0.04em]"
        style={{ color: isRed ? "#EF4444" : "white", transition: "color 0.5s" }}
      >
        {mins}:{secs}
      </div>

      {/* Progress bar */}
      <div
        className="h-[3px] rounded-full my-2 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: isRed ? "#EF4444" : phase === "PREREAD" ? YELLOW : "rgba(255,255,255,0.5)",
            transition: "width 1s linear, background 0.5s",
          }}
        />
      </div>

      {/* Controls */}
      {isHost && (
        <div className="flex gap-1.5 justify-center mt-2">
          <button
            onClick={running ? onPause : onStart}
            className="rounded-lg px-3.5 py-1.5 text-[12px] font-bold"
            style={{
              background: running ? "rgba(255,255,255,0.15)" : YELLOW,
              border: "none",
              color: running ? "white" : NAVY,
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
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.55)",
                cursor: "pointer",
              }}
            >
              Skip →
            </button>
          )}
        </div>
      )}

      {!isHost && (
        <div className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          Host controls the timer
        </div>
      )}

      {phase === "PREREAD" && isHost && (
        <div className="text-[10px] mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
          Read the brief, then start when ready
        </div>
      )}
    </div>
  );
}
