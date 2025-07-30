import React from "react";
import { useState, useEffect } from "react";

export default function Qualifications({ data, handleFormData ,fileRef}) {
    return (
        <div className="container mx-auto space-y-4 p-6 rounded-lg">
            
            <form className="space-y-4">
                <fieldset className="fieldset w-full">
                    <label className="text-lg">Resume<span className="text-error">*</span></label>
                    <input type="file" ref={fileRef} value={data.resume} onChange={(e) => handleFormData("resume", e.target.value)} name="resume" className="file-input file-input-info w-full"/>
                </fieldset>




                <fieldset className="fieldset w-full">
                <label className="text-lg">Cover Letter</label>
                    <textarea
                        name="coverLetter"
                        value={data.coverLetter || ""}
                        onChange={(e) => handleFormData("coverLetter", e.target.value)}
                        rows="4"
                        className="textarea textarea-info w-full"
                        placeholder="Write your cover letter here"
                    ></textarea>
                </fieldset>






                <fieldset className="fieldset w-full">
                    <label className="text-lg">Work Experience <span className="text-error">*</span></label>
                    <select className="select select-info w-full" value={data.workExperience || ""} onChange={(e) => handleFormData("workExperience", e.target.value)}>
                    <option className="text-gray-200">Select Work Experience</option>
                    <option>Fresher (0-2 years)</option>
                    <option>Mid-Career (2-5 years)</option>
                    <option>Senior (5+ years)</option>

                    </select>
                </fieldset>

                {/* Add other qualification fields similarly */}

            </form>
        </div>
    );
}

