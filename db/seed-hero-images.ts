/**
 * Uploads the new photos dropped into the "Hero Images" folder (project
 * root) for the homepage hero carousel — see
 * components/marketing/hero-carousel-data.ts for where each one is used.
 *
 * Fabric hero primary and the entire Bridal Catalogues slide are
 * intentionally left alone (already uploaded in earlier runs); this only
 * uploads the new secondary/collage photos and the new Colorful Vibes and
 * Made to Measure hero shots.
 *
 * Run with: npm run db:seed-hero-images
 */
import { readFile } from "fs/promises";
import { mkdtempSync } from "fs";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import sharp from "sharp";
import { cloudinary } from "@/lib/cloudinary";

const SRC_DIR = path.join(__dirname, "..", "Hero Images");

const images = [
  { localFile: "chiffon for hero images.jpg", publicId: "fabrics-and-bridals/site/hero-chiffon-swirl" },
  {
    localFile: "Fabric hero images small section.jpg",
    publicId: "fabrics-and-bridals/site/hero-leaf-print-fabric",
  },
  { localFile: "Colorful hero.jfif", publicId: "fabrics-and-bridals/site/hero-colorful-jumpsuit" },
  { localFile: "Outfit Hero.jfif", publicId: "fabrics-and-bridals/site/hero-outfit-tan-dress" },
  { localFile: "Outfit hero (2).jfif", publicId: "fabrics-and-bridals/site/hero-outfit-black-gown" },
  { localFile: "Outfit hero (3).jfif", publicId: "fabrics-and-bridals/site/hero-outfit-palm-coord" },
];

async function main() {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "hero-images-"));

  for (const img of images) {
    const raw = await readFile(path.join(SRC_DIR, img.localFile));
    const compressed = await sharp(raw)
      .resize({ width: 2000, height: 1500, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const localPath = path.join(tmpDir, `${path.basename(img.publicId)}.jpg`);
    await writeFile(localPath, compressed);

    const upload = await cloudinary.uploader.upload(localPath, {
      public_id: img.publicId,
      overwrite: true,
    });

    console.log(`+ ${img.publicId} -> ${upload.secure_url}`);
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
