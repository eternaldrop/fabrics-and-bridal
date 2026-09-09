/**
 * Uploads the new static homepage hero — a wide shot of stacked fabric
 * bolts, for the redesigned homepage's "Cloth chosen for you, cut to fit
 * you." opener. Sourced from Openverse the same way as db/seed-images.ts —
 * see ATTRIBUTION below for credit, which the homepage displays next to it
 * per the CC BY-SA license.
 *
 * Run with: npm run db:seed-homepage-hero
 */
import { readFile } from "fs/promises";
import { mkdtempSync } from "fs";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import sharp from "sharp";
import { cloudinary } from "@/lib/cloudinary";

const SRC_FILE = "C:\\Users\\OYINKANSOLA-ZYONEL\\AppData\\Local\\Temp\\claude\\hero-search\\yongle.jpg";
const PUBLIC_ID = "fabrics-and-bridals/site/hero-bolts";
// Photo: "Yongle Market, Taipei City" by Taiwan Scenery Gallery, CC BY-SA 2.0
// https://www.flickr.com/photos/149723665@N07/30531827633

async function main() {
  const raw = await readFile(SRC_FILE);
  const compressed = await sharp(raw)
    .resize({ width: 2400, height: 1400, fit: "cover" })
    .jpeg({ quality: 82 })
    .toBuffer();

  const tmpDir = mkdtempSync(path.join(tmpdir(), "homepage-hero-"));
  const localPath = path.join(tmpDir, "hero-bolts.jpg");
  await writeFile(localPath, compressed);

  const upload = await cloudinary.uploader.upload(localPath, {
    public_id: PUBLIC_ID,
    overwrite: true,
  });

  console.log(`+ ${PUBLIC_ID} -> ${upload.secure_url}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
