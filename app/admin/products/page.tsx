import { desc, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productImages } from "@/db/schema";
import { Container } from "@/components/ui/container";
import { ProductForm } from "@/components/admin/product-form";
import { ProductList } from "@/components/admin/product-list";

export const metadata = { title: "Manage Catalog — Admin" };

export default async function AdminProductsPage() {
  const items = await db.select().from(products).orderBy(desc(products.createdAt));

  const images = items.length
    ? await db.select().from(productImages).orderBy(asc(productImages.position))
    : [];

  const coverByProduct = new Map<string, string>();
  for (const img of images) {
    if (!coverByProduct.has(img.productId)) {
      coverByProduct.set(img.productId, img.cloudinaryPublicId);
    }
  }

  return (
    <Container className="py-12">
      <h1 className="font-serif text-3xl mb-2">Catalog</h1>
      <p className="text-taupe mb-8">
        Add fabrics and outfits here — they appear in the shop immediately.
      </p>

      <ProductForm />

      <h2 className="font-serif text-2xl mt-14 mb-4">Current items ({items.length})</h2>
      <ProductList
        items={items.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          category: item.category,
          price: item.price,
          stockQuantity: item.stockQuantity,
          coverImagePublicId: coverByProduct.get(item.id),
        }))}
      />
    </Container>
  );
}
