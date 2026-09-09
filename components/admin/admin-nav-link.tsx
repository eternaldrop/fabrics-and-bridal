"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavLink({
  href,
  exact,
  icon,
  onNavigate,
  children,
}: {
  href: string;
  exact?: boolean;
  icon?: React.ReactNode;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive}
      className={`group relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-brand text-sm transition-[background-color,color,transform] duration-150 active:scale-[0.97] ${
        isActive
          ? "bg-cream/10 text-cream"
          : "text-cream/60 hover:bg-cream/5 hover:text-cream hover:translate-x-0.5"
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-rose transition-transform duration-200 origin-center ${
          isActive ? "scale-y-100" : "scale-y-0"
        }`}
        aria-hidden
      />
      {icon && (
        <span className={`shrink-0 w-[18px] h-[18px] transition-transform duration-150 group-hover:scale-110 ${isActive ? "text-rose" : ""}`}>
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </Link>
  );
}
