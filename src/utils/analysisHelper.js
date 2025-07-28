import { TfIdf, WordTokenizer } from "natural";

//the function calculates the cosine similarity between two vectors
function calcCosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  for (const key of allKeys) {
    const valA = vecA[key] || 0;
    const valB = vecB[key] || 0;
    dotProduct += valA * valB;
    magnitudeA += valA * valA;
    magnitudeB += valB * valB;
  }
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

//the following function is to preprocess text (everything lowercase and remove punctuation, special chars)
function preprocessText(text) {
  if (!text || typeof text !== "string") return "";
  return text.toLowerCase().replace(/[^\w\s]/g, "");
}

//the main function to calculate the similarity between two job descriptions
export function calculateKeyWordScore(textToAnalyze, jobDescription) {
  try {
    //step 1 : Preprocess and tokenize the text
    const processedTextToAnalyze = preprocessText(textToAnalyze);
    const processedJobDescription = preprocessText(jobDescription);
    const tokenizer = new WordTokenizer();
    const tfIdf = new TfIdf();

    tfIdf.addDocument(tokenizer.tokenize(processedTextToAnalyze));
    tfIdf.addDocument(tokenizer.tokenize(processedJobDescription));

    //step 2 : get tf-idf vectors
    const vecA = {};
    tfIdf.listTerms(0).forEach((item) => {
      vecA[item.term] = item.tfidf;
    });

    const vecB = {};
    tfIdf.listTerms(1).forEach((item) => {
      vecB[item.term] = item.tfidf;
    });

    //step 3 : calculate cosine similarity
    const similarityScore = calcCosineSimilarity(vecA, vecB);
    return Math.round(similarityScore * 100); // Return as a percentage
  } catch (error) {
    console.log("error in calculateKeyWordScore:", error);
    return 0; // Return 0 in case of error
  }
}
