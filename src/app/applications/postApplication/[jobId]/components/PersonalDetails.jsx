import React from "react";
import { useState, useEffect } from "react";


export default function PersonalDetails({ data, handleFormData }) {

        
    
        return (
        <div className="container mx-auto mt-20 mb-25 p-6 border-2 border-base-100 rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Personal Details</h1>
            <form  className="space-y-4">
                <fieldset className="fieldset w-full">
                    <label className="text-lg">First Name<span className="text-error">*</span></label>
                    <input
                        name="firstName"
                        value={data.firstName || ""}
                        onChange={(e) => handleFormData("firstName", e.target.value)}
                        type="text"
                        className="input input-bordered input-info w-full"
                        placeholder="Enter the job title"
                        required
                    />
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="text-lg">Last Name <span className="text-error">*</span></label>
                    <input
                        name="lastName"
                        value={data.lastName || ""}
                        onChange={(e) => handleFormData("lastName", e.target.value)}
                        type="text"
                        className="input input-bordered input-info w-full"
                        placeholder="Enter the last name"
                        required
                    />
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="text-lg">Email <span className="text-error">*</span></label>
                    <input
                        name="email"
                        value={data.email || ""}
                        onChange={(e) => handleFormData("email", e.target.value)}
                        
                        required
                        placeholder="Enter email address"
                        type="email"
                        className="input input-bordered input-info w-full"
                    ></input>
                </fieldset>

                {/* Add other fields similarly */}
                <fieldset className="fieldset w-full">
                    <label className="text-lg">address<span className="text-error">*</span></label>
                    <input
                        name="address"
                        value={data.address || ""}
                        onChange={(e) => handleFormData("address", e.target.value)}
                        type="text"
                        className="input input-bordered input-info w-full"
                        placeholder="Enter address"
                    />
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="text-lg">Contact Number</label>
                    <input
                        name="contactNumber"
                        value={data.contactNumber || ""}
                        onChange={(e) => handleFormData("contactNumber", e.target.value)}
                        type="text"
                        className="input input-bordered input-info w-full"
                        placeholder="Enter contact number"
                    />
                </fieldset>

                
                
                
            </form>
        </div>
    )
    
}
