/**
 * Uploads the user-supplied bridal photography from
 * "images for bridal page/" to fixed Cloudinary public_ids, so the
 * /bridal page and homepage carousel can reference them directly.
 * These are the user's own AI-generated images (confirmed via embedded
 * C2PA metadata) — no licensing concerns, unlike the fabrics folder
 * (excluded entirely: all 6 carried a competitor's "TISSURA" watermark).
 *
 * Run with: npm run db:seed-bridal-page-images
 */
import { readFile } from "fs/promises";
import { mkdtempSync } from "fs";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import sharp from "sharp";
import { cloudinary } from "@/lib/cloudinary";

const sourceDir = path.join(__dirname, "..", "images for bridal page");

const images = [
  { file: "bridal hero.jfif", publicId: "fabrics-and-bridals/bridal-page/hero" },
  { file: "download.jfif", publicId: "fabrics-and-bridals/bridal-page/aso-ebi-look" },
  { file: "download (1).jfif", publicId: "fabrics-and-bridals/bridal-page/bridal-gown" },
  { file: "download (2).jfif", publicId: "fabrics-and-bridals/bridal-page/woven-fabric" },
  { file: "download (3).jfif", publicId: "fabrics-and-bridals/bridal-page/lace-detail" },
];

async function main() {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "bridal-page-images-"));

  for (const img of images) {
    const raw = await readFile(path.join(sourceDir, img.file));

    const compressed = await sharp(raw)
      .resize({ width: 1800, withoutEnlargement: true })
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
