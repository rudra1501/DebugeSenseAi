function calculateConfidence(aiConfidence, similarityScore, category) {
  const ai = Number(aiConfidence) || 0;
  const sim = Number(similarityScore) || 0;

  const base = ai * 0.6;
  const similarityBoost = sim * 100 * 0.3;

  let categoryWeight = 0;
  if (category === "RUNTIME_ERROR") {
    categoryWeight = 5;
  } else if (category === "NETWORK_ERROR") {
    categoryWeight = 3;
  } else if (category === "UNKNOWN") {
    categoryWeight = -5;
  }

  const total = base + similarityBoost + categoryWeight;
  const capped = Math.min(total, 100);

  return Math.round(capped);
}

module.exports = {
  calculateConfidence,
};
