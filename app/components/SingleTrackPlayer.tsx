"use client";

import { useRef, useState, useEffect } from "react";

/**
 * One recording, played the way DualTrackPlayer plays two.
 *
 * It exists because the trainer's note used to be a bare <audio controls>
 * sitting directly above a model consultation in a custom player, inside one
 * tab — a browser default and a designed control stacked on each other. The
 * audio is the same kind of thing in both cases and should look it.
 *
 * Deliberately a sibling of DualTrackPlayer rather than a generalisation of
 * it. Folding both into one component would mean touching a player that works
 * and is already in front of customers, to save a file.
 *
 * The `ready` flag unlocks on any load signal rather than on `canplay` alone:
 * these files come from MediaRecorder and often report no finite duration up
 * front, which can otherwise leave the button disabled over a track that
 * would have played perfectly well.
 */

const NAVY = "#333333";

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function SingleTrackPlayer({
  url,
  label,
}: {
  url: string | null;
  /** Shown top-left, where the dual player names its tracks. Omit when there
   *  is only one thing it could be. */
  label?: string;
}) {
  const ref = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [ready, setReady] = useState(false);

  async function togglePlay() {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    try {
      await el.play();
      setPlaying(true);
    } catch (err) {
      console.error("[SingleTrackPlayer] play() failed", err);
      setPlaying(false);
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const t = parseFloat(e.target.value);
    if (ref.current) ref.current.currentTime = t;
    setCurrentTime(t);
  }

  function changeSpeed(r: number) {
    setSpeed(r);
    if (ref.current) ref.current.playbackRate = r;
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onTime() { setCurrentTime(el!.currentTime); }
    function onDuration() { if (el!.duration && isFinite(el!.duration)) setDuration(el!.duration); }
    function onEnded() { setPlaying(false); setCurrentTime(0); }
    function onReadyEvt() {
      setReady(true);
      if (el!.duration && isFinite(el!.duration)) setDuration(el!.duration);
    }
    function onErr(ev: Event) {
      const media = ev.target as HTMLAudioElement;
      console.error("[SingleTrackPlayer] audio error", {
        src: media.currentSrc,
        code: media.error?.code,
        message: media.error?.message,
        networkState: media.networkState,
        readyState: media.readyState,
      });
    }

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("durationchange", onDuration);
    el.addEventListener("ended", onEnded);
    el.addEventListener("canplay", onReadyEvt);
    el.addEventListener("loadeddata", onReadyEvt);
    el.addEventListener("loadedmetadata", onReadyEvt);
    el.addEventListener("error", onErr);

    if (el.readyState >= 1) setReady(true);

    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("durationchange", onDuration);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("canplay", onReadyEvt);
      el.removeEventListener("loadeddata", onReadyEvt);
      el.removeEventListener("loadedmetadata", onReadyEvt);
      el.removeEventListener("error", onErr);
    };
  }, []);

  if (!url) return null;

  return (
    <div>
      <audio ref={ref} src={url} preload="metadata" />

      <div
        className="rounded-xl p-4"
        style={{ background: "rgba(51,51,51,0.04)", border: "1px solid rgba(51,51,51,0.08)" }}
      >
        <div className={`flex items-center mb-3 ${label ? "justify-between" : "justify-end"}`}>
          {label && (
            <div className="text-[11px]" style={{ color: "rgba(51,51,51,0.4)" }}>{label}</div>
          )}

          <div className="flex gap-1">
            {[1, 1.5, 2].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => changeSpeed(r)}
                className="text-[10px] font-bold px-2 py-0.5 rounded"
                style={{
                  background: speed === r ? NAVY : "rgba(51,51,51,0.07)",
                  color: speed === r ? "white" : "rgba(51,51,51,0.5)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {r}×
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!ready}
            aria-label={playing ? "Pause" : "Play"}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: NAVY,
              border: "none",
              cursor: ready ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              opacity: ready ? 1 : 0.4,
            }}
          >
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                <rect x="1" y="1" width="3.5" height="10" rx="1" />
                <rect x="7.5" y="1" width="3.5" height="10" rx="1" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                <path d="M2.5 1.5L10.5 6L2.5 10.5V1.5Z" />
              </svg>
            )}
          </button>

          <span
            className="text-[11px] font-mono tabular-nums"
            style={{ color: "rgba(51,51,51,0.5)", minWidth: 34, textAlign: "right" }}
          >
            {fmtTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.5}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1"
            style={{ accentColor: NAVY, cursor: "pointer" }}
          />

          <span
            className="text-[11px] font-mono tabular-nums"
            style={{ color: "rgba(51,51,51,0.3)", minWidth: 34 }}
          >
            {duration ? fmtTime(duration) : "--:--"}
          </span>
        </div>
      </div>
    </div>
  );
}
