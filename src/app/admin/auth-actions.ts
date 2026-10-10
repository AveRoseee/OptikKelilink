"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin-auth";

export type AuthFormState = { error?: string };

export async function signInAdmin(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Masukkan email dan kata sandi." };

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user)
      return { error: "Email atau kata sandi tidak sesuai." };
    if (!isAdminEmail(data.user.email)) {
      await supabase.auth.signOut();
      return { error: "Akun ini belum diizinkan sebagai admin." };
    }
  } catch {
    return {
      error: "Supabase Auth belum dikonfigurasi. Periksa environment project.",
    };
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
