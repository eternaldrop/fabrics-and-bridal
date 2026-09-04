import { Container } from "@/components/ui/container";

export const metadata = { title: "Payment & Delivery — Fabrics & Bridals" };

export default function PaymentDeliveryPage() {
  return (
    <Container className="py-16 max-w-2xl">
      <h1 className="font-serif text-4xl mb-10">Payment &amp; delivery</h1>

      <section className="mb-10">
        <h2 className="font-serif text-2xl mb-3">Payment</h2>
        <p className="text-ink/80">
          Payments are processed securely through Paystack, which supports
          card payments, bank transfer, and USSD. We never see or store
          your card details.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl mb-3">Delivery</h2>
        <p className="text-ink/80 mb-3">
          Ready-made items ship within [X] business days of payment.
          Custom and made-to-measure orders ship once production is
          complete — you can track progress from your account at any time.
        </p>
        <p className="text-ink/80">
          Pickup is available at our studio for local customers. Choose
          your preferred delivery method at checkout.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl mb-3">Shipping fees</h2>
        <p className="text-ink/80">
          Shipping fees are calculated at checkout based on your delivery
          address.
        </p>
      </section>

      <p className="text-xs text-taupe mt-10">
        This page has placeholder timelines and fees — fill in your actual
        shipping partners, timelines, and rates before launch.
      </p>
    </Container>
  );
}
