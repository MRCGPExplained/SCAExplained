import { getSupabaseAdmin } from "@/lib/supabase";
import { EventForm } from "../EventForm";
import { createEvent } from "../../actions";

export const dynamic = "force-dynamic";

async function getDefaults() {
  const supabase = getSupabaseAdmin();
  const fallback = {
    webinarTitle: "How To Get A Clear Pass",
    webinarCapacity: 200,
    intensiveTitle: "SCA Intensive",
    activeCapacity: 2,
    activePricePounds: 200,
    observerCapacity: 8,
    observerPricePounds: 50,
  };
  if (!supabase) return fallback;

  const { data } = await supabase.from("settings").select("key, value");
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));

  return {
    webinarTitle: map.DEFAULT_WEBINAR_TITLE ?? "How To Get A Clear Pass",
    webinarCapacity: parseInt(map.DEFAULT_WEBINAR_CAPACITY ?? "200", 10),
    intensiveTitle: map.DEFAULT_INTENSIVE_TITLE ?? "SCA Intensive",
    activeCapacity: parseInt(map.DEFAULT_INTENSIVE_ACTIVE_CAPACITY ?? "2", 10),
    activePricePounds: parseInt(map.DEFAULT_INTENSIVE_ACTIVE_PRICE ?? "20000", 10) / 100,
    observerCapacity: parseInt(map.DEFAULT_INTENSIVE_OBSERVER_CAPACITY ?? "8", 10),
    observerPricePounds: parseInt(map.DEFAULT_INTENSIVE_OBSERVER_PRICE ?? "5000", 10) / 100,
  };
}

export default async function NewEventPage() {
  const defaults = await getDefaults();

  return (
    <div>
      <div className="mb-8">
        <a
          href="/admin"
          className="text-[12px] text-navy/40 hover:text-navy/70 transition no-underline"
        >
          ← Events
        </a>
        <h1 className="font-display font-extrabold text-[24px] text-navy mt-2">
          New event
        </h1>
      </div>
      <EventForm mode="create" action={createEvent} defaults={defaults} />
    </div>
  );
}
