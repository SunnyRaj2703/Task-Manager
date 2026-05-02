import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios.js"
import { useAuth } from "../contexts/AuthContext.jsx"
import Sidebar from "../components/Sidebar.jsx"
import Topbar from "../components/Topbar.jsx"
import ProjectCard from "../components/ProjectCard.jsx"

const Overdue = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    const response = await api.get("/projects/overdue")
    setProjects(response.data.projects)
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await fetchProjects()
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const now = new Date()
  const soon = new Date()
  soon.setDate(soon.getDate() + 7)

  const overdueCount = projects.filter((project) => project.dueDate && new Date(project.dueDate) < now).length
  const dueSoonCount = projects.filter((project) => {
    if (!project.dueDate) return false
    const dueDate = new Date(project.dueDate)
    return dueDate >= now && dueDate <= soon
  }).length

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[20rem_1fr]">
        <Sidebar user={user} />
        <main className="space-y-6 p-6 lg:p-8">
          <Topbar title="Deadline alerts" onLogout={logout} />

          <section className="grid gap-6">
            <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 text-white shadow-xl shadow-slate-200/10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Project deadlines</p>
                  <h2 className="mt-3 text-3xl font-semibold">Overdue and upcoming projects</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-300">
                    See projects that have overdue tasks or deadlines approaching within the next 7 days.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center justify-center rounded-3xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-950/10 transition hover:bg-slate-100"
                >
                  Back to dashboard
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[2rem] bg-white/10 p-5 text-slate-100 ring-1 ring-white/10 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Overdue projects</p>
                  <p className="mt-3 text-3xl font-semibold">{overdueCount}</p>
                </div>
                <div className="rounded-[2rem] bg-white/10 p-5 text-slate-100 ring-1 ring-white/10 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Due soon</p>
                  <p className="mt-3 text-3xl font-semibold">{dueSoonCount}</p>
                </div>
                <div className="rounded-[2rem] bg-white/10 p-5 text-slate-100 ring-1 ring-white/10 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Projects monitored</p>
                  <p className="mt-3 text-3xl font-semibold">{projects.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Active alerts</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Urgent project list</h2>
                </div>
                <button
                  onClick={() => fetchProjects()}
                  className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {loading ? (
                  <div className="col-span-full rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center">Loading projects...</div>
                ) : projects.length === 0 ? (
                  <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                    No overdue or due-soon projects found.
                  </div>
                ) : (
                  projects.map((project) => (
                    <ProjectCard key={project._id} project={project} onView={handleViewProject} />
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Overdue
