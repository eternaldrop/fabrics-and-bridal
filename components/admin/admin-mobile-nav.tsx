"use client";

import { useState } from "react";
import { AdminNavLink } from "@/components/admin/admin-nav-link";
import { LogoutButton } from "@/components/admin/logout-button";
import { GridIcon, SwatchIcon, HangerIcon, GearIcon, MenuIcon, CloseIcon, CalendarHeartIcon } from "@/components/admin/icons";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close admin menu" : "Open admin menu"}
        aria-expanded={open}
        className="w-9 h-9 flex items-center justify-center text-cream active:scale-90 transition-transform duration-150"
      >
        {open ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>

      {open && (
        <nav className="reveal is-visible absolute left-0 right-0 top-full bg-ink border-b border-cream/10 px-4 py-4 flex flex-col gap-1 z-30 shadow-lg">
          <AdminNavLink href="/admin" exact icon={<GridIcon />} onNavigate={() => setOpen(false)}>
            Dashboard
          </AdminNavLink>
          <AdminNavLink href="/admin/products/fabrics" icon={<SwatchIcon />} onNavigate={() => setOpen(false)}>
            Fabrics
          </AdminNavLink>
          <AdminNavLink href="/admin/products/outfits" icon={<HangerIcon />} onNavigate={() => setOpen(false)}>
            Outfits
          </AdminNavLink>
          <AdminNavLink href="/admin/consultations" icon={<CalendarHeartIcon />} onNavigate={() => setOpen(false)}>
            Consultations
          </AdminNavLink>
          <AdminNavLink href="/admin/settings" icon={<GearIcon />} onNavigate={() => setOpen(false)}>
            Settings
          </AdminNavLink>
          <div className="mt-2 pt-2 border-t border-cream/10">
            <LogoutButton />
          </div>
        </nav>
      )}
    </div>
  );
}
