import { body } from "express-validator"

export const signupValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["admin", "member"]).withMessage("Role must be admin or member"),
]

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
]

export const projectValidator = [
  body("name").trim().notEmpty().withMessage("Project name is required"),
  body("description").optional().trim(),
  body("dueDate").optional().isISO8601().withMessage("dueDate must be a valid date"),
  body("memberIds").optional().isArray().withMessage("memberIds must be an array"),
]

export const taskValidator = [
  body("title").trim().notEmpty().withMessage("Task title is required"),
  body("description").optional().trim(),
  body("status").optional().isIn(["Todo", "In Progress", "Done"]).withMessage("Status must be Todo, In Progress, or Done"),
  body("assignedTo").notEmpty().withMessage("assignedTo is required"),
  body("projectId").notEmpty().withMessage("projectId is required"),
  body("dueDate").notEmpty().withMessage("dueDate is required").isISO8601().withMessage("dueDate must be a valid date"),
]

export const taskStatusValidator = [
  body("status").trim().isIn(["Todo", "In Progress", "Done"]).withMessage("Status must be Todo, In Progress, or Done"),
]
