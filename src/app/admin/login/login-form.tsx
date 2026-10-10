"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { signInAdmin, type AuthFormState } from "@/app/admin/auth-actions";

const initialState: AuthFormState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(
    signInAdmin,
    initialState,
  );

  return (
    <form className="admin-login-form" action={formAction}>
      <label>
        Email admin
        <span>
          <Mail size={15} />
          <input
            type="email"
            name="email"
            autoComplete="username"
            required
            placeholder="nama@domain.com"
          />
        </span>
      </label>
      <label>
        Kata sandi
        <span>
          <LockKeyhole size={15} />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Masukkan kata sandi"
          />
        </span>
      </label>
      {state.error && (
        <p className="admin-form-error" role="alert">
          {state.error}
        </p>
      )}
      <button
        className="admin-button primary full"
        type="submit"
        disabled={pending}
      >
        {pending ? "Memeriksa..." : "Masuk ke Dashboard"}
      </button>
    </form>
  );
}
