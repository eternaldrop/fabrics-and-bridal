import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { YardageAddToCart } from "@/components/catalog/yardage-add-to-cart";
import { RelatedProducts } from "@/components/catalog/related-products";
import { Button } from "@/components/ui/button";
import { formatPrice, isOnSale, discountPercent, effectivePrice } from "@/lib/format";
import { getSwatchColor } from "@/lib/color-swatch";
import { SaleBadge } from "@/components/catalog/sale-badge";
import { Reveal } from "@/components/ui/reveal";

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
  const swatch = getSwatchColor(product.color);
  const onSale = isOnSale(product.price, product.salePrice);

  const related = await getRelatedProducts({
    id: product.id,
    category: product.category,
    material: product.material,
    occasion: product.occasion,
    type: "fabric",
  });

  const fabricDetails = [
    product.material && { label: "Material", value: product.material },
    product.color && { label: "Color", value: product.color },
    product.width && { label: "Width", value: product.width },
    product.careInstructions && { label: "Care", value: product.careInstructions },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  return (
    <Container className="py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <ProductGallery images={images} productName={product.name} />

        <Reveal>
          {product.category && (
            <p className="text-xs text-taupe uppercase tracking-wide">{product.category}</p>
          )}
          <h1 className="font-serif text-3xl md:text-4xl mt-2">{product.name}</h1>
          {onSale ? (
            <div className="flex items-center gap-3 mt-3">
              <p className="text-xl text-blush">{formatPrice(product.salePrice!)} / yard</p>
              <p className="text-base text-taupe line-through">{formatPrice(product.price)}</p>
              <SaleBadge percent={discountPercent(product.price, product.salePrice!)} />
            </div>
          ) : (
            <p className="text-xl text-ink mt-3">{formatPrice(product.price)} / yard</p>
          )}
          <p className="text-sm text-taupe mt-1">
            {product.stockQuantity && product.stockQuantity > 0
              ? `${product.stockQuantity} yards in stock`
              : "Made to order"}
          </p>

          {product.description && (
            <p className="text-ink/80 mt-6 max-w-md">{product.description}</p>
          )}

          {(product.color || product.material) && (
            <div className="mt-6 flex items-center gap-3">
              {swatch && (
                <span
                  className="inline-block w-6 h-6 rounded-full border border-taupe/30 shrink-0"
                  style={{ backgroundColor: swatch }}
                  aria-hidden
                />
              )}
              <p className="text-sm">
                {[product.color, product.material].filter(Boolean).join(" · ")}
              </p>
            </div>
          )}

          {colorVariants.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-taupe mb-2">Other colors</p>
              <div className="flex gap-2 flex-wrap">
                {colorVariants.map((v) => (
                  <span
                    key={v.id}
                    className="text-xs border border-taupe/40 rounded-brand px-3 py-1.5 transition-colors duration-150 hover:border-ink"
                  >
                    {v.attributeValue}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <YardageAddToCart
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: effectivePrice(product.price, product.salePrice),
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

          {fabricDetails.length > 0 && (
            <div className="mt-10 pt-8 border-t border-taupe/20">
              <p className="text-sm text-taupe mb-3">Fabric details</p>
              <ul className="space-y-1.5 text-sm">
                {fabricDetails.map((row) => (
                  <li key={row.label} className="flex gap-2">
                    <span className="text-rose">•</span>
                    <span>
                      <span className="text-taupe">{row.label}:</span> {row.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </div>

      <RelatedProducts title="Other similar fabrics" items={related} />
    </Container>
  );
}
