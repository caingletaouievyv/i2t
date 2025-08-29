// i2t-client/src/App.jsx

import { useState } from 'react';
import ImageUploaderAuto from './components/ImageUploaderAuto';

export default function App() {
  const [setOcrText] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">i2t</h1>
      <ImageUploaderAuto
        onTextExtracted={(text) => {
          setOcrText(text);
          setError("");
        }}
        onError={(err) => {
          setError(err);
          setOcrText("");
        }}
      />
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

