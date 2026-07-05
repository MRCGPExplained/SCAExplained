import Link from "next/link";
import { createVideoSystemAction } from "../../actions";
import SystemForm from "../SystemForm";

export default function NewVideoSystemPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/video-course" className="text-[13px] text-navy/50 hover:text-navy transition no-underline">
          ← Video Course
        </Link>
        <span className="text-navy/20">/</span>
        <h1 className="font-display font-extrabold text-[22px] text-navy">Add Lesson</h1>
      </div>
      <SystemForm action={createVideoSystemAction} submitLabel="Create Lesson" />
    </div>
  );
}
