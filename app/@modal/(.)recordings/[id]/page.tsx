import { ReportBody } from "@/app/recordings/[id]/ReportBody";
import { ReportModal } from "@/app/components/ReportModal";

export const dynamic = "force-dynamic";

/**
 * A report opened from inside the app, over whatever you were doing.
 *
 * `(.)` intercepts /recordings/[id] at the same routing level — @modal is a
 * slot, not a segment, so this sits level with the real route rather than a
 * folder below it.
 *
 * Only soft navigation is intercepted. Refresh, a pasted link, a new tab and
 * anything arriving from outside the app all fall through to the real page,
 * which is the behaviour a shared report link needs.
 */
export default async function InterceptedReport({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ReportModal recordingId={id}>
      <ReportBody id={id} inModal />
    </ReportModal>
  );
}
