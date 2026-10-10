import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function allowedAdminEmails() {
  return new Set(
    [process.env.ADMIN_EMAILS, process.env.ADMIN_EMAIL]
      .flatMap((value) => value?.split(",") ?? [])
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminEmail(email: string | undefined) {
  return Boolean(email && allowedAdminEmails().has(email.toLowerCase()));
}

export async function requireAdmin() {
  if (allowedAdminEmails().size === 0) {
    redirect("/admin/login?error=admin-config");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || !isAdminEmail(data.user.email)) {
    redirect("/admin/login");
  }

  return data.user;
}
