export type EventType = "webinar" | "intensive";

export interface TicketAvailability {
  ticketTypeId: string;
  name: string;
  capacity: number;
  price: number; // pence
  remaining: number;
}

/** An upcoming event with its ticket types and live remaining capacity.
 *  Never carries `zoom_link` — that is server-internal and emailed on
 *  confirmation only. */
export interface UpcomingEvent {
  id: string;
  eventType: EventType;
  title: string;
  description: string | null;
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  isoDate: string; // YYYY-MM-DD, used as the booking-route param
  tickets: TicketAvailability[];
}
