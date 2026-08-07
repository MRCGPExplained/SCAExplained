import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createEconLogger } from "@/lib/econ-logger";
import { loadCustomerProfiles } from "@/lib/economics-data";
import CustomerTable from "./CustomerTable";

export const dynamic = "force-dynamic";

const NAVY = "#333333";

export default async function CustomerProfitabilityPage({ searchParams }: { searchParams: Promise<{ debug?: string }> }) {
  const { debug } = await searchParams;
  const logger = createEconLogger(debug === "1");

  const admin = getSupabaseAdmin();
  if (!admin) return <p style={{ color: NAVY }}>Database not available.</p>;

  const customers = await loadCustomerProfiles(admin, logger);
  logger.log("customers-page", "profiles", { count: customers.length });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-[26px]" style={{ color: NAVY }}>Customer profitability</h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(51,51,51,0.55)" }}>All-time revenue, cost and margin per paying customer.</p>
        </div>
        <Link href={`/admin/economics${debug === "1" ? "?debug=1" : ""}`} className="text-[13px] no-underline" style={{ color: "rgba(51,51,51,0.5)" }}>← Economics</Link>
      </div>
      <CustomerTable customers={customers} debug={debug === "1"} />
    </div>
  );
}
