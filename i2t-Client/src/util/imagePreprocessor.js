// i2t-client/src/util/imagePreprocessor.js

export function preprocessImage(file, callback) {
  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Convert to grayscale
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => callback(blob), "image/png");
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

export function preprocessRegion(imageSrc, box, callback) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = box.width;
    canvas.height = box.height;
    const ctx = canvas.getContext("2d");

    // Draw cropped region
    ctx.drawImage(
      img,
      box.x, box.y, box.width, box.height, // source rect
      0, 0, canvas.width, canvas.height    // dest rect
    );

    // Grayscale
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);

    // Thresholding (simple example)
    for (let i = 0; i < data.length; i += 4) {
      const v = data[i] > 128 ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = v;
    }
    ctx.putImageData(imageData, 0, 0);

    canvas.toBlob((blob) => callback(blob), "image/png");
  };
  img.src = imageSrc;
}

