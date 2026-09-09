/**
 * Adds the 4 new photos from the "Outfit images" folder (project root) as
 * 3 new outfit products — the navy silk set had two genuine alternate
 * shots (culottes + pencil skirt), so it gets both as real style photos;
 * the other two only had one photo each, so their missing style slots are
 * filled with a duplicate of the main shot (consistent with
 * db/fix-outfit-thumbnails.ts) until real style photos exist.
 *
 * (Two other files in the folder — outfid.jpg / outfit.jpg — are genuine
 * outfit photos in their own right; they're seeded separately as their own
 * products in db/seed-outfit-final-images.ts.)
 *
 * Run with: npm run db:seed-new-outfits-2
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
  // Local files in order [main, style1, style2] — a filename may repeat
  // when there's only one real photo, duplicating it as a placeholder.
  files: string[];
}

const outfits: NewOutfit[] = [
  {
    name: "Emerald Silk Senator Set",
    category: "Native Wear",
    material: "Silk",
    color: "Emerald",
    occasion: "party",
    price: 48000,
    description: "A tailored silk shantung senator set with a mandarin collar — sharp, lightweight, and ready for any celebration.",
    files: [
      "Gemini_Generated_Image_i41nl6i41nl6i41n.jfif",
      "Gemini_Generated_Image_i41nl6i41nl6i41n.jfif",
      "Gemini_Generated_Image_i41nl6i41nl6i41n.jfif",
    ],
  },
  {
    name: "Navy Silk Business Set",
    category: "Business",
    material: "Silk",
    color: "Navy",
    occasion: "business",
    price: 42000,
    description: "A mandarin-collar silk shantung top with a matching bottom — shown here with wide-leg culottes and a tailored pencil skirt, two ways to wear one set.",
    files: [
      "Gemini_Generated_Image_xnm68qxnm68qxnm6.jfif",
      "Gemini_Generated_Image_z4zzfqz4zzfqz4zz.jfif",
      "Gemini_Generated_Image_xnm68qxnm68qxnm6.jfif",
    ],
  },
  {
    name: "Ivory Floral Maxi Dress",
    category: "Casual",
    material: "Chiffon",
    color: "Ivory",
    occasion: "beach",
    price: 39000,
    description: "A tiered chiffon maxi dress in a soft botanical print, with billowy sleeves and a flowing hem — effortless resort dressing.",
    files: [
      "Gemini_Generated_Image_nj3sg7nj3sg7nj3s.jfif",
      "Gemini_Generated_Image_nj3sg7nj3sg7nj3s.jfif",
      "Gemini_Generated_Image_nj3sg7nj3sg7nj3s.jfif",
    ],
  },
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
  const tmpDir = mkdtempSync(path.join(tmpdir(), "new-outfits-2-"));

  for (const outfit of outfits) {
    console.log(`Removing any earlier seeded row for "${outfit.name}"...`);
    await db.delete(products).where(eq(products.name, outfit.name));

    const base = `fabrics-and-bridals/outfits/${slugify(outfit.name)}`;
    const uploadedPublicIds: string[] = [];
    for (const [i, file] of outfit.files.entries()) {
      const publicId = i === 0 ? `${base}-main` : `${base}-style-${i}`;
      // Skip a redundant re-upload when this slot duplicates the main file.
      if (i > 0 && outfit.files[0] === file) {
        uploadedPublicIds.push(uploadedPublicIds[0]);
        continue;
      }
      uploadedPublicIds.push(await uploadOne(tmpDir, file, publicId));
      console.log(`  + ${publicId}`);
    }

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
      uploadedPublicIds.map((publicId, position) => ({ productId: product.id, cloudinaryPublicId: publicId, position }))
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
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
