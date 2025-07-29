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

    if (!applications || applications.length === 0) {
        return <div className="text-center">No applications found.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          
            app.jobExists && (<div key={app._id} className={"card bg-base-100 shadow-lg border" + (app.applicationStatus === "Pending" ? " border-info" : app.applicationStatus === "Rejected" ? " border-error" : " border-success")}>
            <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title text-xl">{app.jobId.title}</h2>
              <span className="badge badge-outline text-gray-400 p-2">{(app.keyWordMatchScore === 101 || !app.keyWordMatchScore) ? "Cover letter missing" : `Initial Score: ${app.keyWordMatchScore}`}</span>
            </div>
              
              <p className="text-sm text-gray-500 mb-2">
                {app.jobId.companyName} &middot; {app.jobId.location}
              </p>
              <p className="text-sm text-gray-500">Posted On : {app.postedOn.split("T")[0]}</p>
              {(app.reviewedOn && (app.applicationStatus === "Accepted" || app.applicationStatus === "Rejected"))  && <p className="text-sm text-gray-500">Last reviewed : {app.reviewedOn.split("T")[0]}</p>}
              <div className="card-actions mt-4">
                <Link href={`/review/${app._id}`}>
                  <button className="btn btn-info btn-outline btn-sm w-full">{app.applicationStatus === "Pending" ? "Review" : "Application Reviewed (Review Again)"}</button>
                </Link>

                
              </div>
            </div>
          </div>)
          
        ))}
      </div>
        </div>
    );
                        
                        
                    

}


