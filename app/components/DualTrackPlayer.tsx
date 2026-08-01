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
}: {
  doctorUrl: string | null;
  patientUrl: string | null;
}) {
  const doctorRef = useRef<HTMLAudioElement | null>(null);
  const patientRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const wiredRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [ready, setReady] = useState(false);

  function wireAudio() {
    if (wiredRef.current) return;
    wiredRef.current = true;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    if (doctorRef.current) {
      ctx.createMediaElementSource(doctorRef.current).connect(ctx.destination);
    }
    if (patientRef.current) {
      ctx.createMediaElementSource(patientRef.current).connect(ctx.destination);
    }
  }

  async function togglePlay() {
    const doctor = doctorRef.current;
    if (!doctor) return;

    wireAudio();
    if (ctxRef.current?.state === "suspended") await ctxRef.current.resume();

    if (playing) {
      doctor.pause();
      patientRef.current?.pause();
      setPlaying(false);
    } else {
      if (patientRef.current) patientRef.current.currentTime = doctor.currentTime;
      await Promise.all([
        doctor.play(),
        patientRef.current ? patientRef.current.play() : Promise.resolve(),
      ]);
      setPlaying(true);
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const t = parseFloat(e.target.value);
    if (doctorRef.current) doctorRef.current.currentTime = t;
    if (patientRef.current) patientRef.current.currentTime = t;
    setCurrentTime(t);
  }

  function changeSpeed(r: number) {
    setSpeed(r);
    if (doctorRef.current) doctorRef.current.playbackRate = r;
    if (patientRef.current) patientRef.current.playbackRate = r;
  }

  useEffect(() => {
    const el = doctorRef.current;
    if (!el) return;

    function onTime() { setCurrentTime(el!.currentTime); }
    function onDuration() { if (el!.duration && isFinite(el!.duration)) setDuration(el!.duration); }
    function onEnded() { setPlaying(false); setCurrentTime(0); if (patientRef.current) patientRef.current.currentTime = 0; }
    function onCanPlay() { setReady(true); if (el!.duration && isFinite(el!.duration)) setDuration(el!.duration); }

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("durationchange", onDuration);
    el.addEventListener("ended", onEnded);
    el.addEventListener("canplay", onCanPlay);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("durationchange", onDuration);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  if (!doctorUrl && !patientUrl) return null;

  return (
    <div>
      {doctorUrl && <audio ref={doctorRef} src={doctorUrl} preload="metadata" />}
      {patientUrl && <audio ref={patientRef} src={patientUrl} preload="metadata" />}

      <div
        className="rounded-xl p-4"
        style={{ background: "rgba(51,51,51,0.04)", border: "1px solid rgba(51,51,51,0.08)" }}
      >
        <div className="flex items-center justify-between mb-3">
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
