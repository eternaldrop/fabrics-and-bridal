/**
 * Bulk-populates the catalog purely so the admin/customer pagination (20
 * per page on the shop, 2 per page in the admin tables) has more than one
 * page to actually demonstrate — adds 10 more fabrics and 36 more outfits.
 *
 * These reuse the photography already uploaded for existing catalog items
 * (cycling through it with new names/prices/attributes) rather than
 * sourcing new photos — this is volume test data, not real merchandising.
 * Swap in real photos via the admin Fabrics/Outfits pages any time.
 *
 * Run with: npm run db:seed-bulk-demo-items
 */
import { db } from "@/lib/db";
import { products, productImages, productVariants } from "@/db/schema";
import { FABRIC_CATEGORIES, FABRIC_MATERIALS, OUTFIT_CATEGORIES, OUTFIT_SIZES } from "@/lib/taxonomy";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const COLORS = [
  "Emerald", "Sapphire", "Ruby", "Amethyst", "Coral", "Charcoal", "Gold", "Teal",
  "Plum", "Rust", "Mint", "Lavender", "Crimson", "Pearl", "Copper", "Jade",
  "Indigo", "Rose Gold", "Espresso", "Olive", "Slate", "Mustard", "Cobalt", "Bronze",
  "Cream", "Peach", "Turquoise", "Maroon", "Periwinkle", "Tangerine", "Onyx", "Graphite",
  "Lilac", "Chartreuse", "Magenta", "Silver",
];

const FABRIC_DESCRIPTORS = [
  "Twill", "Voile", "Georgette", "Poplin", "Damask", "Jacquard", "Crepe", "Organza", "Taffeta", "Brocade",
];

// Every fabric currently in the catalog's main image — reused here for
// volume, not sourced fresh.
const FABRIC_IMAGES = [
  "fabrics-and-bridals/seed-photos/beaded-bridal-lace",
  "fabrics-and-bridals/seed-photos/silk-charmeuse",
  "fabrics-and-bridals/seed-photos/aso-oke-woven-cloth",
  "fabrics-and-bridals/seed-photos/white-organza",
  "fabrics-and-bridals/seed-photos/natural-linen",
  "fabrics-and-bridals/seed-photos/chantilly-lace-detail",
  "fabrics-and-bridals/seed-photos/indigo-denim",
  "fabrics-and-bridals/seed-photos/gold-brocade",
  "fabrics-and-bridals/seed-photos/kente-cloth",
  "fabrics-and-bridals/seed-photos/ivory-chantilly-lace",
  "fabrics-and-bridals/seed-photos/champagne-silk-satin",
  "fabrics-and-bridals/seed-photos/white-duchess-satin",
  "fabrics-and-bridals/seed-photos/pastel-chiffon",
  "fabrics-and-bridals/seed-photos/blush-tulle",
  "fabrics-and-bridals/seed-photos/ankara-wax-print",
  "fabrics-and-bridals/seed-photos/cotton-chambray",
  "fabrics-and-bridals/seed-photos/emerald-velvet",
  "fabrics-and-bridals/seed-photos/ivory-silk-chiffon",
  "fabrics-and-bridals/seed-photos/indigo-stretch-jersey",
  "fabrics-and-bridals/seed-photos/heathered-blue-jersey",
  "fabrics-and-bridals/seed-photos/charcoal-herringbone-coating",
  "fabrics-and-bridals/seed-photos/donegal-fleck-tweed-coating",
  "fabrics-and-bridals/seed-photos/mint-garden-floral-silk-main",
  "fabrics-and-bridals/seed-photos/violet-bloom-batik-print-main",
  "fabrics-and-bridals/seed-photos/blush-pastel-chiffon-main",
  "fabrics-and-bridals/seed-photos/mustard-paisley-silk-main",
  "fabrics-and-bridals/seed-photos/blush-magnolia-floral-main",
  "fabrics-and-bridals/seed-photos/lilac-floral-print-main",
  "fabrics-and-bridals/seed-photos/wildflower-blue-floral-main",
  "fabrics-and-bridals/seed-photos/noir-floral-print-main",
  "fabrics-and-bridals/seed-photos/sunlit-floral-chiffon-main",
  "fabrics-and-bridals/seed-photos/abstract-dot-sheer-main",
  "fabrics-and-bridals/seed-photos/rose-trail-floral-main",
  "fabrics-and-bridals/seed-photos/burgundy-silk-satin-main",
  "fabrics-and-bridals/seed-photos/sage-mauve-colorblock-satin-main",
];

const FABRIC_PRICE_RANGE: Record<string, [number, number]> = {
  "Bridal Fabrics": [18000, 30000],
  "Lace Fabrics": [15000, 28000],
  "Business Fabrics": [12000, 22000],
  "Coat Fabrics": [18000, 25000],
  "Stretch Fabrics": [4500, 7000],
  "Jersey Fabrics": [4500, 6500],
  "Casual Fabrics": [4000, 8500],
};

const FABRIC_OCCASION: Record<string, string> = {
  "Bridal Fabrics": "wedding",
  "Lace Fabrics": "party",
  "Business Fabrics": "business",
  "Coat Fabrics": "business",
  "Stretch Fabrics": "everyday",
  "Jersey Fabrics": "everyday",
  "Casual Fabrics": "everyday",
};

// Every outfit currently in the catalog, as a 3-image set — reused here
// for volume, not sourced fresh.
const OUTFIT_IMAGE_SETS = [
  ["fabrics-and-bridals/outfits/colorblock-top", "fabrics-and-bridals/outfits/colorblock-top-2", "fabrics-and-bridals/outfits/colorblock-top"],
  ["fabrics-and-bridals/outfits/embroidered-shift-dress", "fabrics-and-bridals/outfits/embroidered-shift-dress", "fabrics-and-bridals/outfits/embroidered-shift-dress"],
  ["fabrics-and-bridals/outfits/navy-agbada-set", "fabrics-and-bridals/outfits/navy-agbada-set-2", "fabrics-and-bridals/outfits/navy-agbada-set"],
  ["fabrics-and-bridals/bridal-page/aso-ebi-look", "fabrics-and-bridals/bridal-page/aso-ebi-look", "fabrics-and-bridals/bridal-page/aso-ebi-look"],
  ["fabrics-and-bridals/bridal-page/bridal-gown", "fabrics-and-bridals/bridal-page/bridal-gown", "fabrics-and-bridals/bridal-page/bridal-gown"],
  ["fabrics-and-bridals/outfits/floral-linen-coord-main", "fabrics-and-bridals/outfits/floral-linen-coord-style-1", "fabrics-and-bridals/outfits/floral-linen-coord-style-2"],
];

const OUTFIT_GARMENTS: Record<(typeof OUTFIT_CATEGORIES)[number], string[]> = {
  Casual: ["Wrap Top", "Wide-Leg Trousers", "Boxy Shirt", "Midi Dress", "Jumpsuit", "Linen Shorts Set"],
  "Native Wear": ["Agbada Set", "Iro & Buba", "Senator Set", "Kaftan", "Buba & Sokoto", "Ankara Wrap Dress"],
  Business: ["Pantsuit", "Sheath Dress", "Blazer Set", "Pencil Skirt Set", "Trouser Suit", "Wrap Blouse"],
  "Aso-Ebi": ["Two-Piece", "Gele & Wrapper Set", "Peplum Set", "Aso-Ebi Gown", "Iro & Buba Set"],
  Bridal: ["Ball Gown", "Mermaid Gown", "A-Line Gown", "Reception Gown", "Lace Wedding Gown"],
  Party: ["Sequin Dress", "Cocktail Dress", "Evening Gown", "Party Jumpsuit", "Beaded Gown"],
};

const OUTFIT_PRICE_RANGE: Record<(typeof OUTFIT_CATEGORIES)[number], [number, number]> = {
  Casual: [20000, 40000],
  "Native Wear": [35000, 60000],
  Business: [30000, 50000],
  "Aso-Ebi": [40000, 70000],
  Bridal: [120000, 200000],
  Party: [25000, 45000],
};

const OUTFIT_OCCASION: Record<(typeof OUTFIT_CATEGORIES)[number], string> = {
  Casual: "everyday",
  "Native Wear": "party",
  Business: "business",
  "Aso-Ebi": "wedding guest",
  Bridal: "wedding",
  Party: "party",
};

function priceAt([min, max]: [number, number], index: number, steps: number) {
  const step = (max - min) / Math.max(1, steps - 1);
  return Math.round((min + step * (index % steps)) / 100) * 100;
}

async function main() {
  console.log("Adding 10 fabrics...");
  for (let i = 0; i < 10; i++) {
    const color = COLORS[i % COLORS.length];
    const descriptor = FABRIC_DESCRIPTORS[i % FABRIC_DESCRIPTORS.length];
    const category = FABRIC_CATEGORIES[i % FABRIC_CATEGORIES.length];
    const material = FABRIC_MATERIALS[i % (FABRIC_MATERIALS.length - 1)]; // skip "Other"
    const name = `${color} ${descriptor}`;
    const price = priceAt(FABRIC_PRICE_RANGE[category], i, 8);

    const [product] = await db
      .insert(products)
      .values({
        type: "fabric",
        name,
        slug: `${slugify(name)}-${Date.now().toString(36)}-${i}`,
        category,
        material,
        color,
        occasion: FABRIC_OCCASION[category],
        price: String(price),
        isCustomOrderable: false,
        stockQuantity: 10 + (i % 4) * 5,
        tags: [category, material, color].map((s) => s.toLowerCase()),
      })
      .returning();

    const imgs = [
      FABRIC_IMAGES[i % FABRIC_IMAGES.length],
      FABRIC_IMAGES[(i + 12) % FABRIC_IMAGES.length],
      FABRIC_IMAGES[(i + 24) % FABRIC_IMAGES.length],
    ];
    await db.insert(productImages).values(
      imgs.map((publicId, position) => ({ productId: product.id, cloudinaryPublicId: publicId, position }))
    );

    console.log(`  + ${name}`);
  }

  console.log("Adding 36 outfits...");
  let idx = 0;
  for (const category of OUTFIT_CATEGORIES) {
    const garments = OUTFIT_GARMENTS[category];
    for (let g = 0; g < 6; g++) {
      const color = COLORS[idx % COLORS.length];
      const garment = garments[g % garments.length];
      const name = `${color} ${garment}`;
      const price = priceAt(OUTFIT_PRICE_RANGE[category], idx, 10);
      const imgSet = OUTFIT_IMAGE_SETS[idx % OUTFIT_IMAGE_SETS.length];

      const [product] = await db
        .insert(products)
        .values({
          type: "outfit",
          name,
          slug: `${slugify(name)}-${Date.now().toString(36)}-${idx}`,
          category,
          color,
          occasion: OUTFIT_OCCASION[category],
          price: String(price),
          isCustomOrderable: false,
          stockQuantity: 8 + (idx % 5) * 4,
          tags: [category, color].map((s) => s.toLowerCase()),
        })
        .returning();

      await db.insert(productImages).values(
        imgSet.map((publicId, position) => ({ productId: product.id, cloudinaryPublicId: publicId, position }))
      );

      await db.insert(productVariants).values(
        OUTFIT_SIZES.slice(0, 4).map((size) => ({
          productId: product.id,
          attributeName: "size",
          attributeValue: size,
        }))
      );

      console.log(`  + ${name}`);
      idx++;
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
