/**
 * Seeds the outfit catalog, which had zero products — every seed so far
 * was fabrics only. Sources real styled-outfit photos from Wikimedia
 * Commons (verified individually, no watermarks, no photos of
 * identifiable public figures) plus reuses two of the user's own
 * AI-generated bridal photos already uploaded for the /bridal page.
 *
 * Run with: npm run db:seed-outfits
 */
import { mkdtempSync } from "fs";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { cloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { products, productImages, productVariants } from "@/db/schema";

interface OutfitSpec {
  name: string;
  category: string;
  color: string;
  occasion: string;
  price: number;
  isCustomOrderable: boolean;
  sizes: string[];
  description: string;
  // Either a fresh external photo to download, or an existing Cloudinary
  // public_id already uploaded (no re-fetch needed).
  source: { kind: "download"; url: string; publicId: string; credit: string } | { kind: "existing"; publicId: string };
}

const outfits: OutfitSpec[] = [
  {
    name: "Colorblock Oversized Top",
    category: "Casual",
    color: "Navy",
    occasion: "everyday",
    price: 25000,
    isCustomOrderable: false,
    sizes: ["S", "M", "L", "XL"],
    description: "Relaxed-fit colorblock top in navy, olive, and orange with a contrast patch pocket.",
    source: {
      kind: "download",
      url: "https://upload.wikimedia.org/wikipedia/commons/3/37/OBI_Xtra_traditional_attire_2.jpg",
      publicId: "fabrics-and-bridals/outfits/colorblock-top",
      credit: "Photo by Obixt, CC BY-SA 4.0. Source: https://commons.wikimedia.org/wiki/File:OBI_Xtra_traditional_attire_2.jpg",
    },
  },
  {
    name: "Embroidered Shift Dress",
    category: "Business",
    color: "Grey",
    occasion: "everyday",
    price: 38000,
    isCustomOrderable: true,
    sizes: ["S", "M", "L"],
    description: "Sleeveless grey shift dress with cream embroidered panel detail and a pleated hem.",
    source: {
      kind: "download",
      url: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Happy_kaftan_dress.jpg",
      publicId: "fabrics-and-bridals/outfits/embroidered-shift-dress",
      credit: "Photo by Zediajaab, CC BY-SA 4.0. Source: https://commons.wikimedia.org/wiki/File:Happy_kaftan_dress.jpg",
    },
  },
  {
    name: "Navy Beaded Agbada Set",
    category: "Aso-Ebi",
    color: "Navy",
    occasion: "wedding guest",
    price: 65000,
    isCustomOrderable: true,
    sizes: ["M", "L", "XL", "XXL"],
    description: "Three-piece navy agbada set with red beaded embroidery on the inner robe.",
    source: {
      kind: "download",
      url: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Men_clothes_agbada.jpg",
      publicId: "fabrics-and-bridals/outfits/navy-agbada-set",
      credit: "Photo by Sweetwata, CC BY-SA 4.0. Source: https://commons.wikimedia.org/wiki/File:Men_clothes_agbada.jpg",
    },
  },
  {
    name: "Blush Aso-Ebi Two-Piece",
    category: "Aso-Ebi",
    color: "Blush",
    occasion: "party",
    price: 45000,
    isCustomOrderable: true,
    sizes: ["S", "M", "L", "XL"],
    description: "Blush cotton two-piece — button-front top and tapered trousers — with a matching gele.",
    source: { kind: "existing", publicId: "fabrics-and-bridals/bridal-page/aso-ebi-look" },
  },
  {
    name: "Champagne Satin Bridal Gown",
    category: "Bridal",
    color: "Champagne",
    occasion: "wedding",
    price: 180000,
    isCustomOrderable: true,
    sizes: ["Made to measure"],
    description: "Fitted champagne satin gown with a beaded lace bodice and a soft A-line skirt.",
    source: { kind: "existing", publicId: "fabrics-and-bridals/bridal-page/bridal-gown" },
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
  console.log("Removing earlier seeded outfits...");
  for (const outfit of outfits) {
    await db.delete(products).where(eq(products.name, outfit.name));
  }

  const tmpDir = mkdtempSync(path.join(tmpdir(), "outfit-photos-"));

  for (const outfit of outfits) {
    let publicId: string;

    if (outfit.source.kind === "download") {
      const res = await fetch(outfit.source.url);
      if (!res.ok) {
        console.warn(`  ! Failed to download ${outfit.name} — skipping`);
        continue;
      }
      const raw = Buffer.from(await res.arrayBuffer());
      const compressed = await sharp(raw)
        .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82 })
        .toBuffer();

      const localPath = path.join(tmpDir, `${slugify(outfit.name)}.jpg`);
      await writeFile(localPath, compressed);

      const upload = await cloudinary.uploader.upload(localPath, {
        public_id: outfit.source.publicId,
        overwrite: true,
      });
      publicId = upload.public_id;
    } else {
      publicId = outfit.source.publicId;
    }

    const slug = `${slugify(outfit.name)}-${Date.now().toString(36)}`;
    const description =
      outfit.source.kind === "download" ? `${outfit.description} ${outfit.source.credit}` : outfit.description;

    const [product] = await db
      .insert(products)
      .values({
        type: "outfit",
        name: outfit.name,
        slug,
        description,
        category: outfit.category,
        color: outfit.color,
        occasion: outfit.occasion,
        price: String(outfit.price),
        isCustomOrderable: outfit.isCustomOrderable,
        stockQuantity: outfit.isCustomOrderable ? null : 10,
        tags: [outfit.category, outfit.color, outfit.occasion].map((s) => s.toLowerCase()),
      })
      .returning();

    await db.insert(productImages).values({
      productId: product.id,
      cloudinaryPublicId: publicId,
      position: 0,
    });

    if (outfit.sizes.length > 0) {
      await db.insert(productVariants).values(
        outfit.sizes.map((size) => ({
          productId: product.id,
          attributeName: "size",
          attributeValue: size,
        }))
      );
    }

    console.log(`  + ${outfit.name} -> ${publicId}`);
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
