import { Container } from "@/components/ui/container";

export const metadata = { title: "About — Fabrics & Bridals" };

export default function AboutPage() {
  return (
    <Container className="py-16 max-w-2xl">
      <h1 className="font-serif text-4xl mb-6">About us</h1>

      <div className="space-y-5 text-ink/80">
        <p>
          Fabrics &amp; Bridals brings together a fabric and outfit catalog
          with a dedicated bridal styling service. Browse and order fabrics
          by the yard, ready-made and made-to-measure outfits, or start a
          consultation and work with a stylist to build your wedding
          palette from scratch.
        </p>
        <p>
          Every fabric is sold with the material, color, and price clearly
          listed, and every custom order can be paired with tailoring —
          whether you&apos;re dressing for everyday wear, aso-ebi, or your own
          wedding day.
        </p>
      </div>

      <h2 className="font-serif text-2xl mt-12 mb-4">Get in touch</h2>
      <p className="text-ink/80">
        Have a question about an order, a fabric, or your bridal
        consultation?{" "}
        <a href="/contact" className="underline decoration-taupe underline-offset-4 hover:text-blush">
          Visit our contact page
        </a>
        .
      </p>
    </Container>
  );
}
