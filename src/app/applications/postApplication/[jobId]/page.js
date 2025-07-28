"use client";
import React, { use } from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import PersonalDetails from "./components/PersonalDetails";
import Qualifications from "./components/Qualifications";
import { toast, Toaster } from "react-hot-toast";

export default function PostApplicationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { jobId } = useParams();
  //const [job, setJob] = useState(null);

  const [step, setStep] = useState(1);
  const [submitDisabled,setSubmitDisabled] = useState(false)
  const fileRef = useRef(null);

  useEffect(() => {
    if (!session || !session.user || session.user.role !== "Job Seeker") {
      console.error("Unauthorized access: User is not a job seeker");
      router.push("/login"); // Redirect to login page if not authorized
      return;
    }
    const fetchAllApplications = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/applications/jobSeekerApps"
        );
        if (!res.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await res.json();

        if (
          data.some(
            (app) =>
              app.jobId._id === jobId &&
              app.applicantData.userId === session.user.id
          )
        ) {
          toast.error("You have already applied for this job");
          router.push("/dashboard"); // Redirect to dashboard if already applied

          return;
        }
        console.log("all appplications in post application page:", data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchAllApplications();
  }, [session, jobId, router]);

  console.log("Job ID from params:", jobId);

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
      console.log("resume file:", fileRef.current.files[0]);
      console.log("application data : " + JSON.stringify(applicationData));

      const resume = fileRef.current.files[0];
      if (!resume) {
        throw new Error("Resume file is required");
      }

      //fetchJobDetails(); // Ensure job details are fetched before submission
      // if (!job) {
      //   throw new Error("Job details not found");
      // }

      // Prepare form data for submission
      //applicationData.jobId = jobId; // Ensure jobId is set correctly
      //applicationData.employerId = job.postedBy; // Ensure employerId is set correctly

      const formData = new FormData();
      formData.append("resumeFile", resume);
      Object.keys(applicationData).forEach((key) => {
        formData.append(key, applicationData[key]);
      });

      setSubmitDisabled(true)
      const response = await fetch("http://localhost:3000/api/applications", {
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
      alert("Application submitted successfully");
      router.push("/dashboard"); // Redirect to dashboard after successful submission
      console.log("Application submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application: " + error.message);
    }finally{
      setSubmitDisabled(false)
    }
  };

  return (
    <>
      <Toaster position="top-center"/>
      <div className="container mx-auto min-h-8xl flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Post Application</h1>

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
        {/* Previous */}
        <button
          className="btn btn-outline btn-info"
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
        >
          Previous
        </button>

        {/* Next or Submit */}
        {step < 2 ? (
          <button
            className="btn btn-outline btn-info"
            onClick={() => setStep((prev) => Math.min(3, prev + 1))}
          >
            Next
          </button>
        ) : (
          <button className="btn btn-info" disabled={submitDisabled} onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
    </>
  );
}
