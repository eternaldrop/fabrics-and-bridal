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

export function YardageAddToCart({ product }: { product: AddToCartProduct }) {
  const [yards, setYards] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3">
        <label htmlFor="yardage" className="text-sm text-taupe">
          Yards
        </label>
        <div className="flex items-center border border-taupe/40 rounded-brand">
          <button
            type="button"
            onClick={() => setYards((y) => Math.max(1, y - 1))}
            className="w-9 h-9 flex items-center justify-center text-ink transition-colors duration-150 hover:bg-taupe/10 active:scale-90"
            aria-label="Decrease yards"
          >
            −
          </button>
          <input
            id="yardage"
            type="number"
            min={1}
            value={yards}
            onChange={(e) => setYards(Math.max(1, Number(e.target.value) || 1))}
            className="w-12 text-center bg-transparent text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setYards((y) => y + 1)}
            className="w-9 h-9 flex items-center justify-center text-ink transition-colors duration-150 hover:bg-taupe/10 active:scale-90"
            aria-label="Increase yards"
          >
            +
          </button>
        </div>
      </div>

      <AddToCartButton product={product} quantity={yards} />
    </div>
  );
}
