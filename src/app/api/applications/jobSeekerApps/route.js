import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Application from "@/lib/models/applicationModel";
import connectDB from "@/lib/dbConnection";


export async function GET(req) {
    try {
        const session = await auth();
        if (!session || !session?.user || session.user.role !== "Job Seeker") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const applications = await Application.find({
            "applicantData.userId": session.user.id,
        })

        .populate({
            path: "jobId",
            select: "title companyName location description",
        });



        //console.log("Job Seeker Applications:", applications);
            

        return NextResponse.json(applications, { status: 200 });
    } catch (error) {
        console.error("Error fetching job seeker applications:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch applications" },
            { status: 500 }
        );
    }
}