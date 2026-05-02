import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

export const signup = async (req, res) => {
  const { name, email, password, role, adminSecret } = req.body

  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    return res.status(409).json({ message: "Email already exists" })
  }

  const userRole = role === "admin" ? "admin" : "member"
  if (role === "admin" && adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: "Invalid admin secret" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: userRole,
  })

  const token = generateToken(user._id)
  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email.toLowerCase() })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" })
  }

  const token = generateToken(user._id)

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  })
}

export const profile = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  })
}
