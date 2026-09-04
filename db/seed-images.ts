/**
 * Seeds the catalog with real, freely-licensed fabric photos so it isn't
 * empty during development. Sources images from Openverse
 * (api.openverse.org), which aggregates CC-licensed photos from Flickr,
 * Wikimedia, etc. and needs no API key. Only pulls images whose license
 * permits commercial use and modification (we resize/crop for the site).
 * Downloaded photos are re-compressed with sharp before upload — keeps
 * Cloudinary's 10MB limit happy and matches the site's "compress catalog
 * images" requirement.
 *
 * Deletes any earlier placeholder-swatch products (from the previous
 * procedural-graphic seed) before inserting the real-photo ones.
 *
 * Run with: npm run db:seed-images
 */
import { mkdtempSync } from "fs";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { like } from "drizzle-orm";
import sharp from "sharp";
import { cloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { products, productImages } from "@/db/schema";

interface FabricSpec {
  name: string;
  searchQueries: string[];
  category: string;
  material: string;
  color: string;
  occasion: string;
  price: number;
}

// 10 general fabrics + 8 under the "bridal" category — 18 total, enough to
// span two pages at the 15-per-page catalog page size. Each has a couple
// of fallback search queries in case the first turns up nothing usable.
const fabrics: FabricSpec[] = [
  { name: "Ankara Wax Print", searchQueries: ["ankara wax print fabric", "african wax print fabric", "ankara cloth"], category: "aso-ebi", material: "Ankara / wax print cotton", color: "Multicolor", occasion: "party", price: 8500 },
  { name: "Silk Charmeuse", searchQueries: ["red silk fabric texture", "silk fabric"], category: "occasion wear", material: "Silk charmeuse", color: "Red", occasion: "evening", price: 15000 },
  { name: "Aso-Oke Woven Cloth", searchQueries: ["aso oke woven fabric", "aso oke nigeria", "handwoven cloth nigeria", "woven textile africa"], category: "aso-ebi", material: "Aso-oke", color: "Gold", occasion: "wedding guest", price: 22000 },
  { name: "Cotton Chambray", searchQueries: ["blue cotton chambray fabric", "cotton fabric texture"], category: "casual", material: "Cotton chambray", color: "Blue", occasion: "everyday", price: 4500 },
  { name: "Pastel Chiffon", searchQueries: ["pastel chiffon fabric", "chiffon fabric texture"], category: "occasion wear", material: "Chiffon", color: "Pastel pink", occasion: "party", price: 6500 },
  { name: "Natural Linen", searchQueries: ["natural linen fabric texture", "linen fabric"], category: "casual", material: "Linen", color: "Natural", occasion: "everyday", price: 5200 },
  { name: "Emerald Velvet", searchQueries: ["green velvet fabric texture", "velvet fabric"], category: "occasion wear", material: "Velvet", color: "Emerald", occasion: "evening", price: 18000 },
  { name: "Indigo Denim", searchQueries: ["blue denim fabric texture", "denim fabric close up"], category: "casual", material: "Denim", color: "Indigo", occasion: "everyday", price: 4000 },
  { name: "Gold Brocade", searchQueries: ["gold brocade fabric texture", "brocade fabric"], category: "aso-ebi", material: "Brocade", color: "Gold", occasion: "wedding guest", price: 19500 },
  { name: "Kente Cloth", searchQueries: ["kente cloth fabric", "kente cloth ghana"], category: "aso-ebi", material: "Kente", color: "Multicolor", occasion: "party", price: 24000 },
  { name: "Ivory Chantilly Lace", searchQueries: ["ivory lace fabric", "white lace fabric texture"], category: "bridal", material: "Chantilly lace", color: "Ivory", occasion: "wedding", price: 28000 },
  { name: "Blush Tulle", searchQueries: ["pink tulle fabric", "tulle fabric texture"], category: "bridal", material: "Tulle", color: "Blush", occasion: "wedding", price: 9000 },
  { name: "Champagne Silk Satin", searchQueries: ["champagne silk satin fabric", "satin fabric gold"], category: "bridal", material: "Silk satin", color: "Champagne", occasion: "wedding", price: 26000 },
  { name: "White Duchess Satin", searchQueries: ["white satin fabric texture", "satin fabric"], category: "bridal", material: "Duchess satin", color: "White", occasion: "wedding", price: 27000 },
  { name: "Beaded Bridal Lace", searchQueries: ["beaded lace fabric bridal", "beaded lace fabric", "embellished lace fabric"], category: "bridal", material: "Beaded lace", color: "Ivory", occasion: "wedding", price: 35000 },
  { name: "White Organza", searchQueries: ["white organza fabric", "organza fabric texture"], category: "bridal", material: "Organza", color: "White", occasion: "wedding", price: 12000 },
  { name: "Chantilly Lace Detail", searchQueries: ["chantilly lace fabric close up", "lace fabric detail"], category: "bridal", material: "Chantilly lace", color: "White", occasion: "wedding", price: 30000 },
  { name: "Ivory Silk Chiffon", searchQueries: ["ivory chiffon fabric texture", "cream chiffon fabric"], category: "bridal", material: "Silk chiffon", color: "Ivory", occasion: "wedding", price: 20000 },
];

interface OpenverseResult {
  url: string;
  creator: string | null;
  license: string;
  license_version: string | null;
  license_url: string | null;
  foreign_landing_url: string;
  provider: string;
}

async function searchOpenverse(query: string): Promise<OpenverseResult | null> {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license_type=commercial,modification&page_size=10&mature=false`;
  const res = await fetch(url, { headers: { "User-Agent": "fabrics-and-bridals-seed-script/1.0" } });
  if (!res.ok) return null;
  const data = await res.json();
  const results: OpenverseResult[] = data.results ?? [];
  return results.find((r) => /\.(jpe?g|png)(\?.*)?$/i.test(r.url)) ?? results[0] ?? null;
}

async function findImage(queries: string[]): Promise<OpenverseResult | null> {
  for (const query of queries) {
    const result = await searchOpenverse(query);
    if (result) return result;
  }
  return null;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function attributionText(result: OpenverseResult) {
  const creator = result.creator ?? "Unknown creator";
  const license = result.license.toUpperCase();
  const version = result.license_version ? ` ${result.license_version}` : "";
  return `Photo by ${creator} (${result.provider}), licensed CC ${license}${version}. Source: ${result.foreign_landing_url}`;
}

async function main() {
  console.log("Removing earlier placeholder-swatch products...");
  await db.delete(products).where(like(products.description, "Placeholder swatch graphic%"));

  const tmpDir = mkdtempSync(path.join(tmpdir(), "fabric-photos-"));
  console.log(`Sourcing ${fabrics.length} real fabric photos from Openverse...`);

  for (const fabric of fabrics) {
    try {
      const result = await findImage(fabric.searchQueries);
      if (!result) {
        console.warn(`  ! No result for "${fabric.name}" — skipping`);
        continue;
      }

      const imageRes = await fetch(result.url);
      if (!imageRes.ok) {
        console.warn(`  ! Failed to download image for "${fabric.name}" — skipping`);
        continue;
      }
      const rawBuffer = Buffer.from(await imageRes.arrayBuffer());

      // Downscale/recompress: keeps every upload well under Cloudinary's
      // free-tier size limit and matches the site's image-compression goal.
      const compressed = await sharp(rawBuffer)
        .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82 })
        .toBuffer();

      const id = slugify(fabric.name);
      const localPath = path.join(tmpDir, `${id}.jpg`);
      await writeFile(localPath, compressed);

      const upload = await cloudinary.uploader.upload(localPath, {
        folder: "fabrics-and-bridals/seed-photos",
        public_id: id,
        overwrite: true,
      });

      const slug = `${id}-${Date.now().toString(36)}`;

      const [product] = await db
        .insert(products)
        .values({
          type: "fabric",
          name: fabric.name,
          slug,
          description: attributionText(result),
          category: fabric.category,
          material: fabric.material,
          color: fabric.color,
          occasion: fabric.occasion,
          price: String(fabric.price),
          isCustomOrderable: fabric.category === "bridal",
          stockQuantity: fabric.category === "bridal" ? null : 20,
          tags: [fabric.category, fabric.material, fabric.color].map((s) => s.toLowerCase()),
        })
        .returning();

      await db.insert(productImages).values({
        productId: product.id,
        cloudinaryPublicId: upload.public_id,
        position: 0,
      });

      console.log(`  + ${fabric.name} -> ${upload.public_id} (credit: ${result.creator ?? "unknown"})`);
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
