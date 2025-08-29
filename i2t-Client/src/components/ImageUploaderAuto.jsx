// i2t-client/src/components/ImageUploaderAuto.jsx

import { useState } from "react";
import axios from "axios";
import { preprocessImage } from "../util/imagePreprocessor";
import { OCR_SINGLE_URL, OCR_MULTI_URL} from "../config/apiConfig";
import LanguageSelector from "./LanguageSelector";
import BoundingBoxCanvas from "./BoundingBoxCanvas";
import ResultDisplay from "./ResultDisplay";

export default function ImageUploaderAuto({ onError }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("eng");
  const [imagePreview, setImagePreview] = useState(null);
  const [ocrBoxes, setOcrBoxes] = useState([]);
  const [ocrText, setOcrText] = useState("");
  const [showBoxes, setShowBoxes] = useState(true);

  const handleFiles = async (fileList) => {
    setOcrBoxes([]);
    setOcrText("");
    setImagePreview(null);

    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));

    if (files.length === 0) {
      onError("Only image files are allowed.");
      return;
    }

    if (files.length === 1) {
      preprocessImage(files[0], (blob) => uploadSingle(blob));
    } else {
      Promise.all(
        files.map(
          (file) =>
            new Promise((resolve) =>
              preprocessImage(file, (blob) => resolve(new File([blob], file.name, { type: blob.type })))
            )
        )
      ).then((processedFiles) => uploadMultiple(processedFiles));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    handleFiles(e.target.files);
  };

  const uploadSingle = async (imageBlob) => {
    try {
      setLoading(true);
      setImagePreview(URL.createObjectURL(imageBlob));

      const formData = new FormData();
      formData.append("image", imageBlob, "preprocessed.png");
      formData.append("language", language);

      const res = await axios.post(OCR_SINGLE_URL, formData);
      setOcrText(res.data.text || "");
      setOcrBoxes(res.data.boxes || []);
    } catch (err) {
      const msg = err.response?.data?.error || "OCR failed";
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const uploadMultiple = async (images) => {
    try {
      setLoading(true);

      const formData = new FormData();
      images.forEach((file) => formData.append("images", file));
      formData.append("language", language);

      const res = await axios.post(OCR_MULTI_URL, formData);
      if (res.data.results && Array.isArray(res.data.results)) {
        // Join all texts with spacing
        setOcrText(res.data.results.map(r => r.text).join("\n\n"));

        // Flatten all boxes into one array
        setOcrBoxes(res.data.results.flatMap(r => r.boxes || []));
      } else {
        setOcrText("No text found.");
        setOcrBoxes([]);
      }
    } catch (err) {
      const msg = err.response?.data?.error || "OCR failed";
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOcrResultUpdate = (newData, index) => {
    setOcrBoxes((prev) => {
      const updated = [...prev];
      updated.splice(index, 1, ...(newData.boxes || []));
      return updated;
    });
    setOcrText((prev) => {
      const parts = prev.split(/\s+/);
      if (newData.text && parts[index]) {
        parts[index] = newData.text.trim();
      }
      return parts.join(" ");
    });
  };

  return (
    <div>
      <LanguageSelector selected={language} onChange={setLanguage} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`p-8 border-2 rounded-2xl text-center transition-all ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        // className={`p-8 border-2 rounded-2xl text-center transition-all flex flex-col items-center justify-center ${
        //   dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        // }`}
      >
        <p className="text-lg">Drag and drop image(s) here</p>
        <p className="text-sm text-gray-500 mt-1">JPG, PNG, etc. or click below</p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="mt-4 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />

        {loading && <p className="text-blue-500 mt-4">Processing...</p>}


        
        {imagePreview && ocrBoxes.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-500">Bounding Box Preview</p>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showBoxes}
                  onChange={(e) => setShowBoxes(e.target.checked)}
                  id="toggleBoxes"
                />
                <label htmlFor="toggleBoxes" className="text-sm text-gray-700">
                  Show Boxes
                </label>
              </div>
            </div>

            <BoundingBoxCanvas
              imageSrc={imagePreview}
              boxes={ocrBoxes}
              showBoxes={showBoxes}
              onOcrResult={handleOcrResultUpdate}
            />
            
          </div>
        )}
      </div>

      {ocrText && <ResultDisplay text={ocrText} boxes={ocrBoxes} />}
    </div>
  );
}
