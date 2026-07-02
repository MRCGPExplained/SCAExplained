import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Station } from "@/lib/case-bank-types";
import { StationForm } from "../../StationForm";

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

  return (
    <div>
      <h1 className="font-display font-bold text-[22px] text-navy mb-1">
        Edit Station #{station.number}
      </h1>
      <p className="text-[13px] text-navy/50 mb-6">{station.title}</p>
      <StationForm station={station} />
    </div>
  );
}
