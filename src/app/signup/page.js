"use client";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {toast,Toaster} from "react-hot-toast";

export default function SignupPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(""); // Reset error state

    try {

      //console.log("email:", email + " password:", password + " contactNumber:", contactNumber + " role:", role);
      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          contactNumber,
          role,
        }),
      });

      console.log("Response status:", res.status);

      if(!res.ok) {
        const errorData = await res.json();
        console.error("Registration error:", errorData);
        setError(errorData.error || "An error occurred during registration.");
        setEmail("");
        setPassword("");
        setContactNumber("");
        setRole("");
        return;
      }

      const data = await res.json();
      if (data.error) {
        console.error("Registration error:", data.error);
        setError(data.error);
      }
      else {
        toast.success("Registration successful! Please log in." , {duration: 3000});
        console.log("Registration successful:", data);
        router.push("/login"); // Redirect to login page on success
       
      }
    }
    catch (error) {
      console.error("Error during registration:", error);
      setEmail("");
      setPassword("");
      setContactNumber("");
      setRole("");
      setError("An error occurred while signing up. Please try again.");
    }

  }



  return (
    <>
    <Toaster position="top-center" />
    {error && <div className="mx-auto alert alert-error max-w-lg">{error}</div>}

      <form
      className="flex flex-col items-center max-w-lg min-h-5xl mt-5 mb-25 mx-auto px-8 py-4 rounded-lg border-2 border-base-info"
      noValidate
      onSubmit = {handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-4">Signup</h2>

      {/* Email Field */}
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">
          Email <span className="text-error">*</span>
        </legend>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered input-info w-full validator"
          placeholder="enter your email"
          required
        />
        <div className="validator-hint text-error">Email is required</div>
      </fieldset>

      {/* Password Field */}
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">
          Password <span className="text-error">*</span>
        </legend>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered input-info w-full validator"
          placeholder="enter your password"
          required
          minLength={6}
        />
        <div className="validator-hint text-error">Password is required (min 6 chars)</div>
      </fieldset>

      {/* Contact Number Field */}
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">
          Contact Number <span className="text-error">*</span>
        </legend>
        <input
          type="tel"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="input input-bordered input-info w-full validator"
          placeholder="enter your contact number"
          required
          pattern="[0-9]{10}"
        />
        <div className="validator-hint text-error">Valid 10‑digit number required</div>
      </fieldset>

      {/* Role Field */}
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">
          Role <span className="text-error">*</span>
        </legend>
        <select
          className="select select-bordered select-info w-full validator"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option disabled value="">
            Select your role
          </option>
          <option>Employer</option>
          <option>Job Seeker</option>
        </select>
        <div className="validator-hint text-error">Please select your role</div>
      </fieldset>

      <button
        type="submit"
        className="my-4 btn btn-soft border-2 border-info btn-info btn-lg btn-block"
      >
        Signup
      </button>

      <span>Already have an account? <Link href="/login"><span className="text-info hover:underline">Login</span></Link></span>
    </form>
    </>
  );
}
