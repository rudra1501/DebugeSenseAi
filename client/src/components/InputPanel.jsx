import { useState } from "react";
import axios from "axios";

export default function InputPanel({ onResult, loading, setLoading}) {
  const [stackTrace, setStackTrace] = useState("");
  const [logs, setLogs] = useState("");
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const ANALYZE_DEV = import.meta.env.VITE_ANALYZE_DEV;
  const ANALYZE_PROD = import.meta.env.VITE_ANALYZE_PROD;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const response = await axios.post(ANALYZE_DEV, {
        stackTrace,
        logs,
        code,
      });

      if (response.data?.error) {
        setErrorMsg(response.data.error);
        onResult && onResult(null);
        return;
      }

      onResult && onResult(response.data);
    } catch (error) {
      console.error("API Error:", error.message);

      if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }

      onResult && onResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-4 bg-gray-900 border-r border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-white">Input</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Stack Trace
          </label>
          <textarea
            value={stackTrace}
            onChange={(e) => {
              setStackTrace(e.target.value)
              setErrorMsg("");
            }}
            className="w-full h-24 p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none"
            placeholder="Paste stack trace..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Logs</label>
          <textarea
            value={logs}
            onChange={(e) => {
              setLogs(e.target.value)
              setErrorMsg("");
            }}
            className="w-full h-20 p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none"
            placeholder="Paste logs..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Code</label>
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              setErrorMsg("");
            }}
            className="w-full h-24 p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none"
            placeholder="Paste code..."
          />
        </div>
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded">
            ⚠️ {errorMsg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </div>
  );
}
