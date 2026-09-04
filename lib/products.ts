import { and, asc, count, desc, eq, gte, lte, or, ilike, SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productImages, productVariants } from "@/db/schema";

export const PRODUCTS_PAGE_SIZE = 15;

export interface ProductFilters {
  type: "fabric" | "outfit";
  category?: string;
  color?: string;
  material?: string;
  occasion?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
}

export async function getProducts(filters: ProductFilters) {
  const conditions: SQL[] = [eq(products.type, filters.type)];

  if (filters.category) conditions.push(eq(products.category, filters.category));
  if (filters.color) conditions.push(eq(products.color, filters.color));
  if (filters.material) conditions.push(eq(products.material, filters.material));
  if (filters.occasion) conditions.push(eq(products.occasion, filters.occasion));
  if (filters.minPrice !== undefined) conditions.push(gte(products.price, String(filters.minPrice)));
  if (filters.maxPrice !== undefined) conditions.push(lte(products.price, String(filters.maxPrice)));
  if (filters.search) {
    const term = `%${filters.search}%`;
    const searchCondition = or(
      ilike(products.name, term),
      ilike(products.description, term)
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  const where = and(...conditions);
  const page = Math.max(1, filters.page ?? 1);

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(asc(products.name))
      .limit(PRODUCTS_PAGE_SIZE)
      .offset((page - 1) * PRODUCTS_PAGE_SIZE),
    db.select({ total: count() }).from(products).where(where),
  ]);

  return {
    items,
    page,
    pageSize: PRODUCTS_PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE)),
  };
}

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) return null;

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(asc(productImages.position));

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id));

  return { product, images, variants };
}

// Homepage curation shelves. Luxury and Bridal are real, computed
// signals (price, category). Popular has no real signal yet — there's no
// order/view tracking until Phase 2 ordering exists — so it's approximated
// by name order for now; swap for an order-count query once that data
// exists.
export async function getNewArrivals(type: "fabric" | "outfit", limit = 5) {
  return db.select().from(products).where(eq(products.type, type)).orderBy(desc(products.createdAt)).limit(limit);
}

export async function getLuxuryFabrics(limit = 5) {
  return db.select().from(products).where(eq(products.type, "fabric")).orderBy(desc(products.price)).limit(limit);
}

export async function getBridalFabrics(limit = 5) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.type, "fabric"), eq(products.category, "Bridal Fabrics")))
    .orderBy(asc(products.name))
    .limit(limit);
}

export async function getPopularFabrics(limit = 5) {
  return db.select().from(products).where(eq(products.type, "fabric")).orderBy(asc(products.name)).limit(limit);
}

// For the /bridal page's catalogue section: bridal fabrics (real, fixed
// category) plus wedding-occasion outfits. Outfits have no fixed
// taxonomy yet and none are seeded, so that half returns empty today —
// it'll start showing results the moment an admin tags an outfit's
// occasion as "wedding", no code change needed.
export async function getBridalCatalogueProducts(limit = 12) {
  const [fabrics, outfits] = await Promise.all([
    db
      .select()
      .from(products)
      .where(and(eq(products.type, "fabric"), eq(products.category, "Bridal Fabrics")))
      .orderBy(asc(products.name))
      .limit(limit),
    db
      .select()
      .from(products)
      .where(and(eq(products.type, "outfit"), eq(products.occasion, "wedding")))
      .orderBy(asc(products.name))
      .limit(limit),
  ]);

  return [...fabrics, ...outfits];
}

export async function getDistinctValues(type: "fabric" | "outfit") {
  const rows = await db
    .select({
      category: products.category,
      color: products.color,
      material: products.material,
      occasion: products.occasion,
    })
    .from(products)
    .where(eq(products.type, type));

  const dedupe = (values: (string | null)[]) =>
    Array.from(new Set(values.filter((v): v is string => Boolean(v))));

  return {
    categories: dedupe(rows.map((r) => r.category)),
    colors: dedupe(rows.map((r) => r.color)),
    materials: dedupe(rows.map((r) => r.material)),
    occasions: dedupe(rows.map((r) => r.occasion)),
  };
}
