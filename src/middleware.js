// middleware.js (or .ts) at project root
//import { auth } from "./auth";
import {getToken} from "next-auth/jwt"
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/applications/:path*",
    "/jobs/:path*",
    "/review/:appId*", // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

export async function middleware(request) {
  //const session = await auth();

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  

  //console.log("token", token);

  const currPath = request.nextUrl.pathname;

  const isAuthorized = token && token.email;
  const role = token ? token.role : null;

  if (
    currPath.startsWith("/review") &&
    (!isAuthorized || role !== "Employer")
  ) {
    //if user is not authorized or not an employer and trying to access review page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const publicPaths = ["/login", "/signup", "/", "/jobs", "/api/jobs","/api/auth/register"];
  const employerPaths = [
    "/jobs/postJob",
    "/jobs/modifyJob",
    "/review/:appId",
    "/api/applications/employerApps",
    "/api/jobs/employerJobs",
  ];
  const jobSeekerPaths = ["applications", "/api/applications/jobSeekerApps"];
  const commonPaths = ["/dashboard", "/api/applications", "/api/jobs"];

  const isEmployerPath = employerPaths.some((path) =>
    currPath.startsWith(path)
  );
  const isJobSeekerPath = jobSeekerPaths.some((path) =>
    currPath.startsWith(path)
  );
  const isCommonPath = commonPaths.some((path) => currPath.startsWith(path));

  if (publicPaths.includes(currPath)) {
    //check if the path is public
    if (isAuthorized && (currPath === "/login" || currPath === "/signup")) {
      //if user is already logged in and trying to access login or register page
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthorized) {
    //if user is not authorized
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isEmployerPath && role !== "Employer") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isJobSeekerPath && role !== "Job Seeker") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isCommonPath && role !== "Employer" && role !== "Job Seeker") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
export default middleware;
