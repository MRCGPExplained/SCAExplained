import Link from "next/link";
import { createRecordedConsultationAction } from "../../actions";
import ConsultationForm from "../ConsultationForm";

export default function NewRecordedConsultationPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/recorded-consultations" className="text-[13px] text-navy/50 hover:text-navy transition no-underline">
          ← Recorded Consultations
        </Link>
        <span className="text-navy/20">/</span>
        <h1 className="font-display font-extrabold text-[22px] text-navy">Add Consultation</h1>
      </div>
      <ConsultationForm action={createRecordedConsultationAction} submitLabel="Create Consultation" />
    </div>
  );
}
