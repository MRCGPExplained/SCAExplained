import {
  countEmptyStudyRoomsAction,
  countExpiredGuestAccountsAction,
} from "../actions";
import { CleanupClient } from "./CleanupClient";

export const dynamic = "force-dynamic";

export default async function AdminCleanupPage() {
  const [emptyRooms, expiredGuests] = await Promise.all([
    countEmptyStudyRoomsAction(),
    countExpiredGuestAccountsAction(),
  ]);

  return (
    <div>
      <h1 className="font-display font-bold text-[22px] text-navy mb-1">Cleanup</h1>
      <p className="text-[13px] text-navy/50 mb-6">
        Housekeeping for data that safely accumulates over time. Each action shows a count before you confirm.
      </p>
      <CleanupClient initialEmptyRooms={emptyRooms} initialExpiredGuests={expiredGuests} />
    </div>
  );
}
