import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { TestimonialTable } from "./TestimonialTable";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const supabase = getSupabaseAdmin();
  const { data: testimonials } = supabase
    ? await supabase
        .from("testimonials")
        .select("id, quote, name, vts, sca_date, display_order, published")
        .order("display_order", { ascending: true })
    : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-navy">Testimonials</h1>
          <p className="text-[13px] text-navy/50 mt-0.5">
            {testimonials?.length ?? 0} testimonials · drag rows to reorder · first 3 shown on the homepage
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="bg-navy text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#F6D44B] hover:text-[#333333] transition no-underline"
        >
          + Add Testimonial
        </Link>
      </div>

      {!testimonials || testimonials.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
          <p className="text-[14px] text-navy/50 mb-4">No testimonials yet.</p>
          <Link href="/admin/testimonials/new" className="text-[13px] font-semibold text-navy underline">
            Add your first testimonial
          </Link>
        </div>
      ) : (
        <TestimonialTable testimonials={testimonials} />
      )}
    </div>
  );
}
