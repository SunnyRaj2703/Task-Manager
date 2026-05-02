import jwt from "jsonwebtoken"
import User from "../models/User.js"

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token" })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

export default authMiddleware
