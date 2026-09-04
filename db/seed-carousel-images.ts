/**
 * Uploads the two net-new images needed for the homepage hero carousel
 * (the "Colorful Vibes" and "Bridal Catalogues" slides reuse existing
 * catalog fabric photos for their other images — see
 * components/marketing/hero-carousel-data.ts for the full slide list).
 *
 * Run with: npm run db:seed-carousel-images
 */
import { mkdtempSync } from "fs";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import sharp from "sharp";
import { cloudinary } from "@/lib/cloudinary";

const images = [
  {
    publicId: "fabrics-and-bridals/site/carousel-dahlia",
    url: "https://live.staticflickr.com/84/241608721_42dce1b99b_b.jpg",
    width: 1600,
    height: 2000,
    credit: "Photo: \"Whimsey Dahlia\" by audreyjm529, CC BY 2.0",
  },
  {
    publicId: "fabrics-and-bridals/site/carousel-gown",
    url: "https://live.staticflickr.com/3106/2763438203_88a2621d37_b.jpg",
    width: 1600,
    height: 2000,
    credit: "Photo: \"The Gown\" by CharlotWest, CC BY-SA 2.0",
  },
];

async function main() {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "carousel-images-"));

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
