
import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
import fs from "fs";

dotenv.config();

// When started with `npm run start --prefix backend`, the working directory is the `backend` folder.
// Use that as the base to locate the built frontend in `../frontend/dist`.
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "../frontend/dist");

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookies
app.use(cookieParser());

// CORS (local + production)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://new-chat-app-txlk.onrender.com",
    ],
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve frontend if the build output exists (e.g. on Render after `vite build`)
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Fallback for any non-API GET request: send the React index.html
  app.use((req, res, next) => {
    if (
      req.method !== "GET" ||
      req.path.startsWith("/api") ||
      !req.headers.accept?.includes("text/html")
    ) {
      return next();
    }

    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  connectDB();
});




// “CORS is a security feature that allows or blocks cross-origin API requests based on server configuration.”

// ❓
// “CORS is not about connecting frontend and backend, it’s about allowing or restricting access between different origins.”

// ❓ CORS error kab aata hai?

// 👉 Jab frontend aur backend alag origin pe ho aur backend allow na kare

// ❓ credentials: true kyun use kiya?

// 👉 Cookies / auth tokens send karne ke liye

// ❓ CORS connection banata hai?

// 👉 ❌ Nahi
// 👉 ✔️ Sirf permission deta hai