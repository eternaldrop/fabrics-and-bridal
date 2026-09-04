import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { bridalConsultations } from "@/db/schema";

export async function getConsultationsForUser(userId: string) {
  return db
    .select()
    .from(bridalConsultations)
    .where(eq(bridalConsultations.userId, userId))
    .orderBy(desc(bridalConsultations.createdAt));
}
