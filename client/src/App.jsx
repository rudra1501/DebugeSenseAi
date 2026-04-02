import InputPanel from "./components/InputPanel.jsx";
import OutputPanel from "./components/OutputPanel.jsx";

export default function App() {
  return (
    <div className="h-screen flex bg-gray-950">
      
      <div className="w-2/5">
        <InputPanel />
      </div>

      <div className="w-3/5">
        <OutputPanel />
      </div>

    </div>
  );
}