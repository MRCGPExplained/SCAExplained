import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getExaminer } from "@/lib/examiner-auth";

/**
 * A few seconds of held-key speech, turned into text.
 *
 * Separate from the betatest exchange route, which does the same Deepgram
 * call and then feeds the result to Claude to answer as a patient. This one
 * stops at the transcript: the examiner's own words are the whole point, and
 * anything that rewrote them here would defeat the copy-editor downstream
 * that is carefully instructed not to.
 *
 * nova-3 with punctuate, the same model and flag the rest of the product
 * uses, so a dictated note reads like the transcripts beside it.
 */

/** Longer than any push-to-talk, short enough that a stuck key costs little. */
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const examiner = await getExaminer();
  if (!examiner) return NextResponse.json({ error: "Not authorised." }, { status: 401 });

  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) {
    console.error("[dictate] DEEPGRAM_API_KEY missing");
    return NextResponse.json({ error: "Dictation is not configured." }, { status: 503 });
  }

  const audio = await request.arrayBuffer();
  if (audio.byteLength === 0) return NextResponse.json({ text: "" });
  if (audio.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "That recording is too long." }, { status: 413 });
  }

  const contentType = request.headers.get("content-type") || "audio/webm";

  try {
    const res = await fetch("https://api.deepgram.com/v1/listen?model=nova-3&punctuate=true", {
      method: "POST",
      headers: { Authorization: `Token ${key}`, "Content-Type": contentType },
      body: audio,
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[dictate] deepgram", res.status, body.slice(0, 300));
      return NextResponse.json({ error: "Could not transcribe that." }, { status: 502 });
    }

    const data = await res.json();
    const text = (data?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "").trim();
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[dictate] request threw", err);
    return NextResponse.json({ error: "Could not transcribe that." }, { status: 502 });
  }
}
