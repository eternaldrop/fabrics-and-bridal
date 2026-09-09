/**
 * Sample bridal consultation requests — purely so the new admin
 * Consultations table (2-per-page pagination, status dropdown) has real
 * rows to demonstrate against instead of an empty state.
 *
 * Run with: npm run db:seed-sample-consultations
 */
import { db } from "@/lib/db";
import { bridalConsultations } from "@/db/schema";

const samples = [
  {
    guestName: "Ifeoma Chukwu",
    guestEmail: "ifeoma.chukwu@example.com",
    weddingDate: "2027-03-20",
    venueType: "Outdoor garden",
    weddingTheme: "Romantic garden, soft pastels",
    preferredColors: "Blush, ivory, sage green",
    budgetRange: "₦500,000 – ₦1,000,000",
    styleInspiration: "Something soft and romantic, lots of florals and light fabrics for an outdoor ceremony.",
    status: "requested" as const,
  },
  {
    guestName: "Amara Bello",
    guestEmail: "amara.bello@example.com",
    weddingDate: "2026-12-12",
    venueType: "Indoor hall",
    weddingTheme: "Classic and glamorous",
    preferredColors: "Emerald, gold, ivory",
    budgetRange: "Over ₦1,000,000",
    styleInspiration: "Rich jewel tones with gold accents — want the whole bridal train coordinated.",
    status: "responded" as const,
  },
  {
    guestName: "Tolu Adeyemi",
    guestEmail: "tolu.adeyemi@example.com",
    weddingDate: "2027-06-05",
    venueType: "Beach",
    weddingTheme: "Relaxed destination beach wedding",
    preferredColors: "Sky blue, sand, white",
    budgetRange: "₦200,000 – ₦500,000",
    styleInspiration: "Light, breathable fabrics for a beach ceremony — nothing too heavy or structured.",
    status: "ongoing" as const,
  },
  {
    guestName: "Chiamaka Okoro",
    guestEmail: "chiamaka.okoro@example.com",
    weddingDate: "2026-11-08",
    venueType: "Church / religious venue",
    weddingTheme: "Traditional with a modern twist",
    preferredColors: "Wine, gold",
    budgetRange: "₦500,000 – ₦1,000,000",
    styleInspiration: "Traditional aso-ebi for the family, but a modern silhouette for the bride.",
    status: "finished" as const,
  },
  {
    guestName: "Ngozi Eze",
    guestEmail: "ngozi.eze@example.com",
    weddingDate: "2027-01-15",
    venueType: "Home / private residence",
    weddingTheme: "Intimate and understated",
    preferredColors: "Champagne, dusty rose",
    budgetRange: "Under ₦200,000",
    styleInspiration: "Small, intimate ceremony — simple and elegant, nothing over the top.",
    status: "requested" as const,
  },
  {
    guestName: "Funmilayo Adisa",
    guestEmail: "funmilayo.adisa@example.com",
    weddingDate: "2027-09-18",
    venueType: "Outdoor garden",
    weddingTheme: "Bold and colourful celebration",
    preferredColors: "Fuchsia, orange, gold",
    budgetRange: "Not sure yet",
    styleInspiration: "Want it to feel festive and joyful — open to bold color combinations.",
    status: "ongoing" as const,
  },
];

async function main() {
  for (const s of samples) {
    await db.insert(bridalConsultations).values({
      guestName: s.guestName,
      guestEmail: s.guestEmail,
      consultationType: "async",
      weddingDate: s.weddingDate,
      venueType: s.venueType,
      weddingTheme: s.weddingTheme,
      budgetRange: s.budgetRange,
      styleInspiration: s.styleInspiration,
      stylePreferences: { preferredColors: s.preferredColors, inspirationImagePublicIds: [] },
      status: s.status,
    });
    console.log(`  + ${s.guestName} (${s.status})`);
  }
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
