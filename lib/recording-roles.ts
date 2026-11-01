/**
 * Which chair somebody sat in.
 *
 * Shared because the envelope and the report page both ask it of the same row
 * and have to give the same answer: the envelope to decide whose consultation
 * to say it is, the page to decide whether this reader was in the room at all.
 *
 * What counts as the report having arrived is not here, because it turned out
 * not to need deciding. A report reaches the envelope when a GP sends it, for
 * everyone who was in the room — sent_to_candidate_at and nothing else. An AI
 * report never does, for any chair.
 */

export type RecordingRole = "doctor" | "patient" | "observer";

/** The columns these tests read. Any row carrying them will do. */
export interface RoleColumns {
  doctor_user_id: string | null;
  patient_user_id: string | null;
  observer_user_ids: string[] | null;
}

/**
 * The chair this person sat in, or null if they were not in the room.
 *
 * Doctor first, then patient, then observer — the same order as
 * app/case-bank/lastAttempts.ts:85, and the order matters rather than being
 * tidy: a solo practice take writes the same person into both chairs
 * (app/betatest/actions.ts:35 sets patient_user_id to the doctor's own id), so
 * testing patient first would hand somebody their own graded attempt as though
 * they had only played the patient in it.
 *
 * Unlike the doctor and patient columns, observer_user_ids has no foreign key —
 * an array cannot have one — so it is matched by containment and nothing more.
 */
export function recordingRole(row: RoleColumns, userId: string): RecordingRole | null {
  if (row.doctor_user_id === userId) return "doctor";
  if (row.patient_user_id === userId) return "patient";
  if ((row.observer_user_ids ?? []).includes(userId)) return "observer";
  return null;
}

