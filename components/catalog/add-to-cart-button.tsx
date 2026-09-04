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

export function AddToCartButton({ product, variant }: { product: AddToCartProduct; variant?: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      key: variant ? `${product.productId}:${variant}` : product.productId,
      productId: product.productId,
      slug: product.slug,
      name: product.name,
      price: product.price,
      type: product.type,
      coverImagePublicId: product.coverImagePublicId,
      variant,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Button variant="primary" onClick={handleClick}>
      {added ? "Added to cart" : "Add to cart"}
    </Button>
  );
}
