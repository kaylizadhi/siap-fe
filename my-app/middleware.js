import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isTokenExist = !!request.localStorage.get("authToken");
  const isLoginPage = pathname.startsWith("/login");

  if (!isTokenExist && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isTokenExist && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};