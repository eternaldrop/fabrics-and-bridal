/**
 * One-off correction for the 5 seeded outfits: they were never given a
 * `material` value (the admin form didn't collect one for outfits until
 * now), and their size variants used S/M/L/XL/XXL — the outfits catalog
 * redesign switched to UK numeric sizing (UK 8-16 + Made to measure), so
 * the old letter sizes no longer match anything in the size filter.
 *
 * Run with: npm run db:fix-outfit-data
 */
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productVariants } from "@/db/schema";

const materialByName: Record<string, string> = {
  "Colorblock Oversized Top": "Jersey Knit",
  "Embroidered Shift Dress": "Cotton Blend",
  "Navy Beaded Agbada Set": "Brocade",
  "Blush Aso-Ebi Two-Piece": "Chiffon",
  "Champagne Satin Bridal Gown": "Silk Satin",
};

const sizeRemap: Record<string, string> = {
  S: "UK 8",
  M: "UK 10",
  L: "UK 12",
  XL: "UK 14",
  XXL: "UK 16",
};

async function main() {
  for (const [name, material] of Object.entries(materialByName)) {
    await db.update(products).set({ material }).where(eq(products.name, name));
    console.log(`  + ${name} -> ${material}`);
  }

  for (const [oldValue, newValue] of Object.entries(sizeRemap)) {
    const result = await db
      .update(productVariants)
      .set({ attributeValue: newValue })
      .where(and(eq(productVariants.attributeName, "size"), eq(productVariants.attributeValue, oldValue)));
    console.log(`  + size ${oldValue} -> ${newValue} (${result.rowCount ?? 0} rows)`);
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
