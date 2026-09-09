/**
 * One-off placeholder fix: most fabrics only ever got a main photo
 * uploaded (the "style photo" slots on the admin form are optional and
 * were left empty), so the detail-page gallery's thumbnail carousel never
 * shows up for them — it only renders once a product has more than 1
 * image. Until real style photos are uploaded per fabric, this duplicates
 * each fabric's main photo into its missing slots (up to 3 total) purely
 * so the carousel UI is visible catalog-wide. Swap these for real photos
 * via the admin Fabrics page whenever they're available — see
 * PhotoSlot in components/admin/product-form.tsx.
 *
 * Run with: npm run db:fix-fabric-thumbnails
 */
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productImages } from "@/db/schema";

async function main() {
  const fabrics = await db.select().from(products).where(eq(products.type, "fabric"));

  let updated = 0;
  for (const fabric of fabrics) {
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, fabric.id))
      .orderBy(asc(productImages.position));

    if (images.length === 0 || images.length >= 3) continue;

    const mainPublicId = images[0].cloudinaryPublicId;
    const nextPosition = images.length;
    const rowsToAdd = 3 - images.length;

    await db.insert(productImages).values(
      Array.from({ length: rowsToAdd }, (_, i) => ({
        productId: fabric.id,
        cloudinaryPublicId: mainPublicId,
        position: nextPosition + i,
      }))
    );

    console.log(`  + ${fabric.name}: added ${rowsToAdd} placeholder image(s)`);
    updated++;
  }

  console.log(`Done. Updated ${updated} fabric(s).`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
