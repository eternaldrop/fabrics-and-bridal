"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

interface AddToCartProduct {
  productId: string;
  slug: string;
  name: string;
  price: string;
  type: "fabric" | "outfit";
  coverImagePublicId?: string;
}

export function AddToCartButton({
  product,
  variant,
  quantity = 1,
}: {
  product: AddToCartProduct;
  variant?: string;
  quantity?: number;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(
      {
        key: variant ? `${product.productId}:${variant}` : product.productId,
        productId: product.productId,
        slug: product.slug,
        name: product.name,
        price: product.price,
        type: product.type,
        coverImagePublicId: product.coverImagePublicId,
        variant,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Button variant="primary" onClick={handleClick} className={added ? "animate-bounce-pop" : ""}>
      <span className="inline-flex items-center gap-1.5">
        {added && (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {added ? "Added to cart" : "Add to cart"}
      </span>
    </Button>
  );
}
