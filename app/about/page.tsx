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
          whether you're dressing for everyday wear, aso-ebi, or your own
          wedding day.
        </p>
      </div>

      <h2 className="font-serif text-2xl mt-12 mb-4">Get in touch</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex gap-3">
          <dt className="text-taupe w-20">Email</dt>
          <dd>
            <a href="mailto:hello@fabricsandbridals.com" className="underline decoration-taupe underline-offset-4 hover:text-blush">
              hello@fabricsandbridals.com
            </a>
          </dd>
        </div>
      </dl>
      <p className="text-xs text-taupe mt-8">
        Contact details above are placeholders — replace with your real
        business email/phone when ready.
      </p>
    </Container>
  );
}
