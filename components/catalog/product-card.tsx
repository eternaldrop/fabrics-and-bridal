import Link from "next/link";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { formatPrice } from "@/lib/format";

export interface ProductCardData {
  slug: string;
  name: string;
  price: string;
  category: string | null;
  coverImagePublicId?: string | null;
  type: "fabric" | "outfit";
}

export function ProductCard({ product, span = "normal" }: { product: ProductCardData; span?: "normal" | "wide" }) {
  const href = `/catalog/${product.type === "fabric" ? "fabrics" : "outfits"}/${product.slug}`;

  return (
    <Link
      href={href}
      className={`group block ${span === "wide" ? "md:col-span-2" : ""}`}
    >
      <div className="relative w-full aspect-[4/5] bg-taupe/10 border border-taupe/20 overflow-hidden">
        {product.coverImagePublicId ? (
          <Image
            src={cloudinaryUrl(product.coverImagePublicId, { width: 800 })}
            alt={product.name}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
          <p className="font-serif text-lg leading-tight">{product.name}</p>
          {product.category && (
            <p className="text-xs text-taupe mt-1">{product.category}</p>
          )}
        </div>
        <p className="text-sm text-ink whitespace-nowrap">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
