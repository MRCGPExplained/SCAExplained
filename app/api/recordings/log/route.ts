import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Where the recording flow's logs go now that console.log is not enough.
 *
 * On 28 Oct a consultation lost one of its two tracks. Everything that could
 * have explained it — whether the recorder started, whether the upload began,
 * whether it threw — went to a browser console that was closed before anyone
 * thought to look. The answer existed for about a minute and then did not.
 *
 * So the same lines are now kept. This is a diagnostic table, not a feature:
 * nothing reads it in the product, and it exists so the NEXT one takes
 * seconds instead of an evening of inference.
 *
 * Deliberately permissive about WHO may write. Checking that a caller really
 * belongs to the recording would cost a query on a path that runs while a
 * consultation is failing, and refusing a log line is a worse failure than
 * storing a junk one. What it does not do is trust the caller's claims about
 * identity: user_id comes from the session, never the body.
 */

/** Keeps a runaway client, or a bored one, from filling the table. */
const MAX_EVENT = 120;
const MAX_DATA_BYTES = 4000;

interface Body {
  recordingId?: string | null;
  roomId?: string | null;
  role?: string | null;
  level?: string;
  event?: string;
  data?: unknown;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const uuidOrNull = (v: unknown) => (typeof v === "string" && UUID.test(v) ? v : null);

export async function POST(request: Request) {
  // Never throws, never blocks, never fails the thing it is observing. Every
  // path below returns 204 — a logger that can report its own failure to the
  // caller invites the caller to handle it, and there is nothing to handle.
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    if (!user) return new NextResponse(null, { status: 204 });

    const admin = getSupabaseAdmin();
    if (!admin) return new NextResponse(null, { status: 204 });

    const body = (await request.json().catch(() => null)) as Body | null;
    if (!body?.event) return new NextResponse(null, { status: 204 });

    let data: unknown = body.data ?? null;
    if (data !== null) {
      const json = JSON.stringify(data);
      // Truncated rather than dropped: a line that says it was too long is
      // still evidence that the event happened.
      if (json.length > MAX_DATA_BYTES) data = { truncated: true, head: json.slice(0, MAX_DATA_BYTES) };
    }

    const { error } = await admin.from("recording_events").insert({
      recording_id: uuidOrNull(body.recordingId),
      room_id: uuidOrNull(body.roomId),
      user_id: user.id,
      role: typeof body.role === "string" ? body.role.slice(0, 20) : null,
      level: body.level === "error" || body.level === "duration" ? body.level : "status",
      event: String(body.event).slice(0, MAX_EVENT),
      data,
      user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    });

    // supabase-js returns { data, error }. This one really is only worth a
    // console line: if the log store is down, the thing to do is nothing.
    if (error) console.error("[recordings/log] insert failed", error.message);
  } catch (e) {
    console.error("[recordings/log] threw", e);
  }

  return new NextResponse(null, { status: 204 });
}
