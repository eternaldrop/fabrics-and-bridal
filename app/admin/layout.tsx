import Link from "next/link";
import { auth } from "@/lib/auth";
import { AdminNavLink } from "@/components/admin/admin-nav-link";
import { LogoutButton } from "@/components/admin/logout-button";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { GridIcon, SwatchIcon, HangerIcon, GearIcon, StoreIcon, CalendarHeartIcon } from "@/components/admin/icons";

// Route access itself is enforced in proxy.ts (admin/stylist only); this
// layout renders the app shell every /admin page shares. It's deliberately
// its own thing — a dark, fixed sidebar app shell — rather than the
// storefront's header/nav (hidden for /admin in SiteChrome).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const name = session?.user?.name ?? "Admin";
  const initials =
    name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 bg-ink text-cream relative">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="font-serif text-lg hover:text-rose transition-colors">
            F&amp;B <span className="text-cream/50 text-sm font-sans">Admin</span>
          </Link>
          <AdminMobileNav />
        </div>
      </div>

      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-ink text-cream z-30">
        <div className="px-6 py-6 border-b border-cream/10">
          <Link
            href="/"
            className="font-serif text-xl inline-flex items-baseline gap-2 hover:text-rose transition-colors"
          >
            Fabrics &amp; Bridals
          </Link>
          <p className="text-[11px] text-cream/40 uppercase tracking-wide mt-1">Admin</p>
        </div>

        <div className="px-6 py-5 border-b border-cream/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose text-ink flex items-center justify-center text-sm font-serif shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm truncate">{name}</p>
            <p className="text-xs text-cream/40 truncate">{session?.user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <AdminNavLink href="/admin" exact icon={<GridIcon />}>
            Dashboard
          </AdminNavLink>
          <AdminNavLink href="/admin/products/fabrics" icon={<SwatchIcon />}>
            Fabrics
          </AdminNavLink>
          <AdminNavLink href="/admin/products/outfits" icon={<HangerIcon />}>
            Outfits
          </AdminNavLink>
          <AdminNavLink href="/admin/consultations" icon={<CalendarHeartIcon />}>
            Consultations
          </AdminNavLink>
          <AdminNavLink href="/admin/settings" icon={<GearIcon />}>
            Settings
          </AdminNavLink>
        </nav>

        <div className="px-3 py-4 border-t border-cream/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-brand text-sm text-cream/60 hover:bg-cream/5 hover:text-cream transition-colors duration-150"
          >
            <StoreIcon className="w-[18px] h-[18px] shrink-0" />
            View store
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <div className="md:pl-64">
        <div className="max-w-6xl mx-auto px-6 py-10 md:px-10">{children}</div>
      </div>
    </div>
  );
}
