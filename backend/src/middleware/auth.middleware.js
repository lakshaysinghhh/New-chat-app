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