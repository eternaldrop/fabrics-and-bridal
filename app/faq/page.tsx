import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

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
    q: "Do I need an account to book a bridal consultation?",
    a: "No — just fill in the guided form with your name and email, and your stylist follows up directly. No account required.",
  },
  {
    q: "Can I change my mood board after it's shared with me?",
    a: "Yes. You can leave comments and request revisions before approving. Once you approve a palette, you can order the matching fabrics and outfits directly from the board.",
  },
  {
    q: "How long does a custom/made-to-order piece take?",
    a: "Timelines vary by piece and current order volume — custom cuts add about ten days on top of the usual turnaround.",
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
      <Reveal>
        <h1 className="font-serif text-4xl mb-10">Frequently asked questions</h1>
      </Reveal>

      <div className="divide-y divide-taupe/20">
        {faqs.map((item, i) => (
          <Reveal
            key={item.q}
            delay={(i % 5) * 60}
            className="py-6 transition-colors duration-200 hover:bg-taupe/5 rounded-brand px-2 -mx-2"
          >
            <h2 className="font-serif text-lg mb-2">{item.q}</h2>
            <p className="text-sm text-ink/80">{item.a}</p>
          </Reveal>
        ))}
      </div>

      <p className="text-sm text-taupe mt-10">
        Can&apos;t find what you&apos;re looking for?{" "}
        <a href="/contact" className="link-underline hover:text-blush transition-colors">
          Contact us
        </a>
        .
      </p>
    </Container>
  );
}
