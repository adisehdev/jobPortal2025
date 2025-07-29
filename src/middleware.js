// middleware.js (or .ts) at project root
import {getToken} from "next-auth/jwt"
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/applications/:path*",
    "/jobs/:path*",
    "/review/:appId*", 
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

export async function middleware(request) {
  // Updated getToken configuration for production
  const token = await getToken({ 
    req: request, 
    secret: process.env.AUTH_SECRET, // Use NEXTAUTH_SECRET instead of AUTH_SECRET
    secureCookie: process.env.NODE_ENV === "production", // Enable secure cookies in production
    cookieName: process.env.NODE_ENV === "production" 
      ? "__Secure-authjs.session-token" 
      : "authjs.session-token"
  });

  const currPath = request.nextUrl.pathname;
  const isAuthorized = token && token.email;
  const role = token ? token.role : null;

  // Special handling for review routes
  if (
    currPath.startsWith("/review") &&
    (!isAuthorized || role !== "Employer")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const publicPaths = ["/login", "/signup", "/", "/jobs", "/api/jobs", "/api/auth/register"];
  const employerPaths = [
    "/jobs/postJob",
    "/jobs/modifyJob",
    "/review",
    "/api/applications/employerApps",
    "/api/jobs/employerJobs",
  ];
  const jobSeekerPaths = ["/applications", "/api/applications/jobSeekerApps"];
  const commonPaths = ["/dashboard", "/api/applications", "/api/jobs"];

  const isEmployerPath = employerPaths.some((path) =>
    currPath.startsWith(path)
  );
  const isJobSeekerPath = jobSeekerPaths.some((path) => 
    currPath.startsWith(path)
  );
  const isCommonPath = commonPaths.some((path) => 
    currPath.startsWith(path)
  );

  // Handle public paths
  if (publicPaths.includes(currPath)) {
    if (isAuthorized && (currPath === "/login" || currPath === "/signup")) {
      // Redirect authenticated users away from login/signup
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthorized users
  if (!isAuthorized) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control
  if (isEmployerPath && role !== "Employer") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isJobSeekerPath && role !== "Job Seeker") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isCommonPath && role !== "Employer" && role !== "Job Seeker") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export default middleware;