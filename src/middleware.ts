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
    secureCookie: request.nextUrl.protocol === "https:",
  });

  if (!token?.userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // /admin authorizes from the DB in the page/API so a freshly promoted
  // admin is not blocked by a stale JWT role/status claim.
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (token.status !== "approved") {
    return NextResponse.redirect(new URL("/pending", request.url));
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
