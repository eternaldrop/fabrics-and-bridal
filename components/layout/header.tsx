import Link from "next/link";
import { auth } from "@/lib/auth";
import { Container } from "@/components/ui/container";

const navLinks = [
  { href: "/catalog/fabrics", label: "Fabrics" },
  { href: "/catalog/outfits", label: "Outfits" },
  { href: "/bridal", label: "Bridal" },
  { href: "/about", label: "About" },
];

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-taupe/30">
      <Container className="flex items-center justify-between py-5">
        <Link href="/" className="font-serif text-xl text-ink">
          Waystream
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink hover:text-blush transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          {session?.user ? (
            <Link href="/account/orders" className="text-sm text-ink hover:text-blush">
              My Account
            </Link>
          ) : (
            <Link href="/login" className="text-sm text-ink hover:text-blush">
              Login
            </Link>
          )}
          <Link href="/cart" className="text-sm text-ink hover:text-blush">
            Cart
          </Link>
        </div>
      </Container>
    </header>
  );
}
