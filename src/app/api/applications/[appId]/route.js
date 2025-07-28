import connectDB from "@/lib/dbConnection";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Application from "@/lib/models/applicationModel";

export async function GET(req,{params}) {
    try {
        const session = await auth();
        const { appId } = params;
        if (!session || !session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        await connectDB();

        const currApplication = await Application.findOne({
            _id: appId,
            
        }).populate({
            path: "jobId",
            select: "title companyName location description experienceLevel employmentType",
        });

        return NextResponse.json(currApplication, { status: 200 });
        
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch application" },
            { status: 500 }
        );  
    }
}


export async function DELETE(req, {params}) {
    try {
        const session = await auth();
        const { appId } = params;
        if (!session || !session?.user || session.user.role !== "Job Seeker") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        await connectDB();

        const deletedApplication = await Application.findOneAndDelete({
            _id: appId,
            "applicantData.userId": session.user.id,
        });

        if (!deletedApplication) {
            return NextResponse.json(
                { error: "Application not found or you are not authorized to delete it" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Application deleted successfully" }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Failed to delete application" },
            { status: 500 }
        );  
    }
}

export async function PUT(req, {params}) { //update application status
    // This function is used by the employer to update the application status
    try {
        const session = await auth();
        const { appId } = params;
        if (!session || !session?.user || session.user.role !== "Employer") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        await connectDB();

        const fullData = await req.json();

        console.log("Full Data:", fullData);

        let updatedApplication = null;

        if(fullData && fullData.applicationStatus === "Accepted"){
            updatedApplication = await Application.findOneAndUpdate(
            { _id: appId, "employerData.userId": session.user.id },
            { applicationStatus: "Accepted", reviewedOn: fullData.reviewedOn || new Date() },
            { new: true }
        );
        }

        else if(fullData && fullData.applicationStatus === "Rejected"){
            updatedApplication = await Application.findOneAndUpdate(
            { _id: appId, "employerData.userId": session.user.id },
            { applicationStatus: "Rejected", reviewedOn: fullData.reviewedOn || new Date() },
            { new: true }
        );
        }

        else{
            return NextResponse.json(
                { error: "Invalid application status" },
                { status: 400 }
            );
        }

        

        if (!updatedApplication) {
            return NextResponse.json(
                { error: "Application not found or you are not authorized to update it" },
                { status: 404 }
            );
        }

        console.log("Updated Application:", updatedApplication);

        return NextResponse.json(updatedApplication, { status: 200 });
        
    } catch (error) {

        return NextResponse.json(
            { error: error.message || "Failed to update application" },
            { status: 500 }
        );  
    }
}


