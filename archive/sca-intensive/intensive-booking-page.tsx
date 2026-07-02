import { getEventForBooking } from "@/lib/events";
import { BookingScreen } from "../../BookingScreen";
import { Unavailable } from "../../Unavailable";

export const dynamic = "force-dynamic";

export default async function IntensiveBookingPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const event = await getEventForBooking("intensive", date);
  if (!event) return <Unavailable kind="intensive" />;
  return <BookingScreen event={event} />;
}
