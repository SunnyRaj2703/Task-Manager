import express from "express"
import { getUsers, getUserById } from "../controllers/userController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import requireRole from "../middleware/roleMiddleware.js"

const router = express.Router()

router.use(authMiddleware)
router.use(requireRole(["admin"]))

router.get("/", getUsers)
router.get("/:id", getUserById)

export default router
