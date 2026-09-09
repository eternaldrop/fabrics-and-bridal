import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { bridalConsultations } from "@/db/schema";

// Guest-only, single-track intake: no live-vs-written call scheduling, just
// a form that gets followed up by email — see app/api/consultations for the
// insert. consultationType stays "async" (kept alive in the schema for the
// admin dashboard's labeling, but never chosen by the bride here).
const consultationSchema = z.object({
  guestName: z.string().min(1, "Name is required"),
  guestEmail: z.string().email("Enter a valid email"),
  weddingDate: z.string().min(1, "Wedding date is required"),
  venueType: z.string().min(1, "Venue type is required"),
  weddingTheme: z.string().min(1, "Wedding theme is required"),
  preferredColors: z.string().min(1, "Favourite colours are required"),
  budgetRange: z.string().min(1, "Budget range is required"),
  styleInspiration: z.string().optional(),
  inspirationImagePublicIds: z.array(z.string()).max(3, "Up to 3 inspiration photos only").default([]),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = consultationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const [consultation] = await db
    .insert(bridalConsultations)
    .values({
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      consultationType: "async",
      weddingDate: data.weddingDate,
      venueType: data.venueType,
      weddingTheme: data.weddingTheme,
      budgetRange: data.budgetRange,
      styleInspiration: data.styleInspiration || undefined,
      stylePreferences: {
        preferredColors: data.preferredColors,
        inspirationImagePublicIds: data.inspirationImagePublicIds,
      },
      status: "requested",
    })
    .returning();

  return NextResponse.json({ ok: true, consultation }, { status: 201 });
}
