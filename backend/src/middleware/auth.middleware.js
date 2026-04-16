import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    
 // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token",
      });
    }

     // 3️⃣ Find user from DB
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

      // 4️⃣ Attach user to request
    req.user = user;

    // 5️⃣ Move to next middleware
    next();

  } catch (error) {
    console.log("Protect Route Error:", error.message);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

// Token lena (cookies se)
// const token = req.cookies.jwt;

// ➡️ Jab user login karta hai → server usko JWT cookie deta hai
// ➡️ Har request me wo cookie automatically aati hai


// 👉 Middleware is a function that runs between the request and response cycle.
// It can:

// modify request (req)
// modify response (res)
// or stop the request

// 👉 Authentication middleware verifies whether a user is authorized to access a protected route.
// app.get("/api/messages", protectRoute, getMessages);


// ➡️ Flow:

// protectRoute chalega
// Agar user valid → getMessages
// Agar invalid → ❌ error