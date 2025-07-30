"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";
import PersonalDetails from "./components/PersonalDetails";
import Qualifications from "./components/Qualifications";


export default function PostApplicationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { jobId } = useParams();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [step, setStep] = useState(1);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!session || !session.user || session.user.role !== "Job Seeker") {
      router.push("/login");
      return;
    }
    const fetchAllApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/applications/jobSeekerApps`);
        if (!res.ok) {
          throw new Error("Failed to fetch applications");
        }
        let data = await res.json();

        if (
          data.some(
            (app) =>
              app.jobId &&
              app.jobId._id === jobId &&
              app.applicantData.userId === session.user.id
          )
        ) {
          toast.error("You have already applied for this job");
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        setError(error.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    const fetchJobDetails = async () => {
      try {
        if (!jobId) {
          throw new Error("Job ID is required");
        }
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await response.json();
        setJobTitle(data.title);
        setJobDescription(data.description);
        setJobCompany(data.companyName);
      } catch (error) {
        setError(error.message || "Failed to load job details.");
        toast.error("Failed to load job details: " + error.message);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAllApplications();
    fetchJobDetails();
  }, [session, jobId, router]);

  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    address: "",
    resume: "",
    coverLetter: "",
    jobId: jobId,
    workExperience: "",
  });

  const handleFormData = (field, value) => {
    setApplicationData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    { id: 1, label: "Personal Details" },
    { id: 2, label: "Qualifications" },
  ];

  const handleSubmit = async () => {
    try {
      const resume = fileRef.current.files[0];
      if (!resume) {
        throw new Error("Resume file is required");
      }

      const formData = new FormData();
      formData.append("resumeFile", resume);
      Object.keys(applicationData).forEach((key) => {
        formData.append(key, applicationData[key]);
      });

      setSubmitDisabled(true);
      const response = await fetch(`/api/applications`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit application" || response.statusText);
      }
      const data = await response.json();
      toast.success("Application submitted successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to submit application: " + error.message);
    } finally {
      setSubmitDisabled(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
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

      <div className="container mx-auto min-h-8xl flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Post Application</h1>

        {/* --- Improved Job Details Section --- */}
        <div className="collapse collapse-arrow bg-base-200 border-2 border-gray-200 rounded-box mb-6">
          <input type="checkbox" id="job-details-collapse" />
          <label
            htmlFor="job-details-collapse"
            className="collapse-title text-lg font-bold cursor-pointer"
          >
            Review Job Details
          </label>
          <div className="collapse-content">
            <div className="p-2 space-y-3">
              <div>
                <p className="font-bold text-base-content">Job Title</p>
                <p>{jobTitle}</p>
              </div>
              <div>
                <p className="font-bold text-base-content">Company</p>
                <p>{jobCompany}</p>
              </div>
              <div>
                <p className="font-bold text-base-content">
                  Description
                </p>
                <p className="mt-1 whitespace-pre-wrap">{jobDescription}</p>
              </div>
            </div>
          </div>
        </div>
        {/* --- End of Improved Section --- */}

        {/* Horizontal stepper */}
        <ul className="steps steps-horizontal w-full">
          {steps.map(({ id, label }) => (
            <li
              key={id}
              className={`step ${step === id ? "step-info" : ""}`}
              onClick={() => setStep(id)}
            >
              {label}
            </li>
          ))}
        </ul>

        {/* Render current form step */}
        <div className="flex-grow">
          {step === 1 && (
            <PersonalDetails
              data={applicationData}
              handleFormData={handleFormData}
            />
          )}
          {step === 2 && (
            <Qualifications
              data={applicationData}
              handleFormData={handleFormData}
              fileRef={fileRef}
            />
          )}
        </div>

        {/* Navigation & Submit buttons */}
        <div className="mt-5 mb-10 flex justify-between">
          <button
            className="btn btn-outline btn-info"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
          >
            Previous
          </button>

          {step < 2 ? (
            <button
              className="btn btn-outline btn-info"
              onClick={() => setStep((prev) => Math.min(3, prev + 1))}
            >
              Next
            </button>
          ) : (
            <button
              className="btn btn-info"
              disabled={submitDisabled}
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </>
  );
}