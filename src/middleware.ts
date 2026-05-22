import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isApiAdminRoute = nextUrl.pathname.startsWith("/api/admin");
  const isAuthRoute = ["/login", "/signup"].includes(nextUrl.pathname);

  if (isApiAdminRoute && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/account", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login", "/signup", "/account/:path*"],
};
