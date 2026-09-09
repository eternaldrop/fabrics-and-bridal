"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/catalog/add-to-cart-button";

interface AddToCartProduct {
  productId: string;
  slug: string;
  name: string;
  price: string;
  type: "fabric" | "outfit";
  coverImagePublicId?: string;
}

export function OutfitPurchasePanel({
  product,
  sizes,
}: {
  product: AddToCartProduct;
  sizes: string[];
}) {
  const [size, setSize] = useState<string | undefined>(sizes[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-5">
      {sizes.length > 0 && (
        <div>
          <p className="text-sm text-taupe mb-2">Size</p>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`text-sm border rounded-brand px-3 py-1.5 transition-all duration-150 active:scale-90 ${
                  size === s ? "border-ink bg-ink text-cream scale-105" : "border-taupe/40 hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="quantity" className="text-sm text-taupe">
            Quantity
          </label>
          <div className="flex items-center border border-taupe/40 rounded-brand">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center text-ink transition-colors duration-150 hover:bg-taupe/10 active:scale-90"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-12 text-center bg-transparent text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 flex items-center justify-center text-ink transition-colors duration-150 hover:bg-taupe/10 active:scale-90"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <AddToCartButton product={product} variant={size} quantity={quantity} />
      </div>
    </div>
  );
}
