// i2t-client/src/services/authService.js

import { AUTH_LOGIN_URL, setAuthToken } from "../config/apiConfig";

export async function login(username, password) {
  const res = await fetch(AUTH_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed");
  }

  const data = await res.json();
  setAuthToken(data.token);
  return data.token;
}

export function logout() {
  localStorage.removeItem("authToken");
}

export function isAuthenticated() {
  return !!localStorage.getItem("authToken");
}
