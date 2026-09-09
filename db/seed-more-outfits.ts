/**
 * A follow-up to db/seed-bulk-demo-items.ts: the pagination page size
 * changed from 20 to 21 per page, which dropped outfits from 3 pages to
 * exactly 2 (42 items / 21 = 2 even). This adds 8 more so there's a third,
 * partial page — same approach as before: reusing existing photography
 * with new names, not new photos.
 *
 * Run with: npm run db:seed-more-outfits
 */
import { db } from "@/lib/db";
import { products, productImages, productVariants } from "@/db/schema";
import { OUTFIT_SIZES } from "@/lib/taxonomy";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const OUTFIT_IMAGE_SETS = [
  ["fabrics-and-bridals/outfits/colorblock-top", "fabrics-and-bridals/outfits/colorblock-top-2", "fabrics-and-bridals/outfits/colorblock-top"],
  ["fabrics-and-bridals/outfits/embroidered-shift-dress", "fabrics-and-bridals/outfits/embroidered-shift-dress", "fabrics-and-bridals/outfits/embroidered-shift-dress"],
  ["fabrics-and-bridals/outfits/navy-agbada-set", "fabrics-and-bridals/outfits/navy-agbada-set-2", "fabrics-and-bridals/outfits/navy-agbada-set"],
  ["fabrics-and-bridals/bridal-page/aso-ebi-look", "fabrics-and-bridals/bridal-page/aso-ebi-look", "fabrics-and-bridals/bridal-page/aso-ebi-look"],
  ["fabrics-and-bridals/bridal-page/bridal-gown", "fabrics-and-bridals/bridal-page/bridal-gown", "fabrics-and-bridals/bridal-page/bridal-gown"],
  ["fabrics-and-bridals/outfits/floral-linen-coord-main", "fabrics-and-bridals/outfits/floral-linen-coord-style-1", "fabrics-and-bridals/outfits/floral-linen-coord-style-2"],
];

const outfits = [
  { name: "Turquoise Ankara Two-Piece", category: "Native Wear", color: "Turquoise", occasion: "party", price: 42000 },
  { name: "Champagne Lace Gown", category: "Bridal", color: "Champagne", occasion: "wedding", price: 150000 },
  { name: "Coral Chiffon Cocktail Dress", category: "Party", color: "Coral", occasion: "party", price: 32000 },
  { name: "Navy Business Wrap Dress", category: "Business", color: "Navy", occasion: "business", price: 38000 },
  { name: "Blush Organza Aso-Ebi Set", category: "Aso-Ebi", color: "Blush", occasion: "wedding guest", price: 52000 },
  { name: "Sand Linen Jumpsuit", category: "Casual", color: "Sand", occasion: "everyday", price: 27000 },
  { name: "Wine Velvet Evening Gown", category: "Party", color: "Wine", occasion: "party", price: 48000 },
  { name: "Ivory Senator Set", category: "Native Wear", color: "Ivory", occasion: "party", price: 45000 },
];

async function main() {
  for (const [i, o] of outfits.entries()) {
    const [product] = await db
      .insert(products)
      .values({
        type: "outfit",
        name: o.name,
        slug: `${slugify(o.name)}-${Date.now().toString(36)}-${i}`,
        category: o.category,
        color: o.color,
        occasion: o.occasion,
        price: String(o.price),
        isCustomOrderable: false,
        stockQuantity: 10 + (i % 4) * 5,
        tags: [o.category, o.color].map((s) => s.toLowerCase()),
      })
      .returning();

    const imgSet = OUTFIT_IMAGE_SETS[i % OUTFIT_IMAGE_SETS.length];
    await db.insert(productImages).values(
      imgSet.map((publicId, position) => ({ productId: product.id, cloudinaryPublicId: publicId, position }))
    );

    await db.insert(productVariants).values(
      OUTFIT_SIZES.slice(0, 4).map((size) => ({
        productId: product.id,
        attributeName: "size",
        attributeValue: size,
      }))
    );

    console.log(`  + ${o.name}`);
  }
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
