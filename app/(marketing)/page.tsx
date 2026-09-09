import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ProductShelf } from "@/components/catalog/product-shelf";
import { FaqSection } from "@/components/marketing/faq-section";
import { MoodBoardPalette } from "@/components/bridal/mood-board-palette";
import { Reveal } from "@/components/ui/reveal";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { heroCarouselSlides } from "@/components/marketing/hero-carousel-data";
import { getNewArrivals } from "@/lib/products";
import { getFeaturedSampleMoodBoard } from "@/lib/mood-boards";
import { db } from "@/lib/db";
import { productImages } from "@/db/schema";
import { asc, inArray } from "drizzle-orm";
import Link from "next/link";

export default async function HomePage() {
  const [newArrivals, sampleBoard] = await Promise.all([
    getNewArrivals("fabric", 4),
    getFeaturedSampleMoodBoard(),
  ]);

  const coverByProduct = new Map<string, string>();
  if (newArrivals.length > 0) {
    const images = await db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, newArrivals.map((p) => p.id)))
      .orderBy(asc(productImages.position));
    for (const img of images) {
      if (!coverByProduct.has(img.productId)) coverByProduct.set(img.productId, img.cloudinaryPublicId);
    }
  }

  return (
    <div>
      <h1 className="sr-only">
        Fabrics &amp; Bridals — fabric, tailoring, and bridal styling consultations
      </h1>

      <HeroCarousel slides={heroCarouselSlides} />

      {/* Persistent CTAs beneath the carousel — stay put regardless of
          which slide is showing, rather than competing with per-slide
          text for attention. */}
      <div className="border-b border-taupe/30 bg-cream">
        <Container className="py-8 flex flex-wrap items-center gap-4">
          <LinkButton href="/catalog/fabrics" variant="primary">
            Shop the collection
          </LinkButton>
          <LinkButton href="/bridal" variant="secondary">
            Book your consultation
          </LinkButton>
        </Container>
      </div>

      {/* New in the fabric room */}
      <Container>
        {newArrivals.length === 0 ? (
          <div className="py-20">
            <div className="border border-dashed border-taupe/40 rounded-brand p-10 text-center">
              <p className="text-taupe">
                Your catalog is empty right now. Once fabrics are added
                from the admin dashboard, they&apos;ll appear here.
              </p>
              <Link
                href="/admin/products/fabrics"
                className="inline-block mt-4 text-sm text-ink underline decoration-taupe underline-offset-4 hover:text-blush"
              >
                Go to admin upload tool
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-16">
            <Reveal>
              <ProductShelf
                title="New in the fabric room"
                viewAllHref="/catalog/fabrics"
                products={newArrivals}
                coverByProduct={coverByProduct}
              />
            </Reveal>
          </div>
        )}
      </Container>

      {/* Bridal consultation teaser */}
      <section className="py-20 border-t border-taupe/30 mt-6">
        <Container className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-3xl mb-4">
              Planning a wedding? Let&apos;s find your palette.
            </h2>
            <p className="text-ink/80 max-w-md">
              Tell us about your wedding date, venue, and style inspiration,
              and we&apos;ll put together a personal mood board — fabric
              swatches, colors, and outfit ideas — for you to review and
              approve. Completely free, no obligation to order.
            </p>
            <LinkButton href="/bridal" variant="secondary" className="mt-6">
              Book your free consultation
            </LinkButton>
          </Reveal>

          {sampleBoard && (
            <Reveal delay={150} className="border border-taupe/20 rounded-brand p-6 transition-shadow duration-300 hover:shadow-lg">
              <p className="text-xs text-taupe uppercase tracking-wide">A sample palette</p>
              <p className="font-serif text-xl mt-1">{sampleBoard.title}</p>
              {sampleBoard.styleDescriptor && (
                <p className="text-sm text-taupe mt-1">{sampleBoard.styleDescriptor}</p>
              )}
              {sampleBoard.colorPalette.length > 0 && (
                <div className="mt-5">
                  <MoodBoardPalette palette={sampleBoard.colorPalette} size="sm" />
                </div>
              )}
              <Link
                href="/bridal/sample-mood-board"
                className="link-underline inline-block mt-5 text-sm text-ink hover:text-blush transition-colors"
              >
                See a real mood board →
              </Link>
            </Reveal>
          )}
        </Container>
      </section>

      <Container>
        <Reveal>
          <FaqSection />
        </Reveal>
      </Container>
    </div>
  );
}
