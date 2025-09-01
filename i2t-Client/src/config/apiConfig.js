// i2t-client/src/config/apiConfig.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const OCR_SINGLE_URL = `${API_BASE_URL}/api/ocr`;
export const OCR_MULTI_URL = `${API_BASE_URL}/api/ocr/UploadMultipleImages`;
