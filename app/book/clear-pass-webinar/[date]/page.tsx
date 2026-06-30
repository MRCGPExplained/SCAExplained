import { getEventForBooking } from "@/lib/events";
import { BookingScreen } from "../../BookingScreen";
import { Unavailable } from "../../Unavailable";

export const dynamic = "force-dynamic";

export default async function WebinarBookingPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const event = await getEventForBooking("webinar", date);
  if (!event) return <Unavailable kind="webinar" />;
  return <BookingScreen event={event} />;
}
