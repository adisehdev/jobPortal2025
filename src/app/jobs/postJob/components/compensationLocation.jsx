import React from "react";
import { useState } from "react";

export default function CompensationLocation({ data, handleFormData }) {
  return (
    <form className="flex flex-col gap-4">
      <fieldset className="fieldset w-full">
        <label className="text-lg">
          Location <span className="text-error">*</span>
        </label>
        <input
          value={data.location}
          onChange={(e) => handleFormData("location", e.target.value)}
          type="text"
          className="input input-bordered input-info w-full validator"
          placeholder="Enter the job location"
          required
        />
        <div className="validator-hint text-error">Location is required</div>
      </fieldset>

      <fieldset className="fieldset w-full">
        <label className="text-lg">
          Salary Range <span className="text-error">*</span>
        </label>
        <input
          value={data.salaryRange}
          onChange={(e) => handleFormData("salaryRange", e.target.value)}
          type="text"
          className="input input-bordered input-info w-full validator"
          placeholder="Enter the salary range"
          required
        />
        <div className="validator-hint text-error">
          Salary range is required
        </div>
      </fieldset>
    </form>
  );
}
