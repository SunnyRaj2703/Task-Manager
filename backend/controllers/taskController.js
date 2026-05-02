import Task from "../models/Task.js"
import Project from "../models/Project.js"

export const createTask = async (req, res) => {
  const { title, description, status, assignedTo, projectId, dueDate } = req.body

  const project = await Project.findById(projectId)
  if (!project) {
    return res.status(404).json({ message: "Project not found" })
  }

  if (req.user.role !== "admin" && !project.members.some((member) => member.equals(req.user._id))) {
    return res.status(403).json({ message: "You are not part of this project" })
  }

  const task = await Task.create({
    title,
    description,
    status: status ?? "Todo",
    assignedTo,
    projectId,
    dueDate,
  })

  res.status(201).json({ success: true, task })
}

export const getTasks = async (req, res) => {
  const { status, projectId, admin } = req.query
  const filters = {}

  if (status) filters.status = status
  if (projectId) filters.projectId = projectId

  // Only show assigned-to-member tasks if user is not admin or if not explicitly asking for all tasks
  if (req.user.role === "member") {
    filters.assignedTo = req.user._id
  }

  const tasks = await Task.find(filters)
    .populate("assignedTo", "name email role")
    .populate("projectId", "name description")

  res.json({ success: true, tasks })
}

export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignedTo", "name email role")
    .populate("projectId", "name description members")

  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }

  if (req.user.role === "member" && !task.assignedTo._id.equals(req.user._id)) {
    return res.status(403).json({ message: "Access denied to this task" })
  }

  res.json({ success: true, task })
}

export const updateTask = async (req, res) => {
  const { title, description, status, assignedTo, dueDate } = req.body
  const task = await Task.findById(req.params.id)

  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }

  if (req.user.role === "member" && !task.assignedTo.equals(req.user._id)) {
    return res.status(403).json({ message: "You cannot modify this task" })
  }

  task.title = title ?? task.title
  task.description = description ?? task.description
  task.status = status ?? task.status
  task.assignedTo = assignedTo ?? task.assignedTo
  task.dueDate = dueDate ?? task.dueDate

  await task.save()

  res.json({ success: true, task })
}

export const updateTaskStatus = async (req, res) => {
  const { status } = req.body
  const task = await Task.findById(req.params.id)

  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }

  if (req.user.role === "member" && !task.assignedTo.equals(req.user._id)) {
    return res.status(403).json({ message: "You cannot update this task status" })
  }

  task.status = status
  await task.save()

  res.json({ success: true, task })
}

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can delete tasks" })
  }

  await task.remove()

  res.json({ success: true, message: "Task deleted successfully" })
}
