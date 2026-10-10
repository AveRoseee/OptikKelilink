"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({
  id,
  name,
  compact = false,
}: {
  id: string;
  name: string;
  compact?: boolean;
}) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(event) => {
        if (!window.confirm(`Hapus produk “${name}” secara permanen?`))
          event.preventDefault();
      }}
    >
      <input type="hidden" name="productId" value={id} />
      <button
        className={compact ? "admin-delete-icon" : "admin-button danger"}
        aria-label={`Hapus ${name}`}
        type="submit"
      >
        <Trash2 size={15} />
        {!compact && "Hapus"}
      </button>
    </form>
  );
}
