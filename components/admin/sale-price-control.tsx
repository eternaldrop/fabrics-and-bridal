"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label, Input } from "@/components/ui/input";
import { formatPrice, isOnSale, discountPercent } from "@/lib/format";

export function SalePriceControl({
  productId,
  price,
  salePrice,
}: {
  productId: string;
  price: string;
  salePrice: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onSale = isOnSale(price, salePrice);

  async function save(nextSalePrice: number | null) {
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salePrice: nextSalePrice }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Couldn't save. Please try again.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = Number(new FormData(e.currentTarget).get("salePrice"));
    if (!value || value <= 0) {
      setError("Enter a sale price.");
      return;
    }
    if (value >= Number(price)) {
      setError("The sale price must be lower than the regular price.");
      return;
    }
    save(value);
  }

  return (
    <>
      {onSale ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex flex-col items-start text-left"
        >
          <span className="text-xs bg-blush text-cream px-2 py-0.5 rounded-brand">
            -{discountPercent(price, salePrice!)}% sale
          </span>
          <span className="text-xs text-taupe mt-1 hover:text-ink transition-colors">Edit</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm text-taupe hover:text-ink hover:underline transition-colors"
        >
          Put on sale
        </button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={onSale ? "Edit sale price" : "Put this item on sale"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-taupe">Regular price: {formatPrice(price)}</p>
          <div>
            <Label htmlFor="salePrice">Sale price</Label>
            <Input
              id="salePrice"
              name="salePrice"
              type="number"
              step="0.01"
              min="0"
              defaultValue={onSale ? salePrice ?? undefined : undefined}
              required
            />
          </div>
          {error && <p className="text-sm text-blush">{error}</p>}
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
            {onSale && (
              <Button type="button" variant="ghost" disabled={submitting} onClick={() => save(null)}>
                Remove from sale
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}
