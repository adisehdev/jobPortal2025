import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const config = {
  // Protects all routes except auth, static files, and public assets.
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function middleware(request) {
  // Decrypts the user's session token.
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const isAuthorized = !!token;

  // Allow access to public pages if user is not logged in.
  const publicPages = ["/", "/login", "/signup", "/jobs"];
  const isPublicPage = publicPages.some(p => pathname.startsWith(p));
  
  if (!isAuthorized && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If authorized, handle role-based access and redirects.
  if (isAuthorized) {
    // Redirect away from login/signup pages if already logged in.
    if (pathname === "/login" || pathname === "/signup") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Enforce role-based access control.
    const role = token.role;
    if (pathname.startsWith("/review") && role !== "Employer") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (pathname.startsWith("/applications") && role !== "Job Seeker") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}