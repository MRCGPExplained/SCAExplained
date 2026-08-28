import { redirect } from "next/navigation";

// Report feedback now lives as a pill inside Feedback & Help, alongside Case
// Feedback and Help. Kept as a redirect so existing bookmarks still land
// somewhere useful.
export default function ReportFeedbackPage() {
  redirect("/admin/feedback");
}
