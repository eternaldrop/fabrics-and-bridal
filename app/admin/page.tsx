import Link from "next/link";
import { desc, eq, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, orders } from "@/db/schema";
import { getPendingConsultationCount, getRecentConsultations } from "@/lib/consultations";
import { getRecentOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";
import { SwatchIcon, HangerIcon, BagIcon, CalendarHeartIcon } from "@/components/admin/icons";

export const metadata = { title: "Dashboard — Admin" };

const consultationStatusLabels: Record<string, string> = {
  requested: "Requested",
  responded: "Responded",
  ongoing: "Ongoing",
  finished: "Finished",
};

const orderStatusLabels: Record<string, string> = {
  pending: "Order placed",
  confirmed: "Confirmed",
  in_production: "In production",
  ready: "Ready",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Always the 5 most recent of each section, regardless of how many exist
// in total — recent orders, recent consultations, and recently added
// catalog items all pass limit 5 into their respective queries below.
const RECENT_SECTION_LIMIT = 5;

export default async function AdminDashboardPage() {
  const [
    [{ fabricCount }],
    [{ outfitCount }],
    [{ orderCount }],
    pendingConsultations,
    recentConsultations,
    recentOrders,
    recentProducts,
  ] = await Promise.all([
    db.select({ fabricCount: count() }).from(products).where(eq(products.type, "fabric")),
    db.select({ outfitCount: count() }).from(products).where(eq(products.type, "outfit")),
    db.select({ orderCount: count() }).from(orders),
    getPendingConsultationCount(),
    getRecentConsultations(RECENT_SECTION_LIMIT),
    getRecentOrders(RECENT_SECTION_LIMIT),
    db.select().from(products).orderBy(desc(products.createdAt)).limit(RECENT_SECTION_LIMIT),
  ]);

  return (
    <div>
      <Reveal>
        <h1 className="font-serif text-3xl mb-2">Dashboard</h1>
        <p className="text-taupe mb-10">
          An overview of the catalog, orders, and bridal consultations.
        </p>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        <Reveal delay={0}>
          <StatCard
            label="Fabrics"
            value={fabricCount}
            href="/admin/products/fabrics"
            icon={<SwatchIcon className="w-5 h-5" />}
            accent="bg-rose/20 text-blush"
          />
        </Reveal>
        <Reveal delay={60}>
          <StatCard
            label="Outfits"
            value={outfitCount}
            href="/admin/products/outfits"
            icon={<HangerIcon className="w-5 h-5" />}
            accent="bg-taupe/20 text-ink"
          />
        </Reveal>
        <Reveal delay={120}>
          <StatCard
            label="Orders"
            value={orderCount}
            icon={<BagIcon className="w-5 h-5" />}
            accent="bg-blush/20 text-blush"
          />
        </Reveal>
        <Reveal delay={180}>
          <StatCard
            label="Pending consultations"
            value={pendingConsultations}
            href="/admin/consultations"
            icon={<CalendarHeartIcon className="w-5 h-5" />}
            accent="bg-rose/20 text-blush"
          />
        </Reveal>
      </div>

      <section className="mb-14">
        <h2 className="font-serif text-2xl mb-4">Recent orders</h2>
        {recentOrders.length === 0 ? (
          <div className="border border-dashed border-taupe/40 rounded-brand p-8 text-center">
            <p className="text-taupe">
              Order history arrives with checkout in Phase 2 — nothing to show
              yet.
            </p>
          </div>
        ) : (
          <div className="border border-taupe/20 rounded-brand divide-y divide-taupe/20 overflow-hidden">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-4 px-4 flex items-center justify-between gap-4 transition-colors duration-150 hover:bg-taupe/5">
                <div>
                  <p className="font-serif">{order.buyerName}</p>
                  <p className="text-xs text-taupe mt-1">
                    {order.buyerEmail} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm">{formatPrice(order.totalAmount)}</p>
                  <span className="text-xs border border-taupe/40 rounded-brand px-3 py-1.5 inline-block mt-1">
                    {orderStatusLabels[order.status] ?? order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl">Recent bridal consultations</h2>
          <Link href="/admin/consultations" className="link-underline text-sm text-taupe hover:text-ink transition-colors">
            View all
          </Link>
        </div>
        {recentConsultations.length === 0 ? (
          <div className="border border-dashed border-taupe/40 rounded-brand p-8 text-center">
            <p className="text-taupe">No consultation requests yet.</p>
          </div>
        ) : (
          <div className="border border-taupe/20 rounded-brand divide-y divide-taupe/20 overflow-hidden">
            {recentConsultations.map((c) => (
              <div key={c.id} className="py-4 px-4 flex items-center justify-between gap-4 transition-colors duration-150 hover:bg-taupe/5">
                <div>
                  <p className="font-serif">{c.guestName}</p>
                  <p className="text-xs text-taupe mt-1">
                    {c.guestEmail} · Requested {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs border border-taupe/40 rounded-brand px-3 py-1.5 shrink-0">
                  {consultationStatusLabels[c.status] ?? c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-2xl mb-4">Recently added to catalog</h2>
        {recentProducts.length === 0 ? (
          <div className="border border-dashed border-taupe/40 rounded-brand p-8 text-center">
            <p className="text-taupe mb-4">Nothing in the catalog yet.</p>
            <Link
              href="/admin/products/fabrics"
              className="link-underline text-sm text-ink hover:text-blush transition-colors"
            >
              Add your first fabric
            </Link>
          </div>
        ) : (
          <div className="border border-taupe/20 rounded-brand divide-y divide-taupe/20 overflow-hidden">
            {recentProducts.map((p) => (
              <div key={p.id} className="py-4 px-4 flex items-center justify-between gap-4 transition-colors duration-150 hover:bg-taupe/5">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-taupe/10 flex items-center justify-center shrink-0 text-taupe">
                    {p.type === "fabric" ? <SwatchIcon className="w-4 h-4" /> : <HangerIcon className="w-4 h-4" />}
                  </span>
                  <div>
                    <p className="font-serif">{p.name}</p>
                    <p className="text-xs text-taupe mt-1">
                      {p.type === "fabric" ? "Fabric" : "Outfit"}
                      {p.category ? ` · ${p.category}` : ""}
                    </p>
                  </div>
                </div>
                <p className="text-sm">{formatPrice(p.price)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  icon,
  accent,
}: {
  label: string;
  value: number;
  href?: string;
  icon: React.ReactNode;
  accent: string;
}) {
  const inner = (
    <>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accent}`}>{icon}</div>
      <p className="text-xs text-taupe uppercase tracking-wide mt-4">{label}</p>
      <p className="font-serif text-3xl mt-1">{value}</p>
    </>
  );

  if (!href) {
    return <div className="border border-taupe/30 rounded-brand p-5">{inner}</div>;
  }

  return (
    <Link
      href={href}
      className="block border border-taupe/30 rounded-brand p-5 transition-[border-color,transform,box-shadow] duration-200 hover:border-ink hover:-translate-y-0.5 hover:shadow-md"
    >
      {inner}
    </Link>
  );
}
