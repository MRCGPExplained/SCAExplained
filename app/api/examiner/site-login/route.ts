import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const passcode = String(formData.get("passcode") ?? "").trim();
  const next = String(formData.get("next") ?? "/case-bank");

  if (!email || !passcode) {
    return NextResponse.redirect(new URL(`/case-bank/login?examiner_error=missing`, req.url), 303);
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.redirect(new URL(`/case-bank/login?examiner_error=server`, req.url), 303);
  }

  // Check examiner credentials
  const { data: examiner } = await admin
    .from("examiners")
    .select("id, name, email")
    .eq("email", email)
    .eq("passcode", passcode)
    .single<{ id: string; name: string; email: string }>();

  if (!examiner) {
    return NextResponse.redirect(new URL(`/case-bank/login?examiner_error=incorrect`, req.url), 303);
  }

  // Get or create Supabase auth user for this email.
  // The admin API has no getUserByEmail; try creating first and fall back to
  // listUsers if the email is already registered.
  let userId: string;

  const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { display_name: examiner.name },
  });

  if (createErr) {
    // User probably already exists — find them by email via listUsers
    const { data: usersPage } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const existing = (usersPage?.users ?? []).find(
      (u: { email?: string; id: string }) => u.email?.toLowerCase() === email
    );
    if (!existing) {
      return NextResponse.redirect(new URL(`/case-bank/login?examiner_error=server`, req.url), 303);
    }
    userId = existing.id;
  } else {
    if (!newUser?.user) {
      return NextResponse.redirect(new URL(`/case-bank/login?examiner_error=server`, req.url), 303);
    }
    userId = newUser.user.id;

    // Create user profile for newly created accounts
    const nameParts = examiner.name.trim().split(" ");
    const initials = nameParts.map((p: string) => p[0]).join("").toUpperCase().slice(0, 2);
    await admin.from("user_profiles").upsert({
      id: userId,
      display_name: examiner.name,
      initials,
      beta: false,
    });
  }

  // Ensure they have indefinite case bank access
  await admin.from("user_access").upsert({
    user_id: userId,
    has_programme: true,
    expires_at: "2099-12-31T23:59:59Z",
    renewal_reminder_sent_at: null,
  });

  // Generate a magic link to establish their Supabase session
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${siteUrl}${next}` },
  });

  if (linkErr || !linkData?.properties?.action_link) {
    return NextResponse.redirect(new URL(`/case-bank/login?examiner_error=server`, req.url), 303);
  }

  return NextResponse.redirect(linkData.properties.action_link, 303);
}
