import { Resend } from "resend";
import { longDate, timeRange } from "./format";
import { getSupabaseAdmin } from "./supabase";

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

async function isResendEnabled(): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (!admin) return true;
  const { data } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "resend_enabled")
    .single<{ value: string }>();
  if (data?.value === "false") {
    console.log("[email] resend_enabled=false — email skipped");
    return false;
  }
  return true;
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
  if (!(await isResendEnabled())) return false;
  const resend = getResend();
  if (!resend) return false;

  const from =
    process.env.EMAIL_FROM ?? "SCA Focus <bookings@scafocus.com>";

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
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SCA Focus</p>
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
          For educational purposes only. © 2026 SCA Focus.</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: args.to,
      subject: `You're booked: ${args.eventTitle}, ${longDate(args.startTime)}`,
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

export async function sendFeedbackEmail(args: {
  to: string;
  kind: "feedback" | "help";
  stationNumber: number;
  stationTitle: string;
  userName: string;
  message: string;
}): Promise<boolean> {
  if (!(await isResendEnabled())) return false;
  const resend = getResend();
  if (!resend) return false;

  const from = process.env.EMAIL_FROM ?? "SCA Focus <bookings@scafocus.com>";
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scafocus.com";
  const label = args.kind === "help" ? "Help request" : "Feedback";

  const html = `
  <div style="background:#fafaf8;padding:32px 16px;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;
      overflow:hidden;border:1px solid rgba(26,27,82,0.10);">
      <tr><td style="background:${NAVY};padding:24px 28px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SCA Focus</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="font-size:16px;color:${NAVY};font-weight:700;margin:0 0 8px;">${label} received</p>
        <p style="font-size:13px;line-height:1.6;color:#6b6c85;margin:0;">
          This is a notification only. Reply from the admin portal, not this email.</p>
      </td></tr>
      <tr><td style="padding:16px 28px;">
        <table role="presentation" width="100%" style="background:#f3f2fb;border-radius:10px;">
          <tr><td style="padding:14px 16px;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">Station</p>
            <p style="margin:0;font-size:15px;color:${NAVY};font-weight:600;">#${args.stationNumber}: ${escapeHtml(args.stationTitle)}</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:16px 28px 8px;">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">From</p>
        <p style="margin:0;font-size:14px;color:${NAVY};">${escapeHtml(args.userName)}</p>
      </td></tr>
      <tr><td style="padding:8px 28px 24px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">Message</p>
        <p style="margin:0;font-size:14px;line-height:1.65;color:#3a3b66;white-space:pre-wrap;">${escapeHtml(args.message)}</p>
      </td></tr>
      <tr><td style="padding:0 28px 28px;">
        <a href="${origin}/admin/feedback"
           style="display:inline-block;background:${NAVY};color:#ffffff;
           font-weight:700;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;">
          Reply in Admin Portal
        </a>
      </td></tr>
      <tr><td style="background:${NAVY};padding:14px 28px;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">SCA Focus Case Bank: ${label}</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: args.to,
      subject: `${label}: Station #${args.stationNumber}, ${args.stationTitle}`,
      html,
    });
    if (error) { console.error("[email] Resend error:", error); return false; }
    return true;
  } catch (err) {
    console.error("[email] send threw:", err);
    return false;
  }
}

export async function sendFeedbackReplyEmail(args: {
  to: string;
  kind: "feedback" | "help";
  userName: string;
  stationNumber: number;
  stationTitle: string;
  originalMessage: string;
  replyText: string;
  adminName: string;
}): Promise<boolean> {
  if (!(await isResendEnabled())) return false;
  const resend = getResend();
  if (!resend) return false;

  const from = process.env.EMAIL_FROM ?? "SCA Focus <bookings@scafocus.com>";
  const label = args.kind === "help" ? "help request" : "feedback";

  const html = `
  <div style="background:#fafaf8;padding:32px 16px;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;
      overflow:hidden;border:1px solid rgba(26,27,82,0.10);">
      <tr><td style="background:${NAVY};padding:24px 28px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SCA Focus</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="font-size:16px;color:${NAVY};font-weight:700;margin:0 0 8px;">
          Reply to your ${label}, ${escapeHtml(args.userName)}</p>
        <p style="font-size:13px;line-height:1.6;color:#6b6c85;margin:0;">
          On Station #${args.stationNumber}: ${escapeHtml(args.stationTitle)}</p>
      </td></tr>
      <tr><td style="padding:16px 28px 8px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">Your message</p>
        <p style="margin:0;font-size:13.5px;line-height:1.6;color:#6b6c85;white-space:pre-wrap;font-style:italic;">${escapeHtml(args.originalMessage)}</p>
      </td></tr>
      <tr><td style="padding:16px 28px 28px;">
        <table role="presentation" width="100%" style="background:#f3f2fb;border-radius:10px;">
          <tr><td style="padding:16px;">
            <p style="margin:0;font-size:14px;line-height:1.65;color:${NAVY};white-space:pre-wrap;">${escapeHtml(args.replyText)}</p>
            <p style="margin:12px 0 0;font-size:12.5px;color:#6b6c85;">${escapeHtml(args.adminName)}, SCA Focus</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 28px 28px;">
        <p style="font-size:12px;color:#9a9ab0;margin:0;">
          Questions? Reply to this email or contact us at
          <a href="mailto:mrcgpexplained@outlook.com" style="color:#9a9ab0;">mrcgpexplained@outlook.com</a>.
        </p>
      </td></tr>
      <tr><td style="background:${NAVY};padding:14px 28px;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">
          For educational purposes only. © 2026 SCA Focus.</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: args.to,
      subject: `Re: ${args.kind === "help" ? "Help" : "Feedback"}, Station #${args.stationNumber}: ${args.stationTitle}`,
      html,
    });
    if (error) { console.error("[email] Resend error:", error); return false; }
    return true;
  } catch (err) {
    console.error("[email] send threw:", err);
    return false;
  }
}

export async function sendVideoRequestEmail(args: {
  stationNumber: number;
  stationTitle: string;
  stationSubject: string;
  userName: string;
  message: string;
}): Promise<boolean> {
  if (!(await isResendEnabled())) return false;
  const resend = getResend();
  if (!resend) return false;

  const from = process.env.EMAIL_FROM ?? "SCA Focus <bookings@scafocus.com>";

  const html = `
  <div style="background:#fafaf8;padding:32px 16px;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;
      overflow:hidden;border:1px solid rgba(26,27,82,0.10);">
      <tr><td style="background:${NAVY};padding:24px 28px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SCA Focus</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="font-size:16px;color:${NAVY};font-weight:700;margin:0 0 8px;">
          Video Lesson Request</p>
      </td></tr>
      <tr><td style="padding:8px 28px;">
        <table role="presentation" width="100%" style="background:#f3f2fb;border-radius:10px;">
          <tr><td style="padding:14px 16px;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">Station</p>
            <p style="margin:0;font-size:15px;color:${NAVY};font-weight:600;">#${args.stationNumber}: ${escapeHtml(args.stationTitle)}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b6c85;">${escapeHtml(args.stationSubject)}</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:16px 28px 8px;">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">From</p>
        <p style="margin:0;font-size:14px;color:${NAVY};">${escapeHtml(args.userName)}</p>
      </td></tr>
      <tr><td style="padding:8px 28px 28px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">Message</p>
        <p style="margin:0;font-size:14px;line-height:1.65;color:#3a3b66;white-space:pre-wrap;">${escapeHtml(args.message)}</p>
      </td></tr>
      <tr><td style="background:${NAVY};padding:14px 28px;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">
          SCA Focus Case Bank: Video Request</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: "mrcgpexplained@outlook.com",
      subject: `Video Request: Station #${args.stationNumber}, ${args.stationTitle}`,
      html,
    });
    if (error) { console.error("[email] Resend error:", error); return false; }
    return true;
  } catch (err) {
    console.error("[email] send threw:", err);
    return false;
  }
}

/**
 * The receipt for a plan purchase.
 *
 * Plan purchases used to go out on sendConfirmationEmail, which is the webinar
 * booking template. A buyer got a subject line reading "You're booked", a body
 * saying their place was confirmed and that a Zoom link would follow before
 * the session, a "When" row that ran their four-month expiry through a time
 * formatter and printed a range from one minute to the same minute, and a
 * sign-off of "See you there". There was no session and no Zoom call: they had
 * bought software. This says what they bought and when it runs out.
 */
export async function sendPurchaseEmail(args: {
  to: string;
  name: string;
  planName: string;
  aiGradings: number;
  gpReviews: number;
  expiresAt: string;
}): Promise<boolean> {
  if (!(await isResendEnabled())) return false;
  const resend = getResend();
  if (!resend) return false;

  const from = process.env.EMAIL_FROM ?? "SCA Focus <bookings@scafocus.com>";
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scafocus.com";

  // Only what this plan actually carries. Starter has no GP reviews, and a
  // line reading "0 GP reviews" is worse than no line at all.
  const items = [
    "Full case bank access",
    `${args.aiGradings} AI gradings`,
    ...(args.gpReviews > 0 ? [`${args.gpReviews} GP review${args.gpReviews === 1 ? "" : "s"}`] : []),
  ];

  const html = `
  <div style="background:#fafaf8;padding:32px 16px;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;
      overflow:hidden;border:1px solid rgba(26,27,82,0.10);">
      <tr><td style="background:${NAVY};padding:24px 28px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SCA Focus</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="font-size:16px;color:${NAVY};font-weight:700;margin:0 0 8px;">
          You're all set, ${escapeHtml(args.name)}.</p>
        <p style="font-size:14px;line-height:1.6;color:#3a3b66;margin:0;">
          Your <strong>${escapeHtml(args.planName)}</strong> plan is active.</p>
      </td></tr>
      <tr><td style="padding:16px 28px 0;">
        <table role="presentation" width="100%" style="background:#f3f2fb;border-radius:10px;">
          <tr><td style="padding:14px 16px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;
              color:#6b6c85;font-weight:700;">What you have</p>
            <p style="margin:6px 0 0;font-size:14px;color:${NAVY};line-height:1.6;">
              ${items.map(escapeHtml).join("<br>")}</p>
            <p style="margin:12px 0 0;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;
              color:#6b6c85;font-weight:700;">Access until</p>
            <p style="margin:4px 0 0;font-size:15px;color:${NAVY};font-weight:600;">
              ${longDate(args.expiresAt)}</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:20px 28px;">
        <a href="${origin}/case-bank"
           style="display:inline-block;background:${YELLOW};color:#333333;
           font-weight:700;text-decoration:none;padding:13px 26px;border-radius:8px;
           font-size:15px;">Start a station</a>
      </td></tr>
      <tr><td style="padding:0 28px 28px;">
        <p style="font-size:12px;color:#9a9ab0;margin:0;">
          Any questions, reply to this email or contact us at
          <a href="mailto:mrcgpexplained@outlook.com" style="color:#9a9ab0;">mrcgpexplained@outlook.com</a>.</p>
      </td></tr>
      <tr><td style="background:${NAVY};padding:14px 28px;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">
          For educational purposes only. © 2026 SCA Focus.</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: args.to,
      subject: `Your SCA Focus ${args.planName} plan is active`,
      html,
    });
    if (error) { console.error("[email] Resend error:", error); return false; }
    return true;
  } catch (err) {
    console.error("[email] send threw:", err);
    return false;
  }
}

/**
 * The receipt for a top-up.
 *
 * Top-ups sent nothing at all. Someone could spend £160 on 200 AI gradings
 * and get no acknowledgement from us whatsoever, which looks like a failed
 * payment and is the kind of silence that produces a chargeback.
 *
 * It says what the top-up did NOT do as well as what it did, because the one
 * thing a buyer is likely to assume is that paying again bought them more
 * time. It did not: a top-up adds to a balance and leaves the expiry alone.
 */
export async function sendTopUpEmail(args: {
  to: string;
  name: string;
  /** e.g. "200 AI gradings" or "20 GP reviews". */
  packLabel: string;
  /** Null when the expiry could not be read; the line is then omitted rather
   *  than guessed, since a wrong date here is worse than no date. */
  expiresAt: string | null;
}): Promise<boolean> {
  if (!(await isResendEnabled())) return false;
  const resend = getResend();
  if (!resend) return false;

  const from = process.env.EMAIL_FROM ?? "SCA Focus <bookings@scafocus.com>";
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scafocus.com";

  const expiryLine = args.expiresAt
    ? `<p style="margin:12px 0 0;font-size:13px;color:#6b6c85;">
         Your access still runs to <strong>${longDate(args.expiresAt)}</strong>.
         A top-up adds to your balance and does not change that date.</p>`
    : `<p style="margin:12px 0 0;font-size:13px;color:#6b6c85;">
         A top-up adds to your balance and does not change when your access
         ends.</p>`;

  const html = `
  <div style="background:#fafaf8;padding:32px 16px;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;
      overflow:hidden;border:1px solid rgba(26,27,82,0.10);">
      <tr><td style="background:${NAVY};padding:24px 28px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SCA Focus</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="font-size:16px;color:${NAVY};font-weight:700;margin:0 0 8px;">
          Thanks, ${escapeHtml(args.name)}.</p>
        <p style="font-size:14px;line-height:1.6;color:#3a3b66;margin:0;">
          <strong>${escapeHtml(args.packLabel)}</strong> have been added to your balance.</p>
        ${expiryLine}
      </td></tr>
      <tr><td style="padding:20px 28px;">
        <a href="${origin}/recordings"
           style="display:inline-block;background:${YELLOW};color:#333333;
           font-weight:700;text-decoration:none;padding:13px 26px;border-radius:8px;
           font-size:15px;">See your balance</a>
      </td></tr>
      <tr><td style="padding:0 28px 28px;">
        <p style="font-size:12px;color:#9a9ab0;margin:0;">
          Any questions, reply to this email or contact us at
          <a href="mailto:mrcgpexplained@outlook.com" style="color:#9a9ab0;">mrcgpexplained@outlook.com</a>.</p>
      </td></tr>
      <tr><td style="background:${NAVY};padding:14px 28px;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">
          For educational purposes only. © 2026 SCA Focus.</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: args.to,
      subject: `${args.packLabel} added to your SCA Focus account`,
      html,
    });
    if (error) { console.error("[email] Resend error:", error); return false; }
    return true;
  } catch (err) {
    console.error("[email] send threw:", err);
    return false;
  }
}

export async function sendAccessExpiryEmail(args: {
  to: string;
  firstName: string;
  expiresAt: string;
}): Promise<boolean> {
  if (!(await isResendEnabled())) return false;
  const resend = getResend();
  if (!resend) return false;

  const from = process.env.EMAIL_FROM ?? "SCA Focus <bookings@scafocus.com>";
  const expiry = new Date(args.expiresAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const html = `
  <div style="background:#fafaf8;padding:32px 16px;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;
      overflow:hidden;border:1px solid rgba(51,51,51,0.10);">
      <tr><td style="background:${NAVY};padding:24px 28px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SCA Focus</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="font-size:16px;color:#333333;font-weight:700;margin:0 0 8px;">
          Your access expires soon, ${escapeHtml(args.firstName)}.</p>
        <p style="font-size:14px;line-height:1.6;color:#555555;margin:0;">
          Your Case Bank access expires on <strong>${expiry}</strong>.
          Renew now to keep access to all 246 stations, study groups, and notes.
        </p>
      </td></tr>
      <tr><td style="padding:20px 28px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scafocus.com"}/case-bank/upgrade"
           style="display:inline-block;background:${YELLOW};color:#333333;
           font-weight:700;text-decoration:none;padding:13px 26px;border-radius:8px;
           font-size:15px;">
          Renew access
        </a>
      </td></tr>
      <tr><td style="padding:0 28px 28px;">
        <p style="font-size:12px;color:#9a9ab0;margin:0;">
          Questions? Reply to this email or contact us at
          <a href="mailto:mrcgpexplained@outlook.com" style="color:#9a9ab0;">mrcgpexplained@outlook.com</a>.
        </p>
      </td></tr>
      <tr><td style="background:${NAVY};padding:14px 28px;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">
          For educational purposes only. © 2026 SCA Focus.</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: args.to,
      subject: `Your SCA Focus access expires on ${expiry}`,
      html,
    });
    if (error) { console.error("[email] Resend error:", error); return false; }
    return true;
  } catch (err) {
    console.error("[email] send threw:", err);
    return false;
  }
}

export async function sendExaminerNotificationEmail(args: {
  to: string;
  examinerName: string;
  candidateName: string;
  stationNumber: number;
  stationTitle: string;
}): Promise<boolean> {
  if (!(await isResendEnabled())) return false;
  const resend = getResend();
  if (!resend) return false;

  const from = process.env.EMAIL_FROM ?? "SCA Focus <bookings@scafocus.com>";
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scafocus.com";

  const html = `
  <div style="background:#fafaf8;padding:32px 16px;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;
      overflow:hidden;border:1px solid rgba(26,27,82,0.10);">
      <tr><td style="background:${NAVY};padding:24px 28px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SCA Focus</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="font-size:16px;color:${NAVY};font-weight:700;margin:0 0 8px;">
          New recording ready for review</p>
        <p style="font-size:14px;line-height:1.6;color:#3a3b66;margin:0;">
          Hi ${escapeHtml(args.examinerName)}, a new consultation has been submitted and is ready for your review.</p>
      </td></tr>
      <tr><td style="padding:16px 28px;">
        <table role="presentation" width="100%" style="background:#f3f2fb;border-radius:10px;">
          <tr><td style="padding:14px 16px;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">Station</p>
            <p style="margin:0;font-size:15px;color:${NAVY};font-weight:600;">#${args.stationNumber}: ${escapeHtml(args.stationTitle)}</p>
            <p style="margin:6px 0 0;font-size:12px;color:#6b6c85;">Candidate: ${escapeHtml(args.candidateName)}</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:8px 28px 28px;">
        <a href="${origin}/examiner"
           style="display:inline-block;background:${NAVY};color:#ffffff;
           font-weight:700;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;">
          Go to Examiner Portal
        </a>
      </td></tr>
      <tr><td style="background:${NAVY};padding:14px 28px;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">
          For educational purposes only. © 2026 SCA Focus.</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: args.to,
      subject: `New recording to review: Station #${args.stationNumber}, ${args.stationTitle}`,
      html,
    });
    if (error) { console.error("[email] Resend error:", error); return false; }
    return true;
  } catch (err) {
    console.error("[email] send threw:", err);
    return false;
  }
}

export async function sendExaminerReportEmail(args: {
  to: string;
  /** The consultation this is about. The button opens it directly. */
  recordingId: string;
  stationNumber: number;
  stationTitle: string;
  dgGrade: string;
  cmGrade: string;
  roGrade: string;
  totalPts: number;
  /**
   * The doctor's name in the possessive — "Ada's" — on a copy going to
   * someone who was in the room but did not sit in the doctor's chair.
   *
   * The last thing that still differs between the copies, and it differs in
   * one place: the subject. The body opens on the station and the chairs,
   * which say whose consultation it is without addressing anyone, and the
   * button now opens the same report for everybody. A subject line cannot do
   * that — it is one line in a list of forty — so it keeps the possessive.
   *
   * Comes from doctorPossessive in lib/doctor-name, which returns null for
   * any display name it cannot vouch for. Nothing else may stand in for it,
   * and null simply gives the doctor's own plain subject.
   */
  whose?: string | null;
  /**
   * Who was in the room, and who marked it.
   *
   * Every name here has been through printableName, so an absent one is
   * absent on purpose and its row is dropped rather than filled with a
   * placeholder. The examiner is named because the report page has always
   * named them — "Marked by Dr X", app/recordings/[id]/page.tsx:433 — to
   * whoever opens it, so this repeats what the link already shows.
   */
  roster?: {
    doctor: string | null;
    patient: string | null;
    observers: string[];
    examiner: string | null;
  };
}): Promise<boolean> {
  if (!(await isResendEnabled())) return false;
  const resend = getResend();
  if (!resend) return false;

  const from = process.env.EMAIL_FROM ?? "SCA Focus <bookings@scafocus.com>";
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scafocus.com";

  const subject = args.whose
    ? `${args.whose} SCA Report: Station ${args.stationNumber}, ${args.stationTitle}`
    : `SCA Report: Station ${args.stationNumber}, ${args.stationTitle}`;
  /*
    Everyone gets the report, not a list to find it in.

    It was the list for the doctor and the report for a peer, because a peer
    has no list — /recordings is `.eq("doctor_user_id", user.id)`
    (app/recordings/page.tsx:125) and peer rows were deliberately taken out of
    My Reviews. But the doctor had no more reason to be routed through an
    index: the email is about one consultation, so the button opens that
    consultation. The list is still a click away in the nav.
  */
  const reportHref = `${origin}/recordings/${args.recordingId}`;

  /*
    The roster, as rows rather than one run-on line, because four labels of
    different lengths read as a list and not as a sentence. A row with no
    usable name is dropped: "Doctor: Doctor" says less than nothing, and the
    placeholder is indistinguishable from a real name except by value.
  */
  const rosterRows: Array<[string, string]> = [];
  if (args.roster) {
    const { doctor, patient, observers, examiner } = args.roster;
    if (doctor) rosterRows.push(["Doctor", doctor]);
    if (patient) rosterRows.push(["Patient", patient]);
    if (observers.length) rosterRows.push([observers.length > 1 ? "Observers" : "Observer", observers.join(", ")]);
    if (examiner) rosterRows.push(["Examiner", examiner]);
  }
  const rosterHtml = rosterRows.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:10px 0 0;">
        ${rosterRows
          .map(
            ([label, value]) =>
              `<tr>
                <td style="padding:1px 10px 1px 0;font-size:12.5px;color:#6b6c85;vertical-align:top;white-space:nowrap;">${label}:</td>
                <td style="padding:1px 0;font-size:12.5px;color:#3a3b66;vertical-align:top;">${escapeHtml(value)}</td>
              </tr>`
          )
          .join("")}
      </table>`
    : "";

  function gradeBadge(g: string): string {
    const styles: Record<string, string> = {
      CF: "background:#fee2e2;color:#b91c1c;",
      F:  "background:#fef3c7;color:#92400e;",
      P:  "background:#dcfce7;color:#166534;",
      CP: "background:#dbeafe;color:#1d4ed8;",
    };
    const labels: Record<string, string> = { CF: "Clear Fail", F: "Fail", P: "Pass", CP: "Clear Pass" };
    const s = styles[g] ?? "";
    return `<span style="display:inline-block;padding:2px 10px;border-radius:6px;font-weight:700;font-size:12px;${s}">${g}: ${labels[g] ?? g}</span>`;
  }

  /*
    The grade, and not the comment that goes with it.

    The email says how it went; the report says why. A domain comment is the
    part worth reading beside the transcript and the examiner's voice note,
    and neither of those can travel in an email — so the comment read better
    on the page than it ever did here, and taking it out of the inbox costs
    nothing it was actually delivering.
  */
  function domainRow(label: string, max: string, grade: string): string {
    return `<tr><td style="padding:12px 0;border-bottom:1px solid rgba(26,27,82,0.07);">
      <p style="margin:0 0 6px;font-size:12px;color:#6b6c85;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${label} <span style="font-weight:400;text-transform:none;">(max ${max})</span></p>
      <p style="margin:0;">${gradeBadge(grade)}</p>
    </td></tr>`;
  }

  const html = `
  <div style="background:#fafaf8;padding:32px 16px;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;
      overflow:hidden;border:1px solid rgba(26,27,82,0.10);">
      <tr><td style="background:${NAVY};padding:24px 28px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SCA Focus</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="font-size:16px;color:#6b6c85;font-weight:400;margin:0;">
          Station ${args.stationNumber}: <strong style="color:${NAVY};font-weight:700;">${escapeHtml(args.stationTitle)}</strong>
        </p>
        ${rosterHtml}
      </td></tr>
      <tr><td style="padding:12px 28px;">
        <table role="presentation" width="100%" style="background:#f3f2fb;border-radius:10px;">
          <tr><td style="padding:14px 16px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">Station Total</p>
            <p style="margin:4px 0 0;font-size:22px;color:${NAVY};font-weight:800;">${args.totalPts} / 10.5 pts</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:12px 28px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${domainRow("Data Gathering &amp; Diagnosis", "3 pts", args.dgGrade)}
          ${domainRow("Clinical Management", "4.5 pts", args.cmGrade)}
          ${domainRow("Relating to Others", "3 pts", args.roGrade)}
        </table>
      </td></tr>
      <tr><td style="padding:16px 28px 0;">
        <p style="margin:0;font-size:13px;line-height:1.6;color:#6b6c85;">
          Your examiner&rsquo;s written comments and voice note are in the full report,
          alongside the recording and the transcript.
        </p>
      </td></tr>
      <tr><td style="padding:14px 28px 20px;">
        <a href="${reportHref}"
           style="display:inline-block;background:${NAVY};color:#ffffff;
           font-weight:700;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;">
          View Full Report
        </a>
      </td></tr>
      <tr><td style="background:${NAVY};padding:14px 28px;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">
          For educational purposes only. © 2026 SCA Focus.</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: args.to,
      subject,
      html,
    });
    if (error) { console.error("[email] Resend error:", error); return false; }
    return true;
  } catch (err) {
    console.error("[email] send threw:", err);
    return false;
  }
}

export async function sendReportFeedbackDisagreeEmail(args: {
  to: string;
  candidateName: string;
  stationNumber: number;
  stationTitle: string;
  comment: string;
  recordingId: string;
}): Promise<boolean> {
  if (!(await isResendEnabled())) return false;
  const resend = getResend();
  if (!resend) return false;

  const from = process.env.EMAIL_FROM ?? "SCA Focus <bookings@scafocus.com>";
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scafocus.com";

  const html = `
  <div style="background:#fafaf8;padding:32px 16px;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;
      overflow:hidden;border:1px solid rgba(26,27,82,0.10);">
      <tr><td style="background:${NAVY};padding:24px 28px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SCA Focus</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="font-size:16px;color:${NAVY};font-weight:700;margin:0 0 8px;">
          A candidate disagreed with an AI report</p>
        <p style="font-size:14px;line-height:1.6;color:#3a3b66;margin:0;">
          ${escapeHtml(args.candidateName)} said they don&rsquo;t agree with their provisional AI-graded report.</p>
      </td></tr>
      <tr><td style="padding:16px 28px;">
        <table role="presentation" width="100%" style="background:#f3f2fb;border-radius:10px;">
          <tr><td style="padding:14px 16px;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">Station</p>
            <p style="margin:0;font-size:15px;color:${NAVY};font-weight:600;">#${args.stationNumber}: ${escapeHtml(args.stationTitle)}</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:16px 28px 8px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">Their comment</p>
        <p style="margin:0;font-size:14px;line-height:1.65;color:#3a3b66;white-space:pre-wrap;">${escapeHtml(args.comment)}</p>
      </td></tr>
      <tr><td style="padding:8px 28px 28px;">
        <a href="${origin}/admin/report-feedback"
           style="display:inline-block;background:${NAVY};color:#ffffff;
           font-weight:700;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;">
          Review in Admin Portal
        </a>
      </td></tr>
      <tr><td style="background:${NAVY};padding:14px 28px;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">
          SCA Focus: AI Report Feedback</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: args.to,
      subject: `Report feedback: disagreement on Station ${args.stationNumber}, ${args.stationTitle}`,
      html,
    });
    if (error) { console.error("[email] Resend error:", error); return false; }
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
