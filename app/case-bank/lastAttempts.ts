/**
 * The last time someone met each station, and in which chair.
 *
 * Kept out of the page so the fold can be tested without a database behind it.
 */

import type { LastAttempt } from "./components/StationListClient";

/**
 * What a grade is worth. Clinical Management counts for half as much again as
 * the other two, which is why it cannot be a single shared table of four.
 */
export const POINTS = {
  dg: { CF: 0, F: 1, P: 2, CP: 3 } as Record<string, number>,
  cm: { CF: 0, F: 1.5, P: 3, CP: 4.5 } as Record<string, number>,
  ro: { CF: 0, F: 1, P: 2, CP: 3 } as Record<string, number>,
};

export interface AttemptRow {
  id: string;
  station_number: number;
  ai_graded_at: string;
  doctor_user_id: string | null;
  sent_to_candidate_at: string | null;
  ai_data_gathering: string | null;
  ai_clinical_management: string | null;
  ai_relating_to_others: string | null;
  examiner_data_gathering: string | null;
  examiner_clinical_management: string | null;
  examiner_relating_to_others: string | null;
}

export function totalOf(r: AttemptRow): number | null {
  const gp = !!r.sent_to_candidate_at;
  const dg = POINTS.dg[(gp && r.examiner_data_gathering) || r.ai_data_gathering || ""];
  const cm = POINTS.cm[(gp && r.examiner_clinical_management) || r.ai_clinical_management || ""];
  const ro = POINTS.ro[(gp && r.examiner_relating_to_others) || r.ai_relating_to_others || ""];
  return [dg, cm, ro].some((v) => v === undefined) ? null : dg + cm + ro;
}

/**
 * The last time this person met each station, and in which chair.
 *
 * Playing the patient counts, and is called out as such. They have read the
 * case from the other side — they know the hidden agenda and where it turns —
 * so coming back to it as the doctor is not a cold run, and a list that said
 * nothing would let them believe it was. Their own attempt as doctor wins
 * where they have both, because that is the one with a mark on it.
 *
 * Only graded recordings count: an abandoned take is not an attempt.
 */

/**
 * Fold the rows into one note per station. Rows must arrive oldest first.
 *
 * Their own turn as doctor wins over having played the patient, because that
 * is the attempt with a mark on it. Within one chair the newest row replaces
 * the older and the count rises; switching from patient to doctor starts the
 * count again, since they are not the same thing being counted.
 */
export function foldAttempts(rows: AttemptRow[], userId: string): Record<number, LastAttempt> {
  const out: Record<number, LastAttempt> = {};
  for (const r of rows) {
    const asDoctor = r.doctor_user_id === userId;
    const seen = out[r.station_number];
    if (seen && seen.asDoctor && !asDoctor) continue;
    const sameRole = seen && seen.asDoctor === asDoctor;
    out[r.station_number] = {
      asDoctor,
      // Only their own. A patient attempt is somebody else's report, and the
      // report page turns away anyone who is not the candidate, an examiner
      // or an admin — so linking it would send them to a dead end.
      reportId: asDoctor ? r.id : null,
      at: r.ai_graded_at,
      total: asDoctor ? totalOf(r) : null,
      count: sameRole ? seen.count + 1 : 1,
    };
  }
  return out;
}
