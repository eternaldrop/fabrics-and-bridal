"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/catalog/fabrics", label: "Fabrics" },
  { href: "/catalog/outfits", label: "Outfits" },
  { href: "/bridal", label: "Bridal" },
  { href: "/about", label: "About" },
];

export function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex flex-col justify-center gap-1.5 w-8 h-8"
      >
        <span className={`block h-px w-6 bg-ink transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
        <span className={`block h-px w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
        <span className={`block h-px w-6 bg-ink transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
      </button>

      {open && (
        <nav className="absolute left-0 right-0 top-full bg-cream border-b border-taupe/30 px-6 py-6 flex flex-col gap-5 z-30">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base text-ink hover:text-blush"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-taupe/20 pt-5">
            <Link
              href={isLoggedIn ? "/account/orders" : "/login"}
              onClick={() => setOpen(false)}
              className="text-base text-ink hover:text-blush"
            >
              {isLoggedIn ? "My Account" : "Login"}
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
