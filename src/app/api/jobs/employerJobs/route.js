import { NextRequest,NextResponse } from "next/server";
import { auth } from "@/auth";
import { Job } from "@/lib/models";
import { connectDB } from "@/lib/dbConnection";


export async function GET(req) {
    try {
        await connectDB();
        const session = await auth();
        //console.log("Session data in GET:", session);
        if(!session || !session?.user || session.user.role !== "Employer"){
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const employerJobs = await Job.find({ postedBy: session.user.id });
        //console.log("Employer Jobs:", employerJobs);
        return NextResponse.json(employerJobs, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch employer jobs" },
            { status: 500 }
        );
    }
}