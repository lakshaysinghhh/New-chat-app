import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser";
import cors from 'cors'


dotenv.config()

const app = express()

// ✅ Increase payload size limit (IMPORTANT)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.use(cookieParser())

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("server is running on " + PORT)
  connectDB()
})