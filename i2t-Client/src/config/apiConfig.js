// i2t-client/src/config/apiConfig.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const OCR_SINGLE_URL = `${API_BASE_URL}/api/ocr`;
export const OCR_MULTI_URL = `${API_BASE_URL}/api/ocr/UploadMultipleImages`;
export const AUTH_LOGIN_URL = `${API_BASE_URL}/api/auth/login`;
export const OCR_ISSERVERAWAKE_URL = `${API_BASE_URL}/api/ocr/isServerAwake`;

export function setAuthToken(token) {
  localStorage.setItem("authToken", token);
}

export function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function authHeaders(extraHeaders = {}) {
  const token = getAuthToken();
  return token
    ? { ...extraHeaders, Authorization: `Bearer ${token}` }
    : extraHeaders;
}
