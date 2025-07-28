import {NextResponse, NextRequest} from 'next/server';
import {auth} from "@/auth";
import {Job} from "@/lib/models"
import { Application } from '@/lib/models';
import {connectDB} from "@/lib/dbConnection";



export async function GET(req,{ params } ) {
    try {
        await connectDB();
        const session = await auth();

        console.log("Session data in GET:", session);
        if (!session || !session?.user) {
            return NextResponse.json(
                {error: "Unauthorized"},

                {status: 401}
            );
        }
        const { jobId } = params;
       
        const job = await Job.findById((jobId));

        
        
        if (!job) {
            return NextResponse.json(
                {error: "Job not found"},
                {status: 404}
            );
        }

        

        return NextResponse.json(job, {status: 200});
    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json(
            {error: error.message || "Failed to fetch job"},
            {status: 500}
        );
    }
}

export async function DELETE(req, {params}) {
    try {
        await connectDB();
        const session = await auth();
        console.log("Session data in DELETE:", session);
        if (!session || !session?.user || session.user.role !== "Employer") {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        const jobId = params.jobId;
        const job = await Job.findById((jobId));

        if(job.postedBy.toString() !== session.user.id) {
            return NextResponse.json(
                {error: "Unauthorized to delete this job"},
                {status: 403}
            );
        }

        if (!job) {
            return NextResponse.json(
                {error: "Job not found"},
                {status: 404}
            );
        }

        if (job.postedBy.toString() !== session.user.id) {
            return NextResponse.json(
                {error: "Unauthorized to delete this job"},
                {status: 403}
            );
        }

        await Application.updateMany({ jobId: jobId },{ $set: { jobExists: false } });

        await Job.findByIdAndDelete(jobId);
        return NextResponse.json(
            {message: "Job deleted successfully"},
            {status: 200}
        );
    } catch (error) {
        console.log("error in deleting job in backend", error);
        return NextResponse.json(
            {error: error.message || "Failed to delete job"},
            {status: 500}
        );
    }
}

export async function PUT(req, {params}) {
    try {
        await connectDB();
        const session = await auth();
        console.log("Session data in PUT:", session);
        if (!session || !session?.user || session.user.role !== "Employer") {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        const jobId = params.jobId;
        const jobDetails = await req.json();

        const job = await Job.findById(jobId);

        if (!job) {
            return NextResponse.json(
                {error: "Job not found"},
                {status: 404}
            );
        }

        if (job.postedBy.toString() !== session.user.id) {
            return NextResponse.json(
                {error: "Unauthorized to update this job"},
                {status: 403}
            );
        }

        Object.assign(job, jobDetails);
        await job.save();

        return NextResponse.json(
            {message: "Job updated successfully", job},
            {status: 200}
        );
    } catch (error) {
        return NextResponse.json(
            {error: error.message || "Failed to update job"},
            {status: 500}
        );
    }
}