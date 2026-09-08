import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get("hicappAccessToken");
  console.log("Access Token ->", accessToken);

  const publicRoutes = ["/", "/login", "/register"];

  const isPublicRoute = publicRoutes.includes(pathname);

  // console.log(
  //   "PATH:",
  //   pathname,
  //   "| HAS TOKEN:",
  //   !!accessToken,
  //   "| PUBLIC:",
  //   isPublicRoute,
  // );

  // No token + trying to access a protected route
  if (!accessToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Don't run Proxy for Next.js internals,
     * static files, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
