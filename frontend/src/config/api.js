// Empty string in dev uses Vite proxy (/api → localhost:5000)
export const API_URL = import.meta.env.VITE_API_URL || "";

// Socket.io needs the full backend URL (no proxy)
export const SOCKET_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiUrl = (path) => `${API_URL}${path}`;
