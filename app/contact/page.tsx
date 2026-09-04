import { Container } from "@/components/ui/container";

export const metadata = { title: "Contact Us — Fabrics & Bridals" };

export default function ContactPage() {
  return (
    <Container className="py-16 max-w-2xl">
      <h1 className="font-serif text-4xl mb-6">Contact us</h1>
      <p className="text-ink/80 mb-10">
        Questions about an order, a fabric, or your bridal consultation?
        Reach out and we&apos;ll get back to you.
      </p>

      <dl className="space-y-6 text-sm">
        <div>
          <dt className="text-taupe mb-1">Email</dt>
          <dd>
            <a href="mailto:hello@fabricsandbridals.com" className="underline decoration-taupe underline-offset-4 hover:text-blush">
              hello@fabricsandbridals.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-taupe mb-1">Phone / WhatsApp</dt>
          <dd>+234 000 000 0000</dd>
        </div>
        <div>
          <dt className="text-taupe mb-1">Studio hours</dt>
          <dd>Monday – Saturday, 9am – 6pm</dd>
        </div>
      </dl>

      <p className="text-xs text-taupe mt-10">
        Contact details above are placeholders — replace with your real
        business email, phone number, and hours.
      </p>
    </Container>
  );
}
