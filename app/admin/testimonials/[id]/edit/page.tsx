import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { updateTestimonialAction } from "../../../actions";
import TestimonialForm from "../../TestimonialForm";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();

  const { data: testimonial } = await supabase
    .from("testimonials")
    .select("id, quote, name, vts, sca_date, display_order, published")
    .eq("id", id)
    .single();

  if (!testimonial) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/testimonials" className="text-[13px] text-navy/50 hover:text-navy transition no-underline">
          ← Testimonials
        </Link>
        <span className="text-navy/20">/</span>
        <h1 className="font-display font-extrabold text-[22px] text-navy">Edit Testimonial — {testimonial.name}</h1>
      </div>
      <TestimonialForm action={updateTestimonialAction} initial={testimonial} submitLabel="Save Changes" />
    </div>
  );
}
