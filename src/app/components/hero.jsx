// components/Hero.js
"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
export default function Hero() {
  const { data: session } = useSession();
  return (
    <section className="hero w-full py-0 px-4 ">
      <div className="container mx-auto flex flex-col lg:flex-row-reverse items-center justify-between py-12 lg:py-20">
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mb-8 lg:mb-0">
          <Image
            src="/heroFinal.png"
            alt="Job Portal Hero"
            width={500}
            height={500}
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full flex flex-col gap-8 items-center lg:w-1/2 lg:items-start text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-lg md:text-xl  mb-6 leading-relaxed">
            Browse through our collection of job listings and find the perfect
            match for your skills and career goals. Whether you're looking for
            a full-time position, part-time work, or freelance opportunities,
            we've got you covered.
          </p>
          <div className="flex sm:flex-row justify-center sm:justify-start gap-3">
            <Link href={session ? "/dashboard" : "/signup"}>
              <button className="btn btn-outline btn-accent btn-lg">{session ? "Dashboard" : "Create Account"}</button>
            </Link>
            
            <Link href="/jobs">
              <button className="btn btn-outline btn-info btn-lg">Browse Jobs</button>
            </Link>
          </div>
        </div>
        
      </div>
    </section>
  );
}
