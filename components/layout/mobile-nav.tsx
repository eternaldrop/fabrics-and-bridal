"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/catalog/fabrics", label: "Fabrics" },
  { href: "/catalog/outfits", label: "Outfits" },
  { href: "/bridal", label: "Bridal" },
  { href: "/about", label: "About" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex flex-col justify-center gap-1.5 w-8 h-8 active:scale-90 transition-transform duration-150"
      >
        <span className={`block h-px w-6 bg-ink transition-transform duration-200 ${open ? "translate-y-[3px] rotate-45" : ""}`} />
        <span className={`block h-px w-6 bg-ink transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`block h-px w-6 bg-ink transition-transform duration-200 ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
      </button>

      {open && (
        <nav
          className="reveal is-visible absolute left-0 right-0 top-full bg-cream border-b border-taupe/30 px-6 py-6 flex flex-col gap-5 z-30"
          style={{ animationDuration: "0.3s" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="link-underline text-base text-ink hover:text-blush transition-colors w-fit"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
