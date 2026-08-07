import type { SupabaseClient } from "@supabase/supabase-js";
import type { EconLogger } from "./econ-logger";

const n = (v: unknown): number => (v == null ? 0 : Number(v));

export interface CustomerProfile {
  userId: string;
  email: string;
  planType: string | null;
  revenue: number;
  stripeFee: number;
  aiConsultations: number;
  gpReviews: number;
  deepgram: number;
  claude: number;
  daily: number;
  gp: number;
  totalCost: number; // providers + GP + Stripe
  grossProfit: number; // revenue - totalCost
  margin: number | null;
  hasCaseBank: boolean;
  caseBankExpiresAt: string | null;
  subscriptionStart: string | null; // earliest purchase
  aiUsesCount: number;
}

/**
 * All-time per-customer economics: revenue + Stripe fees from revenue_events,
 * provider/GP costs from the consultation ledger, subscription window from
 * user_access, emails from auth. Powers the customer table, customer detail,
 * subscription analytics, alerts and projections.
 */
export async function loadCustomerProfiles(admin: SupabaseClient, logger: EconLogger): Promise<CustomerProfile[]> {
  const [revRes, costRes, accessRes, usersRes] = await Promise.all([
    admin.from("revenue_events").select("user_id, plan_type, amount_gross_gbp, stripe_fee_gbp, created_at"),
    admin.from("consultation_costs").select("doctor_user_id, deepgram_cost_gbp, claude_cost_gbp, daily_cost_gbp, gp_cost_gbp, gp_reviewed"),
    admin.from("user_access").select("user_id, has_case_bank, case_bank_expires_at, ai_uses_count"),
    admin.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  if (revRes.error) logger.error("customers", revRes.error, { where: "revenue_events" });
  if (costRes.error) logger.error("customers", costRes.error, { where: "consultation_costs" });
  if (accessRes.error) logger.error("customers", accessRes.error, { where: "user_access" });
  if (usersRes.error) logger.error("customers", usersRes.error, { where: "auth.listUsers" });

  const revenue = (revRes.data ?? []) as { user_id: string | null; plan_type: string; amount_gross_gbp: number | string; stripe_fee_gbp: number | string; created_at: string }[];
  const costs = (costRes.data ?? []) as { doctor_user_id: string | null; deepgram_cost_gbp: number | string; claude_cost_gbp: number | string; daily_cost_gbp: number | string | null; gp_cost_gbp: number | string; gp_reviewed: boolean }[];
  const access = (accessRes.data ?? []) as { user_id: string; has_case_bank: boolean; case_bank_expires_at: string | null; ai_uses_count: number }[];
  const authUsers = (usersRes.data?.users ?? []) as { id: string; email?: string }[];

  logger.log("customers", "loaded rows", {
    revenue: revenue.length,
    costs: costs.length,
    access: access.length,
    users: authUsers.length,
  });

  const emailMap = new Map(authUsers.map((u) => [u.id, u.email ?? ""]));
  const accessMap = new Map(access.map((a) => [a.user_id, a]));

  const profiles = new Map<string, CustomerProfile>();
  const ensure = (userId: string): CustomerProfile => {
    let p = profiles.get(userId);
    if (!p) {
      const a = accessMap.get(userId);
      p = {
        userId,
        email: emailMap.get(userId) ?? "",
        planType: null,
        revenue: 0,
        stripeFee: 0,
        aiConsultations: 0,
        gpReviews: 0,
        deepgram: 0,
        claude: 0,
        daily: 0,
        gp: 0,
        totalCost: 0,
        grossProfit: 0,
        margin: null,
        hasCaseBank: a?.has_case_bank ?? false,
        caseBankExpiresAt: a?.case_bank_expires_at ?? null,
        subscriptionStart: null,
        aiUsesCount: a?.ai_uses_count ?? 0,
      };
      profiles.set(userId, p);
    }
    return p;
  };

  for (const r of revenue) {
    if (!r.user_id) continue;
    const p = ensure(r.user_id);
    p.revenue += n(r.amount_gross_gbp);
    p.stripeFee += n(r.stripe_fee_gbp);
    p.planType = r.plan_type;
    if (!p.subscriptionStart || r.created_at < p.subscriptionStart) p.subscriptionStart = r.created_at;
  }

  for (const c of costs) {
    if (!c.doctor_user_id) continue;
    const p = ensure(c.doctor_user_id);
    p.aiConsultations += 1;
    if (c.gp_reviewed) p.gpReviews += 1;
    p.deepgram += n(c.deepgram_cost_gbp);
    p.claude += n(c.claude_cost_gbp);
    p.daily += n(c.daily_cost_gbp);
    p.gp += n(c.gp_cost_gbp);
  }

  const list = [...profiles.values()];
  for (const p of list) {
    p.totalCost = p.deepgram + p.claude + p.daily + p.gp + p.stripeFee;
    p.grossProfit = p.revenue - p.totalCost;
    p.margin = p.revenue > 0 ? p.grossProfit / p.revenue : null;
  }

  list.sort((a, b) => b.revenue - a.revenue);
  return list;
}

export interface CustomerProjection {
  customer: CustomerProfile;
  daysRemaining: number;
  projAi: number;
  projGp: number;
  projCost: number;
  projProfit: number;
  projMargin: number | null;
  reasons: string[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Projects each ACTIVE subscription's usage forward to expiry at the current
 * rate, and flags power users (margin < 25%, unusually high AI usage, or
 * projected to become unprofitable). Warnings only — nothing is enforced.
 */
export function buildProjections(customers: CustomerProfile[]): CustomerProjection[] {
  const now = Date.now();
  const avgAiAll = customers.length ? customers.reduce((s, c) => s + c.aiConsultations, 0) / customers.length : 0;
  const out: CustomerProjection[] = [];

  for (const c of customers) {
    if (!c.hasCaseBank || !c.caseBankExpiresAt) continue;
    const expiry = new Date(c.caseBankExpiresAt).getTime();
    if (expiry <= now) continue; // active subscriptions only

    const start = c.subscriptionStart ? new Date(c.subscriptionStart).getTime() : expiry - 120 * DAY_MS;
    const elapsedDays = Math.max(1, (now - start) / DAY_MS);
    const totalDays = Math.max(elapsedDays, (expiry - start) / DAY_MS);
    const daysRemaining = Math.max(0, (expiry - now) / DAY_MS);
    const factor = totalDays / elapsedDays;

    const variableUsage = c.deepgram + c.claude + c.daily + c.gp;
    const projCost = variableUsage * factor + c.stripeFee; // Stripe fee is one-off
    const projProfit = c.revenue - projCost;
    const projMargin = c.revenue > 0 ? projProfit / c.revenue : null;

    const reasons: string[] = [];
    if (projMargin !== null && projMargin < 0.25) reasons.push("Projected margin < 25%");
    if (avgAiAll > 0 && c.aiConsultations > Math.max(5, avgAiAll * 2)) reasons.push("Unusually high AI usage");
    if (projProfit < 0) reasons.push("Projected to become unprofitable");

    out.push({
      customer: c,
      daysRemaining,
      projAi: c.aiConsultations * factor,
      projGp: c.gpReviews * factor,
      projCost,
      projProfit,
      projMargin,
      reasons,
    });
  }
  return out;
}
