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
          Ready-made items ship within 3–5 business days of payment.
          Custom and made-to-measure orders typically take 2–4 weeks to
          complete, depending on the piece — you can track progress from
          your account at any time.
        </p>
        <p className="text-ink/80">
          Pickup is available at our studio in Victoria Island, Lagos for
          local customers. Choose your preferred delivery method at
          checkout.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl mb-3">Shipping fees</h2>
        <p className="text-ink/80">
          ₦2,000 flat rate within Lagos, ₦3,500–₦6,000 to other states
          depending on location, calculated at checkout. Pickup is free.
        </p>
      </section>

      <p className="text-xs text-taupe mt-10">
        The timelines and fees above are dummy placeholder values — swap
        in your actual shipping partner, timelines, and rates before
        launch.
      </p>
    </Container>
  );
}
