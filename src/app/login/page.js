"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";
import { credentialLogin } from "../actions";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession(); // Get status to know when session data is loaded

  // Use useEffect to handle redirection after the component has rendered
  useEffect(() => {
    // Only attempt to redirect if the session status is 'authenticated'
    // and the user email exists in the session.
    if (status === "authenticated" && session?.user?.email) {
      console.log("User is already logged in, redirecting:", session);
      router.push("/");
    }
  }, [session, status, router]); // Dependencies: re-run effect if session, status, or router changes

  // If the session is still loading, you might want to show a loading indicator
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-info"></span>
        <p className="ml-2">Loading session...</p>
      </div>
    );
  }

  // If the user is authenticated, we return null immediately after setting up the redirect.
  // The useEffect handles the actual push.
  if (status === "authenticated" && session?.user?.email) {
    return null; // Or a simple message like "Redirecting..."
  }


  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(event.target);
    setError(""); // Reset error state

    try {
      console.log("Login init : " + "email:", email + " password:", password + " role:", role);
      const response = await credentialLogin(formData);
      console.log("Login response : ", response);

      if (response.isVerified === false && response.error) {
        throw new Error(response.error);
      } else {
        console.log("Login successful:", response);
        setError(""); // Clear any previous errors
        
        router.push("/"); // Redirect to home page on success
        toast.success("Login successful!",{duration: 3000});
      }
    } catch (error) {
      console.error("Error during login:", error);
      setEmail(""); // Clear email field
      setPassword(""); // Clear password field
      setRole(""); // Clear role field
      setError(error.message || "An error occurred during login.");
    }
  };

  return (
    <>
      <Toaster position="top-center"/>
      {error && <div className="mx-auto alert alert-error max-w-lg">{error}</div>}
      <form
        className="flex flex-col items-center max-w-lg min-h-5xl mt-5 mb-25 mx-auto px-8 py-4 rounded-lg border-2 border-base-info"
        noValidate
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {/* Email Field */}
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Email <span className="text-error">*</span>
          </legend>
          <input
            type="email"
            name="email"
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
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered input-info w-full validator"
            placeholder="enter your password"
            required
            minLength={6}
          />
          <div className="validator-hint text-error">
            Password is required (min 6 chars)
          </div>
        </fieldset>

        {/* Role Field */}
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">
            Role <span className="text-error">*</span>
          </legend>
          <select
            value={role}
            name="role"
            id="role"
            onChange={(e) => setRole(e.target.value)}
            className="select select-bordered select-info w-full validator"
            required
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
          Login
        </button>

        <span>
          New to Job Portal?{" "}
          <Link href="/signup">
            <span className="text-info hover:underline">Signup</span>
          </Link>
        </span>
      </form>
    </>
  );
}
