/**
 * Puts a handful of existing catalog items on sale (varied discounts,
 * spread across fabrics and outfits) so the new sale feature has real
 * examples to see in the shop right away.
 *
 * Run with: npm run db:put-items-on-sale
 */
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/db/schema";

const sales: { name: string; discountPercent: number }[] = [
  { name: "Ankara Wax Print", discountPercent: 20 },
  { name: "Ivory Chantilly Lace", discountPercent: 25 },
  { name: "Champagne Silk Satin", discountPercent: 15 },
  { name: "Natural Linen", discountPercent: 30 },
  { name: "Burgundy Silk Satin", discountPercent: 20 },
  { name: "Charcoal Herringbone Coating", discountPercent: 18 },
  { name: "Colorblock Oversized Top", discountPercent: 20 },
  { name: "Champagne Satin Bridal Gown", discountPercent: 15 },
  { name: "Navy Beaded Agbada Set", discountPercent: 25 },
  { name: "Blush Aso-Ebi Two-Piece", discountPercent: 20 },
  { name: "Floral Linen Shirt & Shorts Set", discountPercent: 30 },
  { name: "Blush Draped Maxi Dress", discountPercent: 22 },
];

async function main() {
  let updated = 0;
  for (const sale of sales) {
    const [product] = await db.select().from(products).where(eq(products.name, sale.name));
    if (!product) {
      console.warn(`  ! "${sale.name}" not found — skipping`);
      continue;
    }

    const price = Number(product.price);
    const salePrice = Math.round((price * (1 - sale.discountPercent / 100)) / 100) * 100;

    await db.update(products).set({ salePrice: String(salePrice) }).where(eq(products.id, product.id));
    console.log(`  + ${sale.name}: ${product.price} -> ${salePrice} (-${sale.discountPercent}%)`);
    updated++;
  }
  console.log(`Done. ${updated} item(s) on sale.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
