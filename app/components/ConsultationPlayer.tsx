"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const NAVY = "#333333";

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface Line {
  raw: string;
  time: number | null;
  speaker: string | null;
  text: string | null;
}

function parseTranscript(t: string): Line[] {
  return t
    .split("\n")
    .filter(Boolean)
    .map((raw) => {
      const m = raw.match(/^\[(\d+):(\d+)\]\s*(Doctor|Patient):\s*(.*)$/);
      if (!m) return { raw, time: null, speaker: null, text: null };
      return { raw, time: parseInt(m[1], 10) * 60 + parseInt(m[2], 10), speaker: m[3], text: m[4] };
    });
}

export default function ConsultationPlayer({
  doctorUrl,
  patientUrl,
  transcript,
}: {
  doctorUrl: string | null;
  patientUrl: string | null;
  transcript: string | null;
}) {
  const doctorRef = useRef<HTMLAudioElement | null>(null);
  const patientRef = useRef<HTMLAudioElement | null>(null);
  const durationFixRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [ready, setReady] = useState(false);

  const hasAudio = !!doctorUrl || !!patientUrl;
  const lines = transcript ? parseTranscript(transcript) : [];

  const seekTo = useCallback((sec: number, autoplay: boolean) => {
    const d = doctorRef.current;
    if (d) d.currentTime = sec;
    if (patientRef.current) patientRef.current.currentTime = sec;
    setCurrentTime(sec);
    if (autoplay && d) {
      Promise.all([
        d.play(),
        patientRef.current ? patientRef.current.play() : Promise.resolve(),
      ])
        .then(() => setPlaying(true))
        .catch((err) => {
          console.error("[ConsultationPlayer] play() failed", err);
          setPlaying(false);
        });
    }
  }, []);

  async function togglePlay() {
    const d = doctorRef.current;
    if (!d) return;
    if (playing) {
      d.pause();
      patientRef.current?.pause();
      setPlaying(false);
    } else {
      seekTo(d.currentTime, true);
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    seekTo(parseFloat(e.target.value), false);
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
    function onEnded() { setPlaying(false); setCurrentTime(0); if (patientRef.current) patientRef.current.currentTime = 0; }

    function applyDuration() {
      if (el!.duration && isFinite(el!.duration)) setDuration(el!.duration);
    }
    function onReadyEvt() {
      setReady(true);
      applyDuration();
      // MediaRecorder WebM files report duration = Infinity until forced to
      // load it. Nudge currentTime to the end once so the browser computes the
      // real duration (making the seek bar usable), then reset to the start.
      if (!durationFixRef.current && (!el!.duration || !isFinite(el!.duration))) {
        durationFixRef.current = true;
        try {
          el!.currentTime = 1e7;
        } catch {
          /* ignore */
        }
      }
    }
    function onDurationChange() {
      if (el!.duration && isFinite(el!.duration)) {
        setDuration(el!.duration);
        if (durationFixRef.current) {
          durationFixRef.current = false;
          el!.currentTime = 0;
          if (patientRef.current) patientRef.current.currentTime = 0;
          setCurrentTime(0);
        }
      }
    }
    function logErr(which: string) {
      return (ev: Event) => {
        const media = ev.target as HTMLAudioElement;
        console.error(`[ConsultationPlayer] ${which} audio error`, {
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
    el.addEventListener("ended", onEnded);
    el.addEventListener("durationchange", onDurationChange);
    el.addEventListener("canplay", onReadyEvt);
    el.addEventListener("loadeddata", onReadyEvt);
    el.addEventListener("loadedmetadata", onReadyEvt);
    el.addEventListener("error", onDoctorErr);
    patientRef.current?.addEventListener("error", onPatientErr);
    if (el.readyState >= 1) onReadyEvt();

    const patientEl = patientRef.current;
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("durationchange", onDurationChange);
      el.removeEventListener("canplay", onReadyEvt);
      el.removeEventListener("loadeddata", onReadyEvt);
      el.removeEventListener("loadedmetadata", onReadyEvt);
      el.removeEventListener("error", onDoctorErr);
      patientEl?.removeEventListener("error", onPatientErr);
    };
  }, []);

  // Which transcript line is currently playing (last line whose timestamp has passed).
  let activeIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time !== null && (lines[i].time as number) <= currentTime + 0.25) activeIndex = i;
  }

  return (
    <div>
      {hasAudio && (
        <>
          {doctorUrl && <audio ref={doctorRef} src={doctorUrl} preload="metadata" />}
          {patientUrl && <audio ref={patientRef} src={patientUrl} preload="metadata" />}

          <div className="rounded-xl p-4" style={{ background: "rgba(51,51,51,0.04)", border: "1px solid rgba(51,51,51,0.08)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 text-[11px]" style={{ color: "rgba(51,51,51,0.4)" }}>
                {doctorUrl && <span>Doctor</span>}
                {patientUrl && <span>Patient</span>}
                {doctorUrl && !patientUrl && <span className="italic" style={{ color: "rgba(51,51,51,0.25)" }}>patient track unavailable</span>}
              </div>
              <div className="flex gap-1">
                {[1, 1.5, 2].map((r) => (
                  <button key={r} type="button" onClick={() => changeSpeed(r)} className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ background: speed === r ? NAVY : "rgba(51,51,51,0.07)", color: speed === r ? "white" : "rgba(51,51,51,0.5)", border: "none", cursor: "pointer" }}>
                    {r}×
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={togglePlay} disabled={!ready}
                style={{ width: 36, height: 36, borderRadius: "50%", background: NAVY, border: "none", cursor: ready ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: ready ? 1 : 0.4 }}>
                {playing ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><rect x="1" y="1" width="3.5" height="10" rx="1" /><rect x="7.5" y="1" width="3.5" height="10" rx="1" /></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><path d="M2.5 1.5L10.5 6L2.5 10.5V1.5Z" /></svg>
                )}
              </button>
              <span className="text-[11px] font-mono tabular-nums" style={{ color: "rgba(51,51,51,0.5)", minWidth: 34, textAlign: "right" }}>{fmtTime(currentTime)}</span>
              <input type="range" min={0} max={duration || 0} step={0.5} value={currentTime} onChange={handleSeek} className="flex-1" style={{ accentColor: NAVY, cursor: "pointer" }} />
              <span className="text-[11px] font-mono tabular-nums" style={{ color: "rgba(51,51,51,0.3)", minWidth: 34 }}>{duration ? fmtTime(duration) : "--:--"}</span>
            </div>
          </div>
        </>
      )}

      {lines.length > 0 && (
        <div className="flex flex-col gap-1 mt-4">
          {hasAudio && (
            <div className="text-[10px] mb-1" style={{ color: "rgba(51,51,51,0.35)" }}>Tap any line to jump the audio there.</div>
          )}
          {lines.map((line, i) => {
            if (line.time === null) {
              return <p key={i} className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.6)" }}>{line.raw}</p>;
            }
            const active = i === activeIndex;
            const clickable = hasAudio;
            return (
              <div
                key={i}
                onClick={clickable ? () => seekTo(line.time as number, true) : undefined}
                className="rounded-md px-2 py-1 -mx-2 transition"
                style={{
                  cursor: clickable ? "pointer" : "default",
                  background: active ? "rgba(246,212,75,0.22)" : "transparent",
                }}
              >
                <span className="text-[11px] mr-1.5 font-mono" style={{ color: clickable ? "#1D4ED8" : "rgba(51,51,51,0.3)" }}>[{fmtTime(line.time)}]</span>
                <span className="text-[12.5px] font-bold mr-1" style={{ color: NAVY }}>{line.speaker}:</span>
                <span className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.75)" }}>{line.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
