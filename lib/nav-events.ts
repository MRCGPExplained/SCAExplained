/**
 * Events a page fires at the navbar.
 *
 * The navbar lives in the root layout, and Next refetches only the segment a
 * navigation changes — never the shared layout. So every count in it is
 * frozen at whatever was true when the tab last did a full load, however much
 * work happens underneath. A page that changes one of those numbers has to
 * say so; nothing else will.
 *
 * Declared here, client-safe and imported by both ends, because an event name
 * written out twice is a listener that quietly never fires. lib/staff-nav
 * would be the natural home for the staff one, but it imports next/headers,
 * so naming a constant there would drag the server into the browser bundle.
 */

/**
 * A report has been marked read for the viewer, by
 * app/recordings/[id]/page.tsx, and only when its write actually succeeded.
 * `detail` is the recording id. The envelope drops its badge.
 */
export const REPORT_READ_EVENT = "sca:report-read";

/**
 * A GP has sent a report, so it has left the review queue. `detail` is the
 * recording id. The Reviews-waiting icon drops its count by one.
 *
 * Fired by the examiner review page once the server says the send landed —
 * not when the button is pressed. A send that was refused as a duplicate, or
 * that failed, must not move the number.
 */
export const REVIEW_SENT_EVENT = "sca:review-sent";
