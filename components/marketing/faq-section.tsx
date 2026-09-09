import { LinkButton } from "@/components/ui/button";

// Short, homepage-scoped FAQ — distinct from the fuller /faq page. Picks
// the handful of questions a first-time visitor is most likely to have
// before they've even started browsing.
const faqs = [
  {
    q: "How is fabric sold?",
    a: "By the yard, cut fresh the day you order — nothing sits pre-cut on a shelf waiting for you.",
  },
  {
    q: "Can you sew it for me?",
    a: "Yes — choose the fabric + tailoring option and we'll have it made up for you, ready-made or to your own measurements.",
  },
  {
    q: "How long does made-to-measure take?",
    a: "Custom cuts add about ten days to production on top of the usual turnaround for the piece.",
  },
  {
    q: "Are bridal consultations really free?",
    a: "Yes — the styling consultation and your first colour mood board are completely free, with no obligation to order.",
  },
  {
    q: "Can I request a fabric swatch first?",
    a: "Yes — contact us with the fabric's name and we'll arrange a swatch before you commit to a full cut.",
  },
  {
    q: "What's your return policy?",
    a: "Ready-made pieces can be returned if faulty. Made-to-measure and custom-cut fabric are made specifically for you, so they're final sale except for faults.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 border-t border-taupe/30">
      <div className="mb-10 flex items-end justify-between gap-4 flex-wrap">
        <h2 className="font-serif text-2xl md:text-3xl">Frequently asked questions</h2>
        <LinkButton href="/faq" variant="ghost">
          More questions
        </LinkButton>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {faqs.map((item) => (
          <div
            key={item.q}
            className="border border-taupe/20 rounded-brand p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-taupe/40"
          >

            <p className="font-serif text-lg mb-2">{item.q}</p>
            <p className="text-sm text-ink/80">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
