import { NextRequest,NextResponse } from "next/server";
import { auth } from "@/auth";
import { Job } from "@/lib/models";
import connectDB from "@/lib/dbConnection";


export async function GET(req) {
    try {
        await connectDB();
        const allJobs = await Job.find({});
        //console.log("Fetched Jobs:", allJobs);
        return NextResponse.json(allJobs, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch jobs" },
            { status: 500 }
        );
    }
}

export async function POST(req){
    try {
        await connectDB();
        const session = await auth();
        //console.log("Session data in POST:", session);
        if(!session || !session?.user || session.user.role !== "Employer"){
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const jobDetails = await req.json();

        
        const newJob = {
            title : jobDetails.title,
            companyName : jobDetails.companyName,
            description : jobDetails.description,
            jobCategory : jobDetails.jobCategory,
            employmentType : jobDetails.employmentType,
            experienceLevel : jobDetails.experienceLevel,
            location : jobDetails.location,
            salaryRange : jobDetails.salaryRange,
            postedBy : session.user.id, // Assuming session.user.id contains the employer's ID
            createdAt : new Date(),
            isActive : true
        }

        console.log("Job Details:", jobDetails);

        await Job.create(newJob);
        return NextResponse.json(
            { message : "Job posted successfully" },
            { status: 201 }
        );
            
        
    } catch (error) {
        console.error("Error posting job:", error);
        return NextResponse.json(
            { error: error.message || "Failed to post job" },
            { status: 500 }
        );
    }
}