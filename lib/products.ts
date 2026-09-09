import { and, asc, count, desc, eq, gte, lte, ne, or, ilike, inArray, notInArray, SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productImages, productVariants } from "@/db/schema";

export const PRODUCTS_PAGE_SIZE = 21;

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
  if (filters.size) {
    conditions.push(
      inArray(
        products.id,
        db
          .select({ id: productVariants.productId })
          .from(productVariants)
          .where(and(eq(productVariants.attributeName, "size"), eq(productVariants.attributeValue, filters.size)))
      )
    );
  }
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
      .orderBy(desc(products.createdAt))
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

// "Other similar fabrics/outfits" — up to `limit` other catalog items of
// the SAME type (never cross-suggesting an outfit under a fabric or vice
// versa) that share this product's category, material, or occasion, for
// the suggestion strip under a product's detail page. Falls back to recent
// items of the same type if nothing matches, so the section is never empty
// once the catalog has more than one item of that type.
export async function getRelatedProducts(
  product: {
    id: string;
    category: string | null;
    material: string | null;
    occasion: string | null;
    type: "fabric" | "outfit";
  },
  limit = 3
) {
  const matchConditions: SQL[] = [];
  if (product.category) matchConditions.push(eq(products.category, product.category));
  if (product.material) matchConditions.push(eq(products.material, product.material));
  if (product.occasion) matchConditions.push(eq(products.occasion, product.occasion));

  let related: (typeof products.$inferSelect)[] = [];

  if (matchConditions.length > 0) {
    const matched = or(...matchConditions);
    related = await db
      .select()
      .from(products)
      .where(and(eq(products.type, product.type), ne(products.id, product.id), matched))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  }

  if (related.length < limit) {
    const excludeIds = [product.id, ...related.map((r) => r.id)];
    const fallback = await db
      .select()
      .from(products)
      .where(and(eq(products.type, product.type), notInArray(products.id, excludeIds)))
      .orderBy(desc(products.createdAt))
      .limit(limit - related.length);
    related = [...related, ...fallback];
  }

  if (related.length === 0) return [];

  const images = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, related.map((r) => r.id)))
    .orderBy(asc(productImages.position));

  const coverByProduct = new Map<string, string>();
  for (const img of images) {
    if (!coverByProduct.has(img.productId)) coverByProduct.set(img.productId, img.cloudinaryPublicId);
  }

  return related.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    price: item.price,
    type: item.type,
    coverImagePublicId: coverByProduct.get(item.id),
  }));
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

// For the admin Fabrics/Outfits pages — one type's items, newest first,
// 2 per page (tables in the admin app paginate as soon as there's more
// than 2 rows), each with its cover (position-0) image.
export const ADMIN_TABLE_PAGE_SIZE = 2;

export async function getAdminProductList(type: "fabric" | "outfit", page = 1) {
  const currentPage = Math.max(1, page);
  const where = eq(products.type, type);

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(ADMIN_TABLE_PAGE_SIZE)
      .offset((currentPage - 1) * ADMIN_TABLE_PAGE_SIZE),
    db.select({ total: count() }).from(products).where(where),
  ]);

  const result = {
    page: currentPage,
    pageSize: ADMIN_TABLE_PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_TABLE_PAGE_SIZE)),
  };

  if (items.length === 0) return { ...result, items: [] as AdminProductRow[] };

  const itemIds = items.map((item) => item.id);
  const images = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, itemIds))
    .orderBy(asc(productImages.position));

  const coverByProduct = new Map<string, string>();
  for (const img of images) {
    if (!coverByProduct.has(img.productId)) {
      coverByProduct.set(img.productId, img.cloudinaryPublicId);
    }
  }

  return {
    ...result,
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      category: item.category,
      price: item.price,
      stockQuantity: item.stockQuantity,
      coverImagePublicId: coverByProduct.get(item.id),
    })),
  };
}

interface AdminProductRow {
  id: string;
  name: string;
  type: "fabric" | "outfit";
  category: string | null;
  price: string;
  stockQuantity: number | null;
  coverImagePublicId?: string;
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
