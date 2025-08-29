// i2t-client/src/components/BoundingBoxCanvas.jsx

import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { OCR_SINGLE_URL } from "../config/apiConfig";

export default function BoundingBoxCanvas({
  imageSrc,
  boxes = [],
  showBoxes = true,
  onOcrResult,
}) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    box: null,
    index: null,
  });

  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) updateImageSize();
  }, [imageSrc]);

  const updateImageSize = () => {
    if (imgRef.current) {
      setImageSize({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight,
      });
    }
  };

  const handleRightClick = (e, box, index) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      box,
      index,
    });
  };

  const handleCopy = () => {
    if (contextMenu.box?.word) {
      navigator.clipboard.writeText(contextMenu.box.word);
    }
    closeMenu();
  };

  const handleReOcr = async (version) => {
    if (!contextMenu.box) return;

    const formData = new FormData();
    formData.append("image", await fetch(imageSrc).then(res => res.blob()));
    formData.append("version", version);
    formData.append("x", contextMenu.box.x);
    formData.append("y", contextMenu.box.y);
    formData.append("width", contextMenu.box.width);
    formData.append("height", contextMenu.box.height);

    try {
      const res = await axios.post(OCR_SINGLE_URL, formData);
      // if (onOcrResult) onOcrResult(res.data, contextMenu.index);
      
      if (onOcrResult) {
        onOcrResult(res.data, contextMenu.index);
      }
    } catch (err) {
      console.error("Re-OCR failed", err);
    }

    closeMenu();
  };

  const closeMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    const closeOnClick = () => closeMenu();
    window.addEventListener("click", closeOnClick);
    return () => window.removeEventListener("click", closeOnClick);
  }, []);

  return (
    <div className="relative inline-block max-w-full overflow-x-auto">
      <img
        ref={imgRef}
        src={imageSrc}
        alt="OCR"
        onLoad={updateImageSize}
        className="rounded-xl shadow border block w-full h-auto"
      />

      {showBoxes && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-auto">
          {boxes.map((box, index) => {
            const style = {
              position: "absolute",
              top: `${(box.y / imageSize.height) * 100}%`,
              left: `${(box.x / imageSize.width) * 100}%`,
              width: `${(box.width / imageSize.width) * 100}%`,
              height: `${(box.height / imageSize.height) * 100}%`,
              backgroundColor: "rgba(255, 0, 0, 0.12)",
              border: "1px solid rgba(255, 0, 0, 0.4)",
              padding: "1px 2px",
              cursor: "text",
              color: "transparent",
            };

            return (
              <span
                key={index}
                title={box.word}
                style={style}
                onContextMenu={(e) => handleRightClick(e, box, index)}
                className="group hover:bg-red-300 transition-all duration-100"
              >
                {box.word}
              </span>
            );
          })}
        </div>
      )}

      {contextMenu.visible && (
        <div
          className="fixed z-50 rounded-md shadow-lg border border-gray-700 bg-gray-800 text-white text-sm select-none"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            minWidth: "160px",
          }}
        >
          <button
            onClick={handleCopy}
            className="block w-full text-left px-3 py-2 hover:bg-gray-700"
          >
            📋 Copy
          </button>
          <button
            onClick={() => handleReOcr(2)}
            className="block w-full text-left px-3 py-2 hover:bg-gray-700"
          >
            🔄 Re-OCR (Exact Bound Box)
          </button>
          <button
            onClick={() => handleReOcr(3)}
            className="block w-full text-left px-3 py-2 hover:bg-gray-700"
          >
            🔍 Re-OCR (Expand Bound Box)
          </button>
        </div>
      )}
    </div>
  );
}
