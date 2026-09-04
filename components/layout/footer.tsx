import Link from "next/link";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t border-taupe/30 mt-24">
      <Container className="py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-sm text-taupe">
          &copy; {new Date().getFullYear()} Fabrics &amp; Bridals
        </p>
        <div className="flex gap-6">
          <Link href="/about" className="text-sm text-taupe hover:text-ink">
            About
          </Link>
          <Link href="/bridal" className="text-sm text-taupe hover:text-ink">
            Bridal Consultations
          </Link>
        </div>
      </Container>
    </footer>
  );
}
