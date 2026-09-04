import Image from "next/image";
import { asc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { productImages } from "@/db/schema";
import { getBridalCatalogueProducts } from "@/lib/products";
import { getSampleMoodBoards } from "@/lib/mood-boards";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ProductShelf } from "@/components/catalog/product-shelf";
import { MoodBoardShowcase } from "@/components/bridal/mood-board-showcase";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

export const metadata = { title: "Bridal Consultations — Fabrics & Bridals" };

const HERO_IMAGE_ID = "fabrics-and-bridals/bridal-page/hero";

export default async function BridalLandingPage() {
  const [sampleBoards, catalogueProducts] = await Promise.all([
    getSampleMoodBoards(),
    getBridalCatalogueProducts(),
  ]);

  const coverByProduct = new Map<string, string>();
  if (catalogueProducts.length > 0) {
    const images = await db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, catalogueProducts.map((p) => p.id)))
      .orderBy(asc(productImages.position));
    for (const img of images) {
      if (!coverByProduct.has(img.productId)) coverByProduct.set(img.productId, img.cloudinaryPublicId);
    }
  }

  return (
    <div>
      {/* 1. Intro / hero */}
      <section className="border-b border-taupe/30 bg-rose/10">
        <Container className="py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">
              Let&apos;s design your wedding palette.
            </h1>
            <p className="mt-4 text-ink/80 max-w-md">
              Your consultation starts with a conversation about your wedding
              and style — from that, we build you a personal color mood
              board: fabric swatches, a palette, and outfit ideas, all in one
              place. Review it, ask for changes, and once you approve it,
              order the matching fabrics and outfits directly from the
              board.
            </p>
            <LinkButton href="/bridal/consultation" variant="primary" className="mt-8">
              Book Your Consultation
            </LinkButton>
          </div>
          <div className="relative aspect-[4/5] md:aspect-[3/4] border border-taupe/20 overflow-hidden order-first md:order-last">
            <Image
              src={cloudinaryUrl(HERO_IMAGE_ID, { width: 1200 })}
              alt="Bride in an embroidered lace gown beside rolls of fabric"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* 2. Sample mood boards */}
      <section className="py-16 md:py-20">
        <Container>
          <h2 className="font-serif text-2xl md:text-3xl mb-2">Sample mood boards</h2>
          <p className="text-taupe mb-10 max-w-lg">
            A look at the kind of palette we might build for you — every
            board is designed around your own wedding, not picked from a
            template.
          </p>
          <MoodBoardShowcase boards={sampleBoards} />
        </Container>
      </section>

      {/* 3. Bridal catalogue */}
      <section className="py-16 border-t border-taupe/30">
        <Container>
          <ProductShelf
            title="Bridal Catalogue"
            viewAllHref="/catalog/fabrics?category=Bridal+Fabrics"
            products={catalogueProducts}
            coverByProduct={coverByProduct}
          />
          {catalogueProducts.length === 0 && (
            <div className="border border-dashed border-taupe/40 rounded-brand p-10 text-center">
              <p className="text-taupe">
                Bridal fabrics and outfits will appear here once they&apos;re
                added to the catalog.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* 4. Closing CTA */}
      <section className="py-20 border-t border-taupe/30 bg-rose/10">
        <Container className="text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">
            Ready to start planning your palette?
          </h2>
          <LinkButton href="/bridal/consultation" variant="primary">
            Book Your Consultation
          </LinkButton>
        </Container>
      </section>
    </div>
  );
}
