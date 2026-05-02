import express from "express"
import {
  createProject,
  getProjects,
  getOverdueProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import requireRole from "../middleware/roleMiddleware.js"
import validateRequest from "../middleware/validateRequest.js"
import { projectValidator } from "../utils/validators.js"

const router = express.Router()

router.use(authMiddleware)
router.get("/", getProjects)
router.get("/overdue", getOverdueProjects)
router.get("/:id", getProjectById)
router.post("/", requireRole(["admin"]), projectValidator, validateRequest, createProject)
router.put("/:id", requireRole(["admin"]), projectValidator, validateRequest, updateProject)
router.delete("/:id", requireRole(["admin"]), deleteProject)

export default router
