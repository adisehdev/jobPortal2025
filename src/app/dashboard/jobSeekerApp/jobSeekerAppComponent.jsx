"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

export default function DashboardJobSeeker() {
  const [applications, setApplications] = useState([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!session || !session.user || session.user.role !== "Job Seeker") {
      router.push("/login"); // Redirect to login page if not authorized
    } else {
      getJobSeekerApplications();
    }
  }, [session, router]);

  const getJobSeekerApplications = async () => {
    try {
      if (!session || !session.user || session.user.role !== "Job Seeker") {
        console.error("Unauthorized access: User is not a job seeker");
        router.push("/login");
        return;
      }
      setLoading(true);
      setError(null);
      const res = await fetch(
        "http://localhost:3000/api/applications/jobSeekerApps"
      );
      if (!res.ok) {
        throw new Error("Failed to fetch job seeker applications");
      }
      const data = await res.json();
      console.log("Job Seeker Applications Data:", data);
      setApplications(data);
    } catch (error) {
      console.error("Error fetching job seeker applications:", error);
      setError(
        error.message || "Failed to load applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (appId) => {
    try {
      if (!session || !session.user || session.user.role !== "Job Seeker") {
        console.error("Unauthorized access: User is not a job seeker");
        router.push("/login");
        return;
      }
      if (
        !confirm(
          "Are you sure you want to withdraw this application? This action cannot be undone."
        )
      ) {
        return; // User cancelled the deletion
      }
      setLoading(true);
      setError(null);
      const res = await fetch(
        `http://localhost:3000/api/applications/${appId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete application");
      }
      const data = await res.json();
      toast.success("Application withdrawn successfully");
      console.log("Application deleted successfully:", data);
      getJobSeekerApplications(); // Refresh the applications list
    } catch (error) {
      console.error("Error deleting application:", error);
      setError(
        error.message || "Failed to delete application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
    <>
      <Toaster position="top-center" />
      <div className="container min-h-8xl mx-auto mb-25 p-6">
        {/* Header with dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold">Your Applications</h2>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map(
            (app) =>
              app.jobExists && (
                <div key={app._id}>
                  <div
                    key={app._id}
                    className="card bg-base-100 shadow-lg border border-base-200"
                  >
                    <div className="card-body">
                      <h2 className="card-title text-xl">{app.jobId.title}</h2>
                      <p className="text-sm text-gray-500 mb-2">
                        {app.jobId.companyName} &middot; {app.jobId.location}
                      </p>
                      <p className="text-base whitespace-pre-wrap">
                        {app.jobId.description.substring(0, 200) + "..."}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm font-semibold">
                          Status:{" "}
                          <span
                            className={`px-2 py-1 rounded-full text-white ${
                              app.applicationStatus === "Accepted"
                                ? "bg-green-500"
                                : app.applicationStatus === "Rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {app.applicationStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between card-actions mt-4">
                        {app.jobExists === true ? (
                          <>
                            <button
                              onClick={() => handleDeleteApplication(app._id)}
                              className="btn btn-error btn-outline btn-sm"
                            >
                              Withdraw Application
                            </button>
                            <Link
                              href={`/applications/${app._id}`}
                              className="btn btn-info btn-outline btn-sm"
                            >
                              View Application
                            </Link>
                          </>
                        ) : (
                          <button className="btn btn-error btn-outline btn-sm">
                            Job no longer exists
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
}
