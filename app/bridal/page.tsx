import Image from "next/image";
import { getSampleMoodBoards } from "@/lib/mood-boards";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MoodBoardShowcase } from "@/components/bridal/mood-board-showcase";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { Reveal } from "@/components/ui/reveal";

export const metadata = { title: "Bridal Consultations — Fabrics & Bridals" };

const HERO_IMAGE_ID = "fabrics-and-bridals/bridal-page/hero";

export default async function BridalLandingPage() {
  const sampleBoards = await getSampleMoodBoards();

  return (
    <div>
      {/* 1. Intro / hero */}
      <section className="border-b border-taupe/30 bg-rose/10">
        <Container className="py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal>
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
          </Reveal>
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
          <Reveal>
            <h2 className="font-serif text-2xl md:text-3xl mb-2">Sample mood boards</h2>
            <p className="text-taupe mb-10 max-w-lg">
              A look at the kind of palette we might build for you — every
              board is designed around your own wedding, not picked from a
              template.
            </p>
            <MoodBoardShowcase boards={sampleBoards} />
          </Reveal>
        </Container>
      </section>

      {/* 3. Closing CTA */}
      <section className="py-20 border-t border-taupe/30 bg-rose/10">
        <Container className="text-center">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-3xl mb-4">
              Ready to start planning your palette?
            </h2>
            <LinkButton href="/bridal/consultation" variant="primary">
              Book Your Consultation
            </LinkButton>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
