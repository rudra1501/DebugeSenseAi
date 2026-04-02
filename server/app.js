require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { analyzeWithAI } = require("./src/services/ai");
const { Pool } = require("pg");
const { calculateConfidence } = require("./src/utils/confidence");
const { generateDiff } = require("./src/utils/codeDiff");
const { detectSeverity } = require("./src/utils/severity");

const app = express();
const PORT = 5000;

const dbUrl = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;
const pool = dbUrl ? new Pool({ connectionString: dbUrl }) : null;

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  try {
    const parseResponse = await axios.post("http://127.0.0.1:8000/parse", req.body);
    const { parsed, context } = parseResponse.data || {};

    const severity = detectSeverity(context?.category ?? "UNKNOWN", context?.logs ?? null);

    const aiAnalysis = await analyzeWithAI(context);

    const codeDiff = generateDiff(context?.code ?? null, aiAnalysis?.improvedCode ?? null);

    if (!pool) {
      throw new Error(
        "Missing PostgreSQL connection string. Set DATABASE_URL (or PG_CONNECTION_STRING) in environment."
      );
    }

    const input = {
      stackTrace: req.body?.stackTrace ?? null,
      logs: req.body?.logs ?? null,
      code: req.body?.code ?? context?.code ?? null,
    };

    let similarIssues = {
      mostSimilar: null,
      score: 0,
      matchType: "Weak match",
    };
    try {
      const colsRes = await pool.query(
        `SELECT column_name
         FROM information_schema.columns
         WHERE table_name = 'sessions'
           AND table_schema = 'public'`
      );
      const existingCols = new Set((colsRes.rows || []).map((r) => r.column_name));

      const candidates = [
        "created_at",
        "createdAt",
        "created_on",
        "createdOn",
        "timestamp",
        "createdTime",
        "id",
      ];
      const orderCol = candidates.find((c) => existingCols.has(c)) ?? null;

      const orderBySql = orderCol
        ? `ORDER BY "${orderCol}" DESC`
        : "";

      const pastRes = await pool.query(
        `SELECT context->>'errorSummary' AS error_summary
         FROM sessions
         WHERE context IS NOT NULL
         AND context->>'errorSummary' IS NOT NULL
         AND context->>'errorSummary' <> ''
         ${orderBySql}
         LIMIT 10`
      );

      const pastSummaries = (pastRes.rows || [])
        .map((r) => r.error_summary)
        .filter((s) => typeof s === "string" && s.trim().length > 0);

      const currentSummary = context?.errorSummary ?? "";

      const similarResponse = await axios.post("http://127.0.0.1:8000/similar", {
        current: currentSummary,
        past: pastSummaries,
      });

      similarIssues = {
        mostSimilar: similarResponse.data?.mostSimilar ?? null,
        score: typeof similarResponse.data?.score === "number" ? similarResponse.data.score : 0,
        matchType:
          typeof similarResponse.data?.matchType === "string"
            ? similarResponse.data.matchType
            : "Weak match",
      };
    } catch (similarErr) {
      console.log("Similarity step failed:", similarErr.message);
    }

    const finalConfidence = calculateConfidence(
      aiAnalysis?.confidence ?? 0, 
      similarIssues?.score ?? 0, 
      context?.category ?? "UNKNOWN",
      context?.logs ?? "",
      context?.code ?? "",
    );

    const analysis = {
      rootCause: aiAnalysis?.rootCause ?? "",
      fixSuggestion: aiAnalysis?.fixSuggestion ?? "",
      improvedCode: aiAnalysis?.improvedCode ?? "",
      confidence: finalConfidence,
      severity: severity,
      reasoningSteps: Array.isArray(aiAnalysis?.reasoningSteps) ? aiAnalysis.reasoningSteps : [],
      debugHints: Array.isArray(aiAnalysis?.debugHints) ? aiAnalysis.debugHints : [],
      codeDiff: Array.isArray(codeDiff) ? codeDiff : [],
    }

    await pool.query(
      `INSERT INTO sessions ("input", "parsed", "context", "aiAnalysis")
       VALUES ($1::jsonb, $2::jsonb, $3::jsonb, $4::jsonb)`,
      [
        JSON.stringify(input),
        JSON.stringify(parsed ?? null),
        JSON.stringify(context ?? null),
        JSON.stringify(analysis ?? null),
      ]
    );

    res.json({
      parsed,
      context,
      analysis,
      similarIssues,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to analyze request",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
