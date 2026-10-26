/**
 * Everything My Trends knows how to work out, with no React and no database
 * in it.
 *
 * This whole feature is designed to come out in one piece if it does not earn
 * its place: delete app/trends and remove the one card from the dashboard's
 * items array. Nothing outside this directory imports anything in it, which is
 * why the aggregation lives here rather than in lib/.
 *
 * Two facts about the grading model shape most of what follows, and both are
 * easy to get wrong.
 *
 * First, the skills are not an independent second opinion on the domains —
 * they are an INPUT to them. applySkillAdjustment in lib/skill-framework.ts
 * counts the assessable skill answers per domain and steps that domain's grade
 * up or down by one band. So a page that showed the two halves as corroborating
 * each other would be telling one fact twice. They are a verdict and its cause,
 * and because the step is capped at a single band the skill counts move long
 * before a domain grade does. The skills are the sensitive instrument.
 *
 * Second, "not_assessable" means no evidence either way, not a failure. The
 * framework already excludes it from its own denominators, and so does every
 * percentage here. Counting it as a miss would mean a short consultation, where
 * nothing could be judged, scored zero per cent — which reads as catastrophe
 * and means nothing happened.
 */

import {
  GRADE_ORDER,
  type DomainKey,
  type Grade,
  type SkillAnswer,
  type SkillRating,
  type SkillsAssessment,
} from "@/lib/skill-framework";

export const DOMAINS: DomainKey[] = ["data_gathering", "clinical_management", "relating_to_others"];

export const DOMAIN_SHORT: Record<DomainKey, string> = {
  data_gathering: "Data Gathering",
  clinical_management: "Clinical Management",
  relating_to_others: "Relating to Others",
};

/**
 * What each grade is worth. Clinical Management is weighted 1.5x, which is the
 * single most decision-relevant fact in the model and the reason the page
 * states it in the header: a Fail there costs more than a Fail anywhere else.
 */
export const DOMAIN_POINTS: Record<DomainKey, Record<Grade, number>> = {
  data_gathering: { CF: 0, F: 1, P: 2, CP: 3 },
  clinical_management: { CF: 0, F: 1.5, P: 3, CP: 4.5 },
  relating_to_others: { CF: 0, F: 1, P: 2, CP: 3 },
};

export const GRADE_LABEL: Record<Grade, string> = {
  CF: "Clear Fail",
  F: "Fail",
  P: "Pass",
  CP: "Clear Pass",
};

/** The row shape the page reads out of the database, before any thinking. */
export interface RawRecording {
  id: string;
  station_number: number;
  station_title: string | null;
  ai_graded_at: string | null;
  sent_to_candidate_at: string | null;
  ai_data_gathering: string | null;
  ai_clinical_management: string | null;
  ai_relating_to_others: string | null;
  examiner_data_gathering: string | null;
  examiner_clinical_management: string | null;
  examiner_relating_to_others: string | null;
  skills_assessment: SkillsAssessment | null;
  examiner_skills_assessment: SkillsAssessment | null;
}

/** One attempt, after the AI/GP question has been settled. */
export interface Attempt {
  id: string;
  n: number;
  stationNumber: number;
  stationTitle: string;
  gradedAt: string;
  /** A GP has verified this one, so its grades and skills are theirs. */
  gpReviewed: boolean;
  grades: Record<DomainKey, Grade | null>;
  total: number | null;
  skills: SkillAnswer[];
  /** Assessable skill answers in this attempt, across all domains. */
  assessable: number;
  good: number;
}

function asGrade(value: string | null): Grade | null {
  return value && (GRADE_ORDER as string[]).includes(value) ? (value as Grade) : null;
}

/**
 * Both AI and GP, with the GP winning where they have ruled.
 *
 * This mirrors the report itself, which swaps to examiner_* once
 * sent_to_candidate_at is set. The alternative — trending the AI alone for a
 * consistent judge — would have shown a candidate a grade on this page that
 * disagreed with the grade on their own report, which is the worse confusion.
 * Attempts a GP has touched are marked wherever they are drawn, so a step up
 * that happens to coincide with a review is at least visible as such.
 */
export function toAttempts(rows: RawRecording[]): Attempt[] {
  return rows
    .filter((r) => r.ai_graded_at)
    .sort((a, b) => (a.ai_graded_at ?? "").localeCompare(b.ai_graded_at ?? ""))
    .map((r, i) => {
      const gpReviewed = !!r.sent_to_candidate_at;

      const grades: Record<DomainKey, Grade | null> = gpReviewed
        ? {
            data_gathering: asGrade(r.examiner_data_gathering) ?? asGrade(r.ai_data_gathering),
            clinical_management:
              asGrade(r.examiner_clinical_management) ?? asGrade(r.ai_clinical_management),
            relating_to_others:
              asGrade(r.examiner_relating_to_others) ?? asGrade(r.ai_relating_to_others),
          }
        : {
            data_gathering: asGrade(r.ai_data_gathering),
            clinical_management: asGrade(r.ai_clinical_management),
            relating_to_others: asGrade(r.ai_relating_to_others),
          };

      const assessment = (gpReviewed && r.examiner_skills_assessment) || r.skills_assessment;
      const skills = Array.isArray(assessment?.skills) ? assessment.skills : [];
      const scored = skills.filter((s) => s.rating !== "not_assessable");

      const total = DOMAINS.every((d) => grades[d])
        ? DOMAINS.reduce((sum, d) => sum + DOMAIN_POINTS[d][grades[d] as Grade], 0)
        : null;

      return {
        id: r.id,
        n: i + 1,
        stationNumber: r.station_number,
        stationTitle: r.station_title ?? `Station ${r.station_number}`,
        gradedAt: r.ai_graded_at as string,
        gpReviewed,
        grades,
        total,
        skills,
        assessable: scored.length,
        good: scored.filter((s) => s.rating === "good").length,
      };
    });
}

/**
 * An attempt where nothing could be assessed is not a bad attempt, it is an
 * absent one — a few seconds of audio, or a consultation that never started.
 * Averaging those in would bury a real trend under a flat line of zeros, so
 * they are counted and set aside rather than silently dropped: a page that
 * quietly ignored a third of someone's recordings would be lying by omission.
 */
export function splitAssessed(attempts: Attempt[]): { assessed: Attempt[]; unassessed: Attempt[] } {
  return {
    assessed: attempts.filter((a) => a.assessable > 0),
    unassessed: attempts.filter((a) => a.assessable === 0),
  };
}

// ── Panel 1: where each domain stands ────────────────────────────────────────

export interface DomainStanding {
  domain: DomainKey;
  counts: Record<Grade, number>;
  graded: number;
  passOrBetter: number;
}

/**
 * The spread, not a mean.
 *
 * Averaging CF/F/P/CP to "1.7" invents a precision the scale does not have —
 * it is ordinal, so the distance from Clear Fail to Fail is not known to equal
 * the distance from Pass to Clear Pass — and 1.7 is not a grade anyone can act
 * on. The count of each band shows both the level and whether it is settling,
 * and "Pass or better in 8 of 12" gives the one number that maps to the thing
 * being attempted.
 */
export function domainStandings(attempts: Attempt[]): DomainStanding[] {
  return DOMAINS.map((domain) => {
    const counts: Record<Grade, number> = { CF: 0, F: 0, P: 0, CP: 0 };
    let graded = 0;
    for (const a of attempts) {
      const g = a.grades[domain];
      if (!g) continue;
      counts[g] += 1;
      graded += 1;
    }
    return { domain, counts, graded, passOrBetter: counts.P + counts.CP };
  });
}

// ── Panel 2: each domain over the attempts ───────────────────────────────────

export interface DomainPoint {
  n: number;
  grade: Grade;
  gpReviewed: boolean;
  stationNumber: number;
  gradedAt: string;
}

export function domainSeries(attempts: Attempt[]): Record<DomainKey, DomainPoint[]> {
  const out = {} as Record<DomainKey, DomainPoint[]>;
  for (const domain of DOMAINS) {
    out[domain] = attempts
      .filter((a) => a.grades[domain])
      .map((a) => ({
        n: a.n,
        grade: a.grades[domain] as Grade,
        gpReviewed: a.gpReviewed,
        stationNumber: a.stationNumber,
        gradedAt: a.gradedAt,
      }));
  }
  return out;
}

// ── Panels 3 and 4: the skills ───────────────────────────────────────────────

export interface SkillStanding {
  key: string;
  assessed: number;
  good: number;
  needsImprovement: number;
  /** Of the ones that could be judged. */
  goodPct: number;
}

export function skillTotals(attempts: Attempt[]): {
  assessed: number;
  good: number;
  needsImprovement: number;
  goodPct: number | null;
} {
  let assessed = 0;
  let good = 0;
  for (const a of attempts) {
    assessed += a.assessable;
    good += a.good;
  }
  return {
    assessed,
    good,
    needsImprovement: assessed - good,
    goodPct: assessed ? (good / assessed) * 100 : null,
  };
}

export function skillSeries(attempts: Attempt[]): { n: number; goodPct: number; assessed: number; gpReviewed: boolean }[] {
  return attempts
    .filter((a) => a.assessable > 0)
    .map((a) => ({
      n: a.n,
      goodPct: (a.good / a.assessable) * 100,
      assessed: a.assessable,
      gpReviewed: a.gpReviewed,
    }));
}

/**
 * How many attempts before this page is willing to name a weakest skill.
 *
 * Picking the worst of thirteen skills seen three times each is close to
 * drawing a name from a hat: with that many candidates and that little
 * evidence, something tops the list every time, and a confident instruction
 * costs a trainee an evening spent on the wrong thing. Below the gate the page
 * shows the counts and declines to rank them.
 */
export const NAME_WEAKEST_AFTER_ATTEMPTS = 5;
export const NAME_WEAKEST_AFTER_OCCURRENCES = 3;

export function skillStandings(attempts: Attempt[]): SkillStanding[] {
  const tally = new Map<string, { assessed: number; good: number }>();
  for (const a of attempts) {
    for (const s of a.skills) {
      if (s.rating === ("not_assessable" satisfies SkillRating)) continue;
      const t = tally.get(s.skill) ?? { assessed: 0, good: 0 };
      t.assessed += 1;
      if (s.rating === "good") t.good += 1;
      tally.set(s.skill, t);
    }
  }
  return [...tally.entries()]
    .map(([key, t]) => ({
      key,
      assessed: t.assessed,
      good: t.good,
      needsImprovement: t.assessed - t.good,
      goodPct: (t.good / t.assessed) * 100,
    }))
    .sort((a, b) => a.goodPct - b.goodPct || b.assessed - a.assessed);
}

/** The ones the page is willing to point at, or an empty list if it is too early. */
export function weakestSkills(attempts: Attempt[], standings: SkillStanding[], limit = 4): SkillStanding[] {
  if (attempts.length < NAME_WEAKEST_AFTER_ATTEMPTS) return [];
  return standings
    .filter((s) => s.assessed >= NAME_WEAKEST_AFTER_OCCURRENCES && s.needsImprovement > 0)
    .slice(0, limit);
}

// ── The one comparison that holds difficulty constant ────────────────────────

export interface StationRun {
  stationNumber: number;
  stationTitle: string;
  points: { n: number; total: number | null; gradedAt: string; gpReviewed: boolean }[];
}

/**
 * Attempts at the same station, in order.
 *
 * Every other comparison on this page is confounded by the cases themselves
 * being harder or easier than one another. This one is not: it is the same
 * station, so a better result is a better consultation. It is also the shape
 * the usage already has — the heaviest user has eleven attempts at one station
 * and seven distinct stations in total. People redo them, and this is the one
 * view that rewards it.
 */
export function stationRuns(attempts: Attempt[]): StationRun[] {
  const by = new Map<number, Attempt[]>();
  for (const a of attempts) {
    by.set(a.stationNumber, [...(by.get(a.stationNumber) ?? []), a]);
  }
  return [...by.values()]
    .filter((list) => list.length > 1)
    .map((list) => ({
      stationNumber: list[0].stationNumber,
      stationTitle: list[0].stationTitle,
      points: list.map((a) => ({
        n: a.n,
        total: a.total,
        gradedAt: a.gradedAt,
        gpReviewed: a.gpReviewed,
      })),
    }))
    .sort((a, b) => b.points.length - a.points.length);
}
