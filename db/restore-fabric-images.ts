/**
 * Emergency repair: db/seed-outfit-final-images.ts's rebalance step queried
 * `products` without filtering `type = "outfit"`, so it also matched every
 * fabric product and overwrote all 45 fabrics' productImages rows with
 * outfit image public_ids. This restores each fabric's correct images by
 * reconstructing the exact mapping from the original seed scripts
 * (db/seed-images.ts, db/seed-more-fabrics.ts, db/seed-fabric-photos.ts,
 * db/seed-bulk-demo-items.ts) plus the renames later applied by
 * db/fix-fabric-images.ts, matched against each fabric's current name. No
 * Cloudinary assets were touched or need re-uploading — only the
 * product_images rows (which public_id/position belongs to which product)
 * were corrupted, and this rewrites those rows back to the correct values.
 *
 * Run with: npm run db:restore-fabric-images
 */
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productImages } from "@/db/schema";

const P = "fabrics-and-bridals/seed-photos";

// name (current, post-rename) -> [main, style1?, style2?]
const NAMED_FABRICS: Record<string, string[]> = {
  "Ankara Wax Print": [`${P}/ankara-wax-print`],
  "Silk Charmeuse": [`${P}/silk-charmeuse`],
  "Aso-Oke Woven Cloth": [`${P}/aso-oke-woven-cloth`],
  "Cotton Chambray": [`${P}/cotton-chambray`],
  "Fuchsia Chiffon": [`${P}/pastel-chiffon`],
  "Natural Linen": [`${P}/natural-linen`],
  "Rust Pleated Fabric": [`${P}/emerald-velvet`],
  "Indigo Denim": [`${P}/indigo-denim`],
  "Gold Brocade": [`${P}/gold-brocade`],
  "Kente Cloth": [`${P}/kente-cloth`],
  "Ivory Chantilly Lace": [`${P}/ivory-chantilly-lace`],
  "Fuchsia Tulle": [`${P}/blush-tulle`],
  "Champagne Silk Satin": [`${P}/champagne-silk-satin`],
  "White Duchess Satin": [`${P}/white-duchess-satin`],
  "Beaded Bridal Lace": [`${P}/beaded-bridal-lace`],
  "Peach Organza": [`${P}/white-organza`],
  "Chantilly Lace Detail": [`${P}/chantilly-lace-detail`],
  "Ivory Silk Chiffon": [`${P}/ivory-silk-chiffon`],
  "Indigo Stretch Jersey": [`${P}/indigo-stretch-jersey`],
  "Heathered Blue Jersey Knit": [`${P}/heathered-blue-jersey`],
  "Charcoal Herringbone Coating": [`${P}/charcoal-herringbone-coating`],
  "Donegal Fleck Tweed Coating": [`${P}/donegal-fleck-tweed-coating`],
  "Mint Garden Floral Silk": [`${P}/mint-garden-floral-silk-main`],
  "Violet Bloom Batik Print": [`${P}/violet-bloom-batik-print-main`],
  "Blush Pastel Chiffon": [`${P}/blush-pastel-chiffon-main`],
  "Mustard Paisley Silk": [`${P}/mustard-paisley-silk-main`, `${P}/mustard-paisley-silk-style-1`, `${P}/mustard-paisley-silk-style-2`],
  "Blush Magnolia Floral": [`${P}/blush-magnolia-floral-main`, `${P}/blush-magnolia-floral-style-1`],
  "Lilac Floral Print": [`${P}/lilac-floral-print-main`],
  "Wildflower Blue Floral": [`${P}/wildflower-blue-floral-main`],
  "Noir Floral Print": [`${P}/noir-floral-print-main`],
  "Sunlit Floral Chiffon": [`${P}/sunlit-floral-chiffon-main`],
  "Abstract Dot Sheer": [`${P}/abstract-dot-sheer-main`],
  "Rose Trail Floral": [`${P}/rose-trail-floral-main`, `${P}/rose-trail-floral-style-1`],
  "Burgundy Silk Satin": [`${P}/burgundy-silk-satin-main`],
  "Sage & Mauve Colorblock Satin": [`${P}/sage-mauve-colorblock-satin-main`],
};

// Same FABRIC_IMAGES array and formula as db/seed-bulk-demo-items.ts, used
// to reconstruct the 10 generic bulk fabrics' 3 borrowed images.
const FABRIC_IMAGES = [
  `${P}/beaded-bridal-lace`,
  `${P}/silk-charmeuse`,
  `${P}/aso-oke-woven-cloth`,
  `${P}/white-organza`,
  `${P}/natural-linen`,
  `${P}/chantilly-lace-detail`,
  `${P}/indigo-denim`,
  `${P}/gold-brocade`,
  `${P}/kente-cloth`,
  `${P}/ivory-chantilly-lace`,
  `${P}/champagne-silk-satin`,
  `${P}/white-duchess-satin`,
  `${P}/pastel-chiffon`,
  `${P}/blush-tulle`,
  `${P}/ankara-wax-print`,
  `${P}/cotton-chambray`,
  `${P}/emerald-velvet`,
  `${P}/ivory-silk-chiffon`,
  `${P}/indigo-stretch-jersey`,
  `${P}/heathered-blue-jersey`,
  `${P}/charcoal-herringbone-coating`,
  `${P}/donegal-fleck-tweed-coating`,
  `${P}/mint-garden-floral-silk-main`,
  `${P}/violet-bloom-batik-print-main`,
  `${P}/blush-pastel-chiffon-main`,
  `${P}/mustard-paisley-silk-main`,
  `${P}/blush-magnolia-floral-main`,
  `${P}/lilac-floral-print-main`,
  `${P}/wildflower-blue-floral-main`,
  `${P}/noir-floral-print-main`,
  `${P}/sunlit-floral-chiffon-main`,
  `${P}/abstract-dot-sheer-main`,
  `${P}/rose-trail-floral-main`,
  `${P}/burgundy-silk-satin-main`,
  `${P}/sage-mauve-colorblock-satin-main`,
];

const COLORS = [
  "Emerald", "Sapphire", "Ruby", "Amethyst", "Coral", "Charcoal", "Gold", "Teal",
  "Plum", "Rust", "Mint", "Lavender", "Crimson", "Pearl", "Copper", "Jade",
  "Indigo", "Rose Gold", "Espresso", "Olive", "Slate", "Mustard", "Cobalt", "Bronze",
  "Cream", "Peach", "Turquoise", "Maroon", "Periwinkle", "Tangerine", "Onyx", "Graphite",
  "Lilac", "Chartreuse", "Magenta", "Silver",
];
const FABRIC_DESCRIPTORS = [
  "Twill", "Voile", "Georgette", "Poplin", "Damask", "Jacquard", "Crepe", "Organza", "Taffeta", "Brocade",
];

const GENERIC_FABRICS: Record<string, string[]> = {};
for (let i = 0; i < 10; i++) {
  const name = `${COLORS[i % COLORS.length]} ${FABRIC_DESCRIPTORS[i % FABRIC_DESCRIPTORS.length]}`;
  GENERIC_FABRICS[name] = [
    FABRIC_IMAGES[i % FABRIC_IMAGES.length],
    FABRIC_IMAGES[(i + 12) % FABRIC_IMAGES.length],
    FABRIC_IMAGES[(i + 24) % FABRIC_IMAGES.length],
  ];
}

const ALL_MAPPINGS = { ...NAMED_FABRICS, ...GENERIC_FABRICS };

async function main() {
  const fabrics = await db.select().from(products).where(eq(products.type, "fabric"));
  console.log(`Found ${fabrics.length} fabric products.`);

  let fixed = 0;
  const unmatched: string[] = [];

  for (const fabric of fabrics) {
    const imageSet = ALL_MAPPINGS[fabric.name];
    if (!imageSet) {
      unmatched.push(fabric.name);
      continue;
    }

    // Fill up to 3 slots, duplicating the main photo into any missing
    // style slots — matches db/fix-fabric-thumbnails.ts's convention.
    const rows = [imageSet[0], imageSet[1] ?? imageSet[0], imageSet[2] ?? imageSet[0]];

    await db.delete(productImages).where(eq(productImages.productId, fabric.id));
    await db.insert(productImages).values(
      rows.map((publicId, position) => ({ productId: fabric.id, cloudinaryPublicId: publicId, position }))
    );
    fixed++;
  }

  console.log(`Restored ${fixed} fabric product(s).`);
  if (unmatched.length > 0) {
    console.log(`Unmatched (needs manual review): ${unmatched.join(", ")}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
