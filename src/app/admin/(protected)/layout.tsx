import { Suspense } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export const instant = false;

async function ProtectedFrame({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <AdminShell email={user.email ?? "Admin"}>{children}</AdminShell>;
}

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="admin-loading">
          <span className="admin-spinner" />
          Memuat dashboard admin...
        </div>
      }
    >
      <ProtectedFrame>{children}</ProtectedFrame>
    </Suspense>
  );
}
