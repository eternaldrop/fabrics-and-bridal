/**
 * Uploads the two static homepage images (hero + mood board preview) to
 * fixed Cloudinary public_ids, so the homepage can reference them
 * directly rather than through a product. Sourced from Openverse the same
 * way as db/seed-images.ts — see ATTRIBUTION below for credit, which the
 * homepage displays next to each image per the CC BY license.
 *
 * Run with: npm run db:seed-site-images
 */
import { mkdtempSync } from "fs";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import sharp from "sharp";
import { cloudinary } from "@/lib/cloudinary";

const images = [
  {
    publicId: "fabrics-and-bridals/site/hero",
    url: "https://live.staticflickr.com/4018/4703922075_671b5e06e2_b.jpg",
    width: 2400,
    height: 1600,
    credit: "Photo: \"Free Wedding Dress Lace Texture\" by Beverly & Pack, CC BY 2.0",
  },
  {
    publicId: "fabrics-and-bridals/site/moodboard-preview",
    url: "https://live.staticflickr.com/536/31279845870_73e64cd34c_b.jpg",
    width: 1200,
    height: 1200,
    credit: "Photo: \"Peony Blush\" by Angel Lite Photography, Public Domain Mark 1.0",
  },
];

async function main() {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "site-images-"));

  for (const img of images) {
    const res = await fetch(img.url);
    if (!res.ok) throw new Error(`Failed to download ${img.url}: ${res.status}`);
    const raw = Buffer.from(await res.arrayBuffer());

    const compressed = await sharp(raw)
      .resize({ width: img.width, height: img.height, fit: "cover" })
      .jpeg({ quality: 82 })
      .toBuffer();

    const localPath = path.join(tmpDir, `${path.basename(img.publicId)}.jpg`);
    await writeFile(localPath, compressed);

    const upload = await cloudinary.uploader.upload(localPath, {
      public_id: img.publicId,
      overwrite: true,
    });

    console.log(`+ ${img.publicId} -> ${upload.secure_url}`);
    console.log(`  ${img.credit}`);
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
