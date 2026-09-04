import Link from "next/link";
import { ProductCard, type ProductCardData } from "@/components/catalog/product-card";

interface ShelfProduct {
  id: string;
  slug: string;
  name: string;
  price: string;
  category: string | null;
  type: "fabric" | "outfit";
}

export function ProductShelf({
  title,
  viewAllHref,
  products,
  coverByProduct,
}: {
  title: string;
  viewAllHref: string;
  products: ShelfProduct[];
  coverByProduct: Map<string, string>;
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-14 border-t border-taupe/30 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
        <Link href={viewAllHref} className="text-sm text-taupe hover:text-ink">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {products.map((item) => {
          const product: ProductCardData = {
            slug: item.slug,
            name: item.name,
            price: item.price,
            category: item.category,
            type: item.type,
            coverImagePublicId: coverByProduct.get(item.id),
          };
          return <ProductCard key={item.id} product={product} />;
        })}
      </div>
    </section>
  );
}
