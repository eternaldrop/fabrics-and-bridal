import { and, asc, eq, gte, lte, or, ilike, SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productImages, productVariants } from "@/db/schema";

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

  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(asc(products.name));

  return rows;
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
