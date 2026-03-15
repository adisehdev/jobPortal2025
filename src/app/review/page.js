"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState,useEffect } from "react";

export default function ReviewPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch(`/api/applications/employerApps`);
                if (!res.ok) {
                    throw new Error("Failed to fetch applications");
                }
                const data = await res.json();
                console.log("Fetched Applications:", data);
                if(data.length)console.log("Applications Data:", data[0].postedOn.split("T")[0]);
                //data.filter(app => app.jobExists === true); // Filter applications where job exists
                setApplications(data);
                //setApplications(data.filter(app => app.applicationStatus === "Pending"));
                console.log("Applications:", data);
            } catch (err) {
                console.error("Error fetching applications:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (session && session.user && session.user.role === "Employer") {
            fetchApplications();
        } else {
            router.push("/login");
        }
    }, [session, router]);


    if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-info"></span>
      </div>
    );
  }
    if (error) {
        return <div className="text-center">Error: {error}</div>;
    }

    if (!applications || applications.length === 0 || applications.every(app => !app.jobExists)) {
        return <div className="text-center">
          <h2 className="text-2xl font-bold">No Applications Found</h2>
        </div>
    }

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          
            app.jobExists && (<div key={app._id} className={"card bg-base-100 shadow-lg border" + (app.applicationStatus === "Pending" ? " border-info" : app.applicationStatus === "Rejected" ? " border-error" : " border-success")}>
            <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title text-xl">{app.jobId.title}</h2>
              <span className="badge badge-outline text-gray-400 p-2">{(!app.coverLetter) ? "Cover letter missing" : `Initial Score: ${app.aiMatchScore}`}</span>
            </div>
              
              <p className="text-sm text-gray-500 mb-2">
                {app.jobId.companyName} &middot; {app.jobId.location}
              </p>
              <p className="text-sm text-gray-500">Posted On : {app.postedOn.split("T")[0]}</p>
              {(app.reviewedOn && (app.applicationStatus === "Accepted" || app.applicationStatus === "Rejected"))  && <p className="text-sm text-gray-500">Last reviewed : {app.reviewedOn.split("T")[0]}</p>}

              {app.coverLetter &&app.aiAnalysisStatus === "completed" && app.aiRecommendation && (
                <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-3 border-b border-primary/5 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">AI Match Analysis</p>
                    </div>
                    {app.aiJustification && (
                      <Link href={`/review/${app._id}`}>
                        <button className="btn btn-ghost btn-xs text-primary gap-1.5 hover:bg-primary/10 rounded-full px-3 normal-case font-bold group/link transition-all duration-300 border border-transparent hover:border-primary/20">
                          <span className="text-[9px] uppercase tracking-wider">Full Analysis</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </Link>
                    )}
                  </div>
                  <p className="text-sm text-base-content/80 leading-relaxed font-medium">
                    {app.aiRecommendation}
                  </p>
                </div>
              )}

              <div className="card-actions mt-6">
                <Link href={`/review/${app._id}`} className="w-full">
                  <button className="btn btn-info btn-outline btn-sm w-full hover:bg-info hover:text-white transition-all duration-300 rounded-xl">
                    {app.applicationStatus === "Pending" ? "Review" : "Application Reviewed (Review Again)"}
                  </button>
                </Link>
              </div>
            </div>
          </div>)
          
        ))}
      </div>
        </div>
    );
                        
                        
                    

}


