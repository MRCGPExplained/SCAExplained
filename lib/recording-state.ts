/**
 * Where a consultation has got to, on the two axes that actually exist.
 *
 * `status` is one column doing two jobs: it tracks where the AI pipeline has
 * reached AND where the GP review has reached. The pipeline owns the column,
 * so running the pipeline destroys the GP side of it.
 *
 * On 1 Nov a GP-reviewed consultation was re-graded to see a new marksheet.
 * The retry wrote "processing" over "reviewing" and the row left the product
 * entirely: the GP queue filtered status in ('pending_examiner','reviewing'),
 * and nothing anywhere lists "processing". Six of the eleven allowed statuses
 * appear in no staff list at all, so landing on any of them is a disappearance.
 *
 * The fix is not a better status value. It is that the GP side never needed
 * the column. It is already written, unambiguously, in timestamps the
 * pipeline never touches:
 *
 *   submitted_for_review_at   a GP review was asked for, and paid for
 *   examiner_reviewed_at      a GP has saved marks against it
 *   sent_to_candidate_at      the GP has finished and the candidate has it
 *   discarded_at              it was thrown away
 *
 * None of those is ever cleared, and nothing in the pipeline writes any of
 * them. Derive from these and a consultation cannot vanish because the AI
 * happens to be busy with it.
 *
 * So for the GP side `status` is now descriptive, not authoritative. That is
 * the whole point, and it is also the trap: a new list written the obvious
 * way, `.eq("status", ...)`, puts the bug straight back. Ask these functions
 * instead.
 */

export interface GpColumns {
  submitted_for_review_at?: string | null;
  gp_requested_at?: string | null;
  examiner_reviewed_at?: string | null;
  sent_to_candidate_at?: string | null;
  discarded_at?: string | null;
}

/**
 * Has a GP review been asked for?
 *
 * Reads both columns because the two doors into the queue disagree:
 * submitForReviewAction set only submitted_for_review_at while the grading
 * path set both. They are written together now, but reading both costs
 * nothing and means a third door cannot make a row invisible by picking the
 * other column.
 *
 * Queries can filter on submitted_for_review_at alone: every path that
 * requests a review sets it, so it is the superset. Verified against
 * production, where no row has one set without the other.
 */
export function gpRequested(row: GpColumns): boolean {
  return !!(row.submitted_for_review_at || row.gp_requested_at);
}

/**
 * The statuses that mean the AI pipeline currently holds this row.
 *
 * One list, because the number of them is exactly the sort of thing that
 * gets out of step. A re-grade claims "grading" and a fresh run claims
 * "processing", and anything testing for only one of the two is wrong half
 * the time: the retry button tested `status !== "processing"` and so called
 * a grading run finished four seconds after it started, over grades that
 * were still the old ones.
 */
export const LIVE_STATUSES = ["uploading", "processing", "grading"] as const;

export function isPipelineRunning(status: string | null | undefined): boolean {
  return !!status && (LIVE_STATUSES as readonly string[]).includes(status);
}

export type GpState = "discarded" | "none" | "waiting" | "in_progress" | "sent";

export function gpState(row: GpColumns): GpState {
  if (row.discarded_at) return "discarded";
  if (!gpRequested(row)) return "none";
  if (row.sent_to_candidate_at) return "sent";
  if (row.examiner_reviewed_at) return "in_progress";
  return "waiting";
}

/**
 * What `status` should read once a grading run finishes, given where the GP
 * had got to.
 *
 * Call it on a FRESH read of the row, never on the snapshot taken when the
 * run started. A GP can save marks while grading is in flight, and the old
 * line decided from a row fetched minutes earlier: a consultation on
 * "reviewing" came back "pending_examiner", quietly demoting a review
 * somebody had already written marks into.
 */
export function statusAfterGrading(row: GpColumns): string {
  switch (gpState(row)) {
    case "discarded":
      return "discarded";
    case "sent":
      return "sent";
    case "in_progress":
      return "reviewing";
    case "waiting":
      return "pending_examiner";
    case "none":
      return "ai_graded";
  }
}
