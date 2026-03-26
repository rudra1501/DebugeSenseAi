const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/analyze", (req, res) => {
  console.log("Received body:", req.body);
  res.json({ status: "received" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
