import { Container } from "@/components/ui/container";

export const metadata = { title: "FAQ — Fabrics & Bridals" };

const faqs = [
  {
    q: "Can I buy fabric only, without tailoring?",
    a: "Yes. Every fabric listing lets you order by the yard on its own. If you'd like it made up into an outfit, choose the fabric + tailoring option at checkout.",
  },
  {
    q: "How does made-to-measure ordering work?",
    a: "When you request a custom order, you'll be asked for your measurements — either entered directly or uploaded from a measurement guide. Your stylist confirms fit details before production begins.",
  },
  {
    q: "What's the difference between a live and a written bridal consultation?",
    a: "A live consultation is a scheduled call with a stylist. A written consultation is async — you share your preferences through the booking form and receive your mood board without needing to schedule a call.",
  },
  {
    q: "Can I change my mood board after it's shared with me?",
    a: "Yes. You can leave comments and request revisions before approving. Once you approve a palette, you can order the matching fabrics and outfits directly from the board.",
  },
  {
    q: "How long does a custom/made-to-order piece take?",
    a: "Timelines vary by piece and current order volume. Your order status will move from Confirmed to In Production to Ready, and you can track it from your account at any time.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Payments are processed securely through Paystack, which supports card payments, bank transfer, and USSD.",
  },
  {
    q: "Do you ship nationwide, or is pickup available?",
    a: "See the Payment & Delivery page for shipping and pickup details.",
  },
];

export default function FaqPage() {
  return (
    <Container className="py-16 max-w-2xl">
      <h1 className="font-serif text-4xl mb-10">Frequently asked questions</h1>

      <div className="divide-y divide-taupe/20">
        {faqs.map((item) => (
          <div key={item.q} className="py-6">
            <h2 className="font-serif text-lg mb-2">{item.q}</h2>
            <p className="text-sm text-ink/80">{item.a}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-taupe mt-10">
        Can&apos;t find what you&apos;re looking for?{" "}
        <a href="/contact" className="underline decoration-taupe underline-offset-4 hover:text-blush">
          Contact us
        </a>
        .
      </p>
    </Container>
  );
}
