import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bridalConsultations } from "@/db/schema";

const statusSchema = z.object({
  status: z.enum(["requested", "responded", "ongoing", "finished"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "stylist")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid status" },
      { status: 400 }
    );
  }

  const { id } = await params;
  await db
    .update(bridalConsultations)
    .set({ status: parsed.data.status })
    .where(eq(bridalConsultations.id, id));

  return NextResponse.json({ ok: true });
}
