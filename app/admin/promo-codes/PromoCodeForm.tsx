"use client";

import { useActionState } from "react";
import { savePromoCodeSettingsAction } from "../actions";

export function PromoCodeForm({ values }: { values: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(savePromoCodeSettingsAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-[580px]">
      <div className="rounded-2xl border border-navy/10 bg-white p-6 flex flex-col gap-5">

        <div>
          <label className="block text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55 mb-1.5">
            Promo Code
          </label>
          <input
            name="PROMO_CODE_VALUE"
            type="text"
            defaultValue={values.PROMO_CODE_VALUE ?? ""}
            placeholder="e.g. SCAFREE2026"
            className="w-full rounded-lg px-3 py-2.5 text-[14px] border border-navy/20 outline-none focus:border-navy/50 uppercase"
          />
          <p className="text-[11.5px] text-navy/40 mt-1">Changing the code automatically resets the usage count to 0.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            name="PROMO_CODE_ACTIVE"
            type="checkbox"
            value="true"
            defaultChecked={values.PROMO_CODE_ACTIVE === "true"}
            id="promo_active"
            className="rounded"
          />
          <label htmlFor="promo_active" className="text-[13px] text-navy cursor-pointer">
            Active — code can be redeemed
          </label>
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55 mb-1.5">
            Expiry Date
          </label>
          <input
            name="PROMO_CODE_EXPIRY"
            type="date"
            defaultValue={values.PROMO_CODE_EXPIRY ?? ""}
            className="rounded-lg px-3 py-2.5 text-[14px] border border-navy/20 outline-none focus:border-navy/50"
          />
          <p className="text-[11.5px] text-navy/40 mt-1">Code stops working after this date regardless of active toggle.</p>
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55 mb-1.5">
            Max Uses
          </label>
          <input
            name="PROMO_CODE_MAX_USES"
            type="number"
            min={1}
            defaultValue={values.PROMO_CODE_MAX_USES ?? "10"}
            className="w-28 rounded-lg px-3 py-2.5 text-[14px] border border-navy/20 outline-none focus:border-navy/50"
          />
        </div>

        <div>
          <p className="text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55 mb-1">Uses So Far</p>
          <p className="text-[20px] font-display font-bold text-navy">{values.PROMO_CODE_USES ?? "0"}</p>
          <p className="text-[11.5px] text-navy/40">Read only. Resets automatically when the code value changes.</p>
        </div>

      </div>

      {state && "error" in state && state.error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-[13px] text-red-700">{state.error}</p>
      )}
      {state && "ok" in state && state.ok && (
        <p className="text-[13px] text-green-700 font-semibold">Settings saved.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-navy text-white text-[14px] font-bold px-6 py-3 rounded-xl hover:bg-[#F6D44B] hover:text-[#333333] transition disabled:opacity-60 self-start"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
