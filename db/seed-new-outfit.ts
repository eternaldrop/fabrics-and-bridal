/**
 * Adds the new matching floral-linen co-ord set from the "Outfit images"
 * folder (project root) to the outfit catalog — a lifestyle beach shot as
 * the main image, plus the individual women's and men's studio shots as
 * the two style photos, matching the 3-image gallery every product uses.
 *
 * Run with: npm run db:seed-new-outfit
 */
import { readFile } from "fs/promises";
import { mkdtempSync } from "fs";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { cloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { products, productImages } from "@/db/schema";

const SRC_DIR = path.join(__dirname, "..", "Outfit images");

const NAME = "Floral Linen Shirt & Shorts Set";

const images = [
  {
    localFile: "Gemini_Generated_Image_89ogqv89ogqv89og.jfif",
    publicId: "fabrics-and-bridals/outfits/floral-linen-coord-main",
  },
  {
    localFile: "Gemini_Generated_Image_4wlzd84wlzd84wlz.jfif",
    publicId: "fabrics-and-bridals/outfits/floral-linen-coord-style-1",
  },
  {
    localFile: "Gemini_Generated_Image_k01d70k01d70k01d.jfif",
    publicId: "fabrics-and-bridals/outfits/floral-linen-coord-style-2",
  },
];

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Removing any earlier seeded row for this outfit...");
  await db.delete(products).where(eq(products.name, NAME));

  const tmpDir = mkdtempSync(path.join(tmpdir(), "new-outfit-"));
  const uploadedPublicIds: string[] = [];

  for (const img of images) {
    const raw = await readFile(path.join(SRC_DIR, img.localFile));
    const compressed = await sharp(raw)
      .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const localPath = path.join(tmpDir, `${path.basename(img.publicId)}.jpg`);
    await writeFile(localPath, compressed);

    const upload = await cloudinary.uploader.upload(localPath, {
      public_id: img.publicId,
      overwrite: true,
    });
    uploadedPublicIds.push(upload.public_id);
    console.log(`  + ${upload.public_id}`);
  }

  const slug = `${slugify(NAME)}-${Date.now().toString(36)}`;

  const [product] = await db
    .insert(products)
    .values({
      type: "outfit",
      name: NAME,
      slug,
      description:
        "A matching block-print floral linen shirt and shorts set, cut for both — ready to wear on its own or as a couple's set.",
      category: "Casual",
      material: "Linen",
      color: "Cream",
      occasion: "beach",
      price: "52000.00",
      isCustomOrderable: false,
      stockQuantity: 15,
      tags: ["casual", "linen", "cream", "beach", "co-ord", "matching set"],
    })
    .returning();

  await db.insert(productImages).values(
    uploadedPublicIds.map((publicId, position) => ({
      productId: product.id,
      cloudinaryPublicId: publicId,
      position,
    }))
  );

  console.log(`Done. Added "${NAME}" (${product.slug}) with ${uploadedPublicIds.length} photos.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
