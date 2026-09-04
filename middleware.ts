import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Blocks /admin/* at the routing layer for anyone who isn't an admin or
// stylist — this is the "role-based, not just a hidden route" separation
// between customer and admin/stylist accounts.
export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();

  const role = req.auth?.user?.role;
  if (role !== "admin" && role !== "stylist") {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
