import Link from "next/link";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { formatPrice, isOnSale, discountPercent } from "@/lib/format";
import { getSwatchColor } from "@/lib/color-swatch";
import { SaleBadge } from "@/components/catalog/sale-badge";

export interface OutfitCardData {
  slug: string;
  name: string;
  material: string | null;
  color: string | null;
  price: string;
  salePrice?: string | null;
  coverImagePublicId?: string | null;
}

export function OutfitCard({ product, span = "normal" }: { product: OutfitCardData; span?: "normal" | "wide" }) {
  const swatch = getSwatchColor(product.color);
  const onSale = isOnSale(product.price, product.salePrice);

  return (
    <Link href={`/catalog/outfits/${product.slug}`} className={`group block ${span === "wide" ? "md:col-span-2" : ""}`}>
      <div className="relative w-full aspect-[4/5] bg-taupe/10 border border-taupe/20 overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
        {onSale && (
          <SaleBadge percent={discountPercent(product.price, product.salePrice!)} className="absolute top-2 left-2 z-10" />
        )}
        {product.coverImagePublicId ? (
          <Image
            src={cloudinaryUrl(product.coverImagePublicId, { width: 800 })}
            alt={product.name}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
            sizes="(min-width: 768px) 30vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-taupe text-xs">
            No image yet
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-serif text-lg leading-tight transition-colors duration-150 group-hover:text-blush">{product.name}</p>
          {onSale ? (
            <span className="text-right whitespace-nowrap">
              <span className="text-sm text-blush">{formatPrice(product.salePrice!)}</span>{" "}
              <span className="text-xs text-taupe line-through">{formatPrice(product.price)}</span>
            </span>
          ) : (
            <p className="text-sm text-ink whitespace-nowrap">{formatPrice(product.price)}</p>
          )}
        </div>
        {(product.material || product.color) && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-taupe">
            {swatch && (
              <span
                className="inline-block w-2.5 h-2.5 rounded-full border border-taupe/30 shrink-0"
                style={{ backgroundColor: swatch }}
              />
            )}
            <span>
              {[product.material, product.color].filter(Boolean).join(" · ")}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
