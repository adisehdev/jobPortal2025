
import { GoogleGenerativeAI } from "@google/generative-ai";

// Reads GOOGLE_API_KEY from your .env file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export async function analyzeResume(resumeContext, jobContext) {

const prompt = `
You are an expert HR recruiter screening job applications.
Analyze the following applicant information against the job requirements.

JOB REQUIREMENTS:
${jobContext}

APPLICANT INFORMATION:
${resumeContext}

Score this applicant from 0 to 100 and give a hiring recommendation.

Rules:
- Be objective and focus on skill/experience match.
- "Shortlist" if score >= 65
- "Review"    if score >= 35 and < 65
- "Reject"    if score < 35

Return ONLY a valid JSON object. No markdown, no extra text. Use this exact shape:
{
  "percentage": <number between 0 and 100>,
  "justification": "<3-5 bullet points separated by newlines, starting each with •>",
  "recommendation": "<one of: Shortlist | Review | Reject>"
}
`;

  // Send the prompt to Gemini and wait for the response text
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Gemini sometimes wraps JSON in markdown code fences (```json ... ```)
  // This regex strips that wrapper if present, leaving only the raw JSON string
  const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();

  // Parse the cleaned string into a JavaScript object
  const parsed = JSON.parse(cleanedText);

  return parsed;
}
