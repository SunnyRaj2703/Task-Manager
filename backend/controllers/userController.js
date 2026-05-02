import User from "../models/User.js"

export const getUsers = async (req, res) => {
  const users = await User.find().select("_id name email role createdAt")
  res.json({ success: true, users })
}

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("_id name email role createdAt")
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  res.json({ success: true, user })
}
