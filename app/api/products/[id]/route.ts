import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "@/db/schema";

const patchSchema = z.object({
  // null clears the sale (removes the item from sale); omit the field to
  // leave salePrice untouched.
  salePrice: z.coerce.number().positive().nullable().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "stylist")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  if (parsed.data.salePrice !== undefined && parsed.data.salePrice !== null) {
    const [product] = await db.select({ price: products.price }).from(products).where(eq(products.id, id));
    if (!product) return NextResponse.json({ error: "Item not found." }, { status: 404 });
    if (parsed.data.salePrice >= Number(product.price)) {
      return NextResponse.json({ error: "Sale price must be lower than the regular price." }, { status: 400 });
    }
  }

  const [updated] = await db
    .update(products)
    .set({
      salePrice:
        parsed.data.salePrice === undefined
          ? undefined
          : parsed.data.salePrice === null
            ? null
            : String(parsed.data.salePrice),
    })
    .where(eq(products.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Item not found." }, { status: 404 });

  return NextResponse.json({ ok: true, product: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "stylist")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  await db.delete(products).where(eq(products.id, id));

  return NextResponse.json({ ok: true });
}
