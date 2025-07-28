export const prompt = `Analyze the following resume against the job description.
      Provide a percentage match score and a brief justification for your score.
      The justification should be a few bullet points highlighting key strengths and weaknesses.
      Return your response ONLY as a valid JSON object with the structure: {"percentage": number, "justification": string}.
      Do not include any other text or markdown formatting outside of this JSON object.
      ---
      JOB DESCRIPTION: {jobDescription}
      ---
      RESUME TEXT: {resumeText}
      ---
    `;

