export default function OutputPanel({ result }) {
  return (
    <div className="h-full p-6 bg-gray-950 text-white overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Output</h2>

      {!result ? (
        <div className="text-gray-400">No analysis yet</div>
      ) : (
        <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}