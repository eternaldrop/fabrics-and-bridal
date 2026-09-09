import { getProducts, getDistinctValues } from "@/lib/products";
import { OUTFIT_CATEGORIES, OUTFIT_SIZES } from "@/lib/taxonomy";
import { products, productImages } from "@/db/schema";
import { db } from "@/lib/db";
import { asc, desc, eq } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { OutfitCard } from "@/components/catalog/outfit-card";
import { Pagination } from "@/components/catalog/pagination";
import { Reveal } from "@/components/ui/reveal";

export const metadata = { title: "Outfit Catalog — Fabrics & Bridals" };

export default async function OutfitsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const [{ items, page, totalPages, total }, distinct, priceRow] = await Promise.all([
    getProducts({
      type: "outfit",
      category: params.category,
      color: params.color,
      occasion: params.occasion,
      size: params.size,
      search: params.search,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      page: params.page ? Number(params.page) : 1,
    }),
    getDistinctValues("outfit"),
    db
      .select({ price: products.price })
      .from(products)
      .where(eq(products.type, "outfit"))
      .orderBy(desc(products.price))
      .limit(1),
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

  const highestPrice = priceRow[0] ? Number(priceRow[0].price) : 200000;
  const priceMax = Math.ceil(highestPrice / 5000) * 5000;

  return (
    <Container className="py-12">
      <Reveal>
        <h1 className="font-serif text-3xl md:text-4xl mb-2">Outfits</h1>
        <p className="text-taupe mb-8 max-w-2xl">
          Buy a piece ready-made, as it hangs, or send your measurements for a
          made-to-measure cut — custom orders add about ten days to
          production.
          {total > 0 && ` ${total} outfit${total === 1 ? "" : "s"}.`}
        </p>
      </Reveal>

      <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-12">
        <aside>
          <FilterSidebar
            basePath="/catalog/outfits"
            searchParams={params}
            categoryLabel="Outfit category"
            categoryOptions={OUTFIT_CATEGORIES.map((c) => ({ label: c, value: c }))}
            occasionOptions={distinct.occasions.map((o) => ({
              label: o.replace(/\b\w/g, (c) => c.toUpperCase()),
              value: o,
            }))}
            sizeOptions={OUTFIT_SIZES.map((s) => ({ label: s, value: s }))}
            priceBounds={{ min: 0, max: priceMax }}
          />
        </aside>

        <div>
          {items.length === 0 ? (
            <p className="text-taupe py-16 text-center border border-dashed border-taupe/40 rounded-brand">
              No outfits match yet. Try clearing filters, or check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {items.map((item, i) => (
                <Reveal key={item.id} delay={(i % 6) * 60}>
                  <OutfitCard
                    product={{
                      slug: item.slug,
                      name: item.name,
                      material: item.material,
                      color: item.color,
                      price: item.price,
                      salePrice: item.salePrice,
                      coverImagePublicId: coverByProduct.get(item.id),
                    }}
                  />
                </Reveal>
              ))}
            </div>
          )}

          <Pagination basePath="/catalog/outfits" searchParams={params} page={page} totalPages={totalPages} />
        </div>
      </div>
    </Container>
  );
}
