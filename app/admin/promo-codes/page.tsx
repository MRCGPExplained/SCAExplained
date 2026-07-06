import { getSupabaseAdmin } from "@/lib/supabase";
import { PromoCodeForm } from "./PromoCodeForm";

export const dynamic = "force-dynamic";

const PROMO_KEYS = ["PROMO_CODE_VALUE", "PROMO_CODE_ACTIVE", "PROMO_CODE_EXPIRY", "PROMO_CODE_MAX_USES", "PROMO_CODE_USES"];
const DEFAULTS: Record<string, string> = {
  PROMO_CODE_VALUE: "",
  PROMO_CODE_ACTIVE: "false",
  PROMO_CODE_EXPIRY: "",
  PROMO_CODE_MAX_USES: "10",
  PROMO_CODE_USES: "0",
};

export default async function PromoCodesPage() {
  const supabase = getSupabaseAdmin();
  const values = { ...DEFAULTS };

  if (supabase) {
    const { data } = await supabase.from("settings").select("key, value").in("key", PROMO_KEYS);
    (data ?? []).forEach((r: { key: string; value: string }) => { values[r.key] = r.value; });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-[26px] text-navy">Promo Codes</h1>
        <p className="text-[13px] text-navy/50 mt-0.5">
          One active code at a time. Changes take effect immediately.
        </p>
      </div>
      <PromoCodeForm values={values} />
    </div>
  );
}
