import Project from "../models/Project.js"
import Task from "../models/Task.js"
import User from "../models/User.js"

export const createProject = async (req, res) => {
  const { name, description, dueDate, memberIds = [] } = req.body

  if (!dueDate) {
    return res.status(400).json({ message: "Project due date is required" })
  }

  const members = await User.find({ _id: { $in: memberIds } }).select("_id")

  const project = await Project.create({
    name,
    description,
    dueDate,
    members: members.map((member) => member._id),
    createdBy: req.user._id,
  })

  res.status(201).json({ success: true, project })
}

export const getProjects = async (req, res) => {
  let projects
  if (req.user.role === "admin") {
    projects = await Project.find().populate("createdBy", "name email role")
  } else {
    projects = await Project.find({ members: req.user._id }).populate("createdBy", "name email role")
  }

  res.json({ success: true, projects })
}

export const getOverdueProjects = async (req, res) => {
  const now = new Date()
  const soon = new Date()
  soon.setDate(soon.getDate() + 7)

  const projectFilter = req.user.role === "admin"
    ? {}
    : { members: req.user._id }

  const accessibleProjects = await Project.find(projectFilter).lean()
  const projectIds = accessibleProjects.map((project) => project._id)

  if (projectIds.length === 0) {
    return res.json({ success: true, projects: [] })
  }

  const taskGroups = await Task.aggregate([
    { $match: { projectId: { $in: projectIds } } },
    {
      $group: {
        _id: "$projectId",
        totalTasks: { $sum: 1 },
        incompleteTasks: { $sum: { $cond: [{ $ne: ["$status", "Done"] }, 1, 0] } },
        overdueTasks: { $sum: { $cond: [{ $and: [{ $ne: ["$status", "Done"] }, { $lt: ["$dueDate", now] }] }, 1, 0] } },
        dueSoonTasks: { $sum: { $cond: [{ $and: [{ $ne: ["$status", "Done"] }, { $gte: ["$dueDate", now] }, { $lte: ["$dueDate", soon] }] }, 1, 0] } },
      },
    },
  ])

  const taskMap = new Map(taskGroups.map((group) => [String(group._id), group]))

  const urgentProjects = accessibleProjects.filter((project) => {
    if (!project.dueDate) return false

    const deadline = new Date(project.dueDate)
    const isOverdue = deadline < now
    const isDueSoon = deadline >= now && deadline <= soon
    if (!isOverdue && !isDueSoon) return false

    const stats = taskMap.get(String(project._id)) || {
      totalTasks: 0,
      incompleteTasks: 0,
      overdueTasks: 0,
      dueSoonTasks: 0,
    }

    return stats.totalTasks === 0 || stats.incompleteTasks > 0
  })

  if (urgentProjects.length === 0) {
    return res.json({ success: true, projects: [] })
  }

  const projects = await Project.find({ _id: { $in: urgentProjects.map((project) => project._id) } })
    .populate("createdBy", "name email role")
    .populate("members", "name email role")

  const result = projects
    .map((project) => {
      const stats = taskMap.get(String(project._id)) || {
        totalTasks: 0,
        incompleteTasks: 0,
        overdueTasks: 0,
        dueSoonTasks: 0,
      }

      return {
        ...project.toObject(),
        overdueTaskCount: stats.overdueTasks,
        dueSoonTaskCount: stats.dueSoonTasks,
        incompleteTaskCount: stats.incompleteTasks,
      }
    })
    .sort((a, b) => {
      if (a.overdueTaskCount !== b.overdueTaskCount) return b.overdueTaskCount - a.overdueTaskCount
      if (a.dueSoonTaskCount !== b.dueSoonTaskCount) return b.dueSoonTaskCount - a.dueSoonTaskCount
      return new Date(a.dueDate) - new Date(b.dueDate)
    })

  res.json({ success: true, projects: result })
}

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("createdBy", "name email role")
    .populate("members", "name email role")

  if (!project) {
    return res.status(404).json({ message: "Project not found" })
  }

  if (req.user.role !== "admin" && !project.members.some((member) => member._id.equals(req.user._id))) {
    return res.status(403).json({ message: "Access denied to this project" })
  }

  res.json({ success: true, project })
}

export const updateProject = async (req, res) => {
  const { name, description, dueDate, memberIds } = req.body
  const project = await Project.findById(req.params.id)

  if (!project) {
    return res.status(404).json({ message: "Project not found" })
  }

  project.name = name ?? project.name
  project.description = description ?? project.description
  project.dueDate = dueDate ?? project.dueDate

  if (Array.isArray(memberIds)) {
    const members = await User.find({ _id: { $in: memberIds } }).select("_id")
    project.members = members.map((member) => member._id)
  }

  await project.save()

  res.json({ success: true, project })
}

export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    return res.status(404).json({ message: "Project not found" })
  }

  await project.remove()

  res.json({ success: true, message: "Project deleted successfully" })
}
