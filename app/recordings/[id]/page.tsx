import { ReportBody } from "./ReportBody";

export const dynamic = "force-dynamic";

/**
 * The report at its own URL.
 *
 * Kept whole and separate from the modal deliberately. A report link is
 * shared, bookmarked, mailed and refreshed, and all of those must land on a
 * real page rather than an overlay with nothing behind it. The intercepting
 * route in app/@modal only takes over for navigation that starts inside the
 * app; everything else arrives here.
 */
export default async function RecordingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReportBody id={id} />;
}
