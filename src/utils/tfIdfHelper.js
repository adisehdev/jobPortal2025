// lib/textSimilarityHelper.js

/**
 * Pre-processes and tokenizes text. Converts to lowercase, removes punctuation,
 * and splits into an array of words.
 * @param {string} text - The input string.
 * @returns {string[]} An array of words (tokens).
 */
function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Removes punctuation
    .split(/\s+/) // Splits by whitespace
    .filter(word => word.length > 0);
}

/**
 * Calculates Term Frequency (TF) for a document. This creates a vector
 * representing the importance of each word within that document.
 * @param {string[]} tokens - The array of words in the document.
 * @returns {Map<string, number>} A map of a word to its frequency score.
 */
function calculateTfVector(tokens) {
  const termFrequencies = new Map();
  const tokenCount = tokens.length;
  if (tokenCount === 0) return termFrequencies;

  // Count occurrences of each word
  tokens.forEach(token => {
    termFrequencies.set(token, (termFrequencies.get(token) || 0) + 1);
  });

  // Normalize by dividing the count by the total number of words
  for (const [term, count] of termFrequencies.entries()) {
    termFrequencies.set(term, count / tokenCount);
  }
  return termFrequencies;
}

/**
 * Calculates the cosine similarity between two Term Frequency vectors.
 * @param {Map<string, number>} vecA - The first TF vector.
 * @param {Map<string, number>} vecB - The second TF vector.
 * @returns {number} The cosine similarity score (from 0 to 1).
 */
function calculateCosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  // Use all unique keys from both vectors for calculation
  const allKeys = new Set([...vecA.keys(), ...vecB.keys()]);

  for (const key of allKeys) {
    const valA = vecA.get(key) || 0;
    const valB = vecB.get(key) || 0;
    dotProduct += valA * valB;
  }

  for (const val of vecA.values()) {
    magnitudeA += val * val;
  }
  magnitudeA = Math.sqrt(magnitudeA);

  for (const val of vecB.values()) {
    magnitudeB += val * val;
  }
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0; // Avoid division by zero if one document is empty
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Calculates the similarity score between two texts using Term Frequency
 * and Cosine Similarity.
 * @param {string} textA - The first text document (e.g., resume/cover letter).
 * @param {string} textB - The second text document (e.g., job description).
 * @returns {number} A percentage score from 0 to 100.
 */
export function calculateTextSimilarity(textA, textB) {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  const vectorA = calculateTfVector(tokensA);
  const vectorB = calculateTfVector(tokensB);

  const similarity = calculateCosineSimilarity(vectorA, vectorB);
  
  // Convert to percentage and return
  return Math.round(similarity * 100);
}
