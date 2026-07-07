import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { RecordedConsultationTable } from "./RecordedConsultationTable";

export const dynamic = "force-dynamic";

export default async function AdminRecordedConsultationsPage() {
  const supabase = getSupabaseAdmin();
  const { data: consultations } = supabase
    ? await supabase
        .from("recorded_consultations")
        .select("id, title, description, bunny_video_id, duration_minutes, display_order, published")
        .order("display_order", { ascending: true })
    : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[26px] text-navy">Recorded Consultations</h1>
          <p className="text-[13px] text-navy/50 mt-0.5">
            {consultations?.length ?? 0} videos · drag rows to reorder
          </p>
        </div>
        <Link
          href="/admin/recorded-consultations/new"
          className="bg-navy text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#F6D44B] hover:text-[#333333] transition no-underline"
        >
          + Add Consultation
        </Link>
      </div>

      {!consultations || consultations.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-8 py-12 text-center">
          <p className="text-[14px] text-navy/50 mb-4">No recorded consultations yet.</p>
          <Link href="/admin/recorded-consultations/new" className="text-[13px] font-semibold text-navy underline">
            Add your first consultation
          </Link>
        </div>
      ) : (
        <RecordedConsultationTable initial={consultations} />
      )}
    </div>
  );
}
