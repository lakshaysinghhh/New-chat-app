import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : "/api",
  withCredentials: true,
});


// Axios ek JavaScript library hai jo use hoti hai:
// ➡️ HTTP requests bhejne ke liye (frontend → backend)

// Example:

// GET (data lana)
// POST (data bhejna)
// PUT / PATCH (update)
// DELETE (remove)

// “Axios is preferred over Fetch because of built-in interceptors,
//  automatic JSON parsing, and better error handling.”