/**
 * Adds the last 2 unused photos from the "Outfit images" folder
 * (outfid.jpg — a blush native wear set, outfit.jpg — a blush draped maxi
 * dress) as 2 new outfit products, then rebalances image reuse across the
 * generic bulk-demo outfits (from seed-bulk-demo-items.ts and
 * seed-more-outfits.ts) so all 8 real photo sets are cycled roughly evenly
 * instead of the original 6.
 *
 * Run with: npm run db:seed-outfit-final-images
 */
import { readFile } from "fs/promises";
import { mkdtempSync } from "fs";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { and, asc, eq, notInArray } from "drizzle-orm";
import sharp from "sharp";
import { cloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { products, productImages, productVariants } from "@/db/schema";
import { OUTFIT_SIZES } from "@/lib/taxonomy";

const SRC_DIR = path.join(__dirname, "..", "Outfit images");

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface NewOutfit {
  name: string;
  category: string;
  material: string;
  color: string;
  occasion: string;
  price: number;
  description: string;
  file: string;
}

const newOutfits: NewOutfit[] = [
  {
    name: "Blush Native Wear Set",
    category: "Native Wear",
    material: "Wool Blend",
    color: "Blush",
    occasion: "party",
    price: 46000,
    description: "A tailored blush henley-neck top with matching straight trousers — modern native wear with a soft, wearable colour.",
    file: "outfid.jpg",
  },
  {
    name: "Blush Draped Maxi Dress",
    category: "Party",
    material: "Chiffon",
    color: "Blush",
    occasion: "party",
    price: 41000,
    description: "A draped, cowl-front maxi dress in blush chiffon with a fitted waist tie — an easy evening piece that moves beautifully.",
    file: "outfit.jpg",
  },
];

// Every real outfit product's own genuine photo — these products keep
// their existing images untouched by the rebalance below.
const GENUINE_PRODUCT_NAMES = [
  "Colorblock Oversized Top",
  "Embroidered Shift Dress",
  "Navy Beaded Agbada Set",
  "Blush Aso-Ebi Two-Piece",
  "Champagne Satin Bridal Gown",
  "Floral Linen Shirt & Shorts Set",
  "Emerald Silk Senator Set",
  "Navy Silk Business Set",
  "Ivory Floral Maxi Dress",
  ...newOutfits.map((o) => o.name),
];

// The full 8-set rotation used to rebalance the generic bulk-demo outfits
// (up from the original 6 in seed-bulk-demo-items.ts / seed-more-outfits.ts).
const OUTFIT_IMAGE_SETS = [
  ["fabrics-and-bridals/outfits/colorblock-top", "fabrics-and-bridals/outfits/colorblock-top-2", "fabrics-and-bridals/outfits/colorblock-top"],
  ["fabrics-and-bridals/outfits/embroidered-shift-dress", "fabrics-and-bridals/outfits/embroidered-shift-dress", "fabrics-and-bridals/outfits/embroidered-shift-dress"],
  ["fabrics-and-bridals/outfits/navy-agbada-set", "fabrics-and-bridals/outfits/navy-agbada-set-2", "fabrics-and-bridals/outfits/navy-agbada-set"],
  ["fabrics-and-bridals/bridal-page/aso-ebi-look", "fabrics-and-bridals/bridal-page/aso-ebi-look", "fabrics-and-bridals/bridal-page/aso-ebi-look"],
  ["fabrics-and-bridals/bridal-page/bridal-gown", "fabrics-and-bridals/bridal-page/bridal-gown", "fabrics-and-bridals/bridal-page/bridal-gown"],
  ["fabrics-and-bridals/outfits/floral-linen-coord-main", "fabrics-and-bridals/outfits/floral-linen-coord-style-1", "fabrics-and-bridals/outfits/floral-linen-coord-style-2"],
  ["fabrics-and-bridals/outfits/blush-native-wear-set-main", "fabrics-and-bridals/outfits/blush-native-wear-set-main", "fabrics-and-bridals/outfits/blush-native-wear-set-main"],
  ["fabrics-and-bridals/outfits/blush-draped-maxi-dress-main", "fabrics-and-bridals/outfits/blush-draped-maxi-dress-main", "fabrics-and-bridals/outfits/blush-draped-maxi-dress-main"],
];

async function uploadOne(tmpDir: string, localFile: string, publicId: string) {
  const raw = await readFile(path.join(SRC_DIR, localFile));
  const compressed = await sharp(raw)
    .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  const localPath = path.join(tmpDir, `${slugify(publicId)}.jpg`);
  await writeFile(localPath, compressed);

  const upload = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    overwrite: true,
  });
  return upload.public_id;
}

async function main() {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "outfit-final-"));

  console.log("Adding 2 new outfit products (outfit.jpg, outfid.jpg)...");
  for (const outfit of newOutfits) {
    console.log(`Removing any earlier seeded row for "${outfit.name}"...`);
    await db.delete(products).where(eq(products.name, outfit.name));

    const base = `fabrics-and-bridals/outfits/${slugify(outfit.name)}`;
    const publicId = await uploadOne(tmpDir, outfit.file, `${base}-main`);
    console.log(`  + ${publicId}`);

    const slug = `${slugify(outfit.name)}-${Date.now().toString(36)}`;
    const [product] = await db
      .insert(products)
      .values({
        type: "outfit",
        name: outfit.name,
        slug,
        description: outfit.description,
        category: outfit.category,
        material: outfit.material,
        color: outfit.color,
        occasion: outfit.occasion,
        price: String(outfit.price),
        isCustomOrderable: false,
        stockQuantity: 15,
        tags: [outfit.category, outfit.material, outfit.color].map((s) => s.toLowerCase()),
      })
      .returning();

    await db.insert(productImages).values(
      [publicId, publicId, publicId].map((pid, position) => ({
        productId: product.id,
        cloudinaryPublicId: pid,
        position,
      }))
    );

    await db.insert(productVariants).values(
      OUTFIT_SIZES.slice(0, 5).map((size) => ({
        productId: product.id,
        attributeName: "size",
        attributeValue: size,
      }))
    );

    console.log(`Done: "${outfit.name}" (${product.slug})`);
  }

  console.log("Rebalancing image sets across generic bulk-demo outfits...");
  const genericOutfits = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(and(eq(products.type, "outfit"), notInArray(products.name, GENUINE_PRODUCT_NAMES)))
    .orderBy(asc(products.createdAt));

  let reassigned = 0;
  for (const [i, outfit] of genericOutfits.entries()) {
    const imgSet = OUTFIT_IMAGE_SETS[i % OUTFIT_IMAGE_SETS.length];
    await db.delete(productImages).where(eq(productImages.productId, outfit.id));
    await db.insert(productImages).values(
      imgSet.map((publicId, position) => ({ productId: outfit.id, cloudinaryPublicId: publicId, position }))
    );
    reassigned++;
  }

  console.log(`Rebalanced ${reassigned} generic outfit products across ${OUTFIT_IMAGE_SETS.length} image sets.`);
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
