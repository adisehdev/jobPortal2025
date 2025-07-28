"use client"
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast,Toaster } from "react-hot-toast";

export default function ModifyJobPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description : "",
        companyName: "",
        location: "",
        salaryRange: "",
        employmentType: "",
        experienceLevel: "",
        jobCategory: "",
        isActive: true,

    });

    useEffect(()=>{
        if(!session || !session.user || session.user.role !== "Employer") {
            router.push("/login"); // Redirect to login page if not authorized
            return;
        }

        const fetchJob = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`http://localhost:3000/api/jobs/${id}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch job details");
                }
                const data = await res.json();
                setJob(data);
                setFormData({
                    title: data.title,
                    description: data.description,
                    companyName: data.companyName,
                    location: data.location,
                    salaryRange: data.salaryRange,
                    employmentType: data.employmentType,
                    experienceLevel: data.experienceLevel,
                    jobCategory: data.jobCategory,
                    isActive: data.isActive
                });
            } catch (error) {
                console.error("Error fetching job:", error);
                setError(error.message || "Failed to load job details. Please try again.");
                setJob(null);
            }
            finally {
                setLoading(false);
            }
        };

        fetchJob();
    },[id,session,router])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3000/api/jobs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                throw new Error("Failed to update job");
            }
            const updatedJob = await res.json();
            toast.success("Job updated",{duration: 3000});
            console.log("Job updated successfully:", updatedJob);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error updating job:", error);
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
        return <div className="text-center py-10 px-4">Error: {error}</div>;
    }
    if (!job) {
        return <div>No application found</div>;
    }

    return (
        <>
        <Toaster position="top-center" />
            <div className="container mx-auto mt-20 mb-25 p-6 border-2 border-base-100 rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Modify Job</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <fieldset className="fieldset w-full">
                    <label className="text-lg">Job Title <span className="text-error">*</span></label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        type="text"
                        className="input input-bordered input-info w-full"
                        placeholder="Enter the job title"
                        required
                    />
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="text-lg">Company Name <span className="text-error">*</span></label>
                    <input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        type="text"
                        className="input input-bordered input-info w-full"
                        placeholder="Enter the company name"
                        required
                    />
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="text-lg">Job Description <span className="text-error">*</span></label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                        placeholder="Enter job description"
                        className="textarea textarea-info w-full"
                    ></textarea>
                </fieldset>

                {/* Add other fields similarly */}
                <fieldset className="fieldset w-full">
                    <label className="text-lg">Location</label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        type="text"
                        className="input input-bordered input-info w-full"
                        placeholder="Enter job location"
                    />
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="text-lg">Salary Range</label>
                    <input
                        name="salaryRange"
                        value={formData.salaryRange}
                        onChange={handleChange}
                        type="text"
                        className="input input-bordered input-info w-full"
                        placeholder="Enter salary range"
                    />
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="text-lg">Employment Type</label>
                    <select
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        className="select select-info w-full"
                    >
                        <option value="" disabled>Pick Employment Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                    </select>
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="text-lg">Experience Level</label>
                    <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="select select-info w-full"
                    >
                        <option value="" disabled>Pick Experience Level</option>
                        <option value="Entry-level">Entry-level</option>
                        <option value="Mid-level">Mid-level</option>
                        <option value="Senior-level">Senior-level</option>
                    </select>
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="text-lg">Job Category</label>
                    <select
                        name="jobCategory"
                        value={formData.jobCategory}
                        onChange={handleChange}
                        className="select select-info w-full"
                    >
                        <option value="" disabled>Pick Job Category</option>
                        <option value="IT">IT</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Sales">Sales</option>
                        <option value="Other">Other</option>
                    </select>
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="text-lg">Active Status</label>
                    <select
                        name="isActive"
                        value={formData.isActive}
                        onChange={handleChange}
                        className="select select-info w-full"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </fieldset>
                
                <button type="submit" className="btn btn-outline btn-info">Update Job</button>
            </form>
        </div>
        </>
    )
    


}