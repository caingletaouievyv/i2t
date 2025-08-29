// i2t-client/src/components/ResultDisplay.jsx

export default function ResultDisplay({ text, boxes = [] }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted_text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 p-6 rounded-2xl border-2 border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Extracted Text</h2>
      <textarea
        readOnly
        value={text}
        className="w-full h-40 p-4 border rounded-md resize-none text-gray-300"
      />

      {boxes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Word Confidences</h3>
          <ul className="list-disc ml-6 text-gray-600">
            {boxes.map((b, i) => (
              <li key={i}>
                {b.word} — {Math.round(b.confidence)}%
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-4">
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={downloadText}
          className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
        >
          Download .txt
        </button>
      </div>
    </div>
  );
}
