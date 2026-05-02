import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import "express-async-errors"

import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import projectRoutes from "./routes/projects.js"
import taskRoutes from "./routes/tasks.js"
import errorHandler from "./middleware/errorHandler.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

connectDB(process.env.MONGO_URI)

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}))
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
