import { getAdminProductList } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";
import { ProductList } from "@/components/admin/product-list";
import { Pagination } from "@/components/catalog/pagination";
import { Reveal } from "@/components/ui/reveal";
import { HangerIcon } from "@/components/admin/icons";

export const metadata = { title: "Outfits — Admin" };

export default async function AdminOutfitsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { items, page, totalPages, total } = await getAdminProductList(
    "outfit",
    params.page ? Number(params.page) : 1
  );

  return (
    <Reveal>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-full bg-taupe/20 text-ink flex items-center justify-center shrink-0">
          <HangerIcon className="w-5 h-5" />
        </span>
        <h1 className="font-serif text-3xl">Outfits</h1>
      </div>
      <p className="text-taupe mb-8">
        Add outfits here — they appear in the shop immediately.
      </p>

      <ProductForm fixedType="outfit" />

      <h2 className="font-serif text-2xl mt-14 mb-4">Current outfits ({total})</h2>
      <ProductList items={items} />
      <Pagination basePath="/admin/products/outfits" searchParams={params} page={page} totalPages={totalPages} />
    </Reveal>
  );
}
