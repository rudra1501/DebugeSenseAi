import { useState } from "react";
import InputPanel from "./components/InputPanel";
import OutputPanel from "./components/OutputPanel";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="h-screen flex bg-gray-950">
      
      <div className="w-2/5">
        <InputPanel onResult={setResult} />
      </div>

      <div className="w-3/5">
        <OutputPanel result={result} />
      </div>

    </div>
  );
}