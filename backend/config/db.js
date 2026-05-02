import mongoose from "mongoose"

const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error("MONGO_URI is required in environment variables")
  }

  try {
    await mongoose.connect(mongoUri)
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection error:", error.message)
    process.exit(1)
  }
}

export default connectDB
