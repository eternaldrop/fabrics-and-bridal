import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { AddToCartButton } from "@/components/catalog/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export default async function FabricDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result || result.product.type !== "fabric") notFound();

  const { product, images, variants } = result;
  const colorVariants = variants.filter((v) => v.attributeName === "color");

  return (
    <Container className="py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <ProductGallery images={images} productName={product.name} />

        <div>
          {product.category && (
            <p className="text-xs text-taupe uppercase tracking-wide">{product.category}</p>
          )}
          <h1 className="font-serif text-3xl md:text-4xl mt-2">{product.name}</h1>
          <p className="text-xl text-ink mt-3">{formatPrice(product.price)} / yard</p>

          {product.description && (
            <p className="text-ink/80 mt-6 max-w-md">{product.description}</p>
          )}

          <dl className="mt-6 space-y-2 text-sm">
            {product.material && (
              <div className="flex gap-2">
                <dt className="text-taupe w-24">Material</dt>
                <dd>{product.material}</dd>
              </div>
            )}
            {product.color && (
              <div className="flex gap-2">
                <dt className="text-taupe w-24">Color</dt>
                <dd>{product.color}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="text-taupe w-24">Availability</dt>
              <dd>
                {product.stockQuantity && product.stockQuantity > 0
                  ? `${product.stockQuantity} yards in stock`
                  : "Made to order"}
              </dd>
            </div>
          </dl>

          {colorVariants.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-taupe mb-2">Other colors</p>
              <div className="flex gap-2 flex-wrap">
                {colorVariants.map((v) => (
                  <span
                    key={v.id}
                    className="text-xs border border-taupe/40 rounded-brand px-3 py-1.5"
                  >
                    {v.attributeValue}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            <AddToCartButton
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                type: "fabric",
                coverImagePublicId: images[0]?.cloudinaryPublicId,
              }}
            />
            {product.isCustomOrderable && (
              <Button variant="secondary">Request fabric + tailoring</Button>
            )}
          </div>
          <p className="text-xs text-taupe mt-3">
            Checkout and payment arrive in Phase 2 — items you add are saved
            in your cart for now.
          </p>
        </div>
      </div>
    </Container>
  );
}
