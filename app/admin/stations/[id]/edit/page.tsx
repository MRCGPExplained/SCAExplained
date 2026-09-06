import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Station } from "@/lib/case-bank-types";
import type { CaseRule } from "@/lib/case-rules";
import { StationForm } from "../../StationForm";
import CaseRules from "../../CaseRules";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStationPage({ params }: Props) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: station } = await supabase
    ?.from("stations")
    .select("*")
    .eq("id", id)
    .single<Station>() ?? { data: null };

  if (!station) notFound();

  // Retired rules are listed too, so a rule can be brought back rather than
  // rewritten from memory. Includes inactive, unlike the grading pipeline.
  const { data: caseRules } = await supabase
    ?.from("station_case_rules")
    .select("id, name, trigger_question, fires_when, domain, bound, grade, comment_basis, sort_order, active")
    .eq("station_id", id)
    .order("sort_order", { ascending: true })
    .returns<CaseRule[]>() ?? { data: [] };

  return (
    <div>
      <h1 className="font-display font-bold text-[22px] text-navy mb-1">
        Edit Station #{station.number}
      </h1>
      <p className="text-[13px] text-navy/50 mb-6">{station.title}</p>
      {/* Outside StationForm on purpose: rules save on their own actions, and
          nesting a form inside that one would break both. */}
      <StationForm station={station} />
      <CaseRules stationId={id} rules={caseRules ?? []} />
    </div>
  );
}
