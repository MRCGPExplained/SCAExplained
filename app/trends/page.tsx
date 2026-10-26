/**
 * My Trends — what the reports say when you put them together.
 *
 * Self-contained on purpose. Everything this feature needs is in app/trends,
 * and the only mark it leaves anywhere else is one card in the dashboard's
 * items array. To remove it: delete this directory and that card. Nothing else
 * imports from here, and nothing here is imported by anything else.
 *
 * It is not in the middleware matcher, which is fine and deliberate: that is a
 * cheap pre-filter for people with no session at all, and this page does the
 * real check itself a moment later, the way every protected page in this
 * codebase does. Adding it would be one more line to remember to take out.
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { loadAllSkillLabels } from "@/lib/skill-framework";
import {
  DOMAINS,
  DOMAIN_SHORT,
  NAME_WEAKEST_AFTER_ATTEMPTS,
  domainSeries,
  domainStandings,
  skillSeries,
  skillStandings,
  skillTotals,
  splitAssessed,
  stationRuns,
  toAttempts,
  weakestSkills,
  type RawRecording,
} from "./aggregate";
import { DomainDots, GradeSpread, ScoringPrimer, SkillCurve, StationRunRow } from "./TrendVisuals";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const FAINT = { color: "rgba(51,51,51,0.42)" };
const CARD = {
  border: "1px solid rgba(51,51,51,0.10)",
  boxShadow: "0 2px 12px rgba(51,51,51,0.05)",
};

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl p-6" style={CARD}>
      <h2 className="font-display font-bold text-[15px]" style={{ color: DARK }}>{title}</h2>
      {hint && <p className="text-[12px] mt-1 mb-4 leading-[1.55]" style={FAINT}>{hint}</p>}
      {!hint && <div className="mb-4" />}
      {children}
    </section>
  );
}

export default async function TrendsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/trends");

  const admin = getSupabaseAdmin();
  if (!admin) redirect("/dashboard");

  const [{ data: rows }, labels] = await Promise.all([
    admin
      .from("station_recordings")
      .select(
        "id, station_number, station_title, ai_graded_at, sent_to_candidate_at, " +
          "ai_data_gathering, ai_clinical_management, ai_relating_to_others, " +
          "examiner_data_gathering, examiner_clinical_management, examiner_relating_to_others, " +
          "skills_assessment, examiner_skills_assessment"
      )
      .eq("doctor_user_id", user.id)
      .not("ai_graded_at", "is", null)
      // A thrown-away take should not haunt the trend. It also gives an
      // admin a reversible way to take a recording out of here without
      // deleting it, which is the kinder lever of the two.
      .neq("status", "discarded")
      .returns<RawRecording[]>(),
    // Labels live in grading_skills, not in the stored assessment, so naming a
    // skill costs this second read. It is small and the same for everyone.
    loadAllSkillLabels(admin),
  ]);

  const all = toAttempts(rows ?? []);
  const { assessed, unassessed } = splitAssessed(all);

  const standings = domainStandings(assessed);
  const series = domainSeries(assessed);
  const skills = skillTotals(assessed);
  const curve = skillSeries(assessed);
  const bySkill = skillStandings(assessed);
  const weakest = weakestSkills(assessed, bySkill);
  const runs = stationRuns(assessed);

  const n = assessed.length;
  const gpCount = assessed.filter((a) => a.gpReviewed).length;

  return (
    <div className="min-h-screen px-6 pt-12 pb-16" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[680px] mx-auto">

        <Link href="/dashboard" className="text-[12.5px] no-underline" style={FAINT}>← Dashboard</Link>

        <h1 className="font-display font-extrabold text-[28px] mt-3" style={{ color: DARK }}>My Trends</h1>
        <p className="text-[12.5px] mt-1.5" style={FAINT}>
          {n === 0
            ? "Nothing graded yet. Record a consultation and this fills in."
            : `${n} graded consultation${n === 1 ? "" : "s"}` +
              (gpCount ? `, ${gpCount} verified by a GP` : "") +
              (unassessed.length
                ? ` · ${unassessed.length} too short to assess, left out`
                : "")}
        </p>

        <div className="flex flex-col gap-4 mt-8">

          {/* The model itself, before any of the numbers that use it. */}
          <Card
            title="How it is scored"
            hint="Three domains, 10.5 points in total, and 7 to pass. Clinical Management is worth half as much again as the other two — so two Clear Passes elsewhere will not carry a Fail there."
          >
            <ScoringPrimer />
          </Card>

          {n === 0 ? (
            <section className="bg-white rounded-2xl p-6" style={CARD}>
              <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(51,51,51,0.55)" }}>
                Once you have a graded consultation, this page shows where each domain stands, how
                the three move across your attempts, which skills keep coming up short, and how the
                same station goes the second time you try it.
              </p>
              <Link
                href="/case-bank"
                className="inline-block mt-4 no-underline font-bold text-[13px] px-4 py-2 rounded-lg"
                style={{ background: DARK, color: "white" }}
              >
                Open the Case Bank →
              </Link>
            </section>
          ) : (
            <>
              {/* 1 — where each domain stands */}
              <Card
                title="Where each domain stands"
                hint="Every grade you have been given in each domain. The spread matters as much as the level: a run of Fails drifting into Passes is progress a single average would hide."
              >
                <div className="flex flex-col gap-5">
                  {standings.map((s) => (
                    <div key={s.domain}>
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-[13px] font-semibold" style={{ color: DARK }}>
                          {DOMAIN_SHORT[s.domain]}
                        </span>
                        <span className="text-[11.5px]" style={FAINT}>
                          {s.graded
                            ? `Pass or better in ${s.passOrBetter} of ${s.graded}`
                            : "not graded yet"}
                        </span>
                      </div>
                      <GradeSpread counts={s.counts} graded={s.graded} />
                    </div>
                  ))}
                </div>
              </Card>

              {/* 2 — the domains over time */}
              <Card
                title="Each domain, attempt by attempt"
                hint="Oldest on the left. Left as dots rather than joined into a line, because four grades joined up swing wildly on the luck of which case came up. A hollow ring is an attempt a GP verified."
              >
                <div className="flex flex-col gap-5">
                  {DOMAINS.map((d) => (
                    <div key={d}>
                      <p className="text-[13px] font-semibold mb-1" style={{ color: DARK }}>
                        {DOMAIN_SHORT[d]}
                      </p>
                      <DomainDots points={series[d]} domain={d} />
                    </div>
                  ))}
                </div>
              </Card>

              {/* 3 — the skills */}
              <Card
                title="Skills"
                hint="Of the skills that could actually be judged, how many were done well. Skills a consultation gave no chance to show are left out rather than counted against you."
              >
                {skills.assessed === 0 ? (
                  <p className="text-[12.5px]" style={FAINT}>Nothing assessable yet.</p>
                ) : (
                  <>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-display font-extrabold text-[26px]" style={{ color: DARK }}>
                        {Math.round(skills.goodPct ?? 0)}%
                      </span>
                      <span className="text-[12.5px]" style={FAINT}>
                        done well — {skills.good} of {skills.assessed} judged
                      </span>
                    </div>

                    {weakest.length > 0 ? (
                      <>
                        <p className="text-[12px] font-bold uppercase tracking-[0.06em] mb-2" style={FAINT}>
                          Coming up short most often
                        </p>
                        <div className="flex flex-col">
                          {weakest.map((s) => (
                            <div
                              key={s.key}
                              className="flex items-baseline justify-between py-2"
                              style={{ borderTop: "1px solid rgba(51,51,51,0.12)" }}
                            >
                              <span className="text-[12.5px]" style={{ color: DARK }}>
                                {labels[s.key] ?? s.key}
                              </span>
                              <span className="text-[11.5px] shrink-0 ml-3" style={FAINT}>
                                {s.needsImprovement} of {s.assessed}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-[12px] leading-[1.55]" style={FAINT}>
                        {n < NAME_WEAKEST_AFTER_ATTEMPTS
                          ? `Not pointing at a weakest skill yet. With thirteen of them and only ${n} ` +
                            `consultation${n === 1 ? "" : "s"}, whichever came bottom would mostly be chance — ` +
                            `${NAME_WEAKEST_AFTER_ATTEMPTS} is where it starts to mean something.`
                          : "Nothing is consistently coming up short."}
                      </p>
                    )}
                  </>
                )}
              </Card>

              {/* 4 — the skills over time */}
              <Card
                title="Skills, attempt by attempt"
                hint="The share judged good each time. This moves before the grades above do: the skills feed those grades but can only shift one by a single band, so improvement shows here first."
              >
                <SkillCurve points={curve} />
              </Card>

              {/* The one comparison that holds difficulty constant. */}
              {runs.length > 0 && (
                <Card
                  title="The same station, more than once"
                  hint="The only fair before-and-after here: same case, same marking, so a better score is a better consultation rather than an easier station."
                >
                  <div>
                    {runs.map((r) => (
                      <StationRunRow key={r.stationNumber} run={r} />
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
