"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardEmployer from "./employerJob/employerJobComponent";
import DashboardJobSeeker from "./jobSeekerApp/jobSeekerAppComponent";


export default function Dashboard() {
  
  const [dummyJobs, setDummyJobs] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();


  if (!session || !session.user) {
    router.push("/login"); // Redirect to login page if not authorized
  }

  if(session && session?.user && session.user.role === "Employer"){
    return <DashboardEmployer/>
  }

  if(session && session?.user && session.user.role === "Job Seeker"){
    return <DashboardJobSeeker/>
  }


  
 

    

   
}
