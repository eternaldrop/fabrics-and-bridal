"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function CartLink() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="text-sm text-ink hover:text-blush flex items-center gap-1.5">
      Cart
      {itemCount > 0 && (
        <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs bg-rose text-ink rounded-full">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
