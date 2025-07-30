"use client";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiHide, BiShow } from "react-icons/bi";
import {toast,Toaster} from "react-hot-toast";

export default function SignupPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    {/* Use max-width to constrain the alert on larger screens */}
    {error && <div className="mx-auto alert alert-error max-w-md mt-4 px-4">{error}</div>}

      <form
        // Use w-full for mobile, max-w-lg for desktop, and responsive margins/padding
        className="flex flex-col items-center max-w-lg my-8 mx-auto px-8 py-6 rounded-lg border-2 border-base-info"
        noValidate
        onSubmit = {handleSubmit}
      >
        {/* Use responsive text size */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Signup</h2>

        {/* Email Field */}
        <fieldset className="fieldset w-full mb-4">
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
          <div className="validator-hint text-error text-sm mt-1">Email is required</div>
        </fieldset>

        {/* Password Field */}
        <fieldset className="fieldset w-full mb-4">
          <legend className="fieldset-legend">
            Password <span className="text-error">*</span>
          </legend>
          <div className="relative w-full">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // 2. Add padding to the right of the input to make space for the icon
                    className="input input-bordered input-info w-full validator pr-10"
                    placeholder="enter your password"
                    required
                    minLength={6}
                />
                {/* 3. Position the button absolutely within the relative container */}
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <BiHide size={20} />
                    ) : (
                        <BiShow size={20} />
                    )}
                </button>
            </div>
          <div className="validator-hint text-error text-sm mt-1">Password is required (min 6 chars)</div>
        </fieldset>

        {/* Contact Number Field */}
        <fieldset className="fieldset w-full mb-4">
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
          <div className="validator-hint text-error text-sm mt-1">Valid 10‑digit number required</div>
        </fieldset>

        {/* Role Field */}
        <fieldset className="fieldset w-full mb-4">
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
          <div className="validator-hint text-error text-sm mt-1">Please select your role</div>
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
