import React from "react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function JobsPreview() {
  let dummyJobs = []
  const session = await auth();

  try {
    const response  = await fetch("http://localhost:3000/api/jobs");
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    const result = await response.json();
    dummyJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
    dummyJobs = result.slice(0, 6); // Get only the first 6 jobs for preview
    //console.log("Fetched Jobs:", result);

  } catch (error) {
    console.error("Error fetching jobs:", error);
  }


  
  return (
    <section className="hero w-full  py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl  font-bold mb-8">
          Latest Job Listings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyJobs.map((job) => (
          <div key={job._id} className="card bg-base-100 shadow-lg border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-xl">{job.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {job.company} &middot; {job.location}
              </p>
              <p className="text-base">{job.description.slice(0, 400) + "..."}</p>
              <div className="card-actions mt-4">
                <Link href={session ? `/jobs/${job._id}` : `/login`}>
                  <button className="btn btn-info btn-outline btn-sm w-full">{session ? "View Details" : "Login to view Details"}</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
