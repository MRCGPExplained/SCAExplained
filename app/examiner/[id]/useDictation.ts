"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Hold "/" in any note field to dictate into it.
 *
 * WHY "/" IS SAFE, AND WHY IT IS STILL GUARDED. Across all 27 examiner
 * comments written so far there is not one "/" — no "120/80", no "and/or",
 * no dates. Brandon's own test is sharper than the count: a slash never
 * starts a sentence, even in a blood pressure. So the key is free.
 *
 * It is guarded anyway, because "absent from 27 comments" is evidence and
 * not a promise. A tap types a slash exactly as it always did; only a
 * deliberate hold records. The cost of that is one timer.
 *
 * ONE HANDLER, NOT ONE PER BOX. These listeners go on the notepad's
 * container and read the event's target, so the six note boxes and every
 * per-preset detail input get dictation without being wired for it — which
 * matters because those inputs do not exist until a preset is ticked.
 */

type Field = HTMLInputElement | HTMLTextAreaElement;

/** How long "/" must be held before it stops being a slash and starts a recording. */
const HOLD_MS = 250;
/** Below this, treat it as a fumbled key rather than speech. */
const MIN_SPEECH_MS = 500;

const MIC_REFUSED = "No microphone, or permission was refused.";

export type DictationState = "idle" | "listening" | "transcribing";

/**
 * Is the caret at the start of what this line says?
 *
 * The rule that decides whether a slash is speech or a character, and it is
 * the examiner's own: a slash never starts a sentence, not even one about a
 * blood pressure. So a slash with nothing in front of it on the line can
 * only be a request to talk, and a slash with words in front of it can only
 * be punctuation.
 *
 * Start of the LINE rather than of the box, because the notepad is bullets.
 * Empty-box would let an examiner dictate the first observation into a box
 * and never the second.
 *
 * The bullet marker counts as nothing: Enter leaves the caret after "• ",
 * and that is exactly where the next dictation starts from. A selection is
 * never a start — replacing chosen text with a recording is not something
 * anyone asks for by holding a key.
 */
function atLineStart(el: Field): boolean {
  const pos = el.selectionStart ?? 0;
  if (pos !== (el.selectionEnd ?? 0)) return false;
  const before = el.value.slice(0, pos);
  const line = before.slice(before.lastIndexOf("\n") + 1);
  return /^\s*[•\-*]?\s*$/.test(line);
}

function isField(node: EventTarget | null): node is Field {
  const el = node as HTMLElement | null;
  if (!el) return false;
  if (!el.matches?.("[data-dictate]")) return false;
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
}

/**
 * Writes at the caret the way a keystroke would.
 *
 * Not by setting .value: these are controlled fields, and assigning to them
 * puts the caret at 0 and loses native undo. That is the bug that once made
 * the notepad's bullets come out in reverse order, fixed the same way.
 */
function insertAtCaret(el: Field, text: string) {
  el.focus();
  document.execCommand("insertText", false, text);
}

export function useDictation(recordingId: string, onError?: (message: string | null) => void) {
  const [state, setState] = useState<DictationState>("idle");

  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const target = useRef<Field | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startedAt = useRef(0);
  /** Set the moment the key goes down and cleared on release, so a stream
   *  that finishes opening after the key is already up is thrown away. */
  const held = useRef(false);
  /** The microphone refused. Key-up still has to decide about the slash. */
  const micFailed = useRef(false);
  /** The hold passed HOLD_MS, so the press was meant as speech. */
  const qualified = useRef(false);

  const release = useCallback(() => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    recorder.current = null;
    chunks.current = [];
  }, []);

  const onKeyDownCapture = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      if (!isField(e.target)) return;

      // Holding a key repeats it. The first press arms; the repeats are
      // swallowed so no slashes leak out while the examiner is talking.
      if (e.repeat) {
        if (held.current) e.preventDefault();
        return;
      }

      /*
        Mid-line, a slash is a slash and this gets out of the way entirely.

        Not merely "do not record" — do not intercept at all. Suppressing the
        key and replaying it on release put every slash in the document a
        keystroke late, so typing "/" then "a" quickly produced "a/". Same
        family as the bug that once reversed the bullets, and avoided the
        same way: let the browser handle the character.
      */
      if (!atLineStart(e.target as Field)) return;

      // Capture phase and stopPropagation together: the note boxes have
      // their own key handling for Enter and Backspace, and this must settle
      // whether the slash is a character before any of that sees it.
      e.preventDefault();
      e.stopPropagation();

      target.current = e.target as Field;
      held.current = true;
      micFailed.current = false;
      qualified.current = false;
      // A new attempt clears the last failure, so a stale message does not
      // sit under the notepad after the thing it described has been retried.
      onError?.(null);

      /*
        The microphone is opened now, not when the hold qualifies.

        getUserMedia takes 100-300ms even with permission already given, and
        people start talking as they press. Opening at the 250ms mark would
        eat the first word of every note. Opening here means the recorder is
        usually live by the time the hold counts, and the stream is thrown
        away unused if it turns out to be a tap.
      */
      navigator.mediaDevices
        ?.getUserMedia({ audio: true })
        .then((s) => {
          if (!held.current) {
            s.getTracks().forEach((t) => t.stop());
            return;
          }
          stream.current = s;
          const mr = new MediaRecorder(s);
          chunks.current = [];
          mr.ondataavailable = (ev) => {
            if (ev.data.size > 0) chunks.current.push(ev.data);
          };
          mr.start();
          recorder.current = mr;
          startedAt.current = Date.now();
        })
        .catch(() => {
          /*
            held is deliberately NOT cleared here.

            Key-up is what decides whether the press was a slash or a
            recording, and clearing held would make it return early — so on
            a machine with no microphone, or after the permission is
            refused, typing a slash would silently do nothing at all. The
            failure is noted and key-up still gets to type the character.
          */
          micFailed.current = true;
          setState("idle");
          // Only worth saying if they were actually trying to talk. A tap is
          // someone typing a slash, and telling them about microphones they
          // did not ask to use is noise on every keystroke.
          if (qualified.current) onError?.(MIC_REFUSED);
        });

      holdTimer.current = setTimeout(() => {
        holdTimer.current = null;
        if (!held.current) return;
        qualified.current = true;
        // The microphone may already have refused while the hold was being
        // measured; this is the first moment at which that is worth saying.
        if (micFailed.current) {
          onError?.(MIC_REFUSED);
          setState("idle");
          return;
        }
        setState("listening");
      }, HOLD_MS);
    },
    [onError]
  );

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "/") return;
      if (!held.current) return;
      held.current = false;

      const field = target.current;
      const wasTap = holdTimer.current !== null;
      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
        holdTimer.current = null;
      }

      // Let go inside the threshold: it was a slash after all. Typed here
      // because keydown suppressed it before anyone could decide.
      if (wasTap) {
        if (field) insertAtCaret(field, "/");
        release();
        setState("idle");
        return;
      }

      const mr = recorder.current;
      const spokenFor = Date.now() - startedAt.current;
      // Held long enough to mean it, but there is no recording: the
      // microphone failed, and the message about that is already up.
      //
      // Always back to idle. The error is a separate piece of state and the
      // hint prefers it, so leaving this at "listening" was invisible right
      // up until the next successful tap cleared the error and uncovered a
      // hint claiming to be recording.
      if (!mr || mr.state !== "recording") {
        release();
        setState("idle");
        return;
      }

      mr.onstop = async () => {
        const blob = new Blob(chunks.current, { type: mr.mimeType || "audio/webm" });
        release();

        // A fumbled key rather than speech. Silently dropped: there is
        // nothing to say about it and a Deepgram call would return "".
        if (spokenFor < MIN_SPEECH_MS || blob.size === 0) {
          setState("idle");
          return;
        }

        setState("transcribing");
        try {
          const res = await fetch("/api/examiner/dictate", {
            method: "POST",
            headers: {
              "Content-Type": blob.type || "audio/webm",
              "x-recording-id": recordingId,
            },
            body: blob,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error ?? "Could not transcribe that.");
          const text: string = (data?.text ?? "").trim();
          if (text && field) {
            /*
              A space before it when the line already has something on it, so
              dictating twice into one bullet does not weld the words
              together. Nothing is added at the start of an empty field, nor
              after the bullet marker, which already ends in one.
            */
            const needsSpace = field.value.length > 0 && !/\s$/.test(field.value.slice(0, field.selectionStart ?? undefined));
            insertAtCaret(field, needsSpace ? ` ${text}` : text);
          }
        } catch (err) {
          onError?.(err instanceof Error ? err.message : "Could not transcribe that.");
        } finally {
          setState("idle");
        }
      };

      mr.stop();
    },
    [onError, release, recordingId]
  );

  /** Abandon a hold if focus leaves mid-press; otherwise the key-up never comes. */
  const onBlurCapture = useCallback(() => {
    if (!held.current) return;
    held.current = false;
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (recorder.current?.state === "recording") recorder.current.stop();
    release();
    setState("idle");
  }, [release]);

  return { state, onKeyDownCapture, onKeyUp, onBlurCapture };
}
