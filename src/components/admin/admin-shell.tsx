"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Box,
  ChevronDown,
  ExternalLink,
  Glasses,
  LayoutDashboard,
  LogOut,
  Menu,
  PackagePlus,
  X,
} from "lucide-react";
import { signOutAdmin } from "@/app/admin/auth-actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/produk", label: "Produk", icon: Box, exact: false },
  {
    href: "/admin/produk/tambah",
    label: "Tambah produk",
    icon: PackagePlus,
    exact: true,
  },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="admin-layout">
      <button
        className="admin-mobile-menu"
        type="button"
        aria-label="Buka menu"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>
      <aside className={`admin-sidebar${open ? " open" : ""}`}>
        <Link className="admin-brand" href="/admin">
          <span>
            <Glasses size={18} />
          </span>
          <strong>kelilink</strong>
          <small>ADMIN</small>
        </Link>
        <p className="admin-nav-caption">MENU UTAMA</p>
        <nav>
          {links.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`admin-nav-link${(exact ? path === href : path === href || path.startsWith(`${href}/`)) ? " active" : ""}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/katalog" target="_blank">
            <ExternalLink size={15} />
            Lihat katalog
          </Link>
          <form action={signOutAdmin}>
            <button type="submit">
              <LogOut size={15} />
              Keluar
            </button>
          </form>
        </div>
      </aside>
      {open && (
        <button
          className="admin-overlay"
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-crumb">
            <span>Admin</span>
            <ChevronDown size={13} />
            <strong>
              {path === "/admin"
                ? "Dashboard"
                : path.includes("tambah")
                  ? "Tambah Produk"
                  : "Produk"}
            </strong>
          </div>
          <div className="admin-user">
            <span className="admin-avatar">
              {email.slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{email}</strong>
              <small>Administrator</small>
            </span>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
