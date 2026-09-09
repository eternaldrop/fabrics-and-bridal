import Link from "next/link";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { formatPrice, isOnSale, discountPercent } from "@/lib/format";
import { SaleBadge } from "@/components/catalog/sale-badge";

export interface ProductCardData {
  slug: string;
  name: string;
  price: string;
  salePrice?: string | null;
  category: string | null;
  coverImagePublicId?: string | null;
  type: "fabric" | "outfit";
}

export function ProductCard({ product, span = "normal" }: { product: ProductCardData; span?: "normal" | "wide" }) {
  const href = `/catalog/${product.type === "fabric" ? "fabrics" : "outfits"}/${product.slug}`;
  const onSale = isOnSale(product.price, product.salePrice);

  return (
    <Link
      href={href}
      className={`group block ${span === "wide" ? "md:col-span-2" : ""}`}
    >
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
            sizes="(min-width: 768px) 33vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-taupe text-xs">
            No image yet
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div>
          <p className="font-serif text-lg leading-tight transition-colors duration-150 group-hover:text-blush">{product.name}</p>
          {product.category && (
            <p className="text-xs text-taupe mt-1">{product.category}</p>
          )}
        </div>
        {onSale ? (
          <span className="text-right whitespace-nowrap">
            <span className="text-sm text-blush block">{formatPrice(product.salePrice!)}</span>
            <span className="text-xs text-taupe line-through">{formatPrice(product.price)}</span>
          </span>
        ) : (
          <p className="text-sm text-ink whitespace-nowrap">
            {formatPrice(product.price)}
          </p>
        )}
      </div>
    </Link>
  );
}
