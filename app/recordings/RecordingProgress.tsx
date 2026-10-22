"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The four stages a take passes through, and nothing else on screen.
 *
 * /recordings is a server component: the chips were a snapshot taken when the
 * page loaded and never moved again, so a recording part way through the
 * pipeline looked exactly like one that had stalled. That ambiguity cost two
 * false alarms in a day, one of which was a real bug and one of which was
 * work in progress.
 *
 * This polls only while a take is actually moving, and calls router.refresh()
 * when the status changes so the server re-renders the row it already owns.
 * The bar is the only thing it draws: stage, not percentage, because
 * transcription is quick and grading is slow, and a smoothly filling bar
 * would be inventing a rate it cannot know.
 */

/** Terminal: nothing further happens without the candidate doing something. */
const SETTLED = new Set([
  "transcribed",
  "ai_graded",
  "pending_examiner",
  "reviewing",
  "reviewed",
  "sent",
  "discarded",
  "failed",
]);

const SEGMENTS = 4;
const POLL_MS = 4000;
/** Nothing legitimately takes this long, and a tab left open overnight should
 *  not keep asking. */
const GIVE_UP_MS = 15 * 60 * 1000;

interface Status {
  status: string;
  has_transcript?: boolean;
  audio_complete?: boolean;
}

/** Which of the four is in progress, on the same ladder the study room uses. */
function stageIndex(s: Status): number {
  if (s.status === "uploading") return 0;
  // Explicitly false, not merely absent. Before the first poll lands there is
  // no audio_complete at all, and treating undefined as "not complete" put
  // every row back at stage one for the first four seconds, including ones
  // already grading.
  if (s.audio_complete === false) return 0;
  if (s.status === "processing") return s.has_transcript ? 2 : 1;
  if (s.status === "grading") return 2;
  return 3;
}

export function RecordingProgress({
  recordingId,
  initialStatus,
}: {
  recordingId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<Status>({ status: initialStatus });
  const startedAt = useRef(Date.now());
  const lastStatus = useRef(initialStatus);

  useEffect(() => {
    if (SETTLED.has(initialStatus)) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/recordings/${recordingId}/status`, { cache: "no-store" });
        if (res.ok) {
          const next = (await res.json()) as Status;
          if (cancelled) return;
          setState(next);
          // Only when it actually moved. Refreshing on every tick would
          // re-render the whole list every four seconds for no reason.
          if (next.status !== lastStatus.current) {
            lastStatus.current = next.status;
            router.refresh();
            if (SETTLED.has(next.status)) return;
          }
        }
      } catch {
        // A failed poll is not worth reporting: the next one is four seconds
        // away, and the bar showing its last known stage is still true.
      }
      if (!cancelled && Date.now() - startedAt.current < GIVE_UP_MS) {
        timer = setTimeout(tick, POLL_MS);
      }
    };

    timer = setTimeout(tick, POLL_MS);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [recordingId, initialStatus, router]);

  if (SETTLED.has(state.status)) return null;

  const active = stageIndex(state);

  return (
    <div className="flex items-center gap-1 w-[104px]" aria-hidden="true">
      <style>{`
        @keyframes rec-stage-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.45; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rec-stage-active { animation: none !important; }
        }
      `}</style>
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <span
          key={i}
          className={i === active ? "rec-stage-active" : undefined}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 999,
            background: i <= active ? "#6D28D9" : "rgba(51,51,51,0.12)",
            animation: i === active ? "rec-stage-pulse 1.4s ease-in-out infinite" : undefined,
          }}
        />
      ))}
    </div>
  );
}
