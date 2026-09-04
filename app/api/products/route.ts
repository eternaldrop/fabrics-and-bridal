import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products, productImages, productVariants } from "@/db/schema";

const productSchema = z.object({
  type: z.enum(["fabric", "outfit"]),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  occasion: z.string().optional(),
  price: z.coerce.number().positive(),
  isCustomOrderable: z.boolean().default(false),
  stockQuantity: z.coerce.number().int().nonnegative().optional(),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1, "At least one image is required"),
  sizes: z.array(z.string()).default([]),
  colorVariants: z.array(z.string()).default([]),
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "stylist")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const baseSlug = slugify(data.name);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const [product] = await db
    .insert(products)
    .values({
      type: data.type,
      name: data.name,
      slug,
      description: data.description,
      category: data.category,
      material: data.material,
      color: data.color,
      occasion: data.occasion,
      price: String(data.price),
      isCustomOrderable: data.isCustomOrderable,
      stockQuantity: data.stockQuantity,
      tags: data.tags,
    })
    .returning();

  if (data.images.length > 0) {
    await db.insert(productImages).values(
      data.images.map((publicId, i) => ({
        productId: product.id,
        cloudinaryPublicId: publicId,
        position: i,
      }))
    );
  }

  const variantRows = [
    ...data.sizes.map((size) => ({
      productId: product.id,
      attributeName: "size",
      attributeValue: size,
    })),
    ...data.colorVariants.map((color) => ({
      productId: product.id,
      attributeName: "color",
      attributeValue: color,
    })),
  ];

  if (variantRows.length > 0) {
    await db.insert(productVariants).values(variantRows);
  }

  return NextResponse.json({ ok: true, product }, { status: 201 });
}
