import Link from "next/link";
import { createHomepageVideoAction } from "../../actions";
import HomepageVideoForm from "../HomepageVideoForm";

export default function NewHomepageVideoPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/homepage-videos" className="text-[13px] text-navy/50 hover:text-navy transition no-underline">
          ← Homepage Videos
        </Link>
        <span className="text-navy/20">/</span>
        <h1 className="font-display font-extrabold text-[22px] text-navy">Add Video</h1>
      </div>
      <HomepageVideoForm action={createHomepageVideoAction} submitLabel="Create Video" />
    </div>
  );
}
