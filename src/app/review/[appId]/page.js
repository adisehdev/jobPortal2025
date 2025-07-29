"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function ReviewAppPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { appId } = useParams();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!session) return;
        const fetchApplicationDetails = async () => {
            try {
                if (session.user.role !== "Employer") {
                    router.push("/login");
                    return;
                }
                const res = await fetch(`/api/applications/${appId}`);
                if (!res.ok) throw new Error("Failed to fetch application details");
                const data = await res.json();
                setApplication(data);
            } catch (err) {
                console.error("Error fetching application details:", err);
                setError("Failed to load application details.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetails();
    }, [appId, session, router]);

    const handleApplicationStatus = (status) => async () => {
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`/api/applications/${appId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicationStatus: status, reviewedOn: new Date() }),
            });
            if (!res.ok) throw new Error("Failed to update application status");
            router.push("/review");
        } catch (error) {
            console.error("Error updating application status:", error);
            setError("Failed to update status. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-base-200">
                <span className="loading loading-spinner loading-lg text-info"></span>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
                <div role="alert" className="alert alert-error max-w-md">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error || "Application not found."}</span>
                </div>
                <Link href="/review" className="btn btn-primary btn-sm mt-6">
                    Back to Review List
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

    const handleAIReview = async()=>{
      console.log("ai review started")
      try {
        const res = await fetch(`/api/applications/${appId}/analyze`, {
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({appId : appId})

          


        })

        if(!res.ok) {
          console.log(res);
          throw new Error("Failed to fetch application details");}
        
        const data = await res.json();
        
        console.log("ai review data : " , data);
      } catch (error) {
        console.error("Error fetching application details:", error);
        //setError(error.message);
      }
    }

    return (
        <main className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                {/* --- Main Card --- */}
                <div className="card bg-base-100 border border-base-300/50 shadow-sm">
                    <div className="card-body p-6 sm:p-8 md:p-10">
                        {/* Header */}
                        <header className="mb-8">
                            <h1 className="text-3xl lg:text-4xl font-bold text-base-content">
                                {application.firstName} {application.lastName}
                            </h1>
                            <p className="text-base-content/70">
                                Application for: {application.jobId?.title || "N/A"}
                            </p>
                        </header>

                        {/* --- Internal Content Grid --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                            {/* Left Side: Applicant Details */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold border-b border-base-300 pb-2">Applicant Information</h2>
                                <div className="space-y-4">
                                    <DetailItem label="Contact Email">{application.email}</DetailItem>
                                    <DetailItem label="Contact Number">{application.contactNumber || "N/A"}</DetailItem>
                                    <DetailItem label="Stated Experience">{application.workExperience || "N/A"}</DetailItem>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-base-content mb-2">Cover Letter</h3>
                                    <div className="p-4 rounded-box bg-base-200 min-h-[200px] max-h-[400px] overflow-y-auto">
                                        {application.coverLetter ? (
                                             <article className="prose prose-sm max-w-none text-base-content/80">
                                                <p>{application.coverLetter}</p>
                                            </article>
                                        ) : (
                                            <p className="text-sm text-base-content/60 italic">No cover letter was provided.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Right Side: Job Details for Context */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold border-b border-base-300 pb-2">Position Details</h2>
                                <div className="space-y-4">
                                    <DetailItem label="Company">{application.jobId?.companyName || "N/A"}</DetailItem>
                                    <DetailItem label="Location">{application.jobId?.location || "N/A"}</DetailItem>
                                    <DetailItem label="Experience Required">{application.jobId?.experienceLevel || "N/A"}</DetailItem>
                                </div>
                            </div>
                        </div>
                        
                        {/* --- Actions Bar --- */}
                        <div className="divider my-8"></div>
                        <footer className="flex flex-wrap items-center justify-between gap-4">
                             {/* Secondary Actions */}
                            <div className="flex items-center gap-2">
                                <a href={application.resume} target="_blank" rel="noopener noreferrer" className={`btn btn-sm btn-outline btn-base-100 ${!application.resume && 'btn-disabled'}`}>
                                    View Resume
                                </a>
                                
                            </div>

                             {/* Primary Actions */}
                            <div className="flex items-center gap-3">
                                <button className="btn btn-sm btn-error" onClick={handleApplicationStatus("Rejected")} disabled={submitting}>
                                    {submitting ? <span className="loading loading-spinner"></span> : "Reject"}
                                </button>
                                <button className="btn btn-sm btn-success" onClick={handleApplicationStatus("Accepted")} disabled={submitting}>
                                    {submitting ? <span className="loading loading-spinner"></span> : "Accept"}
                                </button>
                            </div>
                        </footer>
                         {error && <div role="alert" className="alert alert-error text-xs mt-4"><svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</div>}
                    </div>
                </div>
            </div>
        </main>
    );
}