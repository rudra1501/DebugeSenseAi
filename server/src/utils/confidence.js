function calculateConfidence(aiConfidence, similarityScore, category, logs, code) {
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

  let total = base + similarityBoost + categoryWeight;

  if (!logs || String(logs).trim() === "") {
    total -= 15;
  }
  
  if (!code || String(code).trim() === "") {
    total -= 10;
  }
  
  if (category === "UNKNOWN") {
    total -= 20;
  }

  total = Math.min(total, 90);
  total = Math.max(total, 0);

  return Math.round(total);
}

module.exports = {
  calculateConfidence,
};
