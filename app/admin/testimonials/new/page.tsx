import Link from "next/link";
import { createTestimonialAction } from "../../actions";
import TestimonialForm from "../TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/testimonials" className="text-[13px] text-navy/50 hover:text-navy transition no-underline">
          ← Testimonials
        </Link>
        <span className="text-navy/20">/</span>
        <h1 className="font-display font-extrabold text-[22px] text-navy">Add Testimonial</h1>
      </div>
      <TestimonialForm action={createTestimonialAction} submitLabel="Create Testimonial" />
    </div>
  );
}
