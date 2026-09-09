import { getAdminProductList, getAdminProductStats } from "@/lib/products";
import { AddProductModal } from "@/components/admin/add-product-modal";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { ProductList } from "@/components/admin/product-list";
import { Pagination } from "@/components/catalog/pagination";
import { Reveal } from "@/components/ui/reveal";
import { HangerIcon, GridIcon, StoreIcon, TagIcon } from "@/components/admin/icons";

export const metadata = { title: "Outfits — Admin" };

export default async function AdminOutfitsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [{ items, page, totalPages, total }, stats] = await Promise.all([
    getAdminProductList("outfit", params.page ? Number(params.page) : 1),
    getAdminProductStats("outfit"),
  ]);

  return (
    <Reveal>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-taupe/20 text-ink flex items-center justify-center shrink-0">
            <HangerIcon className="w-5 h-5" />
          </span>
          <h1 className="font-serif text-3xl">Outfits</h1>
        </div>
        <AddProductModal type="outfit" />
      </div>
      <p className="text-taupe mb-8">
        Add outfits here — they appear in the shop immediately.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <AdminStatCard
          label="Total outfits"
          value={stats.total}
          icon={<HangerIcon className="w-4 h-4" />}
          accent="bg-taupe/20 text-ink"
        />
        <AdminStatCard
          label="Categories"
          value={stats.categoryCount}
          icon={<GridIcon className="w-4 h-4" />}
          accent="bg-rose/20 text-blush"
        />
        <AdminStatCard
          label="In stock / made to order"
          value={`${stats.inStock} / ${stats.madeToOrder}`}
          icon={<StoreIcon className="w-4 h-4" />}
          accent="bg-blush/20 text-blush"
        />
        <AdminStatCard
          label="On sale"
          value={stats.onSale}
          icon={<TagIcon className="w-4 h-4" />}
          accent="bg-blush/20 text-blush"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl">Current outfits</h2>
        <p className="text-sm text-taupe">{total} total</p>
      </div>
      <ProductList items={items} />
      <Pagination basePath="/admin/products/outfits" searchParams={params} page={page} totalPages={totalPages} />
    </Reveal>
  );
}
