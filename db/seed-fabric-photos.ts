/**
 * Uploads the new fabric photos dropped into the "Fabric images" folder
 * (project root) and creates a fabric product for each, using the new
 * three-slot photo model: one main fabric shot, plus up to two optional
 * "style" shots showing what can be made with it (position 0 = main,
 * 1-2 = style, matching how ProductGallery reads productImages).
 *
 * These source files are small/mixed-quality stock photos (some carry
 * third-party watermarks, several are Google-thumbnail sized) — used as-is
 * per instruction rather than re-sourced, so expect softer image quality
 * than the site's other seeded fabrics.
 *
 * Run with: npm run db:seed-fabric-photos
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

const SRC_DIR = path.join(__dirname, "..", "Fabric images");

interface FabricSpec {
  name: string;
  mainFile: string;
  styleFiles?: string[];
  publicIdBase: string;
  category: string;
  material: string;
  color: string;
  occasion: string;
  price: number;
}

const fabrics: FabricSpec[] = [
  {
    name: "Mint Garden Floral Silk",
    mainFile: "images.jpg",
    publicIdBase: "fabrics-and-bridals/seed-photos/mint-garden-floral-silk",
    category: "Casual Fabrics",
    material: "Silk",
    color: "Mint",
    occasion: "everyday",
    price: 7500,
  },
  {
    name: "Violet Bloom Batik Print",
    mainFile: "images (1).jpg",
    publicIdBase: "fabrics-and-bridals/seed-photos/violet-bloom-batik-print",
    category: "Casual Fabrics",
    material: "Cotton Blend",
    color: "Violet",
    occasion: "everyday",
    price: 6200,
  },
  {
    name: "Blush Pastel Chiffon",
    mainFile: "images (2).jpg",
    publicIdBase: "fabrics-and-bridals/seed-photos/blush-pastel-chiffon",
    category: "Casual Fabrics",
    material: "Silk Blend",
    color: "Blush",
    occasion: "party",
    price: 6800,
  },
  {
    name: "Mustard Paisley Silk",
    mainFile: "images (3).jpg",
    styleFiles: ["download (5).jfif", "download (1).jfif"],
    publicIdBase: "fabrics-and-bridals/seed-photos/mustard-paisley-silk",
    category: "Casual Fabrics",
    material: "Silk",
    color: "Mustard",
    occasion: "party",
    price: 8200,
  },
  {
    name: "Blush Magnolia Floral",
    mainFile: "images (6).jpg",
    styleFiles: ["images (8).jpg"],
    publicIdBase: "fabrics-and-bridals/seed-photos/blush-magnolia-floral",
    category: "Casual Fabrics",
    material: "Cotton",
    color: "Blush",
    occasion: "everyday",
    price: 5800,
  },
  {
    name: "Lilac Floral Print",
    mainFile: "images (7).jpg",
    publicIdBase: "fabrics-and-bridals/seed-photos/lilac-floral-print",
    category: "Casual Fabrics",
    material: "Cotton",
    color: "Lilac",
    occasion: "everyday",
    price: 5200,
  },
  {
    name: "Wildflower Blue Floral",
    mainFile: "images (5).jpg",
    publicIdBase: "fabrics-and-bridals/seed-photos/wildflower-blue-floral",
    category: "Casual Fabrics",
    material: "Cotton",
    color: "Sky Blue",
    occasion: "everyday",
    price: 5400,
  },
  {
    name: "Noir Floral Print",
    mainFile: "download.jfif",
    publicIdBase: "fabrics-and-bridals/seed-photos/noir-floral-print",
    category: "Casual Fabrics",
    material: "Silk Blend",
    color: "Black",
    occasion: "party",
    price: 6600,
  },
  {
    name: "Sunlit Floral Chiffon",
    mainFile: "download (2).jfif",
    publicIdBase: "fabrics-and-bridals/seed-photos/sunlit-floral-chiffon",
    category: "Casual Fabrics",
    material: "Silk Blend",
    color: "Multicolour",
    occasion: "everyday",
    price: 6400,
  },
  {
    name: "Abstract Dot Sheer",
    mainFile: "download (3).jfif",
    publicIdBase: "fabrics-and-bridals/seed-photos/abstract-dot-sheer",
    category: "Casual Fabrics",
    material: "Silk Blend",
    color: "Grey",
    occasion: "everyday",
    price: 5900,
  },
  {
    name: "Rose Trail Floral",
    mainFile: "download (4).jfif",
    styleFiles: ["images (4).jpg"],
    publicIdBase: "fabrics-and-bridals/seed-photos/rose-trail-floral",
    category: "Casual Fabrics",
    material: "Cotton",
    color: "Rose",
    occasion: "everyday",
    price: 5600,
  },
  {
    name: "Burgundy Silk Satin",
    mainFile: "download (6).jfif",
    publicIdBase: "fabrics-and-bridals/seed-photos/burgundy-silk-satin",
    category: "Casual Fabrics",
    material: "Silk",
    color: "Burgundy",
    occasion: "evening",
    price: 9500,
  },
  {
    name: "Sage & Mauve Colorblock Satin",
    mainFile: "download (7).jfif",
    publicIdBase: "fabrics-and-bridals/seed-photos/sage-mauve-colorblock-satin",
    category: "Casual Fabrics",
    material: "Silk",
    color: "Sage",
    occasion: "evening",
    price: 9200,
  },
];

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uploadOne(tmpDir: string, localFile: string, publicId: string) {
  const raw = await readFile(path.join(SRC_DIR, localFile));
  const compressed = await sharp(raw)
    .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82 })
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
  console.log("Removing earlier seeded rows for these fabrics...");
  for (const fabric of fabrics) {
    await db.delete(products).where(eq(products.name, fabric.name));
  }

  const tmpDir = mkdtempSync(path.join(tmpdir(), "new-fabric-photos-"));

  for (const fabric of fabrics) {
    try {
      const mainPublicId = await uploadOne(tmpDir, fabric.mainFile, `${fabric.publicIdBase}-main`);

      const stylePublicIds: string[] = [];
      for (const [i, styleFile] of (fabric.styleFiles ?? []).entries()) {
        stylePublicIds.push(
          await uploadOne(tmpDir, styleFile, `${fabric.publicIdBase}-style-${i + 1}`)
        );
      }

      const slug = `${slugify(fabric.name)}-${Date.now().toString(36)}`;

      const [product] = await db
        .insert(products)
        .values({
          type: "fabric",
          name: fabric.name,
          slug,
          description: null,
          category: fabric.category,
          material: fabric.material,
          color: fabric.color,
          occasion: fabric.occasion,
          price: String(fabric.price),
          isCustomOrderable: false,
          stockQuantity: 20,
          tags: [fabric.category, fabric.material, fabric.color].map((s) => s.toLowerCase()),
        })
        .returning();

      const imageRows = [mainPublicId, ...stylePublicIds].map((publicId, position) => ({
        productId: product.id,
        cloudinaryPublicId: publicId,
        position,
      }));
      await db.insert(productImages).values(imageRows);

      console.log(`  + ${fabric.name} -> ${imageRows.length} photo(s)`);
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
