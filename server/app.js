require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { analyzeWithAI } = require("./src/services/ai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  try {
    const parseResponse = await axios.post("http://127.0.0.1:8000/parse", req.body);
    const { parsed, context } = parseResponse.data || {};

    const aiAnalysis = await analyzeWithAI(context);

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
