import Link from "next/link";
import { Container } from "@/components/ui/container";

const columns = [
  {
    heading: "Shop",
    links: [
      { href: "/catalog/fabrics", label: "Fabrics" },
      { href: "/catalog/outfits", label: "Outfits" },
      { href: "/bridal", label: "Bridal Consultations" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact Us" },
      { href: "/payment-delivery", label: "Payment & Delivery" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-taupe/30 mt-24">
      <Container className="py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-lg text-ink">Fabrics &amp; Bridals</p>
            <p className="text-sm text-taupe mt-2 max-w-[220px]">
              Fabrics, made-to-measure outfits, and bridal styling
              consultations.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-sm text-ink mb-3">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-taupe hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-sm text-taupe mt-14 pt-6 border-t border-taupe/20">
          &copy; {new Date().getFullYear()} Fabrics &amp; Bridals
        </p>
      </Container>
    </footer>
  );
}
