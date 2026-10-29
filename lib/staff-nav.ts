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

/** One row in the review-queue panel. */
export interface ReviewWaiting {
  id: string;
  stationNumber: number;
  stationTitle: string;
  candidate: string;
  /** A GP has opened it but not sent it. Still not done; still counted. */
  started: boolean;
  waitingSince: string;
}

/** One row in the feedback panel. */
export interface FeedbackWaiting {
  id: string;
  topic: "feedback" | "help";
  from: string | null;
  stationNumber: number | null;
  stationTitle: string | null;
  content: string;
  sentAt: string;
}

export interface Staff {
  isExaminer: boolean;
  isAdmin: boolean;
}

/**
 * Who this is, in one query.
 *
 * isAdmin() and getExaminer() both look up the same examiners row by the same
 * email. Run separately from the root layout they would cost every visitor
 * two lookups on every page, forever, to say "no".
 *
 * Exported because the panels behind these icons are server actions, and a
 * server action is a public endpoint. The navbar only RENDERING an icon for
 * staff is not a check — anyone signed in can POST to the action directly.
 */
export async function resolveStaff(): Promise<Staff> {
  const user = await getCurrentUser();
  const admin = getSupabaseAdmin();
  if (!admin) return { isExaminer: false, isAdmin: false };

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
      return { isExaminer: false, isAdmin: false };
    }
    if (data) {
      isExaminer = true;
      if (data.is_admin) isAdmin = true;
    }
  }

  return { isExaminer, isAdmin };
}

export async function loadStaffNav(): Promise<StaffNav> {
  const admin = getSupabaseAdmin();
  if (!admin) return NONE;

  const { isExaminer, isAdmin } = await resolveStaff();
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
