require("dotenv").config();
const axios = require("axios");

async function analyzeWithGemini(context) {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";
  const safeContext = context || {};
  const errorSummary = String(safeContext.errorSummary ?? "");
  const location = String(safeContext.location ?? "");
  const category = String(safeContext.category ?? "");
  const logs = String(safeContext.logs ?? "");
  const code = String(safeContext.code ?? "");

  const PROMPT = `You are a senior software engineer debugging production issues.

INPUT:
Error: ${errorSummary}
Location: ${location}
Category: ${category}
Logs: ${logs}
Code: ${code}

TASK:

1. Identify root cause
2. Suggest fix
3. Provide improved code
4. Give confidence score (0-100)

IMPORTANT:

* Return ONLY valid JSON
* No extra text

FORMAT:
{
"rootCause": "...",
"fixSuggestion": "...",
"improvedCode": "...",
"confidence": number
}`;

  console.log("🔵 Calling Gemini API...");
  console.log("API KEY EXISTS:", !!apiKey);
  console.log("PROMPT:", PROMPT);

  let response;

  try {
    response = await axios.post(`${endpoint}?key=${apiKey}`, {
      contents: [
        {
          parts: [{ text: PROMPT }],
        },
      ],
    });
  } catch (err) {
    console.error("🔴 Gemini API ERROR:");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    throw err; // rethrow so your main API still catches it
  }
  console.log("🟢 Gemini RAW response:", response.data);

  const rawText =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const cleanedJson = extractJSON(rawText);
  return cleanedJson;
}

function extractJSON(text) {
  try {
    const raw = String(text ?? "");
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      return null;
    }

    const jsonText = raw.slice(start, end + 1);
    return JSON.parse(jsonText);
  } catch (error) {
    return null;
  }
}

module.exports = {
  analyzeWithGemini,
  extractJSON,
};
