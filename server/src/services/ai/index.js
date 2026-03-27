const { analyzeWithGemini } = require("./gemini.service");

async function analyzeWithAI(context, provider = "gemini") {
  switch (provider) {
    case "gemini":
      return analyzeWithGemini(context);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

module.exports = {
  analyzeWithAI,
};
