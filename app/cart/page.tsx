"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/ui/container";
import { Button, LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <Container className="py-16 max-w-lg text-center">
        <Reveal>
          <h1 className="font-serif text-3xl mb-3">Your cart is empty</h1>
          <p className="text-taupe mb-8">
            Browse the catalog and add fabrics or outfits you love.
          </p>
          <LinkButton href="/catalog/fabrics" variant="primary">
            Shop fabrics
          </LinkButton>
        </Reveal>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-16">
      <Reveal>
        <h1 className="font-serif text-3xl md:text-4xl mb-10">Your cart</h1>
      </Reveal>

      <div className="grid md:grid-cols-[2fr_1fr] gap-10 md:gap-16">
        <div className="divide-y divide-taupe/20 border-t border-b border-taupe/20">
          {items.map((item, i) => (
            <div
              key={item.key}
              className="reveal is-visible flex gap-4 py-5"
              style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
            >
              <div className="relative w-20 h-24 shrink-0 bg-taupe/10 border border-taupe/20">
                {item.coverImagePublicId && (
                  <Image
                    src={cloudinaryUrl(item.coverImagePublicId, { width: 160 })}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/catalog/${item.type === "fabric" ? "fabrics" : "outfits"}/${item.slug}`}
                  className="link-underline font-serif text-lg hover:text-blush transition-colors"
                >
                  {item.name}
                </Link>
                {item.variant && <p className="text-xs text-taupe mt-1">{item.variant}</p>}
                <p className="text-sm text-ink mt-1">{formatPrice(item.price)}</p>

                <div className="flex items-center gap-3 mt-3">
                  <label htmlFor={`qty-${item.key}`} className="text-xs text-taupe">
                    Qty
                  </label>
                  <input
                    id={`qty-${item.key}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.key, Number(e.target.value))}
                    className="w-16 bg-cream border border-taupe/40 rounded-brand px-2 py-1 text-sm transition-colors focus:outline-none focus:border-ink"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="text-xs text-blush hover:underline ml-2 transition-transform duration-150 active:scale-90"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p className="text-sm text-ink whitespace-nowrap">
                {formatPrice(Number(item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <Reveal delay={150} className="border border-taupe/20 rounded-brand p-6 h-fit">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-taupe">Subtotal</span>
            <span className="text-ink">{formatPrice(subtotal)}</span>
          </div>
          <p className="text-xs text-taupe mb-6">
            Shipping and any tailoring add-ons are calculated at checkout.
          </p>
          <Button variant="primary" className="w-full" disabled>
            Checkout
          </Button>
          <p className="text-xs text-taupe mt-3">
            Payment isn&apos;t connected yet — checkout arrives in Phase 2.
            Your cart is saved on this device in the meantime.
          </p>
        </Reveal>
      </div>
    </Container>
  );
}
