import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getExaminer } from "@/lib/examiner-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { examinerLogoutAction } from "./actions";
import ExaminerPortalClient, { type QueueRow } from "./ExaminerPortalClient";

export const dynamic = "force-dynamic";

const NAVY = "#333333";

export default async function ExaminerPage() {
  const examiner = await getExaminer();

  // ── Logged in, but this email isn't on the examiners list ────────────────
  if (!examiner) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
        <div className="w-full max-w-[360px] rounded-2xl p-8" style={{ background: "white", border: "1px solid rgba(51,51,51,0.1)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: "rgba(51,51,51,0.4)" }}>
            SCA Focus
          </div>
          <h1 className="font-display font-extrabold text-[22px] mb-3" style={{ color: NAVY }}>
            Examiner Portal
          </h1>
          <p className="text-[13.5px] mb-1" style={{ color: "rgba(51,51,51,0.65)" }}>
            Signed in as <strong>{user?.email}</strong>.
          </p>
          <p className="text-[13.5px] mb-7 leading-relaxed" style={{ color: "rgba(51,51,51,0.5)" }}>
            This account isn&apos;t registered as an examiner. Ask an admin to add
            your email under Examiners, or sign out and try a different account.
          </p>
          <form action={examinerLogoutAction}>
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-[14px] font-bold"
              style={{ background: NAVY, color: "white", border: "none", cursor: "pointer" }}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Logged in: show review portal ────────────────────────────────────────
  const admin = getSupabaseAdmin();
  const QUEUE_COLUMNS =
    "id, station_number, station_title, doctor_display_name, candidate_email, started_at, status, ai_data_gathering, ai_clinical_management, ai_relating_to_others, ai_graded_at, examiner_data_gathering, examiner_clinical_management, examiner_relating_to_others, examiner_reviewed_at, submitted_for_review_at, gp_requested_at, sent_to_candidate_at, discarded_at, doctor_audio_path, examiner_id, manually_checked_at, examiners!station_recordings_examiner_id_fkey(name)";
  // site_settings is no longer read here: the AI pipeline button is offered on
  // every attempt, and the pipeline reports what happened if it can't run.
  const [queueResult, doneResult, aiResult, examinersResult] = admin
    ? await Promise.all([
        admin
          .from("station_recordings")
          .select(QUEUE_COLUMNS)
          /*
            Everything a GP was asked to look at, derived rather than read off
            `status`. This listed status in (pending_examiner, reviewing,
            reviewed, sent), so re-grading a consultation moved it to
            "grading" and it dropped out of this page mid-run. That is the
            incident of 1 Nov, and this was the list being watched when it
            happened. The queue/completed split below is now made on
            sent_to_candidate_at. See lib/recording-state.

            ("reviewed" was in that list and has no writer anywhere in the
            codebase, so it never matched anything.)
          */
          .not("submitted_for_review_at", "is", null)
          .is("discarded_at", null)
          /*
            Oldest first, and the cap is why it matters rather than the
            display order — the portal sorts each list itself.

            This list becomes two: the queue, which is unsent, and completed,
            which is sent. Ordered newest-first a full cap would drop the
            oldest rows, and the oldest unsent row is precisely the candidate
            who has been waiting longest — the one a queue exists to surface.
            Completed is fetched separately below so it can keep its own end.
          */
          .is("sent_to_candidate_at", null)
          .order("started_at", { ascending: true })
          .limit(200),
        admin
          .from("station_recordings")
          .select(QUEUE_COLUMNS)
          // The finished half. Newest first, because what is wanted from a
          // record of completed work is the recent end of it.
          .not("submitted_for_review_at", "is", null)
          .not("sent_to_candidate_at", "is", null)
          .is("discarded_at", null)
          .order("sent_to_candidate_at", { ascending: false })
          .limit(200),
        admin
          .from("station_recordings")
          .select(QUEUE_COLUMNS)
          /*
            The AI pile: graded, and nobody asked a GP for it. Was
            status === "ai_graded", which had the same fault in the other
            tab, since re-grading one of these moves it to "grading" too.
            ai_graded_at keeps ungraded and in-flight rows out.
          */
          .is("submitted_for_review_at", null)
          .is("gp_requested_at", null)
          .is("discarded_at", null)
          .not("ai_graded_at", "is", null)
          .order("started_at", { ascending: false })
          .limit(200),
        admin.from("examiners").select("id, name").order("name"),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];

  // Handed to the portal as one list, which splits it on sent_to_candidate_at
  // exactly as before. The split is unchanged; only which rows survive a full
  // cap, and that is now the right end of each half.
  const gpRows = [
    ...((queueResult.data ?? []) as unknown as QueueRow[]),
    ...((doneResult.data ?? []) as unknown as QueueRow[]),
  ];
  const aiRows = (aiResult.data ?? []) as unknown as QueueRow[];
  const examiners = (examinersResult.data ?? []) as { id: string; name: string }[];

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[860px] mx-auto px-4 py-10">

        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-1" style={{ color: "rgba(51,51,51,0.45)" }}>
              Examiner Portal
            </div>
            <h1 className="font-display font-extrabold text-[26px]" style={{ color: NAVY }}>
              Review Queue
            </h1>
            <p className="text-[13px] mt-1" style={{ color: "rgba(51,51,51,0.5)" }}>
              Welcome, {examiner.name}.
            </p>
          </div>
          <form action={examinerLogoutAction}>
            <button type="submit" className="text-[12px]" style={{ background: "none", border: "none", color: "rgba(51,51,51,0.4)", cursor: "pointer" }}>
              Sign out
            </button>
          </form>
        </div>

        <ExaminerPortalClient
          gpRows={gpRows}
          aiRows={aiRows}
          examiners={examiners}
        />
      </div>
    </div>
  );
}
