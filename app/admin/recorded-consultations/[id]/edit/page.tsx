import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { updateRecordedConsultationAction } from "../../../../actions";
import ConsultationForm from "../../ConsultationForm";

export const dynamic = "force-dynamic";

export default async function EditRecordedConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();

  const { data: consultation } = await supabase
    .from("recorded_consultations")
    .select("id, title, description, bunny_video_id, thumbnail_url, duration_minutes, display_order, published")
    .eq("id", id)
    .single();

  if (!consultation) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/recorded-consultations" className="text-[13px] text-navy/50 hover:text-navy transition no-underline">
          ← Recorded Consultations
        </Link>
        <span className="text-navy/20">/</span>
        <h1 className="font-display font-extrabold text-[22px] text-navy">Edit — {consultation.title}</h1>
      </div>
      <ConsultationForm action={updateRecordedConsultationAction} initial={consultation} submitLabel="Save Changes" />
    </div>
  );
}
