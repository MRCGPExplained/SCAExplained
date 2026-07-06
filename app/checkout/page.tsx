import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { CheckoutClient } from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/checkout");

  const { data: access } = await supabase
    .from("user_access")
    .select("has_programme, expires_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const hasProgramme = !!(access?.has_programme && access.expires_at && new Date(access.expires_at) > new Date());
  if (hasProgramme) redirect("/dashboard");

  return <CheckoutClient />;
}
