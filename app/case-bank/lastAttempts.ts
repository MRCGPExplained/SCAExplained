/**
 * Every time someone has met each station, and in which chair.
 *
 * Kept out of the page so the fold can be tested without a database behind it.
 *
 * Keeping the whole history rather than only the latest is what makes the one
 * honest comparison in this product available: the same station, twice.
 * Difficulty is held constant there, so CF/F/P becoming P/P/CP is a better
 * consultation rather than an easier case — which is exactly what an average
 * taken across different stations could never promise.
 */

import type { LastAttempt, StationAttempt } from "./components/StationListClient";

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

/** The three letters actually in force: a GP's, once they have ruled. */
export function gradesOf(r: AttemptRow): [string | null, string | null, string | null] {
  const gp = !!r.sent_to_candidate_at;
  return [
    (gp && r.examiner_data_gathering) || r.ai_data_gathering,
    (gp && r.examiner_clinical_management) || r.ai_clinical_management,
    (gp && r.examiner_relating_to_others) || r.ai_relating_to_others,
  ];
}

export function totalOf(r: AttemptRow): number | null {
  const [d, c, o] = gradesOf(r);
  const dg = POINTS.dg[d ?? ""];
  const cm = POINTS.cm[c ?? ""];
  const ro = POINTS.ro[o ?? ""];
  return [dg, cm, ro].some((v) => v === undefined) ? null : dg + cm + ro;
}

/**
 * Fold the rows into one note per station. Rows must arrive oldest first.
 *
 * Their own turn as doctor wins over having played the patient, because that
 * is the attempt with a mark on it, and it wins in either direction: a case
 * role-played last week still loses to one sat as the doctor last month.
 *
 * The history holds their own attempts only, newest first. A patient attempt
 * is somebody else's report — the report page turns away anyone who is not
 * the candidate, an examiner or an admin — so it carries no id and would be a
 * row in a list of links that could not be clicked.
 *
 * Only graded recordings count: an abandoned take is not an attempt.
 */
export function foldAttempts(rows: AttemptRow[], userId: string): Record<number, LastAttempt> {
  const doctorHistory: Record<number, StationAttempt[]> = {};
  const patient: Record<number, { at: string; count: number }> = {};

  for (const r of rows) {
    if (r.doctor_user_id === userId) {
      const [dg, cm, ro] = gradesOf(r);
      // Newest first, and rows arrive oldest first, so each one goes in front.
      doctorHistory[r.station_number] = [
        { id: r.id, at: r.ai_graded_at, total: totalOf(r), grades: [dg, cm, ro] },
        ...(doctorHistory[r.station_number] ?? []),
      ];
    } else {
      const seen = patient[r.station_number];
      patient[r.station_number] = { at: r.ai_graded_at, count: seen ? seen.count + 1 : 1 };
    }
  }

  const out: Record<number, LastAttempt> = {};

  for (const [n, history] of Object.entries(doctorHistory)) {
    const latest = history[0];
    out[Number(n)] = {
      asDoctor: true,
      reportId: latest.id,
      at: latest.at,
      total: latest.total,
      count: history.length,
      history,
    };
  }

  for (const [n, p] of Object.entries(patient)) {
    if (out[Number(n)]) continue; // their own turn as doctor wins
    out[Number(n)] = {
      asDoctor: false,
      reportId: null,
      at: p.at,
      total: null,
      count: p.count,
      history: [],
    };
  }

  return out;
}
