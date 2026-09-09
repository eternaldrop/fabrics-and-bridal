import { eq, desc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { bridalConsultations } from "@/db/schema";

// For the admin dashboard's consultations overview.
export async function getRecentConsultations(limit = 5) {
  return db
    .select()
    .from(bridalConsultations)
    .orderBy(desc(bridalConsultations.createdAt))
    .limit(limit);
}

// For the admin Consultations page — every request a bride has submitted
// through the bridal consultation form, newest first, 2 per page (tables
// in the admin app paginate as soon as there's more than 2 rows).
export const ADMIN_TABLE_PAGE_SIZE = 2;

export async function getConsultationsPage(page = 1) {
  const currentPage = Math.max(1, page);

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(bridalConsultations)
      .orderBy(desc(bridalConsultations.createdAt))
      .limit(ADMIN_TABLE_PAGE_SIZE)
      .offset((currentPage - 1) * ADMIN_TABLE_PAGE_SIZE),
    db.select({ total: count() }).from(bridalConsultations),
  ]);

  return {
    items,
    page: currentPage,
    pageSize: ADMIN_TABLE_PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_TABLE_PAGE_SIZE)),
  };
}

export async function getPendingConsultationCount() {
  const [row] = await db
    .select({ total: count() })
    .from(bridalConsultations)
    .where(eq(bridalConsultations.status, "requested"));
  return row?.total ?? 0;
}
