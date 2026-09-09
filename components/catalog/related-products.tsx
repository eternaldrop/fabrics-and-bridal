import Link from "next/link";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { formatPrice } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";

export interface RelatedProduct {
  slug: string;
  name: string;
  price: string;
  type: "fabric" | "outfit";
  coverImagePublicId?: string;
}

export function RelatedProducts({ title = "Goes well with", items }: { title?: string; items: RelatedProduct[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-taupe/20">
      <Reveal>
        <h2 className="font-serif text-2xl mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/catalog/${item.type === "fabric" ? "fabrics" : "outfits"}/${item.slug}`}
              className="group block"
            >
              <div className="relative w-full aspect-[4/5] bg-taupe/10 border border-taupe/20 overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
                {item.coverImagePublicId ? (
                  <Image
                    src={cloudinaryUrl(item.coverImagePublicId, { width: 500 })}
                    alt={item.name}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                    sizes="(min-width: 768px) 20vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-taupe text-xs">
                    No image yet
                  </div>
                )}
              </div>
              <p className="font-serif text-sm mt-2 leading-tight transition-colors duration-150 group-hover:text-blush">{item.name}</p>
              <p className="text-xs text-taupe mt-0.5">{formatPrice(item.price)}</p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
