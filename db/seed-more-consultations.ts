/**
 * Adds more sample consultations so the admin Consultations table — now
 * paginated at 10 per page — actually has more than one page to
 * demonstrate. db/seed-sample-consultations.ts added 6; this adds 10 more
 * for 16 total (2 pages).
 *
 * Run with: npm run db:seed-more-consultations
 */
import { db } from "@/lib/db";
import { bridalConsultations } from "@/db/schema";

const samples = [
  {
    guestName: "Blessing Okafor",
    guestEmail: "blessing.okafor@example.com",
    weddingDate: "2027-02-14",
    venueType: "Indoor hall",
    weddingTheme: "Valentine-inspired romance, deep reds",
    preferredColors: "Wine, blush, gold",
    budgetRange: "₦500,000 – ₦1,000,000",
    styleInspiration: "Want a dramatic entrance look — a lot of movement in the gown.",
    status: "requested" as const,
  },
  {
    guestName: "Halima Suleiman",
    guestEmail: "halima.suleiman@example.com",
    weddingDate: "2027-04-10",
    venueType: "Outdoor garden",
    weddingTheme: "Soft, dreamy garden party",
    preferredColors: "Lilac, sage, cream",
    budgetRange: "₦200,000 – ₦500,000",
    styleInspiration: "Lightweight fabrics — it'll be a daytime outdoor ceremony.",
    status: "ongoing" as const,
  },
  {
    guestName: "Precious Nwachukwu",
    guestEmail: "precious.nwachukwu@example.com",
    weddingDate: "2026-12-24",
    venueType: "Church / religious venue",
    weddingTheme: "Christmas-season elegance",
    preferredColors: "Emerald, gold",
    budgetRange: "Over ₦1,000,000",
    styleInspiration: "Festive but still bridal — thinking velvet accents.",
    status: "responded" as const,
  },
  {
    guestName: "Aisha Bello",
    guestEmail: "aisha.bello2@example.com",
    weddingDate: "2027-07-03",
    venueType: "Beach",
    weddingTheme: "Barefoot beach wedding",
    preferredColors: "Coral, ivory, sand",
    budgetRange: "Under ₦200,000",
    styleInspiration: "Simple and breathable — nothing that'll wilt in the heat.",
    status: "requested" as const,
  },
  {
    guestName: "Grace Etim",
    guestEmail: "grace.etim@example.com",
    weddingDate: "2027-08-21",
    venueType: "Home / private residence",
    weddingTheme: "Small backyard gathering",
    preferredColors: "Dusty blue, white",
    budgetRange: "₦200,000 – ₦500,000",
    styleInspiration: "Under 30 guests — want something understated but still special.",
    status: "finished" as const,
  },
  {
    guestName: "Fatima Yusuf",
    guestEmail: "fatima.yusuf@example.com",
    weddingDate: "2027-05-29",
    venueType: "Indoor hall",
    weddingTheme: "Grand traditional wedding",
    preferredColors: "Royal blue, silver",
    budgetRange: "Over ₦1,000,000",
    styleInspiration: "Full aso-ebi coordination for the bridal train, plus a reception change.",
    status: "ongoing" as const,
  },
  {
    guestName: "Chidinma Obi",
    guestEmail: "chidinma.obi@example.com",
    weddingDate: "2027-03-06",
    venueType: "Outdoor garden",
    weddingTheme: "Modern minimalist, monochrome",
    preferredColors: "Black, white",
    budgetRange: "₦500,000 – ₦1,000,000",
    styleInspiration: "Clean lines, no lace — thinking structured silk.",
    status: "requested" as const,
  },
  {
    guestName: "Ronke Adebayo",
    guestEmail: "ronke.adebayo@example.com",
    weddingDate: "2026-10-17",
    venueType: "Church / religious venue",
    weddingTheme: "Classic white wedding",
    preferredColors: "White, gold",
    budgetRange: "₦500,000 – ₦1,000,000",
    styleInspiration: "Timeless silhouette, cathedral-length veil.",
    status: "finished" as const,
  },
  {
    guestName: "Zainab Mohammed",
    guestEmail: "zainab.mohammed@example.com",
    weddingDate: "2027-06-19",
    venueType: "Indoor hall",
    weddingTheme: "Northern traditional, rich textiles",
    preferredColors: "Maroon, gold, cream",
    budgetRange: "Over ₦1,000,000",
    styleInspiration: "Heavy embroidery, statement headpiece.",
    status: "responded" as const,
  },
  {
    guestName: "Comfort Iheanacho",
    guestEmail: "comfort.iheanacho@example.com",
    weddingDate: "2027-09-11",
    venueType: "Beach",
    weddingTheme: "Sunset beach ceremony",
    preferredColors: "Terracotta, peach, cream",
    budgetRange: "₦200,000 – ₦500,000",
    styleInspiration: "Warm sunset tones, flowing fabric that photographs well in wind.",
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
