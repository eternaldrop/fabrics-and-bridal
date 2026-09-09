import { getAdminProductList } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";
import { ProductList } from "@/components/admin/product-list";
import { Pagination } from "@/components/catalog/pagination";
import { Reveal } from "@/components/ui/reveal";
import { SwatchIcon } from "@/components/admin/icons";

export const metadata = { title: "Fabrics — Admin" };

export default async function AdminFabricsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { items, page, totalPages, total } = await getAdminProductList(
    "fabric",
    params.page ? Number(params.page) : 1
  );

  return (
    <Reveal>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-full bg-rose/20 text-blush flex items-center justify-center shrink-0">
          <SwatchIcon className="w-5 h-5" />
        </span>
        <h1 className="font-serif text-3xl">Fabrics</h1>
      </div>
      <p className="text-taupe mb-8">
        Add fabrics here — they appear in the shop immediately.
      </p>

      <ProductForm fixedType="fabric" />

      <h2 className="font-serif text-2xl mt-14 mb-4">Current fabrics ({total})</h2>
      <ProductList items={items} />
      <Pagination basePath="/admin/products/fabrics" searchParams={params} page={page} totalPages={totalPages} />
    </Reveal>
  );
}
