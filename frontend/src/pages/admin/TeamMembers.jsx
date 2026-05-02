import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../api/axios"
import { FiUsers, FiUser, FiMail, FiShield, FiCalendar, FiSearch } from "react-icons/fi"

const TeamMembers = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [userStats, setUserStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchUsers(), fetchTasks()])
      setLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    buildUserStats()
  }, [users, tasks])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, selectedRole])

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users")
      setUsers(response.data.users || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks/admin/all")
      setTasks(response.data.tasks || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const buildUserStats = () => {
    const stats = {}

    users.forEach((user) => {
      stats[user._id] = {
        projectCount: 0,
        totalTasks: 0,
        completed: 0,
        pending: 0,
        todo: 0,
        inProgress: 0,
        projects: new Set(),
      }
    })

    tasks.forEach((task) => {
      const userId = task.assignedTo?._id || task.assignedTo
      if (!userId) return

      if (!stats[userId]) {
        stats[userId] = {
          projectCount: 0,
          totalTasks: 0,
          completed: 0,
          pending: 0,
          todo: 0,
          inProgress: 0,
          projects: new Set(),
        }
      }

      stats[userId].totalTasks += 1
      stats[userId].projects.add(task.projectId?._id || task.projectId)

      if (task.status === "Done") {
        stats[userId].completed += 1
      } else {
        stats[userId].pending += 1
      }

      if (task.status === "Todo") {
        stats[userId].todo += 1
      } else if (task.status === "In Progress") {
        stats[userId].inProgress += 1
      }
    })

    Object.keys(stats).forEach((userId) => {
      stats[userId].projectCount = stats[userId].projects.size
      delete stats[userId].projects
    })

    setUserStats(stats)
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole)
    }

    setFilteredUsers(filtered)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRoleColor = (role) => {
    return role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
  }

  return (
    <DashboardLayout activeMenu={"Team Members"}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Team Members</h2>
              <p className="text-purple-100 mt-1">
                Manage and view all team members in your organization
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                <FiUsers className="w-5 h-5" />
                <span className="font-medium">{filteredUsers.length} members</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading team members...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No team members found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Projects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Total Tasks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Pending
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Joined Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const stats = userStats[user._id] || {
                      projectCount: 0,
                      totalTasks: 0,
                      completed: 0,
                      pending: 0,
                    }

                    return (
                      <tr key={user._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiMail className="w-4 h-4" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                              user.role
                            )}`}
                          >
                            <FiShield className="w-3 h-3" />
                            {user.role === "admin" ? "Admin" : "Member"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {stats.projectCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {stats.totalTasks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {stats.completed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {stats.pending}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCalendar className="w-4 h-4" />
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TeamMembers
