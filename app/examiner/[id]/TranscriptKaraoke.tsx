"use client";

import { useEffect, useMemo, useRef } from "react";
import { activeWordIndex, wordCues, type TimedTurn } from "@/lib/transcript";

const NAVY = "#333333";
const HIGHLIGHT = "rgba(246,212,75,0.55)";

/**
 * The transcript, following the audio.
 *
 * Two things make this not a normal React component, and both are about the
 * same number: a consultation is fifteen hundred to two thousand words, and
 * the median word lasts 240ms.
 *
 *   - NOTHING HERE RE-RENDERS. The word list is built once and the highlight
 *     moves by setting `style.background` on two spans — the one being left
 *     and the one being reached. Driving it through state would re-render two
 *     thousand nodes several times a second to change the colour of one.
 *
 *   - THE CLOCK IS NOT A PROP. It arrives through `subscribe`, so a time
 *     update does not pass through the parent's render at all. The player
 *     emits from a requestAnimationFrame loop rather than from `timeupdate`,
 *     which fires about every 250ms — slower than the median word, so words
 *     would be stepped over.
 *
 * Auto-scroll only happens while the audio is playing. An examiner who has
 * scrolled back to re-read something has paused to do it, and a box that
 * yanked itself back every few hundred milliseconds would be unusable.
 */
export default function TranscriptKaraoke({
  turns,
  subscribe,
  onSeek,
  isPlaying,
}: {
  turns: TimedTurn[];
  /** Registers a listener for the audio position. Returns an unsubscribe. */
  subscribe: (fn: (t: number) => void) => () => void;
  /** Jump the audio to a word's start. */
  onSeek?: (t: number) => void;
  isPlaying: boolean;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef(-1);
  /*
    Read inside the subscription without re-subscribing when it changes. The
    listener is registered once; if `isPlaying` were a dependency, every
    play and pause would tear the subscription down and rebuild it.
  */
  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;

  const cues = useMemo(() => wordCues(turns), [turns]);

  useEffect(() => {
    const unsubscribe = subscribe((t) => {
      const next = activeWordIndex(cues, t);
      if (next === activeRef.current) return;

      const spans = spansRef.current;
      const previous = spans[activeRef.current];
      if (previous) {
        previous.style.background = "transparent";
        previous.style.color = "rgba(51,51,51,0.75)";
      }
      activeRef.current = next;

      const span = spans[next];
      if (!span) return;
      span.style.background = HIGHLIGHT;
      span.style.color = NAVY;

      if (!playingRef.current) return;
      const box = boxRef.current;
      if (!box) return;
      /*
        scrollTop rather than scrollIntoView. scrollIntoView walks every
        scrollable ancestor, so it would also scroll the window — and the page
        it would scroll has a sticky score bar and a sticky rail on it, both
        of which would slide. This moves one box and nothing else.
      */
      const target = span.offsetTop - box.clientHeight / 2 + span.offsetHeight / 2;
      box.scrollTop = Math.max(0, target);
    });
    return unsubscribe;
  }, [subscribe, cues]);

  // One flat counter across every turn, so a span's position in spansRef is
  // the same number wordCues recorded for it.
  let w = -1;

  return (
    <div
      ref={boxRef}
      style={{
        position: "relative",
        maxHeight: 420,
        overflowY: "auto",
        // Half a box of air under the last line, so the final words can still
        // reach the middle when the highlight centres them.
        paddingBottom: 180,
      }}
      className="flex flex-col gap-2.5"
    >
      {turns.map((turn, ti) => (
        <div key={ti} className="leading-relaxed">
          <span
            className="text-[11px] mr-1.5 font-mono"
            style={{ color: "rgba(51,51,51,0.3)" }}
          >
            [{Math.floor(turn.start / 60)}:{String(Math.floor(turn.start % 60)).padStart(2, "0")}]
          </span>
          <span
            className="text-[12.5px] font-bold mr-1"
            style={{ color: turn.speaker === "Doctor" ? NAVY : "rgba(51,51,51,0.55)" }}
          >
            {turn.speaker}:
          </span>
          {turn.words.map((word) => {
            w += 1;
            const index = w;
            return (
              <span
                key={index}
                ref={(el) => {
                  spansRef.current[index] = el;
                }}
                onClick={onSeek ? () => onSeek(word.start) : undefined}
                title={onSeek ? "Play from here" : undefined}
                className="text-[12.5px]"
                style={{
                  color: "rgba(51,51,51,0.75)",
                  background: "transparent",
                  borderRadius: 3,
                  padding: "0 1px",
                  cursor: onSeek ? "pointer" : "default",
                  transition: "background 80ms linear",
                }}
              >
                {word.text}{" "}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
