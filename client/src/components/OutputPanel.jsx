export default function OutputPanel({ result }) {
  if (!result) {
    return (
      <div className="h-full p-6 bg-gray-950 text-gray-400">
        No analysis yet
      </div>
    );
  }

  const confidence = result?.analysis?.confidence ?? 0;
  const severity = result?.analysis?.severity ?? "LOW";

  const confidenceColor =
    confidence >= 80
      ? "bg-green-600"
      : confidence >= 50
        ? "bg-yellow-500"
        : "bg-red-600";

  const severityColor =
    severity === "HIGH"
      ? "bg-red-600"
      : severity === "MEDIUM"
        ? "bg-yellow-500"
        : "bg-green-600";

  return (
    <div className="h-full p-6 bg-gray-950 text-white overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Output</h2>

      <div className="space-y-4">
        {/* reused flag */}
        {result?.reused && (
          <div className="mb-4">
            <span className="px-3 py-1 text-sm rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
              ⚡ Reused previous solution
            </span>
          </div>
        )}
        {/* root cause */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-300">Root Cause</h3>

            <div className="flex gap-2">
              <span
                className={`px-2 py-1 text-xs rounded text-white ${confidenceColor}`}
              >
                {confidence}%
              </span>

              <span
                className={`px-2 py-1 text-xs rounded text-white ${severityColor}`}
              >
                {severity}
              </span>
            </div>
          </div>

          <p className="text-white font-medium leading-relaxed">
            {result?.analysis?.rootCause || "No root cause available"}
          </p>
        </div>
        {/* suggested fix */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Suggested Fix
          </h3>

          <p className="text-gray-200 leading-relaxed">
            {result?.analysis?.fixSuggestion || "No fix suggestion available"}
          </p>
        </div>
        {/* code diff */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Code Changes
          </h3>

          <div className="bg-black rounded p-3 text-sm font-mono overflow-x-auto max-h-60 overflow-y-auto">
            {Array.isArray(result?.analysis?.codeDiff) &&
            result.analysis.codeDiff.length > 0 ? (
              result.analysis.codeDiff.map((line, index) => {
                const isAdded = line.startsWith("+");
                const isRemoved = line.startsWith("-");

                const colorClass = isAdded
                  ? "text-green-400"
                  : isRemoved
                    ? "text-red-400"
                    : "text-gray-300";

                return (
                  <div key={index} className={colorClass}>
                    {line}
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500">No code changes available</div>
            )}
          </div>
        </div>
        {/* reasoning steps */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">
            Reasoning Steps
          </h3>

          {Array.isArray(result?.analysis?.reasoningSteps) &&
          result.analysis.reasoningSteps.length > 0 ? (
            <ol className="list-decimal list-inside space-y-2 text-gray-200">
              {result.analysis.reasoningSteps.map((step, index) => (
                <li key={index} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-gray-500">No reasoning available</div>
          )}
        </div>
        {/* similar issues */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">
            Similar Issues
          </h3>

          {result?.similarIssues?.mostSimilar ? (
            <div className="space-y-2 text-sm">
              <div className="text-gray-200">
                {result.similarIssues.mostSimilar}
              </div>

              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                  Score: {result.similarIssues.score}
                </span>

                <span
                  className={`px-2 py-1 text-xs rounded ${
                    result.similarIssues.matchType === "Exact match"
                      ? "bg-green-600 text-white"
                      : result.similarIssues.matchType === "Highly similar"
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-700 text-white"
                  }`}
                >
                  {result.similarIssues.matchType}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No similar issues found</div>
          )}
        </div>
        {/* debugging hints */}
        {Array.isArray(result?.analysis?.debugHints) &&
          result.analysis.debugHints.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">
                Debugging Tips
              </h3>

              <ul className="list-disc list-inside space-y-2 text-gray-200">
                {result.analysis.debugHints.map((hint, index) => (
                  <li key={index} className="leading-relaxed">
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}
