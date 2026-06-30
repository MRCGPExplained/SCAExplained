import { Resend } from "resend";
import { longDate, timeRange } from "./format";

let cached: Resend | null = null;

function getResend(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY missing — confirmation email skipped.");
    return null;
  }
  cached = new Resend(key);
  return cached;
}

interface ConfirmationArgs {
  to: string;
  customerName: string;
  eventTitle: string;
  ticketName: string;
  startTime: string;
  endTime: string;
  zoomLink: string | null;
}

const NAVY = "#1A1B52";
const YELLOW = "#F6D44B";

/**
 * Sends the booking confirmation — this is the ONLY place the Zoom join link is
 * surfaced, and only after payment (paid tickets) or immediate confirmation
 * (free webinar). Never expose zoom_link on any public page.
 *
 * Returns true on success; logs and returns false on failure (a failed email
 * must not fail the webhook / booking — the booking row is already confirmed).
 */
export async function sendConfirmationEmail(
  args: ConfirmationArgs
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const from =
    process.env.EMAIL_FROM ?? "SCA Explained <bookings@scaexplained.com>";

  const when = `${longDate(args.startTime)}, ${timeRange(
    args.startTime,
    args.endTime
  )}`;

  const zoomBlock = args.zoomLink
    ? `<tr><td style="padding:20px 28px;">
         <a href="${args.zoomLink}"
            style="display:inline-block;background:${YELLOW};color:${NAVY};
            font-weight:700;text-decoration:none;padding:13px 26px;border-radius:8px;
            font-size:15px;">Join on Zoom</a>
         <p style="font-size:12px;color:#6b6c85;margin:14px 0 0;">
           Or paste this link into your browser at the start time:<br>
           <span style="word-break:break-all;">${args.zoomLink}</span>
         </p>
       </td></tr>`
    : `<tr><td style="padding:0 28px 8px;">
         <p style="font-size:14px;color:#6b6c85;margin:0;">
           Your Zoom joining link will follow by email before the session.
         </p>
       </td></tr>`;

  const html = `
  <div style="background:#fafaf8;padding:32px 16px;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;
      overflow:hidden;border:1px solid rgba(26,27,82,0.10);">
      <tr><td style="background:${NAVY};padding:24px 28px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SCA Explained</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="font-size:16px;color:${NAVY};font-weight:700;margin:0 0 8px;">
          You're booked in, ${escapeHtml(args.customerName)}.</p>
        <p style="font-size:14px;line-height:1.6;color:#3a3b66;margin:0;">
          Your place for the <strong>${escapeHtml(args.eventTitle)}</strong>
          (${escapeHtml(args.ticketName)}) is confirmed.</p>
      </td></tr>
      <tr><td style="padding:16px 28px 0;">
        <table role="presentation" width="100%" style="background:#f3f2fb;border-radius:10px;">
          <tr><td style="padding:14px 16px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;
              color:#6b6c85;font-weight:700;">When</p>
            <p style="margin:4px 0 0;font-size:15px;color:${NAVY};font-weight:600;">${when}</p>
          </td></tr>
        </table>
      </td></tr>
      ${zoomBlock}
      <tr><td style="padding:8px 28px 28px;">
        <p style="font-size:12px;color:#9a9ab0;margin:0;">
          See you there. If you need to rearrange or have any questions, contact us at
          <a href="mailto:mrcgpexplained@outlook.com" style="color:#9a9ab0;">mrcgpexplained@outlook.com</a>.</p>
      </td></tr>
      <tr><td style="background:${NAVY};padding:14px 28px;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">
          For educational purposes only. © 2026 SCA Explained.</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: args.to,
      subject: `You're booked: ${args.eventTitle} — ${longDate(args.startTime)}`,
      html,
    });
    if (error) {
      console.error("[email] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send threw:", err);
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
