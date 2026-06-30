// Display helpers. The DB stores full UTC timestamps; the UI splits each into a
// date chip (day / date / month) and a separate time-of-day line, and everything
// is rendered in UK local time (Europe/London) regardless of server timezone.

const TZ = "Europe/London";

/** YYYY-MM-DD for the given instant, in UK local time. Used as the booking
 *  route param and to match an event back from its [date] segment. */
export function isoDay(timestamp: string | Date): string {
  const d = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export interface DateChip {
  day: string; // 'Wed'
  date: string; // '08'
  month: string; // 'Jul'
}

export function dateChip(timestamp: string | Date): DateChip {
  const d = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: get("weekday"), date: get("day"), month: get("month") };
}

function timeOfDay(d: Date): string {
  // e.g. "6:00 PM" — drop the leading zero on the hour for a cleaner look.
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .replace(/\b0(\d:)/, "$1")
    .toUpperCase()
    .replace("AM", "AM")
    .replace("PM", "PM");
}

/** "6:00–8:00 PM" — collapses the meridiem when start and end share it. */
export function timeRange(start: string | Date, end: string | Date): string {
  const s = typeof start === "string" ? new Date(start) : start;
  const e = typeof end === "string" ? new Date(end) : end;
  const sStr = timeOfDay(s);
  const eStr = timeOfDay(e);
  const sMer = sStr.slice(-2);
  const eMer = eStr.slice(-2);
  if (sMer === eMer) {
    return `${sStr.slice(0, -2).trim()}–${eStr}`;
  }
  return `${sStr}–${eStr}`;
}

/** "£150" / "Free" from a pence amount. */
export function formatPrice(pence: number): string {
  if (pence === 0) return "Free";
  const pounds = pence / 100;
  return Number.isInteger(pounds) ? `£${pounds}` : `£${pounds.toFixed(2)}`;
}

/** Long human date, e.g. "Wednesday 8 July 2026". */
export function longDate(timestamp: string | Date): string {
  const d = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
