"use client";
import React, { useEffect, useState } from "react";
import JobInfo from "./components/jobInfo";
import Requirements from "./components/requirements";
import CompensationLocation from "./components/compensationLocation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";

export default function PostJobPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    description: "",
    jobCategory: "",
    employmentType: "",
    experienceLevel: "",
    location: "",
    salaryRange: "",
  });
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Check if user is logged in and has the employer role
    if (!session || !session.user || session.user.role !== "Employer") {
      //alert("You must be logged in as an employer to post a job.");
      router.push("/login"); // Redirect to login page if not authorized
    }
  }, [session, router]);

  const handleFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    { id: 1, label: "Job Info" },
    { id: 2, label: "Requirements" },
    { id: 3, label: "Compensation & Location" },
  ];

  const handleSubmit = async() => {
    // Replace this with your form submission logic (e.g. API call)
    console.log("Submitting form:", formData);
    //alert("Form submitted successfully!" + JSON.stringify(formData, null, 2));
    try {
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      console.error("Failed to submit job posting:", res.statusText);
      throw new Error("Failed to submit job posting ");
    }
    const data = await res.json();
    console.log("Job posted successfully:", data);
    toast.success("Job posted",{duration: 3000});
    //alert("Job posted successfully!");
    router.push("/jobs"); // Redirect to jobs page after successful submission
    setFormData({
      jobTitle: "",
      companyName: "",
      jobDescription: "",
      jobDomain: "",
      employmentType: "",
      experienceLevel: "",
      location: "",
      salaryRange: "",
    });

    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Failed to post job: " + error.message);
    }
  };

  return (
    <>
    <Toaster position="top-center" />
      <div className="container mx-auto min-h-8xl flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Post a Job</h1>

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
        {step === 1 && <JobInfo data={formData} handleFormData={handleFormData} />}
        {step === 2 && <Requirements data={formData} handleFormData={handleFormData} />}
        {step === 3 && <CompensationLocation data={formData} handleFormData={handleFormData} />}
      </div>

      {/* Navigation & Submit buttons */}
      <div className="mt-5 mb-10 flex justify-between">
        {/* Previous */}
        <button
          className="btn btn-outline btn-info"
          onClick={() => setStep(prev => Math.max(1, prev - 1))}
          disabled={step === 1}
        >
          Previous
        </button>

        {/* Next or Submit */}
        {step < 3 ? (
          <button
            className="btn btn-outline btn-info"
            onClick={() => setStep(prev => Math.min(3, prev + 1))}
          >
            Next
          </button>
        ) : (
          <button
            className="btn btn-info"
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
