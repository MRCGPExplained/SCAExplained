"use client";

import { Timer } from "../Timer";
import { useStudyRoomTimer } from "./context";

/**
 * Subscribes to the timer context on the station page's behalf.
 *
 * The timer ticks once a second, so it is deliberately isolated here: if the
 * page consumed that context directly, every tick would re-render the whole
 * case, highlightable text and all.
 */
export function StudyRoomTimer() {
  const t = useStudyRoomTimer();

  return (
    <Timer
      phase={t.phase}
      timeLeft={t.timeLeft}
      running={t.running}
      isHost={t.isTimerHost}
      locked={t.locked}
      onStart={t.start}
      onPause={t.pause}
      onSkipPreread={t.skipPreread}
      onReset={t.reset}
      onTick={t.tick}
      onPhaseComplete={t.phaseComplete}
    />
  );
}
