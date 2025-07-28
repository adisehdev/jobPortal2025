"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Helper function to determine badge color based on application status
const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
        case "reviewed":
            return "badge-info badge-outline";
        case "shortlisted":
            return "badge-success badge-outline";
        case "rejected":
            return "badge-error badge-outline";
        default:
            return "badge-ghost"; // A neutral, subtle default
    }
};

export default function ApplicationPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { appId } = useParams();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            if (!session || session?.user?.role !== "Job Seeker") {
                router.push("/login");
                return;
            }
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${appId}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch application details");
                }
                const data = await res.json();
                setApplication(data);
            } catch (err) {
                console.error("Error fetching application details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (appId) {
            fetchApplicationDetails();
        }
    }, [appId, session, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-base-200">
                Loading application... 
                <span>{" "}</span>
                <span className="loading loading-spinner loading-lg text-info"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-base-200">
                <div role="alert" className="alert alert-error max-w-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Error: {error}</span>
                </div>
            </div>
        );
    }

    if (!application) {
        return <div className="p-10 text-center">No application found.</div>;
    }

    // A reusable component for perfectly aligned key-value pairs
    const DetailItem = ({ label, children }) => (
        <>
            <dt className="text-sm font-medium text-base-content/60">{label}</dt>
            <dd className="text-sm text-base-content sm:col-span-2">{children}</dd>
        </>
    );

    return (
        <main className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* --- Header Section --- */}
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                       <Link href="/dashboard" className="btn btn-ghost btn-sm btn-circle">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                       </Link>
                       <div>
                           <h1 className="text-2xl lg:text-3xl font-bold text-base-content">
                                Application: {application.jobId.title}
                           </h1>
                           <p className="text-sm text-base-content/70">at {application.jobId.companyName}</p>
                       </div>
                    </div>
                    <div className={`badge ${getStatusBadgeClass(application.status)} p-4 font-semibold`}>
                        Status: {application.status || 'Submitted'}
                    </div>
                </header>

                {/* --- Main Content Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Left Column: Job & Documents --- */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        {/* Job Card */}
                        <div className="card bg-base-100 border border-base-300/50 shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title text-base font-semibold">Job Information</h2>
                                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-x-4 gap-y-3">
                                    <DetailItem label="Location">{application.jobId.location}</DetailItem>
                                    <DetailItem label="Experience">
                                        <span className="badge badge-info badge-outline text-xs">{application.jobId.experienceLevel}</span>
                                    </DetailItem>
                                    <DetailItem label="Employer ID">
                                        <span className="font-mono text-xs">{application.employerData.userId}</span>
                                    </DetailItem>
                                </dl>
                                <div className="divider my-2"></div>
                                <div tabIndex={0} className="collapse collapse-arrow -m-4">
                                    <input type="checkbox" /> 
                                    <div className="collapse-title text-sm font-medium">View Full Description</div>
                                    <div className="collapse-content">
                                      <article className="prose prose-sm max-w-none text-base-content/80">
                                        <p>{application.jobId.description}</p>
                                      </article>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents Card */}
                        <div className="card bg-base-100 border border-base-300/50 shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title text-base font-semibold">Submitted Documents</h2>
                                <div className="mt-4 flex flex-col gap-4">
                                   {/* Resume Link */}
                                   <a href={application.resume} target="_blank" rel="noopener noreferrer" className={`btn btn-sm justify-start btn-outline ${!application.resume && 'btn-disabled'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                                        View Resume
                                    </a>
                                   
                                   {/* Conditional Cover Letter Section */}
                                   {application.coverLetter ? (
                                        // IF cover letter EXISTS, show collapsible content
                                        <div tabIndex={0} className="collapse collapse-arrow border border-base-300/50 bg-base-200">
                                            <input type="checkbox" /> 
                                            <div className="collapse-title text-sm font-medium">
                                              View Cover Letter
                                            </div>
                                            <div className="collapse-content">
                                              <article className="prose prose-sm max-w-none text-base-content/80">
                                                <p>{application.coverLetter}</p>
                                              </article>
                                            </div>
                                        </div>
                                   ) : (
                                        // IF cover letter DOES NOT EXIST, show yellow warning box
                                        <div role="alert" className="alert alert-warning">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            <span>No Cover Letter was provided.</span>
                                        </div>
                                   )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Column: Applicant Info --- */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="card bg-base-100 border border-base-300/50 shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title text-base font-semibold">Applicant Details</h2>
                                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                    <DetailItem label="First Name">{application.firstName}</DetailItem>
                                    <DetailItem label="Last Name">{application.lastName}</DetailItem>
                                    <DetailItem label="Email Address">{application.email}</DetailItem>
                                    <DetailItem label="Contact Number">{application.contactNumber || "N/A"}</DetailItem>
                                    <DetailItem label="Address (Full)">{application.address}</DetailItem>
                                    <DetailItem label="Years of Experience">
                                        <span className="font-semibold">{application.workExperience}</span>
                                    </DetailItem>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}