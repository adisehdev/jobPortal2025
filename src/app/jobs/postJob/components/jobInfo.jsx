import React from "react";
import { useState } from "react";

export default function JobInfo({ data, handleFormData }) {
  return (
    <form>
      <fieldset className="fieldset w-full">
        <label className="text-lg">
          Job Title <span className="text-error">*</span>
        </label>
        <input
          value={data.title}
          onChange={(e) => handleFormData("title", e.target.value)}
          type="text"
          className="input input-bordered input-info w-full validator"
          placeholder="enter the job title"
          required
        />
        <div className="validator-hint text-error">Job title is required</div>
      </fieldset>

      <fieldset className="fieldset w-full">
        <label className="text-lg">
          Company Name <span className="text-error">*</span>
        </label>
        <input
          value={data.companyName}
          onChange={(e) => handleFormData("companyName", e.target.value)}
          type="text"
          className="input input-bordered input-info w-full validator"
          placeholder="enter the company name"
          required
        />
        <div className="validator-hint text-error">
          Company name is required
        </div>
      </fieldset>

      <fieldset className="fieldset w-full">
        <label className="text-lg">
          Job Description <span className="text-error">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => handleFormData("description", e.target.value)}
          rows="4"
          required
          placeholder="enter job description"
          className="textarea textarea-info w-full"
        ></textarea>
        <div className="validator-hint text-error">
          Job description is required
        </div>
      </fieldset>
    </form>
  );
}
