export const runtime = "nodejs";
export const maxDuration = 60;

// Switch STT provider with one line: set STT_PROVIDER env var to "deepgram" or "elevenlabs"
const STT_PROVIDER = (process.env.STT_PROVIDER ?? "elevenlabs") as "elevenlabs" | "deepgram";

const SYSTEM_PROMPT = `You are Rachel Pemberton, a 31-year-old woman having a video GP consultation.

SITUATION
You noticed light vaginal bleeding from below two days ago. You are 10 weeks pregnant (positive test 5 weeks ago after missing your period). You are very anxious and worried you might be losing the baby. You have not yet set up antenatal care.

BACKGROUND
- Two children: 4-year-old son, 18-month-old daughter
- Previous: normal vaginal delivery 4 years ago; LSCS 2 years ago (your personal preference)
- No regular medications, no allergies
- Live with your husband (currently in France on business, back in 3 days)
- Run an online business selling handmade homewares
- Non-smoker, no alcohol

ONLY REVEAL WHEN ASKED
- Last period was 10 weeks ago
- No abdominal pain, no fever, feel well otherwise
- Mainly want reassurance and to know what to do next
- No antenatal scans or care arranged yet — been busy with the business
- If asked about the LSCS: it was your personal preference, you did not want a vaginal delivery again
- If told to go to hospital today: childcare is difficult as your two young children are with you and your husband is in France
- If told to come to the surgery: agree and ask whether you can bring your toddler
- Question to raise: ask whether your husband needs to know and if he should come home early

ROLE-PLAY RULES
1. Speak naturally as a worried patient — short, conversational sentences, 1–3 sentences maximum per reply
2. Do NOT volunteer information unless the doctor asks; answer only what is directly asked
3. Do NOT give medical opinions or diagnoses
4. If asked something not covered above, say you are not sure or that you do not know
5. Stay in character throughout; do not break character or discuss the roleplay itself
6. Open with: "Hello doctor, I've been having some bleeding from down below for the past couple of days and I'm worried I might be losing the baby." — but only on the very first message if the doctor has not yet spoken`;

async function transcribeElevenLabs(audio: Blob): Promise<string> {
  const fd = new FormData();
  fd.append("file", audio, "audio.webm");
  fd.append("model_id", "scribe_v2");

  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY! },
    body: fd,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs STT ${res.status}: ${body}`);
  }
  const data = await res.json();
  return (data.text ?? "").trim();
}

async function transcribeDeepgram(audio: Blob): Promise<string> {
  const res = await fetch(
    "https://api.deepgram.com/v1/listen?model=nova-3&punctuate=true",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "audio/webm",
      },
      body: audio,
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Deepgram ${res.status}: ${body}`);
  }
  const data = await res.json();
  return (
    data?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? ""
  ).trim();
}

async function askClaude(transcript: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: transcript }],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude ${res.status}: ${body}`);
  }
  const data = await res.json();
  return (data.content?.[0]?.text ?? "").trim();
}

async function synthesise(text: string): Promise<ArrayBuffer> {
  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "content-type": "application/json",
        accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_flash_v2_5",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs TTS ${res.status}: ${body}`);
  }
  return res.arrayBuffer();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");
    if (!audioFile || !(audioFile instanceof Blob)) {
      return Response.json({ error: "No audio file received." }, { status: 400 });
    }

    // STT
    const t0 = Date.now();
    const transcript =
      STT_PROVIDER === "deepgram"
        ? await transcribeDeepgram(audioFile)
        : await transcribeElevenLabs(audioFile);
    const stt_ms = Date.now() - t0;

    if (!transcript) {
      return Response.json({ error: "No speech detected in recording." }, { status: 400 });
    }

    // LLM
    const t1 = Date.now();
    const response_text = await askClaude(transcript);
    const llm_ms = Date.now() - t1;

    // TTS
    const t2 = Date.now();
    const audioBuffer = await synthesise(response_text);
    const tts_ms = Date.now() - t2;

    const audio_b64 = Buffer.from(audioBuffer).toString("base64");

    return Response.json({ transcript, response_text, audio_b64, stt_ms, llm_ms, tts_ms });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Internal server error";
    console.error("[betatest/exchange]", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
