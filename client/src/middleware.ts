import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicPath = path === "/login" || "/register" || "/";
  const token = req.cookies.get("token")?.value || ""; // Replace 'yourCookieName' with the actual cookie name

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
}

// Specify the paths where the middleware should apply
export const config = {
  matcher: ["/", "/login", "/register", "/account", "/hire-remotely"], // Apply middleware only to the /account page
};
