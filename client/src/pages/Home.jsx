import { useState } from "react";
import InputPanel from "../components/InputPanel";
import OutputPanel from "../components/OutputPanel";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* header */}
      <div className="sticky top-0 z-50 h-16 min-h-[64px] flex-shrink-0 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md shadow-sm">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          DebugSenseAi
        </h1>

        <span className="text-sm text-gray-400">AI Debugging Assistant</span>
      </div>

      <div className="flex flex-1">
        <div className="w-2/5">
          <InputPanel onResult={setResult} loading={loading} setLoading={setLoading}/>
        </div>

        <div className="w-3/5">
          <OutputPanel result={result} loading={loading}/>
        </div>
      </div>
      {/* footer */}
      <div className="h-12 flex-shrink-0 flex items-center justify-between px-6 border-t border-gray-800 bg-gray-900 text-sm text-gray-400">
        <span>© {new Date().getFullYear()} DebugSenseAi</span>

        <div className="flex items-center gap-4">
          {/* gitHub */}
          <a
            href="https://github.com/rudra1501/DebugeSenseAi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
