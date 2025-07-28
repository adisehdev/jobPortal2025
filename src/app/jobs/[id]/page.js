"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function JobPage() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchJob = async () => {
            if (status === "loading") return;

            try {
                setLoading(true);
                const response = await fetch(`/api/jobs/${id}`);
                if (!response.ok) {
                    throw new Error(response.statusText || "Failed to fetch job details");
                }
                const data = await response.json();
                setJob(data);
            } catch (error) {
                console.error("Error fetching job details:", error);
                setError(error.message || "Failed to load job details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id, status]);

    const handleApplyClick = () => {
        if (!session || !session.user) {
            router.push("/login?callbackUrl=" + window.location.pathname);
            return;
        }
        if (session.user.role !== "Job Seeker") {
            alert("Only users with a Job Seeker account can apply for jobs.");
            return;
        }
        router.push(`/applications/postApplication/${job._id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-base-200">
                <span className="loading loading-spinner loading-lg text-info"></span>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
                <div role="alert" className="alert alert-error max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error ? `Error: ${error}` : "Job not found."}</span>
                </div>
                <Link href="/" className="btn btn-primary btn-sm mt-6">
                    Back to All Jobs
                </Link>
            </div>
        );
    }

    const DetailItem = ({ label, children }) => (
        <div>
            <dt className="text-sm font-medium text-base-content/60">{label}</dt>
            <dd className="text-base text-base-content font-medium">{children}</dd>
        </div>
    );

    const isEligibleToApply = session?.user?.role === "Job Seeker";

    return (
        <main className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-sm mb-4">
                    <Link href="/jobs" className="btn btn-ghost btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                        Back to All Jobs
                    </Link>
                </div>

                {/* --- Single Content Card --- */}
                <div className="card bg-base-100 border border-base-300/50 shadow-sm">
                    <div className="card-body p-6 sm:p-8 md:p-10">
                        {/* Job Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl lg:text-4xl font-bold text-base-content">
                                {job.title}
                            </h1>
                            <p className="text-lg text-base-content/80 mt-1">
                                {job.companyName}
                            </p>
                        </div>
                        
                        {/* Key Details Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
                            <DetailItem label="Location">{job.location}</DetailItem>
                            <DetailItem label="Employment Type">{job.employmentType}</DetailItem>
                            <DetailItem label="Experience Level">{job.experienceLevel}</DetailItem>
                        </div>

                        <div className="divider my-6 md:my-8"></div>

                        {/* Full Job Description */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Full Job Description</h2>
                            <article className="prose prose-sm md:prose-base max-w-none text-base-content/80">
                                <p>{job.description}</p>
                            </article>
                        </div>
                        
                        {/* Card Actions - Apply Button */}
                        <div className="card-actions justify-end items-center mt-10">
                            {!session && (
                                <p className="text-xs text-center text-base-content/60 mr-4">
                                    You must be logged in to apply.
                                </p>
                            )}
                            {session && !isEligibleToApply && (
                                <p className="text-xs text-center text-warning mr-4">
                                    Only Job Seeker accounts can apply.
                                </p>
                            )}
                            <button onClick={handleApplyClick} className="btn btn-info w-full sm:w-auto">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}