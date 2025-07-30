"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function JobsPage() {
  const { data: session } = useSession();
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [perPage, setPerPage] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [filters, setFilters] = useState({
    employmentType: "",
    experienceLevel: "",
    jobCategory: "",
  });

  // Fetch jobs once
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/jobs`
        );
        if (!res.ok) throw new Error((await res.json()).message || "Fetch failed");
        setAllJobs(await res.json());
      } catch (err) {
        setError(err.message);
        setAllJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Derived filtered jobs
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const byType = filters.employmentType ? job.employmentType === filters.employmentType : true;
      const byExp = filters.experienceLevel ? job.experienceLevel === filters.experienceLevel : true;
      const byCat = filters.jobCategory ? job.jobCategory === filters.jobCategory : true;
      return byType && byExp && byCat;
    });
  }, [allJobs, filters]);

  // Compute pagination values
  const pages = useMemo(
    () => Math.max(1, Math.ceil(filteredJobs.length / perPage)),
    [filteredJobs.length, perPage]
  );

  // Reset pageNum if out of range
  useEffect(() => {
    if (pageNum > pages) {
      setPageNum(pages);
    }
  }, [pages, pageNum]);

  // Current page slice
  const currPageJobs = useMemo(() => {
    const start = (pageNum - 1) * perPage;
    return filteredJobs.slice(start, start + perPage);
  }, [filteredJobs, pageNum, perPage]);

  const clearFilters = useCallback(() => {
    setPerPage(5);
    setPageNum(1);
    setFilters({ employmentType: "", experienceLevel: "", jobCategory: "" });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-info" />
        <p className="ml-4 text-xl text-base-content">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-base-200">
        <div className="alert alert-error max-w-lg mx-auto" role="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error loading jobs: {error}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
        <p className="mt-4 text-base-content">
          Please try refreshing the page or contact support if the issue persists.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-20 gap-6">
        <button className="btn btn-sm btn-outline mt-5" onClick={clearFilters}>
          Clear Filters
        </button>

        {/* Per-page selector */}
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-medium">Jobs per page</span>
          </label>
          <select
            className="select select-bordered select-sm"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Filters */}
        {[
          { label: "Employment Type", key: "employmentType", options: ["Full-time", "Part-time", "Contract", "Internship"] },
          { label: "Experience Level", key: "experienceLevel", options: ["Entry-level", "Mid-level", "Senior-level"] },
          { label: "Job Category", key: "jobCategory", options: ["IT", "Finance", "Healthcare", "Education", "Marketing", "Engineering", "Sales", "Other"] }
        ].map(({ label, key, options }) => (
          <div className="form-control w-full max-w-xs" key={key}>
            <label className="label">
              <span className="label-text font-medium">{label}</span>
            </label>
            <select
              className="select select-bordered select-sm"
              value={filters[key]}
              onChange={(e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))}
            >
              <option value="">All</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-6">Job Listings</h2>

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
                  {job.companyName || "N/A"} · {job.location || "N/A"}
                </p>
                <p className="text-base text-gray-700 line-clamp-3">
                  {job.description || "No description available."}
                </p>
                <div className="card-actions mt-4 justify-end">
                  <Link href={session?.user ? `/jobs/${job._id || job.id}` : `/login?redirect=/jobs/${job._id || job.id}`} passHref>
                    <button className="btn btn-info btn-outline btn-sm">
                      {session?.user ? "View Details" : "Login to View"}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-3xl font-bold mb-4 text-info">No Jobs Available</h2>
          <p className="text-gray-500 text-lg text-center max-w-prose">
            We could not find any job listings matching your criteria. Please try adjusting your filters.
          </p>
        </div>
      )}

      {pages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            className="btn btn-info btn-outline btn-sm"
            onClick={() => setPageNum((p) => Math.max(p - 1, 1))}
            disabled={pageNum === 1}
          >
            « Previous
          </button>
          <span className="text-sm font-medium">Page {pageNum} of {pages}</span>
          <button
            className="btn btn-info btn-outline btn-sm"
            onClick={() => setPageNum((p) => Math.min(p + 1, pages))}
            disabled={pageNum === pages}
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
}
