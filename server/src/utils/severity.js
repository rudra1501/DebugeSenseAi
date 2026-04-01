function detectSeverity(category, logs) {
  const normalizedCategory = String(category ?? "").toUpperCase();

  switch (normalizedCategory) {
    case "NETWORK_ERROR":
      return "HIGH";
    case "DATABASE_ERROR":
      return "HIGH";
    case "RUNTIME_ERROR":
      return "MEDIUM";
    case "UNKNOWN":
      return "LOW";
    default:
      return "LOW";
  }
}

module.exports = {
  detectSeverity,
};
