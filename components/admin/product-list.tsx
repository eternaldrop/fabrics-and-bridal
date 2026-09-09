"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { formatPrice } from "@/lib/format";

export interface AdminProductRow {
  id: string;
  name: string;
  type: "fabric" | "outfit";
  category: string | null;
  price: string;
  stockQuantity: number | null;
  coverImagePublicId?: string | null;
}

export function ProductList({ items }: { items: AdminProductRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-taupe/40 rounded-brand p-8 text-center">
        <p className="text-taupe">No catalog items yet — add one above.</p>
      </div>
    );
  }

  return (
    <div className="border border-taupe/20 rounded-brand divide-y divide-taupe/20 overflow-hidden">
      {items.map((item) => (
        <div key={item.id} className="group flex flex-wrap items-center gap-x-4 gap-y-2 py-4 px-4 transition-colors duration-150 hover:bg-taupe/5">
          <div className="relative w-14 h-16 bg-taupe/10 border border-taupe/20 shrink-0 overflow-hidden">
            {item.coverImagePublicId && (
              <Image
                src={cloudinaryUrl(item.coverImagePublicId, { width: 120 })}
                alt={item.name}
                fill
                sizes="56px"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            )}
          </div>
          <div className="flex-1 min-w-[140px]">
            <p className="font-serif">{item.name}</p>
            <p className="text-xs text-taupe">
              {item.type === "fabric" ? "Fabric" : "Outfit"}
              {item.category ? ` · ${item.category}` : ""}
            </p>
          </div>
          <p className="text-sm sm:w-24 sm:text-right">{formatPrice(item.price)}</p>
          <p className="text-sm sm:w-32 sm:text-right text-taupe">
            {item.stockQuantity != null ? `${item.stockQuantity} in stock` : "Made to order"}
          </p>
          <button
            type="button"
            onClick={() => handleDelete(item.id)}
            disabled={deletingId === item.id}
            className="text-sm text-blush hover:underline transition-transform duration-150 active:scale-90 disabled:opacity-50 disabled:active:scale-100"
          >
            {deletingId === item.id ? "Removing..." : "Remove"}
          </button>
        </div>
      ))}
    </div>
  );
}
