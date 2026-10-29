import { cookies } from "next/headers";
import { createHash } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/current-user";
import { likeEscape } from "@/lib/like-escape";

/**
 * The two staff counters in the navbar: consultations waiting on a GP, and
 * feedback nobody has answered.
 *
 * Resolved in ONE query against `examiners`, not two. isAdmin() and
 * getExaminer() both look up the same row by the same email — run separately
 * from the root layout they would cost every visitor two lookups on every
 * page, forever, to tell almost all of them "no".
 *
 * Null means "not entitled to see this", which the navbar renders as no icon
 * at all. Zero means "entitled, nothing waiting" — the icon shows without a
 * badge. The two are not the same and must not collapse into one.
 */
export interface StaffNav {
  /** Consultations a GP has not finished with. Null unless examiner or admin. */
  reviewsWaiting: number | null;
  /** Feedback and help requests not yet replied to. Null unless admin. */
  feedbackWaiting: number | null;
}

const NONE: StaffNav = { reviewsWaiting: null, feedbackWaiting: null };

export async function loadStaffNav(): Promise<StaffNav> {
  const user = await getCurrentUser();
  const admin = getSupabaseAdmin();
  if (!admin) return NONE;

  // The /master passcode fail-safe has no examiner row, and is admin by
  // definition. Mirrors isAdmin() in admin-auth.ts.
  let isAdmin = false;
  try {
    const jar = await cookies();
    const masterSession = jar.get("master_session")?.value ?? "";
    const pw = process.env.ADMIN_PASSWORD ?? "";
    if (masterSession && pw && masterSession === createHash("sha256").update(pw).digest("hex")) {
      isAdmin = true;
    }
  } catch {
    // No cookie store (shouldn't happen in a layout) — fall through to the
    // examiners lookup, which is the normal path anyway.
  }

  let isExaminer = isAdmin;

  if (user?.email) {
    const { data, error } = await admin
      .from("examiners")
      .select("id, is_admin")
      // Escaped, like every other ilike on a typed value. See lib/like-escape.
      .ilike("email", likeEscape(user.email))
      .maybeSingle<{ id: string; is_admin: boolean }>();

    // supabase-js returns { data, error }. Unread, a transient failure would
    // silently strip a GP's queue counter and read as "nothing waiting".
    if (error) {
      console.error("[staff-nav] examiner lookup failed", error.message);
      return NONE;
    }
    if (data) {
      isExaminer = true;
      if (data.is_admin) isAdmin = true;
    }
  }

  if (!isExaminer && !isAdmin) return NONE;

  const [reviews, feedback] = await Promise.all([
    /*
      Both "pending_examiner" and "reviewing" count. A review someone has
      opened but not sent is still not done, and dropping it from the badge
      would make a half-finished one invisible until somebody thought to look.
      The queue page shows the difference; the badge only has to say "there is
      work here".
    */
    admin
      .from("station_recordings")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending_examiner", "reviewing"])
      .is("discarded_at", null),
    isAdmin
      ? admin
          .from("station_reports")
          .select("id", { count: "exact", head: true })
          .eq("resolved", false)
      : Promise.resolve({ count: null, error: null }),
  ]);

  if (reviews.error) console.error("[staff-nav] review count failed", reviews.error.message);
  if (feedback.error) console.error("[staff-nav] feedback count failed", feedback.error.message);

  return {
    reviewsWaiting: reviews.error ? null : reviews.count ?? 0,
    feedbackWaiting: isAdmin && !feedback.error ? feedback.count ?? 0 : null,
  };
}
