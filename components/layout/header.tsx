import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CartLink } from "@/components/layout/cart-link";
import { MobileNav } from "@/components/layout/mobile-nav";

const navLinks = [
  { href: "/catalog/fabrics", label: "Fabrics" },
  { href: "/catalog/outfits", label: "Outfits" },
  { href: "/bridal", label: "Bridal" },
  { href: "/about", label: "About" },
];

// No customer accounts — shoppers browse, add to cart, and check out as
// guests, so this header has no login/account link. Staff sign in directly
// at /login (not advertised here).
export function Header() {
  return (
    <header className="relative border-b border-taupe/30">
      <Container className="flex items-center justify-between py-5">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/" className="font-serif text-xl text-ink transition-transform duration-200 hover:scale-[1.03] inline-block">
            Fabrics &amp; Bridals
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-sm text-ink hover:text-blush transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <CartLink />
        </div>
      </Container>
    </header>
  );
}
