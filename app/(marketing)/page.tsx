import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function HomePage() {
  return (
    <div>
      {/* Full-bleed hero. Swap the placeholder block below for a real
          fabric/outfit photograph once catalog photography is ready —
          keep the headline positioned bottom-left over the image, not
          centered. */}
      <section className="relative h-[70vh] min-h-[480px] w-full bg-ink flex items-end">
        <div className="absolute inset-0 flex items-center justify-center text-taupe/40 text-sm">
          Hero photograph goes here
        </div>
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
      </section>

      {/* Latest arrivals — asymmetric, left-aligned; no uniform card grid. */}
      <section className="py-20">
        <Container>
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-2xl md:text-3xl">Latest arrivals</h2>
            <Link href="/catalog/fabrics" className="text-sm text-taupe hover:text-ink">
              View all fabrics
            </Link>
          </div>

          <div className="border border-dashed border-taupe/40 rounded-brand p-10 text-center">
            <p className="text-taupe">
              Your catalog is empty right now. Once fabrics and outfits are
              added from the admin dashboard, they&apos;ll appear here.
            </p>
            <Link
              href="/admin/products"
              className="inline-block mt-4 text-sm text-ink underline decoration-taupe underline-offset-4 hover:text-blush"
            >
              Go to admin upload tool
            </Link>
          </div>
        </Container>
      </section>

      {/* Bridal teaser */}
      <section className="py-20 border-t border-taupe/30">
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
          <div className="h-64 bg-rose/30 border border-taupe/30 rounded-brand flex items-center justify-center text-taupe text-sm">
            Mood board preview goes here
          </div>
        </Container>
      </section>
    </div>
  );
}
