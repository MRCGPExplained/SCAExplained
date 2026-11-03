"use client";

import { useRef, useState, useEffect } from "react";

const NAVY = "#333333";

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function DualTrackPlayer({
  doctorUrl,
  patientUrl,
  onTime,
  onPlayingChange,
  compact = false,
  seekRef,
  toggleRef,
}: {
  doctorUrl: string | null;
  patientUrl: string | null;
  /**
   * The audio position, for anything that has to follow along.
   *
   * Emitted from a requestAnimationFrame loop while playing, NOT from the
   * `timeupdate` listener below. timeupdate fires roughly every 250ms and the
   * median word in a consultation lasts 240ms, so a follower driven off it
   * steps over words. Also emitted once on seek and on ended, which rAF
   * cannot cover because it only runs while playing.
   */
  onTime?: (t: number) => void;
  onPlayingChange?: (playing: boolean) => void;
  /** One row, no card: for a sticky bar where height is the scarce thing. */
  compact?: boolean;
  /** Filled with a seek function, so a parent can drive the position. */
  seekRef?: { current: ((t: number) => void) | null };
  /** Filled with the play/pause toggle, so a parent can drive it from a key
   *  without the examiner reaching for the transport. */
  toggleRef?: { current: (() => void) | null };
}) {
  const doctorRef = useRef<HTMLAudioElement | null>(null);
  const patientRef = useRef<HTMLAudioElement | null>(null);

  /*
    Props held in refs, not read directly in the effects below.

    The listener effect is deliberately mount-only, and the rAF effect should
    restart on play/pause and on nothing else. Naming these as dependencies
    would tear both down and rebuild them every time the parent re-renders
    with a fresh callback identity.
  */
  const onTimeRef = useRef(onTime);
  onTimeRef.current = onTime;
  const onPlayingChangeRef = useRef(onPlayingChange);
  onPlayingChangeRef.current = onPlayingChange;

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [ready, setReady] = useState(false);

  async function togglePlay() {
    const doctor = doctorRef.current;
    if (!doctor) return;

    /*
      Which way to toggle is asked of the ELEMENT, not of `playing`.

      `playing` is a render value and it lags: the play branch awaits
      play() before setting it, so two presses inside that await both see
      "not playing" and both call play(). Measured with four quick
      spacebars, which produced pause, play, play, play. It also drifts when
      the audio ends — the element is paused while the state still says
      playing, so the next press called pause() on something already
      stopped and did nothing visible.

      The element knows. `playing` stays, because the button label and the
      rAF loop need a render value, but it is a reflection of this, never
      the thing being tested.
    */
    if (!doctor.paused) {
      doctor.pause();
      patientRef.current?.pause();
      setPlaying(false);
      onPlayingChangeRef.current?.(false);
    } else {
      if (patientRef.current) patientRef.current.currentTime = doctor.currentTime;
      try {
        await Promise.all([
          doctor.play(),
          patientRef.current ? patientRef.current.play() : Promise.resolve(),
        ]);
        setPlaying(true);
        onPlayingChangeRef.current?.(true);
      } catch (err) {
        console.error("[DualTrackPlayer] play() failed", err);
        setPlaying(false);
      }
    }
  }

  function seekTo(t: number) {
    if (doctorRef.current) doctorRef.current.currentTime = t;
    if (patientRef.current) patientRef.current.currentTime = t;
    setCurrentTime(t);
    // rAF only runs while playing, so a seek while paused would otherwise
    // leave every follower sitting at the old position.
    onTimeRef.current?.(t);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    seekTo(parseFloat(e.target.value));
  }

  if (seekRef) seekRef.current = seekTo;
  if (toggleRef) toggleRef.current = togglePlay;

  /*
    The position, at frame rate, while playing and never otherwise. A loop
    left running on a paused player is a wakeup every 16ms for a number that
    is not changing.
  */
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const el = doctorRef.current;
      if (el) onTimeRef.current?.(el.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  function changeSpeed(r: number) {
    setSpeed(r);
    if (doctorRef.current) doctorRef.current.playbackRate = r;
    if (patientRef.current) patientRef.current.playbackRate = r;
  }

  useEffect(() => {
    const el = doctorRef.current;
    if (!el) return;

    function onTime() {
      setCurrentTime(el!.currentTime);
      /*
        The floor under the rAF loop below.

        requestAnimationFrame does not run in a background tab, so a browser
        left playing in another window would freeze every follower at the
        moment it was hidden and then jump when it came back. timeupdate keeps
        firing there. It is coarse — about every 250ms against a median word
        of 240ms — so it is not good enough to BE the clock, only to stop it
        stopping. Emitting from both is harmless: a follower acts on the word
        changing, not on being told the time.
      */
      onTimeRef.current?.(el!.currentTime);
    }
    function onDuration() { if (el!.duration && isFinite(el!.duration)) setDuration(el!.duration); }
    function onEnded() {
      setPlaying(false);
      setCurrentTime(0);
      if (patientRef.current) patientRef.current.currentTime = 0;
      onPlayingChangeRef.current?.(false);
      onTimeRef.current?.(0);
    }
    // Enable playback as soon as ANY load signal fires — MediaRecorder webm
    // files often don't report a finite duration up front, so relying on
    // "canplay" alone can leave the button stuck disabled.
    function onReadyEvt() { setReady(true); if (el!.duration && isFinite(el!.duration)) setDuration(el!.duration); }

    // Surface media load/decode failures instead of failing silently.
    function logErr(which: string) {
      return (ev: Event) => {
        const media = ev.target as HTMLAudioElement;
        console.error(`[DualTrackPlayer] ${which} audio error`, {
          src: media.currentSrc,
          code: media.error?.code,
          message: media.error?.message,
          networkState: media.networkState,
          readyState: media.readyState,
        });
      };
    }
    const onDoctorErr = logErr("doctor");
    const onPatientErr = logErr("patient");

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("durationchange", onDuration);
    el.addEventListener("ended", onEnded);
    el.addEventListener("canplay", onReadyEvt);
    el.addEventListener("loadeddata", onReadyEvt);
    el.addEventListener("loadedmetadata", onReadyEvt);
    el.addEventListener("error", onDoctorErr);
    patientRef.current?.addEventListener("error", onPatientErr);

    // If metadata is already loaded by the time this effect runs, unlock now.
    if (el.readyState >= 1) setReady(true);

    const patientEl = patientRef.current;
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("durationchange", onDuration);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("canplay", onReadyEvt);
      el.removeEventListener("loadeddata", onReadyEvt);
      el.removeEventListener("loadedmetadata", onReadyEvt);
      el.removeEventListener("error", onDoctorErr);
      patientEl?.removeEventListener("error", onPatientErr);
    };
  }, []);

  if (!doctorUrl && !patientUrl) return null;

  return (
    <div>
      {doctorUrl && <audio ref={doctorRef} src={doctorUrl} preload="metadata" />}
      {patientUrl && <audio ref={patientRef} src={patientUrl} preload="metadata" />}

      <div
        className={compact ? "" : "rounded-xl p-4"}
        style={
          compact
            ? undefined
            : { background: "rgba(51,51,51,0.04)", border: "1px solid rgba(51,51,51,0.08)" }
        }
      >
        {/*
          The track labels and their own row are the first thing to go in a
          sticky bar: they say the same thing on every consultation, and the
          row they sit on costs more height than they are worth. The speed
          buttons move onto the transport row instead of being dropped.
        */}
        <div className={compact ? "hidden" : "flex items-center justify-between mb-3"}>
          <div className="flex items-center gap-4 text-[11px]" style={{ color: "rgba(51,51,51,0.4)" }}>
            {doctorUrl && <span>Doctor</span>}
            {patientUrl && <span>Patient</span>}
            {doctorUrl && !patientUrl && (
              <span className="italic" style={{ color: "rgba(51,51,51,0.25)" }}>patient track unavailable</span>
            )}
          </div>

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

          {compact && (
            <div className="flex gap-1 flex-shrink-0">
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
          )}
        </div>

      </div>
    </div>
  );
}
