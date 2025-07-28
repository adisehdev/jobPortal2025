"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function JobsPage() {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [perpage, setPerpage] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [currPageJobs, setCurrPageJobs] = useState([]);
  const [pages, setPages] = useState(1);

  const [filter, setFilter] = useState({
    employmentType: "",
    experienceLevel: "",
    jobCategory: "",
  });
  const { data: session } = useSession();

  // Fetch jobs from API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3000/api/jobs");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch jobs");
        }

        const data = await response.json();
        setAllJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(
          err.message || "An unexpected error occurred while fetching jobs."
        );
        setAllJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on 'filter' and 'allJobs' changes
  useEffect(() => {
    let tempJobs = [...allJobs];

    if (filter.employmentType) {
      tempJobs = tempJobs.filter(
        (job) => job.employmentType === filter.employmentType
      );
    }
    if (filter.experienceLevel) {
      tempJobs = tempJobs.filter(
        (job) => job.experienceLevel === filter.experienceLevel
      );
    }
    if (filter.jobCategory) {
      tempJobs = tempJobs.filter(
        (job) => job.jobCategory === filter.jobCategory
      );
    }

    setFilteredJobs(tempJobs);
    let currentPages = Math.ceil(tempJobs.length / perpage);
    let currentPageNum = pageNum;

    if (currentPageNum > currentPages) {
      currentPageNum = currentPages || 1; // Reset to last page if current page exceeds total pages
    }
    setPageNum(currentPageNum);
    setCurrPageJobs(
      tempJobs.slice((currentPageNum - 1) * perpage, currentPageNum * perpage)
    );
    setPages(currentPages);
    //setPageNum(1); // Reset to the first page when filters change
  }, [perpage, filter, allJobs]); // Removed `perpage` from this dependency array

  // Pagination logic: update current page jobs and total pages
  useEffect(() => {
    const start = (pageNum - 1) * perpage;
    const end = start + perpage;

    setCurrPageJobs(filteredJobs.slice(start, end));
    setPages(Math.ceil(filteredJobs.length / perpage));
  }, [pageNum, perpage, filteredJobs]); // Added `perpage` as a dependency here

  // Render based on states: loading, error, or job listings
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-info"></span>
        <p className="ml-4 text-xl text-base-content">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-base-200">
        <div role="alert" className="alert alert-error max-w-lg mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error loading jobs: {error}</span>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
        <p className="mt-4 text-base-content">
          Please try refreshing the page or contact support if the issue
          persists.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-20 gap-6">
        {/* Clear Filters Button */}
        <button
          className="btn btn-sm btn-outline mt-5" // Styled with DaisyUI classes
          onClick={() => {
            setPerpage(5); // Reset to default per page
            setPageNum(1); // Reset to first page
            setFilter({
              employmentType: "",
              experienceLevel: "",
              jobCategory: "",
            });
          }}
        >
          Clear Filters
        </button>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-medium">Jobs per page</span>
          </label>
          <select
            className="select select-bordered select-sm"
            value={perpage}
            onChange={(e) => setPerpage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-medium">Employment Type</span>
          </label>
          <select
            className="select select-bordered select-sm"
            value={filter.employmentType}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, employmentType: e.target.value }))
            }
          >
            <option value={""}>All</option>
            <option value={"Full-time"}>Full-time</option>
            <option value={"Part-time"}>Part-time</option>
            <option value={"Contract"}>Contract</option>
            <option value={"Internship"}>Internship</option>
          </select>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-medium">Experience Level</span>
          </label>
          <select
            className="select select-bordered select-sm"
            value={filter.experienceLevel}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                experienceLevel: e.target.value,
              }))
            }
          >
            <option value={""}>All</option>
            <option value={"Entry-level"}>Entry-level</option>
            <option value={"Mid-level"}>Mid-level</option>
            <option value={"Senior-level"}>Senior-level</option>
          </select>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-medium">Job Category</span>
          </label>
          <select
            className="select select-bordered select-sm"
            value={filter.jobCategory}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, jobCategory: e.target.value }))
            }
          >
            <option value={""}>All</option>
            <option value={"IT"}>IT</option>
            <option value={"Finance"}>Finance</option>
            <option value={"Healthcare"}>Healthcare</option>
            <option value={"Education"}>Education</option>
            <option value={"Marketing"}>Marketing</option>
            <option value={"Engineering"}>Engineering</option>
            <option value={"Sales"}>Sales</option>
            <option value={"Other"}>Other</option>
          </select>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6">Job Listings</h2>

      {/* Job Cards Grid */}
      {currPageJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currPageJobs.map((job) => (
            <div
              key={job._id || job.id}
              className="card bg-base-100 shadow-lg border border-base-200"
            >
              <div className="card-body">
                <div className="flex justify-between">
                  <h2 className="card-title text-xl">{job.title}</h2>
                  <span className="badge badge-sm badge-outline text-sm text-gray-300 h-auto py-1">
                    {job.experienceLevel}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  {job.companyName || "N/A"} &middot; {job.location || "N/A"}
                </p>

                <p className="text-base text-gray-700 line-clamp-3">
                  {job.description || "No description available."}
                </p>
                <div className="card-actions mt-4 justify-end">
                  <Link
                    href={
                      session && session.user
                        ? `/jobs/${job._id || job.id}`
                        : "/login"
                    }
                    passHref
                  >
                    <button className="btn btn-info btn-outline btn-sm">
                      {session && session.user
                        ? "View Details"
                        : "Login to View"}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-3xl font-bold mb-4 text-info">
            No Jobs Available
          </h2>
          <p className="text-gray-500 text-lg text-center max-w-prose">
            We couldn't find any job listings matching your criteria. Please try
            adjusting your filters.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pages >= 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            className="btn btn-info btn-outline btn-sm"
            onClick={() => setPageNum((prev) => Math.max(prev - 1, 1))}
            disabled={pageNum === 1}
          >
            « Previous
          </button>
          <span className="text-sm font-medium">
            Page {pageNum} of {pages}
          </span>
          <button
            className="btn btn-info btn-outline btn-sm"
            onClick={() => setPageNum((prev) => Math.min(prev + 1, pages))}
            disabled={pageNum === pages}
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
}
