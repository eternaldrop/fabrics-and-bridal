import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bridalConsultations } from "@/db/schema";

const consultationSchema = z.object({
  consultationType: z.enum(["live", "async"]),
  preferredDate: z.string().optional(),
  weddingDate: z.string().optional(),
  venueType: z.string().optional(),
  season: z.string().optional(),
  budgetRange: z.string().optional(),
  styleInspiration: z.string().optional(),
  preferredColors: z.string().optional(),
  inspirationImagePublicIds: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Please log in to book a consultation." }, { status: 401 });
  }

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
      userId: session.user.id,
      consultationType: data.consultationType,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : undefined,
      weddingDate: data.weddingDate || undefined,
      venueType: data.venueType || undefined,
      season: data.season || undefined,
      budgetRange: data.budgetRange || undefined,
      styleInspiration: data.styleInspiration || undefined,
      stylePreferences: {
        preferredColors: data.preferredColors || undefined,
        inspirationImagePublicIds: data.inspirationImagePublicIds,
      },
      status: "requested",
    })
    .returning();

  return NextResponse.json({ ok: true, consultation }, { status: 201 });
}
