import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata = { title: "Bridal Consultations — Fabrics & Bridals" };

const steps = [
  {
    title: "Tell us about your wedding",
    body: "Share your wedding date, venue type and season, preferred colors, style inspiration, and budget range.",
  },
  {
    title: "We build your mood board",
    body: "Your stylist puts together fabric swatches, a color palette, and outfit ideas into one shareable board.",
  },
  {
    title: "Review and approve",
    body: "Comment, ask for revisions, and approve the final palette when it feels right.",
  },
  {
    title: "Order straight from the board",
    body: "Once approved, order the matching fabrics and outfits directly — no separate browsing needed.",
  },
];

export default function BridalLandingPage() {
  return (
    <div>
      <section className="border-b border-taupe/30 bg-rose/10">
        <Container className="py-16 md:py-24">
          <h1 className="font-serif text-4xl md:text-5xl max-w-xl leading-tight">
            A personal styling consultation for your wedding.
          </h1>
          <p className="mt-4 text-ink/80 max-w-md">
            Tell us about your wedding, and we&apos;ll put together a
            mood board — fabric swatches, colors, and outfit ideas — built
            around you. Review it, ask for changes, and order the pieces
            you love once it&apos;s approved.
          </p>
          <LinkButton href="/register" variant="primary" className="mt-8">
            Start your consultation
          </LinkButton>
          <p className="text-xs text-taupe mt-3">
            Booking form is being finished — create an account now and
            we&apos;ll notify you the moment it&apos;s ready.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <h2 className="font-serif text-2xl md:text-3xl mb-10">How it works</h2>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-10">
            {steps.map((step) => (
              <div key={step.title} className="border-t border-taupe/30 pt-4">
                <h3 className="font-serif text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-ink/70 max-w-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 border-t border-taupe/30">
        <Container className="max-w-2xl">
          <h2 className="font-serif text-2xl mb-4">Live or written — your choice</h2>
          <p className="text-ink/80">
            Book a live consultation call with a stylist, or request an
            async written consultation and get your mood board without
            scheduling a call. Both options are available once you start
            your consultation.
          </p>
        </Container>
      </section>
    </div>
  );
}
