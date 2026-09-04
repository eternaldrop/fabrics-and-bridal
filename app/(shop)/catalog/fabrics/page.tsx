import { getProducts, getDistinctValues } from "@/lib/products";
import { FABRIC_CATEGORIES, FABRIC_MATERIALS } from "@/lib/taxonomy";
import { productImages } from "@/db/schema";
import { db } from "@/lib/db";
import { asc } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { FilterBar } from "@/components/catalog/filter-bar";
import { ProductCard } from "@/components/catalog/product-card";
import { Pagination } from "@/components/catalog/pagination";

export const metadata = { title: "Fabric Catalog — Fabrics & Bridals" };

export default async function FabricsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const [{ items, page, totalPages, total }, distinct] = await Promise.all([
    getProducts({
      type: "fabric",
      category: params.category,
      color: params.color,
      material: params.material,
      occasion: params.occasion,
      search: params.search,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      page: params.page ? Number(params.page) : 1,
    }),
    getDistinctValues("fabric"),
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
      <h1 className="font-serif text-3xl md:text-4xl mb-2">Fabrics</h1>
      <p className="text-taupe mb-8">
        Lace, ankara, silk, and more — sold by the yard, ready for tailoring.
        {total > 0 && ` ${total} fabric${total === 1 ? "" : "s"}.`}
      </p>

      <FilterBar
        basePath="/catalog/fabrics"
        searchParams={params}
        filters={{
          category: FABRIC_CATEGORIES.map((c) => ({ label: c, value: c })),
          color: distinct.colors.map((c) => ({ label: c, value: c })),
          material: FABRIC_MATERIALS.map((m) => ({ label: m, value: m })),
          occasion: distinct.occasions.map((o) => ({ label: o, value: o })),
        }}
      />

      {items.length === 0 ? (
        <p className="text-taupe py-16 text-center border border-dashed border-taupe/40 rounded-brand">
          No fabrics match yet. Try clearing filters, or check back soon.
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
                type: "fabric",
                coverImagePublicId: coverByProduct.get(item.id),
              }}
              span={i % 5 === 0 ? "wide" : "normal"}
            />
          ))}
        </div>
      )}

      <Pagination basePath="/catalog/fabrics" searchParams={params} page={page} totalPages={totalPages} />
    </Container>
  );
}
