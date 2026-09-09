/**
 * Same fix as db/fix-fabric-thumbnails.ts, applied to outfits: most only
 * had a main photo uploaded, so the detail-page gallery's thumbnail
 * carousel never showed up for them. This duplicates each outfit's main
 * photo into its missing slots (up to 3 total) purely so the carousel UI
 * is visible catalog-wide. Swap these for real style photos via the admin
 * Outfits page whenever they're available.
 *
 * Run with: npm run db:fix-outfit-thumbnails
 */
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productImages } from "@/db/schema";

async function main() {
  const outfits = await db.select().from(products).where(eq(products.type, "outfit"));

  let updated = 0;
  for (const outfit of outfits) {
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, outfit.id))
      .orderBy(asc(productImages.position));

    if (images.length === 0 || images.length >= 3) continue;

    const mainPublicId = images[0].cloudinaryPublicId;
    const nextPosition = images.length;
    const rowsToAdd = 3 - images.length;

    await db.insert(productImages).values(
      Array.from({ length: rowsToAdd }, (_, i) => ({
        productId: outfit.id,
        cloudinaryPublicId: mainPublicId,
        position: nextPosition + i,
      }))
    );

    console.log(`  + ${outfit.name}: added ${rowsToAdd} placeholder image(s)`);
    updated++;
  }

  console.log(`Done. Updated ${updated} outfit(s).`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
