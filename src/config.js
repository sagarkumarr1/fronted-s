// src/config.js

// Always return a clean base URL
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
  console.error("❌ VITE_API_URL is missing! Add it in your Vercel dashboard.");
}

export default API_BASE_URL;
