
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/dbConnection";
import Application from "@/lib/models/applicationModel";
import { runResumeScreener } from "@/utils/resumeScreenerAgent";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const session = await auth();

    if (!session || session.user.role !== "Employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { appId } = await params;

    if (!appId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const application = await Application.findById(appId);

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.employerData.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    runResumeScreener(appId).catch((err) =>
      console.error("[ScreenAPI] Agent error:", err)
    );

    return NextResponse.json(
      { message: "Screening started. Results will appear shortly." },
      { status: 202 }
    );

  } catch (error) {
    console.error("[ScreenAPI] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to start screening" },
      { status: 500 }
    );
  }
}
