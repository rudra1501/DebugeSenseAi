require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { analyzeWithAI } = require("./src/services/ai");
const { Pool } = require("pg");

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

    const aiAnalysis = await analyzeWithAI(context);

    if (!pool) {
      throw new Error(
        "Missing PostgreSQL connection string. Set DATABASE_URL (or PG_CONNECTION_STRING) in environment."
      );
    }

    // Store session for later inspection/auditing.
    const input = {
      stackTrace: req.body?.stackTrace ?? null,
      logs: req.body?.logs ?? null,
      code: req.body?.code ?? context?.code ?? null,
    };

    await pool.query(
      `INSERT INTO sessions ("input", "parsed", "context", "aiAnalysis")
       VALUES ($1::jsonb, $2::jsonb, $3::jsonb, $4::jsonb)`,
      [
        JSON.stringify(input),
        JSON.stringify(parsed ?? null),
        JSON.stringify(context ?? null),
        JSON.stringify(aiAnalysis ?? null),
      ]
    );

    res.json({
      parsed,
      context,
      aiAnalysis,
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
