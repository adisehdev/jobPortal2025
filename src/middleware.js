// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const config = {
  // ✅ This matcher protects all routes except for the ones required by Next.js and Auth.js
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};

export async function middleware(request) {
  const token = await getToken({
    req: request,
    // ✅ Use the consistent secret variable
    secret: process.env.AUTH_SECRET,
  });

  const currPath = request.nextUrl.pathname;
  const isAuthorized = !!token; // Simplified check for token existence
  const role = token ? token.role : null;

  // Special handling for review routes
  if (
    currPath.startsWith("/review") &&
    (!isAuthorized || role !== "Employer")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // NOTE: Your specific authorization logic below remains unchanged.
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

  const isPublicPath = publicPaths.some(path => currPath === path || (path.endsWith('/*') && currPath.startsWith(path.slice(0, -2))));

  // Handle public paths
  if (isPublicPath) {
    if (isAuthorized && (currPath === "/login" || currPath === "/signup")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthorized users from protected routes
  if (!isAuthorized) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control
  const isEmployerPath = employerPaths.some((path) => currPath.startsWith(path));
  const isJobSeekerPath = jobSeekerPaths.some((path) => currPath.startsWith(path));

  if (isEmployerPath && role !== "Employer") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isJobSeekerPath && role !== "Job Seeker") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// The default export is not needed when using the `config` object
// export default middleware;