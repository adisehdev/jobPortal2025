import React from "react";
import { useState } from "react";

export default function Requirements({ data, handleFormData }) {
  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label className="text-lg mb-1">
          Job Category <span className="text-red-500">*</span>
        </label>
        <select
          value={data.jobCategory}
          onChange={(e) => handleFormData("jobCategory", e.target.value)}
          required
          className="w-full select select-info"
        >
          <option value="" disabled>
            Pick Job Domain
          </option>
          <option>IT</option>
          <option>Finance</option>
          <option>Marketing</option>
          <option>Healthcare</option>
          <option>Education</option>
          <option>Engineering</option>
          <option>Sales</option>
          <option>Other</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-lg mb-1">
          Employment Type <span className="text-red-500">*</span>
        </label>
        <select
          value={data.employmentType}
          onChange={(e) => handleFormData("employmentType", e.target.value)}
          required
          className="w-full select select-info"
        >
          <option value="" disabled>
            Pick Employment Type
          </option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-lg mb-1">
          Experience Level <span className="text-red-500">*</span>
        </label>
        <select
          value={data.experienceLevel}
          onChange={(e) => handleFormData("experienceLevel", e.target.value)}
          required
          className="w-full select select-info"
        >
          <option value="" disabled>
            Pick Experience Level
          </option>
          <option>Entry-level</option>
          <option>Mid-level</option>
          <option>Senior-level</option>
        </select>
      </div>
    </form>
  );
}
