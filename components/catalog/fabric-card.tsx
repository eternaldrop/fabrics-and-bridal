import Link from "next/link";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { formatPrice } from "@/lib/format";
import { getSwatchColor } from "@/lib/color-swatch";

export interface FabricCardData {
  slug: string;
  name: string;
  material: string | null;
  color: string | null;
  price: string;
  coverImagePublicId?: string | null;
}

export function FabricCard({ product, span = "normal" }: { product: FabricCardData; span?: "normal" | "wide" }) {
  const swatch = getSwatchColor(product.color);

  return (
    <Link href={`/catalog/fabrics/${product.slug}`} className={`group block ${span === "wide" ? "md:col-span-2" : ""}`}>
      <div className="relative w-full aspect-[4/5] bg-taupe/10 border border-taupe/20 overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
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
          <p className="text-sm text-ink whitespace-nowrap">{formatPrice(product.price)} / yd</p>
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
