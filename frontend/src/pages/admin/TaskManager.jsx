import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../api/axios"
import {
  FiEdit2,
  FiTrash2,
  FiUser,
  FiCalendar,
  FiFilter,
  FiX,
  FiCheck,
} from "react-icons/fi"
import toast from "react-hot-toast"

const TaskManager = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [editingTask, setEditingTask] = useState(null)
  const [newAssignee, setNewAssignee] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, statusFilter, assigneeFilter])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tasksRes, usersRes] = await Promise.all([
        axiosInstance.get("/tasks/admin/all"),
        axiosInstance.get("/users"),
      ])
      setTasks(tasksRes.data.tasks || [])
      setUsers(usersRes.data.users || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (assigneeFilter !== "all") {
      filtered = filtered.filter((task) => task.assignedTo._id === assigneeFilter)
    }

    setFilteredTasks(filtered)
  }

  const handleEditAssignee = async (taskId) => {
    if (!newAssignee) {
      toast.error("Please select a team member")
      return
    }

    try {
      await axiosInstance.put(`/tasks/${taskId}`, {
        assignedTo: newAssignee,
      })
      toast.success("Task reassigned successfully")
      setEditingTask(null)
      setNewAssignee("")
      fetchData()
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to reassign task")
    }
  }

  const handleRemoveAssignee = async (taskId) => {
    if (!window.confirm("Are you sure you want to remove the assignee from this task?")) {
      return
    }

    try {
      await axiosInstance.put(`/tasks/${taskId}`, {
        assignedTo: null,
      })
      toast.success("Assignee removed successfully")
      fetchData()
    } catch (error) {
      console.error("Error removing assignee:", error)
      toast.error("Failed to remove assignee")
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      await axiosInstance.delete(`/tasks/${taskId}`)
      toast.success("Task deleted successfully")
      fetchData()
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      Todo: "bg-gray-100 text-gray-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Done: "bg-green-100 text-green-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <DashboardLayout activeMenu={"Task Manager"}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Task Manager</h2>
              <p className="text-blue-100 mt-1">
                Manage all tasks and reassign team members
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                <span className="font-medium">{filteredTasks.length} tasks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Tasks
              </label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Todo">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Assignee Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Members</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600">No tasks found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Task Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {task.description || "No description"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingTask === task._id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={newAssignee}
                              onChange={(e) => setNewAssignee(e.target.value)}
                              className="px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="">Select member</option>
                              {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                  {user.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleEditAssignee(task._id)}
                              className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                              title="Confirm"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingTask(null)
                                setNewAssignee("")
                              }}
                              className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                              title="Cancel"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {task.assignedTo ? (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-800">
                                  {task.assignedTo.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-900">
                                  {task.assignedTo.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500 italic">
                                Unassigned
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiCalendar className="w-4 h-4" />
                          {formatDate(task.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {editingTask !== task._id && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingTask(task._id)
                                  setNewAssignee(task.assignedTo?._id || "")
                                }}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                title="Edit assignee"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              {task.assignedTo && (
                                <button
                                  onClick={() => handleRemoveAssignee(task._id)}
                                  className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition"
                                  title="Remove assignee"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                title="Delete task"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TaskManager
