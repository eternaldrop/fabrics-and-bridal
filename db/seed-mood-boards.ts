/**
 * Seeds 6 sample mood boards shown on the public /bridal page, to give
 * brides something to browse before they book a real consultation.
 * Marked isSample: true and consultationId: null — entirely separate
 * from real, client-linked boards, which always have a consultation
 * behind them. Reuses photos already uploaded for the fabric catalog and
 * homepage carousel, so no new image sourcing was needed.
 *
 * Run with: npm run db:seed-mood-boards
 */
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { moodBoards, moodBoardItems } from "@/db/schema";

interface SampleBoard {
  title: string;
  styleDescriptor: string;
  colorPalette: { hex: string; label: string }[];
  images: string[]; // Cloudinary public_ids, already uploaded
}

const boards: SampleBoard[] = [
  {
    title: "Blush & Ivory Garden Wedding",
    styleDescriptor: "Soft, romantic, garden-inspired",
    colorPalette: [
      { hex: "#D9A5AE", label: "Blush" },
      { hex: "#FBF7EE", label: "Ivory" },
      { hex: "#9CAF88", label: "Sage" },
      { hex: "#C9A227", label: "Soft Gold" },
    ],
    images: [
      "fabrics-and-bridals/seed-photos/ivory-chantilly-lace",
      "fabrics-and-bridals/bridal-page/woven-fabric",
      "fabrics-and-bridals/bridal-page/aso-ebi-look",
      "fabrics-and-bridals/seed-photos/chantilly-lace-detail",
    ],
  },
  {
    title: "Emerald & Gold Evening Affair",
    styleDescriptor: "Rich, dramatic, evening glamour",
    colorPalette: [
      { hex: "#1F4D3A", label: "Emerald" },
      { hex: "#C9A227", label: "Gold" },
      { hex: "#1A1714", label: "Ink" },
      { hex: "#FBF7EE", label: "Ivory" },
    ],
    images: [
      "fabrics-and-bridals/seed-photos/gold-brocade",
      "fabrics-and-bridals/seed-photos/aso-oke-woven-cloth",
      "fabrics-and-bridals/seed-photos/silk-charmeuse",
      "fabrics-and-bridals/site/carousel-gown",
    ],
  },
  {
    title: "Terracotta & Cream Outdoor Ceremony",
    styleDescriptor: "Earthy, warm, sun-drenched",
    colorPalette: [
      { hex: "#C1652F", label: "Terracotta" },
      { hex: "#F7F1E8", label: "Cream" },
      { hex: "#8B8378", label: "Taupe" },
      { hex: "#8B3A1F", label: "Rust" },
    ],
    images: [
      "fabrics-and-bridals/seed-photos/emerald-velvet",
      "fabrics-and-bridals/seed-photos/natural-linen",
      "fabrics-and-bridals/seed-photos/ankara-wax-print",
      "fabrics-and-bridals/seed-photos/kente-cloth",
    ],
  },
  {
    title: "Champagne & Silver Modern Minimalist",
    styleDescriptor: "Clean, understated, modern elegance",
    colorPalette: [
      { hex: "#E8D8B8", label: "Champagne" },
      { hex: "#C7C7C7", label: "Silver" },
      { hex: "#1A1714", label: "Ink" },
      { hex: "#FBF7EE", label: "White" },
    ],
    images: [
      "fabrics-and-bridals/seed-photos/champagne-silk-satin",
      "fabrics-and-bridals/seed-photos/white-duchess-satin",
      "fabrics-and-bridals/seed-photos/beaded-bridal-lace",
      "fabrics-and-bridals/bridal-page/bridal-gown",
    ],
  },
  {
    title: "Wine & Aso-Ebi Celebration",
    styleDescriptor: "Bold, festive, traditional glamour",
    colorPalette: [
      { hex: "#7B2D3E", label: "Wine" },
      { hex: "#C9A227", label: "Gold" },
      { hex: "#4B2E5A", label: "Deep Purple" },
      { hex: "#F7F1E8", label: "Cream" },
    ],
    images: [
      "fabrics-and-bridals/seed-photos/silk-charmeuse",
      "fabrics-and-bridals/seed-photos/kente-cloth",
      "fabrics-and-bridals/seed-photos/gold-brocade",
      "fabrics-and-bridals/seed-photos/ivory-silk-chiffon",
    ],
  },
  {
    title: "Fuchsia & Ivory Celebration",
    styleDescriptor: "Playful, vibrant, joy-filled",
    colorPalette: [
      { hex: "#C2185B", label: "Fuchsia" },
      { hex: "#FBF7EE", label: "Ivory" },
      { hex: "#F5A3C7", label: "Rose Pink" },
      { hex: "#1A1714", label: "Ink" },
    ],
    images: [
      "fabrics-and-bridals/seed-photos/blush-tulle",
      "fabrics-and-bridals/seed-photos/pastel-chiffon",
      "fabrics-and-bridals/bridal-page/lace-detail",
      "fabrics-and-bridals/site/carousel-dahlia",
    ],
  },
];

async function main() {
  console.log("Removing earlier sample mood boards...");
  await db.delete(moodBoards).where(eq(moodBoards.isSample, true));

  for (const board of boards) {
    const [row] = await db
      .insert(moodBoards)
      .values({
        consultationId: null,
        title: board.title,
        styleDescriptor: board.styleDescriptor,
        colorPalette: board.colorPalette,
        status: "shared",
        isSample: true,
      })
      .returning();

    await db.insert(moodBoardItems).values(
      board.images.map((publicId, i) => ({
        moodBoardId: row.id,
        cloudinaryPublicId: publicId,
        position: i,
      }))
    );

    console.log(`  + ${board.title}`);
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
