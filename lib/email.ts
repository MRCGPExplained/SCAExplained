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

export async function sendFeedbackEmail(args: {
  stationNumber: number;
  stationTitle: string;
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
        <p style="font-size:16px;color:${NAVY};font-weight:700;margin:0 0 8px;">Feedback received</p>
      </td></tr>
      <tr><td style="padding:8px 28px;">
        <table role="presentation" width="100%" style="background:#f3f2fb;border-radius:10px;">
          <tr><td style="padding:14px 16px;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">Station</p>
            <p style="margin:0;font-size:15px;color:${NAVY};font-weight:600;">#${args.stationNumber} — ${escapeHtml(args.stationTitle)}</p>
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
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">SCA Focus Case Bank — Feedback</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: "mrcgpexplained@outlook.com",
      subject: `Feedback: Station #${args.stationNumber} — ${args.stationTitle}`,
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
            <p style="margin:0;font-size:15px;color:${NAVY};font-weight:600;">#${args.stationNumber} — ${escapeHtml(args.stationTitle)}</p>
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
          SCA Focus Case Bank — Video Request</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: "mrcgpexplained@outlook.com",
      subject: `Video Request: Station #${args.stationNumber} — ${args.stationTitle}`,
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
          Renew now to keep access to all 246 stations, study rooms, and notes.
        </p>
      </td></tr>
      <tr><td style="padding:20px 28px;">
        <a href="https://www.scafocus.com/register"
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
            <p style="margin:0;font-size:15px;color:${NAVY};font-weight:600;">#${args.stationNumber} — ${escapeHtml(args.stationTitle)}</p>
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
      subject: `New recording to review: Station #${args.stationNumber} — ${args.stationTitle}`,
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
  candidateName: string;
  stationNumber: number;
  stationTitle: string;
  dgGrade: string;
  cmGrade: string;
  roGrade: string;
  totalPts: number;
  dgComment: string;
  cmComment: string;
  roComment: string;
  overallComment: string;
}): Promise<boolean> {
  if (!(await isResendEnabled())) return false;
  const resend = getResend();
  if (!resend) return false;

  const from = process.env.EMAIL_FROM ?? "SCA Focus <bookings@scafocus.com>";
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scafocus.com";

  function gradeBadge(g: string): string {
    const styles: Record<string, string> = {
      CF: "background:#fee2e2;color:#b91c1c;",
      F:  "background:#fef3c7;color:#92400e;",
      P:  "background:#dcfce7;color:#166534;",
      CP: "background:#dbeafe;color:#1d4ed8;",
    };
    const labels: Record<string, string> = { CF: "Clear Fail", F: "Fail", P: "Pass", CP: "Clear Pass" };
    const s = styles[g] ?? "";
    return `<span style="display:inline-block;padding:2px 10px;border-radius:6px;font-weight:700;font-size:12px;${s}">${g} — ${labels[g] ?? g}</span>`;
  }

  function domainRow(label: string, max: string, grade: string, comment: string): string {
    return `<tr><td style="padding:14px 0;border-bottom:1px solid rgba(26,27,82,0.07);">
      <p style="margin:0 0 6px;font-size:12px;color:#6b6c85;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${label} <span style="font-weight:400;text-transform:none;">(max ${max})</span></p>
      <p style="margin:0 0 6px;">${gradeBadge(grade)}</p>
      ${comment ? `<p style="margin:6px 0 0;font-size:13px;color:#3a3b66;line-height:1.6;">${escapeHtml(comment)}</p>` : ""}
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
        <p style="font-size:16px;color:${NAVY};font-weight:700;margin:0 0 6px;">
          Your examiner report is ready, ${escapeHtml(args.candidateName)}.</p>
        <p style="font-size:13px;color:#6b6c85;margin:0;">
          Station ${args.stationNumber}: <strong style="color:${NAVY};">${escapeHtml(args.stationTitle)}</strong>
        </p>
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
          ${domainRow("Data Gathering &amp; Diagnosis", "3 pts", args.dgGrade, args.dgComment)}
          ${domainRow("Clinical Management", "4.5 pts", args.cmGrade, args.cmComment)}
          ${domainRow("Relating to Others", "3 pts", args.roGrade, args.roComment)}
        </table>
      </td></tr>
      ${args.overallComment ? `<tr><td style="padding:16px 28px 8px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#6b6c85;font-weight:700;">Overall Comment</p>
        <p style="margin:0;font-size:13.5px;line-height:1.65;color:#3a3b66;">${escapeHtml(args.overallComment)}</p>
      </td></tr>` : ""}
      <tr><td style="padding:20px 28px;">
        <a href="${origin}/recordings"
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
      subject: `SCA Report: Station ${args.stationNumber} — ${args.stationTitle}`,
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
            <p style="margin:0;font-size:15px;color:${NAVY};font-weight:600;">#${args.stationNumber} — ${escapeHtml(args.stationTitle)}</p>
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
          SCA Focus — AI Report Feedback</p>
      </td></tr>
    </table>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: args.to,
      subject: `Report feedback: disagreement on Station ${args.stationNumber} — ${args.stationTitle}`,
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
