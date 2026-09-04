/**
 * One-off correction: several photos in the original db/seed-images.ts run
 * were picked by an automated fallback search without visual verification
 * and turned out to be wrong or inappropriate for their product (a
 * commemorative cloth depicting a real person's face, a random design
 * blog infographic, glass ornaments with a visible third-party watermark,
 * a museum photo of the Wizard of Oz ruby slippers, full garment/model
 * photos instead of fabric swatches, and two color-mismatched fabrics).
 * This overwrites those Cloudinary images with manually-verified
 * replacements and corrects the affected product records (description
 * attribution, and name/color for the two that no longer matched their
 * photo's actual color).
 *
 * Run with: npm run db:fix-fabric-images
 */
import { mkdtempSync } from "fs";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { cloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { products } from "@/db/schema";

interface Fix {
  publicId: string;
  productName: string; // matches the existing product's current name
  sourceUrl: string;
  fabricType: string;
  credit: { creator: string; license: string; version: string; url: string };
  rename?: { name: string; color: string };
}

const fixes: Fix[] = [
  {
    publicId: "fabrics-and-bridals/seed-photos/ankara-wax-print",
    productName: "Ankara Wax Print",
    sourceUrl: "https://live.staticflickr.com/4049/4619081681_cff559d51d_b.jpg",
    fabricType: "Batik-pattern cotton",
    credit: { creator: "shaire productions", license: "BY", version: "2.0", url: "https://www.flickr.com/photos/9822107@N08/4619081681" },
  },
  {
    publicId: "fabrics-and-bridals/seed-photos/cotton-chambray",
    productName: "Cotton Chambray",
    sourceUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Chambray_fabric.jpg",
    fabricType: "Cotton chambray",
    credit: { creator: "Enby", license: "BY-SA", version: "4.0", url: "https://commons.wikimedia.org/w/index.php?curid=92286312" },
  },
  {
    publicId: "fabrics-and-bridals/seed-photos/emerald-velvet",
    productName: "Emerald Velvet",
    sourceUrl: "https://live.staticflickr.com/2534/4207543611_f7c0d2faf5_b.jpg",
    fabricType: "Pleated fabric",
    credit: { creator: "shaire productions", license: "BY", version: "2.0", url: "https://www.flickr.com/photos/9822107@N08/4207543611" },
    rename: { name: "Rust Pleated Fabric", color: "Rust" },
  },
  {
    publicId: "fabrics-and-bridals/seed-photos/beaded-bridal-lace",
    productName: "Beaded Bridal Lace",
    sourceUrl: "https://live.staticflickr.com/4144/5204797042_a1c71fff56_b.jpg",
    fabricType: "Sequined lace mesh",
    credit: { creator: "shaire productions", license: "BY", version: "2.0", url: "https://www.flickr.com/photos/9822107@N08/5204797042" },
    rename: { name: "Beaded Bridal Lace", color: "Silver" },
  },
  {
    publicId: "fabrics-and-bridals/seed-photos/white-organza",
    productName: "White Organza",
    sourceUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Organza_fabric.jpg",
    fabricType: "Organza",
    credit: { creator: "Shiva Theerthagiri", license: "BY", version: "4.0", url: "https://commons.wikimedia.org/w/index.php?curid=176372885" },
    rename: { name: "Peach Organza", color: "Peach" },
  },
  {
    publicId: "fabrics-and-bridals/seed-photos/chantilly-lace-detail",
    productName: "Chantilly Lace Detail",
    sourceUrl: "https://live.staticflickr.com/129/390021401_5bcc78bb2a_b.jpg",
    fabricType: "Chantilly lace",
    credit: { creator: "-Jer-", license: "BY", version: "2.0", url: "https://www.flickr.com/photos/16564057@N00/390021401" },
  },
  {
    publicId: "fabrics-and-bridals/seed-photos/ivory-silk-chiffon",
    productName: "Ivory Silk Chiffon",
    sourceUrl: "https://live.staticflickr.com/3389/3592216753_a446880a61_b.jpg",
    fabricType: "Silk chiffon",
    credit: { creator: "shaire productions", license: "BY", version: "2.0", url: "https://www.flickr.com/photos/9822107@N08/3592216753" },
  },
  {
    publicId: "fabrics-and-bridals/seed-photos/pastel-chiffon",
    productName: "Pastel Chiffon",
    sourceUrl: "https://live.staticflickr.com/4144/4945838938_b2ec5fb7b7_b.jpg",
    fabricType: "Chiffon",
    credit: { creator: "shaire productions", license: "BY", version: "2.0", url: "https://www.flickr.com/photos/9822107@N08/4945838938" },
    rename: { name: "Fuchsia Chiffon", color: "Fuchsia" },
  },
  {
    publicId: "fabrics-and-bridals/seed-photos/blush-tulle",
    productName: "Blush Tulle",
    sourceUrl: "https://live.staticflickr.com/3006/2596516476_a916ac261e_b.jpg",
    fabricType: "Tulle",
    credit: { creator: "Dvlshkitten", license: "BY", version: "2.0", url: "https://www.flickr.com/photos/65327729@N00/2596516476" },
    rename: { name: "Fuchsia Tulle", color: "Fuchsia" },
  },
];

async function main() {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "fabric-fixes-"));

  for (const fix of fixes) {
    console.log(`Fixing ${fix.productName}...`);

    const res = await fetch(fix.sourceUrl);
    if (!res.ok) throw new Error(`Failed to download ${fix.sourceUrl}: ${res.status}`);
    const raw = Buffer.from(await res.arrayBuffer());

    const compressed = await sharp(raw)
      .resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toBuffer();

    const localPath = path.join(tmpDir, `${path.basename(fix.publicId)}.jpg`);
    await writeFile(localPath, compressed);

    await cloudinary.uploader.upload(localPath, {
      public_id: fix.publicId,
      overwrite: true,
      invalidate: true, // bust Cloudinary's CDN cache for this public_id
    });

    const description = `Fabric type: ${fix.fabricType}. Photo by ${fix.credit.creator} (via ${fix.credit.url.includes("wikimedia") ? "Wikimedia Commons" : "Flickr"}), licensed CC ${fix.credit.license} ${fix.credit.version}. Source: ${fix.credit.url}`;

    const updates: Partial<typeof products.$inferInsert> = { description };
    if (fix.rename) {
      updates.name = fix.rename.name;
      updates.color = fix.rename.color;
    }

    await db.update(products).set(updates).where(eq(products.name, fix.productName));

    console.log(`  done (credit: ${fix.credit.creator})`);
  }

  console.log("All fixes applied.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
