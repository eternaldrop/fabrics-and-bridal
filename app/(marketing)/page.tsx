import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ProductShelf } from "@/components/catalog/product-shelf";
import { getPopularFabrics, getNewArrivals, getLuxuryFabrics, getBridalFabrics } from "@/lib/products";
import { db } from "@/lib/db";
import { productImages } from "@/db/schema";
import { asc, inArray } from "drizzle-orm";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import Link from "next/link";

const HERO_IMAGE_ID = "fabrics-and-bridals/site/hero";
const MOODBOARD_IMAGE_ID = "fabrics-and-bridals/site/moodboard-preview";

export default async function HomePage() {
  const [popular, newArrivals, luxury, bridal] = await Promise.all([
    getPopularFabrics(),
    getNewArrivals("fabric"),
    getLuxuryFabrics(),
    getBridalFabrics(),
  ]);

  const allIds = [...popular, ...newArrivals, ...luxury, ...bridal].map((p) => p.id);
  const coverByProduct = new Map<string, string>();
  if (allIds.length > 0) {
    const images = await db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, Array.from(new Set(allIds))))
      .orderBy(asc(productImages.position));
    for (const img of images) {
      if (!coverByProduct.has(img.productId)) coverByProduct.set(img.productId, img.cloudinaryPublicId);
    }
  }

  const catalogIsEmpty = popular.length === 0 && newArrivals.length === 0;

  return (
    <div>
      <section className="relative h-[70vh] min-h-[480px] w-full bg-ink flex items-end overflow-hidden">
        <Image
          src={cloudinaryUrl(HERO_IMAGE_ID, { width: 2000 })}
          alt="Ivory wedding dress lace detail"
          fill
          priority
          className="object-cover"
        />
        {/* Flat translucent scrim for text contrast — not a gradient. */}
        <div className="absolute inset-0 bg-ink/45" />

        <Container className="relative pb-16">
          <h1 className="font-serif text-4xl md:text-6xl text-cream max-w-2xl leading-tight">
            Fabric, tailoring, and bridal styling — all in one place.
          </h1>
          <p className="mt-4 text-cream/80 max-w-md">
            Browse fabrics and finished outfits, or start a bridal
            consultation and let us build your wedding palette with you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LinkButton href="/catalog/fabrics" variant="primary">
              Shop the collection
            </LinkButton>
            <LinkButton href="/bridal" variant="secondary">
              Book your consultation
            </LinkButton>
          </div>
        </Container>

        <p className="absolute bottom-2 right-3 text-[11px] text-cream/50">
          Photo: &quot;Free Wedding Dress Lace Texture&quot; by Beverly &amp; Pack, CC BY 2.0
        </p>
      </section>

      <Container>
        {catalogIsEmpty ? (
          <div className="py-20">
            <div className="border border-dashed border-taupe/40 rounded-brand p-10 text-center">
              <p className="text-taupe">
                Your catalog is empty right now. Once fabrics are added
                from the admin dashboard, they&apos;ll appear here.
              </p>
              <Link
                href="/admin/products"
                className="inline-block mt-4 text-sm text-ink underline decoration-taupe underline-offset-4 hover:text-blush"
              >
                Go to admin upload tool
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-14">
            <ProductShelf title="Popular Fabrics" viewAllHref="/catalog/fabrics" products={popular} coverByProduct={coverByProduct} />
            <ProductShelf title="New Arrivals" viewAllHref="/catalog/fabrics" products={newArrivals} coverByProduct={coverByProduct} />
            <ProductShelf title="Luxury Fabrics" viewAllHref="/catalog/fabrics" products={luxury} coverByProduct={coverByProduct} />
            <ProductShelf
              title="Bridal Fabrics"
              viewAllHref="/catalog/fabrics?category=Bridal+Fabrics"
              products={bridal}
              coverByProduct={coverByProduct}
            />
          </div>
        )}
      </Container>

      {/* Bridal consultation teaser */}
      <section className="py-20 border-t border-taupe/30 mt-6">
        <Container className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl mb-4">
              Planning a wedding? Let&apos;s find your palette.
            </h2>
            <p className="text-ink/80 max-w-md">
              Tell us about your wedding date, venue, and style inspiration,
              and we&apos;ll put together a personal mood board — fabric
              swatches, colors, and outfit ideas — for you to review and
              approve.
            </p>
            <LinkButton href="/bridal" variant="secondary" className="mt-6">
              Start a consultation
            </LinkButton>
          </div>
          <div>
            <div className="relative h-80 border border-taupe/30 rounded-brand overflow-hidden">
              <Image
                src={cloudinaryUrl(MOODBOARD_IMAGE_ID, { width: 1000 })}
                alt="Blush peony — an example of a wedding color palette starting point"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-[11px] text-taupe mt-2">
              Photo: &quot;Peony Blush&quot; by Angel Lite Photography, Public Domain Mark 1.0
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
