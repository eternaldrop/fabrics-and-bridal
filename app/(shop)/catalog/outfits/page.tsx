import { getProducts, getDistinctValues } from "@/lib/products";
import { productImages } from "@/db/schema";
import { db } from "@/lib/db";
import { asc } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { FilterBar } from "@/components/catalog/filter-bar";
import { ProductCard } from "@/components/catalog/product-card";

export const metadata = { title: "Outfit Catalog — Fabrics & Bridals" };

export default async function OutfitsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const [items, distinct] = await Promise.all([
    getProducts({
      type: "outfit",
      category: params.category,
      color: params.color,
      occasion: params.occasion,
      search: params.search,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    }),
    getDistinctValues("outfit"),
  ]);

  const coverImages = items.length
    ? await db
        .select()
        .from(productImages)
        .orderBy(asc(productImages.position))
    : [];

  const coverByProduct = new Map<string, string>();
  for (const img of coverImages) {
    if (!coverByProduct.has(img.productId)) {
      coverByProduct.set(img.productId, img.cloudinaryPublicId);
    }
  }

  return (
    <Container className="py-12">
      <h1 className="font-serif text-3xl md:text-4xl mb-2">Outfits</h1>
      <p className="text-taupe mb-8">
        Ready-made and made-to-measure pieces — casual, native wear, aso-ebi, and bridal.
      </p>

      <FilterBar
        basePath="/catalog/outfits"
        searchParams={params}
        filters={{
          category: distinct.categories.map((c) => ({ label: c, value: c })),
          color: distinct.colors.map((c) => ({ label: c, value: c })),
          occasion: distinct.occasions.map((o) => ({ label: o, value: o })),
        }}
      />

      {items.length === 0 ? (
        <p className="text-taupe py-16 text-center border border-dashed border-taupe/40 rounded-brand">
          No outfits match yet. Try clearing filters, or check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {items.map((item, i) => (
            <ProductCard
              key={item.id}
              product={{
                slug: item.slug,
                name: item.name,
                price: item.price,
                category: item.category,
                type: "outfit",
                coverImagePublicId: coverByProduct.get(item.id),
              }}
              span={i % 5 === 0 ? "wide" : "normal"}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
