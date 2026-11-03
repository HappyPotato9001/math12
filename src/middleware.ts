import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPrefixes = [
  "/math1",
  "/math2",
  "/learning",
  "/sharing",
  "/practice-tests",
  "/admin",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!needsAuth) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret:
      process.env.AUTH_SECRET || "math12-dev-secret-change-me-in-production",
  });

  if (!token?.userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token.status !== "approved") {
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/learning", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/math1/:path*",
    "/math2/:path*",
    "/learning/:path*",
    "/sharing/:path*",
    "/practice-tests/:path*",
    "/admin/:path*",
  ],
};
