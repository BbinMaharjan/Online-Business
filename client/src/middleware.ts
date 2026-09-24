import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/account",
  "/checkout",
];

const PUBLIC_AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const isAuthenticated = !!token;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) => pathname === route);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  if (pathname === "/cart") {
    const checkoutUrl = new URL("/checkout", request.url);
    if (!isAuthenticated) {
      checkoutUrl.searchParams.set("redirect", "/checkout");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/cart",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ],
};