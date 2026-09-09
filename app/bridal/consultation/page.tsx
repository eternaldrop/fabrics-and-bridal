import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ConsultationForm } from "@/components/bridal/consultation-form";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { Reveal } from "@/components/ui/reveal";

export const metadata = { title: "Book Your Consultation — Fabrics & Bridals" };

const HERO_IMAGE_ID = "fabrics-and-bridals/bridal-page/hero";

const steps = [
  {
    title: "Fill the form",
    description: "Tell us your wedding date, venue, theme, colours, and budget — takes a few minutes.",
  },
  {
    title: "We build your board",
    description: "Your stylist puts together a personal colour mood board with fabric and outfit ideas.",
  },
  {
    title: "You approve",
    description: "Review it, ask for changes, and once you approve it, order the matching fabrics and outfits.",
  },
];

export default function ConsultationBookingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-taupe/30 bg-rose/10">
        <Container className="py-16 md:py-20 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">
              A free bridal styling consultation.
            </h1>
            <p className="mt-4 text-ink/80 max-w-md">
              Share your wedding date, venue, and the colours you love, and
              we&apos;ll build you a personal colour mood board — no
              obligation, nothing to pay.
            </p>
            <p className="mt-6 text-sm">
              <Link
                href="/bridal/sample-mood-board"
                className="link-underline text-ink hover:text-blush transition-colors"
              >
                See a real mood board →
              </Link>
            </p>
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

      {/* How it works */}
      <section className="py-16 md:py-20">
        <Container>
          <Reveal>
            <h2 className="font-serif text-2xl md:text-3xl mb-10">How it works</h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <p className="font-serif text-3xl text-rose">{i + 1}</p>
                <p className="font-serif text-lg mt-2">{s.title}</p>
                <p className="text-sm text-taupe mt-1">{s.description}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* The form */}
      <section className="py-16 md:py-20 border-t border-taupe/30">
        <Container>
          <Reveal>
            <ConsultationForm />
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
