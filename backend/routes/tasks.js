import express from "express"
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import requireRole from "../middleware/roleMiddleware.js"
import validateRequest from "../middleware/validateRequest.js"
import { taskValidator, taskStatusValidator } from "../utils/validators.js"

const router = express.Router()

router.use(authMiddleware)
router.get("/admin/all", requireRole(["admin"]), getTasks)
router.get("/", getTasks)
router.get("/:id", getTaskById)
router.post("/", requireRole(["admin"]), taskValidator, validateRequest, createTask)
router.put("/:id", validateRequest, updateTask)
router.patch("/:id/status", taskStatusValidator, validateRequest, updateTaskStatus)
router.delete("/:id", requireRole(["admin"]), deleteTask)

export default router
