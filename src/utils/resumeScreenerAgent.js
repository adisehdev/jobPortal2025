
import connectDB from "../lib/dbConnection";
import Application from "../lib/models/applicationModel";
import Job from "../lib/models/jobModel";
import { analyzeResume } from "./geminiHelper";


export async function runResumeScreener(applicationId) {
  console.log(`[ResumeScreenerAgent] 🚀 Starting screening for application: ${applicationId}`);


  await connectDB();

  await Application.findByIdAndUpdate(applicationId, {
    aiAnalysisStatus: "in_progress",
  });

  try {
    const application = await Application.findById(applicationId);

    if (!application) {
      console.error(`[ResumeScreenerAgent] ❌ Application not found: ${applicationId}`);
      return;
    }
    const job = await Job.findById(application.jobId);

    if (!job) {
      console.error(`[ResumeScreenerAgent] ❌ Job not found for application: ${applicationId}`);
      await Application.findByIdAndUpdate(applicationId, { aiAnalysisStatus: "failed" });
      return;
    }


    const resumeContext = `
Cover Letter: ${application.coverLetter || "Not provided"}
Work Experience Level: ${application.workExperience || "Not specified"}
Applicant Name: ${application.firstName} ${application.lastName}
    `.trim();

    const jobContext = `
Job Title: ${job.title}
Company: ${job.companyName}
Employment Type: ${job.employmentType}
Required Experience Level: ${job.experienceLevel}
Job Category: ${job.jobCategory}
Job Description: ${job.description}
    `.trim();

    console.log(`[ResumeScreenerAgent] 🤖 Calling Gemini AI...`);

    const aiResult = await analyzeResume(resumeContext, jobContext);
    console.log(`[ResumeScreenerAgent] ✅ Gemini result:`, aiResult);

    await Application.findByIdAndUpdate(applicationId, {
      aiMatchScore:      aiResult.percentage,
      aiJustification:   aiResult.justification,
      aiRecommendation:  aiResult.recommendation, // Save the Shortlist/Review/Reject string
      aiAnalysisStatus:  "completed",
      reviewedOn:        new Date(),
    });

    console.log(`[ResumeScreenerAgent] 🎉 Screening complete for application: ${applicationId}`);

  } catch (error) {
    console.error(`[ResumeScreenerAgent] 💥 Error during screening:`, error.message);

    await Application.findByIdAndUpdate(applicationId, {
      aiAnalysisStatus: "failed",
    });
  }
}
