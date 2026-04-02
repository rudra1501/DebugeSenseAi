export default function InputPanel() {
  return (
    <div className="h-full p-4 bg-gray-900 border-r border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-white">Input</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Stack Trace
          </label>
          <textarea
            className="w-full h-24 p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none"
            placeholder="Paste stack trace..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Logs
          </label>
          <textarea
            className="w-full h-20 p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none"
            placeholder="Paste logs..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Code
          </label>
          <textarea
            className="w-full h-24 p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none"
            placeholder="Paste code..."
          />
        </div>

        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium">
          Analyze
        </button>
      </div>
    </div>
  );
}