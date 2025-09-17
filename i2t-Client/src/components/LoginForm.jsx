// i2t-client/src/components/LoginForm.jsx

// i2t-client/src/components/LoginForm.jsx
import { useState } from "react";
import { login, logout, isAuthenticated } from "../services/authService";

export default function LoginForm({ onLoginSuccess, onError }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isProd = import.meta.env.MODE === "production";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await login(username, password);
      onLoginSuccess?.(token);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUsername("");
    setPassword("");
    onLoginSuccess?.(null);
  };

  if (isAuthenticated()) {
    return (
      <div className="mt-6 p-6 rounded-2xl border-2 border-gray-200 text-center">
        <h2 className="text-xl font-semibold mb-4">You are logged in ✅</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-6 rounded-2xl border-2 border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
          placeholder="Enter username"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
          placeholder="Enter password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading
          ? isProd
            ? "Waking server... (this may take a minute)"
            : "Logging in..."
          : "Login"}
      </button>
    </form>
  );
}
