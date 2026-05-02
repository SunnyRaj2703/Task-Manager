import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios.js"
import { useAuth } from "../contexts/AuthContext.jsx"
import Sidebar from "../components/Sidebar.jsx"
import Topbar from "../components/Topbar.jsx"
import ProjectCard from "../components/ProjectCard.jsx"
import TaskCard from "../components/TaskCard.jsx"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [urgentProjects, setUrgentProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [filter, setFilter] = useState("All")
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    const response = await api.get("/projects")
    setProjects(response.data.projects)
  }

  const fetchTasks = async () => {
    const query = filter !== "All" ? `?status=${encodeURIComponent(filter)}` : ""
    const response = await api.get(`/tasks${query}`)
    setTasks(response.data.tasks)
  }

  const fetchMembers = async () => {
    const response = await api.get("/users")
    setMembers(response.data.users)
  }

  const fetchUrgentProjects = async () => {
    const response = await api.get("/projects/overdue")
    setUrgentProjects(response.data.projects)
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await Promise.all([fetchProjects(), fetchTasks(), fetchUrgentProjects()])
        if (user?.role === "admin") {
          await fetchMembers()
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [filter, user?.role])

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`)
  }

  const stats = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    todo: tasks.filter((task) => task.status === "Todo").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    done: tasks.filter((task) => task.status === "Done").length,
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[20rem_1fr]">
        <Sidebar user={user} />
        <main className="space-y-6 p-6 lg:p-8">
          <Topbar title="Team Dashboard" onLogout={logout} />

          <section className="grid gap-6">
            <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 text-white shadow-xl shadow-slate-200/10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Welcome....</p>
                  <h2 className="mt-3 text-3xl font-semibold">{user?.name || "Team Member"}</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-300">
                    Manage your projects, track tasks, and coordinate the team from one modern workspace.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/projects/new")}
                  className="inline-flex items-center justify-center rounded-3xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-950/10 transition hover:bg-slate-100"
                >
                  Create new project
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[2rem] bg-white/10 p-5 text-slate-100 ring-1 ring-white/10 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Projects</p>
                  <p className="mt-3 text-3xl font-semibold">{stats.totalProjects}</p>
                </div>
                <div className="rounded-[2rem] bg-white/10 p-5 text-slate-100 ring-1 ring-white/10 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Tasks</p>
                  <p className="mt-3 text-3xl font-semibold">{stats.totalTasks}</p>
                </div>
                <div className="rounded-[2rem] bg-white/10 p-5 text-slate-100 ring-1 ring-white/10 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-300">In progress</p>
                  <p className="mt-3 text-3xl font-semibold">{stats.inProgress}</p>
                </div>
                <div className="rounded-[2rem] bg-white/10 p-5 text-slate-100 ring-1 ring-white/10 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Done</p>
                  <p className="mt-3 text-3xl font-semibold">{stats.done}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[16fr_1fr]">
              <div className="space-y-6">
                <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Active workspace</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Your projects</h2>
                    </div>
                    <button
                      onClick={() => navigate("/projects/new")}
                      className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      New project
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {loading ? (
                      <div className="col-span-full rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center">Loading projects...</div>
                    ) : projects.length === 0 ? (
                      <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                        No projects found. Create one to get started.
                      </div>
                    ) : (
                      projects.map((project) => (
                        <ProjectCard key={project._id} project={project} taskCount={0} onView={handleViewProject} />
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Deadline alerts</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Overdue & due soon</h2>
                    </div>
                    <button
                      onClick={() => navigate("/overdue")}
                      className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      View overdue page
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {loading ? (
                      <div className="col-span-full rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center">Loading deadline alerts...</div>
                    ) : urgentProjects.length === 0 ? (
                      <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                        No overdue or due-soon projects at the moment.
                      </div>
                    ) : (
                      urgentProjects.slice(0, 4).map((project) => (
                        <ProjectCard key={project._id} project={project} onView={handleViewProject} />
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Task panel</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Assigned tasks</h2>
                    </div>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                    >
                      {['All', 'Todo', 'In Progress', 'Done'].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {loading ? (
                      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center">Loading tasks...</div>
                    ) : tasks.length === 0 ? (
                      <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                        No tasks matched the filter.
                      </div>
                    ) : (
                      tasks.slice(0, 4).map((task) => <TaskCard key={task._id} task={task} />)
                    )}
                  </div>
                </div>
              </div>

              
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
