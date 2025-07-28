"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { set } from "mongoose";


export default function DashboardEmployer() {
  
  const [dummyJobs, setDummyJobs] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
        if(!session || !session.user || session.user.role !== "Employer") {
            
            router.push("/login"); // Redirect to login page if not authorized
        }

        getEmployerJobs();
    },[session, router]);

 

    

    const getEmployerJobs = async () => {
        try {
            if(!session || !session.user || session.user.role !== "Employer") {
                console.error("Unauthorized access: User is not an employer");
                router.push("/login");
                return;
            }
            setLoading(true);
            setError(null);
            
            const res = await fetch("http://localhost:3000/api/jobs/employerJobs");
            if (!res.ok) {
                throw new Error("Failed to fetch employer jobs");
            }
            const data = await res.json();
            console.log("Employer Jobs Data:", data);
            setDummyJobs(data.filter(job => job.isActive === true)); // Filter active jobs
        } catch (error) {
            console.error("Error fetching employer jobs:", error);
            setError(error.message || "Failed to load jobs. Please try again.");
        }finally {
            setLoading(false);
        }
    }

    const handleDeleteJob = async (jobId) => {
        try {
            if(!session || !session.user || session.user.role !== "Employer") {
                console.error("Unauthorized access: User is not an employer");
                router.push("/login");
                return;
            }
            if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
                return; // User cancelled the deletion
            }
            setLoading(true);
            setError(null);
            const res = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                throw new Error("Failed to delete job");
            }
            const data = await res.json();
            if(data) {
                setDummyJobs((prevJobs) => prevJobs.filter(job => job._id !== jobId));
            }
        } catch (error) {
            console.error("Error deleting job:", error.message);
            alert("Failed to delete job. Please try again.");
            setError(error.message || "Failed to delete job. Please try again.");
        } finally {
            setLoading(false);
        }
    }


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

  


  return (
    <div className="container min-h-8xl mx-auto mb-25 p-6">
      {/* Header with dropdown */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Jobs Posted by You</h2>
        
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyJobs.map((job) => (
          <div key={job._id} className="card bg-base-100 shadow-lg border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-xl">{job.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {job.company} &middot; {job.location}
              </p>
              <p className="text-base">{job.description.substring(0, 200) + " ..."}</p>
              <div className="flex justify-between card-actions mt-4">
                <Link href={`jobs/modifyJob/${job._id}`}>
                  <button className="btn btn-info btn-outline btn-sm ">Modify</button>
                </Link>
                
                  <button onClick={()=>handleDeleteJob(job._id)} className="btn btn-error btn-outline btn-sm">Delete</button>
                
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}
