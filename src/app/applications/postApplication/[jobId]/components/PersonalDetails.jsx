import React from "react";

export default function PersonalDetails({ data, handleFormData }) {
  return (
    // This component renders only the form fields for better reusability.
    // The parent component should handle the title and main container.
    <div className="space-y-4 py-4">
      {/* Flex container for First and Last Name */}
      <div className="flex flex-col md:flex-row md:gap-4">
        {/* First Name */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">First Name<span className="text-error">*</span></span>
          </label>
          <input
            type="text"
            name="firstName"
            value={data.firstName || ""}
            onChange={(e) => handleFormData("firstName", e.target.value)}
            placeholder="Enter first name"
            className="input input-bordered input-info w-full"
            required
          />
        </div>

        {/* Last Name */}
        <div className="form-control w-full mt-4 md:mt-0">
          <label className="label">
            <span className="label-text">Last Name<span className="text-error">*</span></span>
          </label>
          <input
            type="text"
            name="lastName"
            value={data.lastName || ""}
            onChange={(e) => handleFormData("lastName", e.target.value)}
            placeholder="Enter last name"
            className="input input-bordered input-info w-full"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Email<span className="text-error">*</span></span>
        </label>
        <input
          type="email"
          name="email"
          value={data.email || ""}
          onChange={(e) => handleFormData("email", e.target.value)}
          placeholder="Enter email address"
          className="input input-bordered input-info w-full"
          required
        />
      </div>

      {/* Address */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Address<span className="text-error">*</span></span>
        </label>
        <input
          type="text"
          name="address"
          value={data.address || ""}
          onChange={(e) => handleFormData("address", e.target.value)}
          placeholder="Enter address"
          className="input input-bordered input-info w-full"
          required
        />
      </div>

      {/* Contact Number */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Contact Number</span>
        </label>
        <input
          type="text"
          name="contactNumber"
          value={data.contactNumber || ""}
          onChange={(e) => handleFormData("contactNumber", e.target.value)}
          placeholder="Enter contact number"
          className="input input-bordered input-info w-full"
        />
      </div>
    </div>
  );
}