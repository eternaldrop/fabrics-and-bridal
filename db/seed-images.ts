/**
 * One-off content seed: procedurally-drawn fabric "swatch" placeholder
 * images (not real photography — see each product's description), so the
 * catalog isn't empty while real product photos are pending. Run with:
 *   npm run db:seed-images
 */
import sharp from "sharp";
import { mkdtempSync } from "fs";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { cloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { products, productImages } from "@/db/schema";

const WIDTH = 960;
const HEIGHT = 1200;

interface SwatchSpec {
  name: string;
  type: "fabric" | "outfit";
  category: string;
  material: string;
  color: string;
  occasion: string;
  price: number;
  svg: (id: string) => string;
}

// Small helpers to build repeating <pattern> fills — no gradients, per the
// site's design brief (patterns/textures instead).
function stripePattern(id: string, bg: string, stripe: string, w = 28) {
  return `
    <pattern id="${id}" width="${w}" height="${w}" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <rect width="${w}" height="${w}" fill="${bg}"/>
      <rect width="${w / 2.5}" height="${w}" fill="${stripe}"/>
    </pattern>`;
}

function dotMeshPattern(id: string, bg: string, dot: string, spacing = 34, r = 3) {
  return `
    <pattern id="${id}" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
      <rect width="${spacing}" height="${spacing}" fill="${bg}"/>
      <circle cx="${spacing / 2}" cy="${spacing / 2}" r="${r}" fill="${dot}"/>
      <circle cx="0" cy="0" r="${r}" fill="${dot}"/>
      <circle cx="${spacing}" cy="0" r="${r}" fill="${dot}"/>
      <circle cx="0" cy="${spacing}" r="${r}" fill="${dot}"/>
      <circle cx="${spacing}" cy="${spacing}" r="${r}" fill="${dot}"/>
    </pattern>`;
}

function meshPattern(id: string, bg: string, line: string, spacing = 24) {
  return `
    <pattern id="${id}" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
      <rect width="${spacing}" height="${spacing}" fill="${bg}"/>
      <path d="M0 0 L${spacing} ${spacing} M${spacing} 0 L0 ${spacing}" stroke="${line}" stroke-width="1"/>
    </pattern>`;
}

function diamondPattern(id: string, bg: string, a: string, b: string, size = 60) {
  return `
    <pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
      <rect width="${size}" height="${size}" fill="${bg}"/>
      <polygon points="${size / 2},4 ${size - 4},${size / 2} ${size / 2},${size - 4} 4,${size / 2}" fill="${a}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="4" fill="${b}"/>
    </pattern>`;
}

function crosshatchPattern(id: string, bg: string, line: string, spacing = 16) {
  return `
    <pattern id="${id}" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
      <rect width="${spacing}" height="${spacing}" fill="${bg}"/>
      <line x1="0" y1="0" x2="0" y2="${spacing}" stroke="${line}" stroke-width="1"/>
      <line x1="0" y1="0" x2="${spacing}" y2="0" stroke="${line}" stroke-width="1"/>
    </pattern>`;
}

function wrap(defs: string, patternId: string, label: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>${defs(patternId)}</defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${patternId})"/>
    <text x="24" y="${HEIGHT - 24}" font-family="Georgia, serif" font-size="20" fill="#1A171466">${label}</text>
  </svg>`;
}

const swatches: SwatchSpec[] = [
  {
    name: "Ankara Wax Print — Ochre Diamond",
    type: "fabric",
    category: "aso-ebi",
    material: "Ankara / wax print cotton",
    color: "Ochre",
    occasion: "party",
    price: 8500,
    svg: (id) => wrap((pid) => diamondPattern(pid, "#1A1714", "#C77F8C", "#F7F1E8", 64), id, "Ankara Wax Print"),
  },
  {
    name: "Silk Charmeuse — Wine",
    type: "fabric",
    category: "occasion wear",
    material: "Silk charmeuse",
    color: "Wine",
    occasion: "evening",
    price: 15000,
    svg: (id) => wrap((pid) => stripePattern(pid, "#5C1F2E", "#7B2D3E", 22), id, "Silk Charmeuse"),
  },
  {
    name: "Aso-Oke Woven Stripe — Gold",
    type: "fabric",
    category: "aso-ebi",
    material: "Aso-oke",
    color: "Gold",
    occasion: "wedding guest",
    price: 22000,
    svg: (id) => wrap((pid) => stripePattern(pid, "#8B8378", "#C9A227", 18), id, "Aso-Oke Woven"),
  },
  {
    name: "Cotton Chambray — Taupe",
    type: "fabric",
    category: "casual",
    material: "Cotton chambray",
    color: "Taupe",
    occasion: "everyday",
    price: 4500,
    svg: (id) => wrap((pid) => crosshatchPattern(pid, "#F7F1E8", "#8B8378", 16), id, "Cotton Chambray"),
  },
  {
    name: "Chiffon Floral Dot — Dusty Rose",
    type: "fabric",
    category: "occasion wear",
    material: "Chiffon",
    color: "Dusty rose",
    occasion: "party",
    price: 6500,
    svg: (id) => wrap((pid) => dotMeshPattern(pid, "#F7F1E8", "#D9A5AE", 30, 4), id, "Chiffon Floral Dot"),
  },
  {
    name: "Ivory Chantilly Lace",
    type: "fabric",
    category: "bridal",
    material: "Chantilly lace",
    color: "Ivory",
    occasion: "wedding",
    price: 28000,
    svg: (id) => wrap((pid) => meshPattern(pid, "#FBF7EE", "#8B8378", 20), id, "Ivory Chantilly Lace"),
  },
  {
    name: "Blush Tulle",
    type: "fabric",
    category: "bridal",
    material: "Tulle",
    color: "Blush",
    occasion: "wedding",
    price: 9000,
    svg: (id) => wrap((pid) => dotMeshPattern(pid, "#FBF7EE", "#D9A5AE", 26, 2.5), id, "Blush Tulle"),
  },
  {
    name: "Champagne Silk Satin",
    type: "fabric",
    category: "bridal",
    material: "Silk satin",
    color: "Champagne",
    occasion: "wedding",
    price: 26000,
    svg: (id) => wrap((pid) => stripePattern(pid, "#E8D8B8", "#D9C49A", 26), id, "Champagne Silk Satin"),
  },
  {
    name: "Pearl Duchess Satin",
    type: "fabric",
    category: "bridal",
    material: "Duchess satin",
    color: "Pearl white",
    occasion: "wedding",
    price: 27000,
    svg: (id) => wrap((pid) => stripePattern(pid, "#F3EFE6", "#E3DCCB", 26), id, "Pearl Duchess Satin"),
  },
  {
    name: "Beaded Bridal Lace — Ivory & Gold",
    type: "fabric",
    category: "bridal",
    material: "Beaded lace",
    color: "Ivory",
    occasion: "wedding",
    price: 35000,
    svg: (id) => wrap((pid) => diamondPattern(pid, "#FBF7EE", "#C9A227", "#8B8378", 48), id, "Beaded Bridal Lace"),
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
  const tmpDir = mkdtempSync(path.join(tmpdir(), "fabric-swatches-"));
  console.log(`Rendering ${swatches.length} placeholder swatches...`);

  for (const swatch of swatches) {
    const id = slugify(swatch.name);
    const svgMarkup = swatch.svg(id);
    const pngPath = path.join(tmpDir, `${id}.png`);

    await sharp(Buffer.from(svgMarkup)).png().toFile(pngPath);

    const upload = await cloudinary.uploader.upload(pngPath, {
      folder: "fabrics-and-bridals/seed-swatches",
      public_id: id,
      overwrite: true,
    });

    const slug = `${id}-${Date.now().toString(36)}`;

    const [product] = await db
      .insert(products)
      .values({
        type: swatch.type,
        name: swatch.name,
        slug,
        description:
          "Placeholder swatch graphic — not real photography. Replace with an actual product photo from the admin upload tool when available.",
        category: swatch.category,
        material: swatch.material,
        color: swatch.color,
        occasion: swatch.occasion,
        price: String(swatch.price),
        isCustomOrderable: swatch.category === "bridal",
        stockQuantity: swatch.category === "bridal" ? null : 20,
        tags: [swatch.category, swatch.material, swatch.color].map((s) => s.toLowerCase()),
      })
      .returning();

    await db.insert(productImages).values({
      productId: product.id,
      cloudinaryPublicId: upload.public_id,
      position: 0,
    });

    console.log(`  + ${swatch.name} -> ${upload.public_id}`);
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
