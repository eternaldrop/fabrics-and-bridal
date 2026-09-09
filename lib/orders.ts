import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, users } from "@/db/schema";

// For the admin dashboard's "Recent orders" section — always capped at 5,
// newest first, regardless of how many orders exist overall.
export async function getRecentOrders(limit = 5) {
  return db
    .select({
      id: orders.id,
      status: orders.status,
      totalAmount: orders.totalAmount,
      createdAt: orders.createdAt,
      buyerName: users.name,
      buyerEmail: users.email,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(limit);
}
