import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Application } from "@/lib/models";
import { Job } from "@/lib/models";
import connectDB from "@/lib/dbConnection";
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier'; // Import streamifier
import { calculateTextSimilarity } from "@/utils/tfIdfHelper";




// Configure Cloudinary directly. cloudinary.config() sets up the 'cloudinary' object.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Recommended for HTTPS URLs
});

// This function now correctly uses the configured 'cloudinary' object
async function uploadResumeToCloudinary(fileBuffer) { // Accept a buffer, not a stream directly
    return new Promise((resolve, reject) => {
        // Create a readable stream from the buffer using streamifier
        const readableStream = streamifier.createReadStream(fileBuffer);

        const uploadStream = cloudinary.uploader.upload_stream( // Use 'cloudinary.uploader' directly
            {
                folder: "job_portal/resumes",
                resource_type: "raw", // Ensure this is 'raw' for PDFs/docs, 'auto' can also work
                format: "pdf", // Specify the format if needed, or use 'auto' for automatic detection
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(new Error("Failed to upload resume to Cloudinary: " + error.message));
                }
                resolve(result);
            }
        );

        // Pipe the readable stream to the Cloudinary upload stream
        readableStream.pipe(uploadStream);
    });
}

export async function POST(req) {
    try {
        await connectDB();
        const session = await auth();

        if (!session || !session?.user || session.user.role !== "Job Seeker") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const fullData = await req.formData();

        console.log("Full Data:", fullData);

        let resumeFile = fullData.get("resumeFile");

        const jobId = fullData.get("jobId");



        if (!fullData || !resumeFile) {
            return NextResponse.json(
                { error: "Resume is required" },
                { status: 400 }
            );
        }

        // Convert the File object to a Buffer
        // Note: resumeFile is a File object from FormData
        const bytes = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Pass the buffer to the upload function
        const uploadResponse = await uploadResumeToCloudinary(buffer);

        console.log("Upload Response:", uploadResponse);

        if (!uploadResponse || !uploadResponse.secure_url) {
            return NextResponse.json(
                { error: "Failed to upload resume" },
                { status: 500 }
            );
        }

        
        const job = await Job.findById(jobId);

        

        if (!job) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        const employerId = job.postedBy; // Ensure employerId is set correctly


        // Calculate keyword score
        const jobDescriptionText = job.description || "";

        let similarityScore = 101;
        


       if(fullData.get("coverLetter")){
         const coverLetterText = fullData.get("coverLetter");
        similarityScore = calculateTextSimilarity(coverLetterText, jobDescriptionText);
        console.log("Similarity Score:", similarityScore);
       
    }

        

        

        const applicationData = {
            jobId: fullData.get("jobId"),
            firstName: fullData.get("firstName"),
            lastName: fullData.get("lastName"),
            email: fullData.get("email"),
            contactNumber: fullData.get("contactNumber"),
            address: fullData.get("address"),
            resume: uploadResponse.secure_url,
            coverLetter: fullData.get("coverLetter"),
            workExperience: fullData.get("workExperience"),
            applicantData: {
                userId: session?.user?.id,
                role: session?.user?.role,
            },
            employerData: {
                userId: employerId,
                role: "Employer",
            },
            applicationStatus: "Pending",
            postedOn: new Date(),
            keyWordMatchScore: similarityScore,
            
        };

        const application = new Application(applicationData);
        console.log("Application Data before save:", applicationData);
        console.log("Application Data:", application);
        await application.save();

        return NextResponse.json(
            { message: "Application data received successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST /applications:", error);
        return NextResponse.json(
            { error: error.message || "Failed to post application" },
            { status: 500 }
        );
    }
}


