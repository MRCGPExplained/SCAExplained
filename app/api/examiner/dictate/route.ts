import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getExaminer } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCurrentPricing, deepgramBillableMinutes, deepgramCostUsd, usdToGbp } from "@/lib/pricing";

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

const DICTATE_MODEL = "nova-3";

/**
 * Put the spend on the same ledger the consultation transcripts use.
 *
 * Billed the same way and by the same vendor, so it belongs in the same
 * table rather than a parallel one — and role tells them apart, which is
 * what the economics page splits on.
 *
 * Duration comes from Deepgram rather than from how long the key was held.
 * The hold is what the examiner did; the duration is what was charged for,
 * and only one of those appears on an invoice.
 *
 * Never throws. This is a reporting row: an incomplete cost report is a far
 * smaller problem than losing the examiner's words over an insert.
 */
async function recordDictationCost(
  recordingId: string | null,
  durationSec: number,
  requestId: string | null
): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) return;
    const pricing = await getCurrentPricing(admin);
    if (!pricing) return;

    const billable = deepgramBillableMinutes(durationSec);
    const costUsd = deepgramCostUsd(billable, pricing);

    const { error } = await admin.from("deepgram_usage").insert({
      recording_id: recordingId,
      role: "dictation",
      audio_duration_s: durationSec,
      billable_min: billable,
      model: DICTATE_MODEL,
      request_id: requestId,
      cost_usd: costUsd,
      cost_gbp: usdToGbp(costUsd, pricing),
      pricing_version_id: pricing.id,
    });

    /*
      Until the check constraint on role allows "dictation" this insert is
      refused, and the dictation itself is unaffected — the examiner has
      their words either way, and the row starts landing the moment the
      constraint is widened. Logged rather than swallowed so the gap is
      visible in the meantime.
    */
    if (error) console.error("[dictate] usage insert refused:", error.message);
  } catch (e) {
    console.error("[dictate] usage insert threw", e);
  }
}

export async function POST(request: NextRequest) {
  const examiner = await getExaminer();
  if (!examiner) return NextResponse.json({ error: "Not authorised." }, { status: 401 });

  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) {
    console.error("[dictate] DEEPGRAM_API_KEY missing");
    return NextResponse.json({ error: "Dictation is not configured." }, { status: 503 });
  }

  // Which review this was dictated into, for attributing the cost. A
  // header rather than a query string: the body is the audio.
  const recordingId = request.headers.get("x-recording-id");

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

    await recordDictationCost(
      recordingId,
      Number(data?.metadata?.duration ?? 0),
      data?.metadata?.request_id ?? null
    );

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[dictate] request threw", err);
    return NextResponse.json({ error: "Could not transcribe that." }, { status: 502 });
  }
}
