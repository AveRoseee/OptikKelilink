import Link from "next/link";
import { Glasses, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/app/admin/login/login-form";

export const metadata = { title: "Masuk Admin | Kelilink" };

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <Link className="admin-login-brand" href="/">
          <span>
            <Glasses size={19} />
          </span>
          kelilink
        </Link>
        <div className="admin-login-title">
          <span>
            <ShieldCheck size={18} />
          </span>
          <div>
            <p>ADMINISTRATOR</p>
            <h1>Selamat datang</h1>
          </div>
        </div>
        <p className="admin-login-description">
          Masuk untuk mengelola katalog produk Kelilink.
        </p>
        <AdminLoginForm />
        <Link className="admin-login-back" href="/">
          Kembali ke halaman katalog
        </Link>
      </div>
      <p className="admin-login-caption">KELILINK · ADMIN CONSOLE</p>
    </main>
  );
}
