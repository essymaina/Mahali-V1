import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const protectedRoutes = ["/dashboard", "/bookings", "/profile"];

  const token = req.cookies.get("supabase-auth-token")?.value;

  if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/bookings", "/profile", "/auth/signin"],
};
