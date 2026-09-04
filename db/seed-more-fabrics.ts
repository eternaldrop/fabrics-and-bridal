/**
 * Fills the three fabric categories that had zero products — Stretch,
 * Jersey, and Coat Fabrics. Openverse kept failing (504s/timeouts) for
 * these searches, so images are sourced directly from Wikimedia Commons
 * instead. Each one was downloaded and visually checked before being
 * added here (rejected: synthetic/rendered PBR textures, raw unprocessed
 * wool fleece, irrelevant/unrelated photos), then saved locally — the
 * live Wikimedia fetch was flaky mid-script (worked standalone, failed
 * inside the loop), so this reads the already-verified local copies
 * instead of re-fetching over the network.
 *
 * Run with: npm run db:seed-more-fabrics
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

const SRC_DIR = "C:\\Users\\OYINKANSOLA-ZYONEL\\AppData\\Local\\Temp\\fabric-src";

interface FabricSpec {
  name: string;
  localFile: string;
  publicId: string;
  category: string;
  material: string;
  fabricType: string;
  color: string;
  occasion: string;
  price: number;
  credit: string;
}

const fabrics: FabricSpec[] = [
  {
    name: "Indigo Stretch Jersey",
    localFile: "stretch-swatches.jpg",
    publicId: "fabrics-and-bridals/seed-photos/indigo-stretch-jersey",
    category: "Stretch Fabrics",
    material: "Cotton Blend",
    fabricType: "Stretch jersey (spandex blend)",
    color: "Indigo",
    occasion: "everyday",
    price: 5800,
    credit: "Photo by Djr xi, CC BY-SA 3.0. Source: https://commons.wikimedia.org/wiki/File:Stretch_fabric_swatches_different_values_DSCF2204.jpg",
  },
  {
    name: "Heathered Blue Jersey Knit",
    localFile: "blue-gray-knit.jpg",
    publicId: "fabrics-and-bridals/seed-photos/heathered-blue-jersey",
    category: "Jersey Fabrics",
    material: "Cotton Blend",
    fabricType: "Jersey knit",
    color: "Slate Blue",
    occasion: "everyday",
    price: 4800,
    credit: "Public domain. Source: https://commons.wikimedia.org/wiki/File:Blue_Gray_knit_texture.jpg",
  },
  {
    name: "Charcoal Herringbone Coating",
    localFile: "herringbone-cloth.jpg",
    publicId: "fabrics-and-bridals/seed-photos/charcoal-herringbone-coating",
    category: "Coat Fabrics",
    material: "Wool Blend",
    fabricType: "Herringbone wool coating",
    color: "Charcoal",
    occasion: "business",
    price: 21000,
    credit: "Photo by Verrier Cornelius, CC BY-SA 2.5. Source: https://commons.wikimedia.org/wiki/File:HerringbonePatternCloth.jpg",
  },
  {
    name: "Donegal Fleck Tweed Coating",
    localFile: "donegal-tweed.jpg",
    publicId: "fabrics-and-bridals/seed-photos/donegal-fleck-tweed-coating",
    category: "Coat Fabrics",
    material: "Wool",
    fabricType: "Donegal tweed",
    color: "Oatmeal Fleck",
    occasion: "business",
    price: 23500,
    credit: "Photo by Missy & the Universe, CC BY-SA 4.0. Source: https://commons.wikimedia.org/wiki/File:Donegal_Tweed.JPG",
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
  console.log("Removing earlier seeded rows for these fabrics...");
  for (const fabric of fabrics) {
    await db.delete(products).where(eq(products.name, fabric.name));
  }

  const tmpDir = mkdtempSync(path.join(tmpdir(), "more-fabric-photos-"));

  for (const fabric of fabrics) {
    try {
      const raw = await readFile(path.join(SRC_DIR, fabric.localFile));
      const compressed = await sharp(raw)
        .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82 })
        .toBuffer();

      const localPath = path.join(tmpDir, `${slugify(fabric.name)}.jpg`);
      await writeFile(localPath, compressed);

      const upload = await cloudinary.uploader.upload(localPath, {
        public_id: fabric.publicId,
        overwrite: true,
      });

      const slug = `${slugify(fabric.name)}-${Date.now().toString(36)}`;

      const [product] = await db
        .insert(products)
        .values({
          type: "fabric",
          name: fabric.name,
          slug,
          description: `Fabric type: ${fabric.fabricType}. ${fabric.credit}`,
          category: fabric.category,
          material: fabric.material,
          color: fabric.color,
          occasion: fabric.occasion,
          price: String(fabric.price),
          isCustomOrderable: false,
          stockQuantity: 20,
          tags: [fabric.category, fabric.material, fabric.fabricType, fabric.color].map((s) => s.toLowerCase()),
        })
        .returning();

      await db.insert(productImages).values({
        productId: product.id,
        cloudinaryPublicId: upload.public_id,
        position: 0,
      });

      console.log(`  + ${fabric.name} -> ${upload.public_id}`);
    } catch (err) {
      console.warn(`  ! Error on "${fabric.name}" — skipping:`, err instanceof Error ? err.message : err);
    }
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
