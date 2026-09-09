"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { formatPrice } from "@/lib/format";
import { SalePriceControl } from "@/components/admin/sale-price-control";

export interface AdminProductRow {
  id: string;
  name: string;
  type: "fabric" | "outfit";
  category: string | null;
  color?: string | null;
  material?: string | null;
  price: string;
  salePrice?: string | null;
  stockQuantity: number | null;
  coverImagePublicId?: string | null;
}

export function ProductList({ items }: { items: AdminProductRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Remove "${name}" from the catalog? This can't be undone.`)) return;
    setDeletingId(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-taupe/40 rounded-brand p-10 text-center">
        <p className="text-taupe">No items yet — use the button above to add one.</p>
      </div>
    );
  }

  return (
    <div className="border border-taupe/20 rounded-brand overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[820px]">
        <thead>
          <tr className="text-left text-xs text-taupe uppercase tracking-wide border-b border-taupe/20">
            <th className="py-3 pl-4 pr-4 font-normal">Item</th>
            <th className="py-3 pr-4 font-normal">Category</th>
            <th className="py-3 pr-4 font-normal">Color / Material</th>
            <th className="py-3 pr-4 font-normal">Price</th>
            <th className="py-3 pr-4 font-normal">Stock</th>
            <th className="py-3 pr-4 font-normal">Sale</th>
            <th className="py-3 pr-4 font-normal text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-taupe/10 last:border-b-0 align-middle transition-colors duration-150 hover:bg-taupe/5"
            >
              <td className="py-3 pl-4 pr-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 bg-taupe/10 border border-taupe/20 shrink-0 overflow-hidden rounded-brand">
                    {item.coverImagePublicId && (
                      <Image
                        src={cloudinaryUrl(item.coverImagePublicId, { width: 120 })}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="font-serif">{item.name}</p>
                </div>
              </td>
              <td className="py-3 pr-4 text-taupe">{item.category ?? "—"}</td>
              <td className="py-3 pr-4 text-taupe">
                {[item.color, item.material].filter(Boolean).join(" · ") || "—"}
              </td>
              <td className="py-3 pr-4 whitespace-nowrap">{formatPrice(item.price)}</td>
              <td className="py-3 pr-4 whitespace-nowrap text-taupe">
                {item.stockQuantity != null ? item.stockQuantity : "Made to order"}
              </td>
              <td className="py-3 pr-4">
                <SalePriceControl productId={item.id} price={item.price} salePrice={item.salePrice ?? null} />
              </td>
              <td className="py-3 pr-4 text-right">
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={deletingId === item.id}
                  className="text-sm text-blush hover:underline transition-transform duration-150 active:scale-90 disabled:opacity-50 disabled:active:scale-100"
                >
                  {deletingId === item.id ? "Removing..." : "Remove"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
