# 🚀 DebugSenseAI

An AI-powered debugging assistant that analyzes stack traces, logs, and code to identify root causes and suggest fixes instantly.

---

## 🧠 Overview

DebugSenseAI helps developers quickly understand and resolve errors by:

* Parsing stack traces and logs
* Generating AI-based root cause analysis
* Suggesting fixes with improved code
* Reusing past solutions using similarity matching
* Providing debugging hints and reasoning steps

---

## ✨ Features

* 🔍 Error Parsing Engine (Python - FastAPI)
* 🤖 AI-Based Root Cause Analysis
* 🔁 Smart Reuse System (Similarity Matching)
* 📊 Confidence Scoring & Severity Detection
* 🧾 Code Diff Generator
* 🌐 Full Stack Deployment (Frontend + Backend + Microservice)

---

## 🏗️ Architecture

Frontend (React + Vite)
↓
Node.js Backend (Express)
↓
Python Microservice (FastAPI)
↓
PostgreSQL (Render DB)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend (Node)

* Node.js
* Express.js
* PostgreSQL

### Python Service

* FastAPI
* Pydantic
* Scikit-learn

### Deployment

* Vercel (Frontend)
* Render (Node + Python)
* Render PostgreSQL

---

## ⚙️ How It Works

1. User inputs stack trace / logs / code
2. Node backend sends data to Python parser
3. Python extracts:

   * Error type
   * Message
   * File & line
4. Context is built from parsed data
5. Similar past issues are searched
6. If match found → reuse solution
7. Else → AI generates new analysis
8. Result is stored for future reuse

---

## 📌 Key Highlights

* 🔁 Reuse Logic

  * Prevents redundant AI calls
  * Uses similarity threshold + validation checks

* 🧠 Context Builder

  * Handles multiple errors (e.g., multiple KeyErrors)
  * Generates clean summaries

---

## 📦 API Endpoints

### Node Backend

POST /analyze

### Python Service

POST /parse
POST /similar

---

## 🚧 Challenges Solved

- Parsing noisy, multi-line stack traces into structured and meaningful data  
- Designing a reliable similarity system while avoiding false positive matches  
- Ensuring safe reuse of past AI solutions without returning incorrect results  
- Managing communication between Node backend and Python microservice  
---

## 🔮 Future Improvements

- Improve similarity using embeddings for better semantic matching  
- Smarter handling of multiple errors in a single input  
- Add caching layer to reduce latency and repeated processing  
- Introduce user history and session-based debugging insights  
- Improve system reliability and performance for production-scale usage  

---

## 🧑‍💻 Author

Rudra Mahyavanshi

GitHub: https://github.com/rudra1501/DebugeSenseAi

---

## ⭐ Show Your Support

If you found this useful, consider giving it a ⭐ on GitHub!
