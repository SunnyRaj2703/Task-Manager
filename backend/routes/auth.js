import express from "express"
import { signup, login, profile } from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import validateRequest from "../middleware/validateRequest.js"
import { signupValidator, loginValidator } from "../utils/validators.js"

const router = express.Router()

router.post("/signup", signupValidator, validateRequest, signup)
router.post("/login", loginValidator, validateRequest, login)
router.get("/profile", authMiddleware, profile)

export default router
