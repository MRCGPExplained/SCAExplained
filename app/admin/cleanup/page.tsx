import {
  countEmptyStudyRoomsAction,
  countExpiredGuestAccountsAction,
  countOrphanStationImagesAction,
} from "../actions";
import { CleanupClient } from "./CleanupClient";

export const dynamic = "force-dynamic";

export default async function AdminCleanupPage() {
  /*
    Counted here rather than waiting for a button.

    The other two counts that need no input are fetched on load, and this one
    needs no input either — leaving it blank meant the card opened showing an
    em dash, which reads as "none" to anyone who has not been told that the
    dash means "not asked". The two cards still left on demand are the ones
    that take an "older than N days" box, and genuinely cannot be counted
    before that is chosen.
  */
  const [emptyRooms, expiredGuests, orphans] = await Promise.all([
    countEmptyStudyRoomsAction(),
    countExpiredGuestAccountsAction(),
    countOrphanStationImagesAction(),
  ]);

  return (
    <div>
      <h1 className="font-display font-bold text-[22px] text-navy mb-1">Cleanup</h1>
      <p className="text-[13px] text-navy/50 mb-6">
        Housekeeping for data that safely accumulates over time. Each action shows a count before you confirm.
      </p>
      <CleanupClient
        initialEmptyRooms={emptyRooms}
        initialExpiredGuests={expiredGuests}
        initialOrphans={orphans}
      />
    </div>
  );
}
