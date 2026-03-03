import express from "express";
import { 
    sendMessage, 
    getMessages, 
    getUsersForSidebar 
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// 📌 Sidebar users
router.get("/users", protectRoute, getUsersForSidebar);

// 📌 Get messages between logged-in user & selected user
router.get("/:id", protectRoute, getMessages);

// 📌 Send message
router.post("/send/:id", protectRoute, sendMessage);


// 📌 Send message
router.post("/send/:id", protectRoute, sendMessage);

export default router;