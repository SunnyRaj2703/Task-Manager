import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios.js"
import { useAuth } from "../contexts/AuthContext.jsx"
import Sidebar from "../components/Sidebar.jsx"
import Topbar from "../components/Topbar.jsx"

const ProjectView = () => {
  const { projectId } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState("")
  const [allUsers, setAllUsers] = useState([])
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDesc, setTaskDesc] = useState("")
  const [taskDue, setTaskDue] = useState("")
  const [taskAssignee, setTaskAssignee] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isNew = projectId === "new"

  const fetchUsers = async () => {
    const response = await api.get("/users")
    setAllUsers(response.data.users)
  }

  const fetchProject = async () => {
    if (!isNew) {
      const response = await api.get(`/projects/${projectId}`)
      setProject(response.data.project)
      setName(response.data.project.name)
      setDescription(response.data.project.description)
      setDueDate(response.data.project.dueDate ? response.data.project.dueDate.slice(0, 10) : "")
      setMembers(response.data.project.members)
      setSelectedMember(response.data.project.members[0]?._id || "")
    }
  }

  const fetchTasks = async () => {
    if (!isNew) {
      const response = await api.get(`/tasks?projectId=${projectId}`)
      setTasks(response.data.tasks)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        if (user?.role === "admin") {
          await fetchUsers()
        }
        await fetchProject()
        await fetchTasks()
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [projectId, user?.role])

  const handleCreateProject = async (event) => {
    event.preventDefault()
    setError("")

    try {
      const response = await api.post("/projects", {
        name,
        description,
        dueDate,
        memberIds: members.map((member) => member._id),
      })
      navigate(`/projects/${response.data.project._id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create project")
    }
  }

  const handleAddMember = () => {
    const userToAdd = allUsers.find((option) => option._id === selectedMember)
    if (userToAdd && !members.some((member) => member._id === userToAdd._id)) {
      setMembers([...members, userToAdd])
    }
  }

  const handleRemoveMember = (memberId) => {
    setMembers((current) => current.filter((member) => member._id !== memberId))
  }

  const handleSaveMembers = async () => {
    setError("")
    try {
      await api.put(`/projects/${projectId}`, {
        name: project.name,
        description: project.description,
        dueDate: dueDate || project.dueDate,
        memberIds: members.map((member) => member._id),
      })
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save members")
    }
  }

  const handleCreateTask = async (event) => {
    event.preventDefault()
    setError("")

    try {
      await api.post("/tasks", {
        title: taskTitle,
        description: taskDesc,
        assignedTo: taskAssignee,
        projectId,
        dueDate: taskDue,
      })
      setTaskTitle("")
      setTaskDesc("")
      setTaskDue("")
      setTaskAssignee("")
      await fetchTasks()
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create task")
    }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status })
      await fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-700">Loading project...</div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[20rem_1fr]">
        <Sidebar user={user} />
        <main className="space-y-6 p-6 lg:p-8">
          <Topbar title={isNew ? "Create project" : project?.name || "Project"} onLogout={logout} />

          <section className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/20">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Project overview</p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">{project?.name || "New project"}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    {project?.description || "Create your project with a clear description and assign your team to start collaborating."}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
                  <p className="text-slate-500">Team members</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{members.length}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
              <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">Project details</h3>
                <form onSubmit={isNew ? handleCreateProject : undefined} className="mt-6 space-y-5">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Project name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-900"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Description</span>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-900"
                      rows={5}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Project deadline</span>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-900"
                      required
                    />
                  </label>

                  {isNew && (
                    <button className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                      Create project
                    </button>
                  )}
                </form>

                {!isNew && (
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Owner</p>
                      <p className="mt-2 font-semibold text-slate-900">{project?.createdBy?.name}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Created</p>
                      <p className="mt-2 font-semibold text-slate-900">{project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : "-"}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Deadline</p>
                      <p className="mt-2 font-semibold text-slate-900">{project?.dueDate ? new Date(project.dueDate).toLocaleDateString() : "-"}</p>
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Team members</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">Project team</h3>
                  </div>
                  {user?.role === "admin" && (
                    <button
                      onClick={handleSaveMembers}
                      className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      Save members
                    </button>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {members.length === 0 ? (
                    <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                      No members assigned yet.
                    </div>
                  ) : (
                    members.map((member) => (
                      <div key={member._id} className="flex items-center justify-between gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          <p className="text-sm text-slate-500">{member.email}</p>
                        </div>
                        {user?.role === "admin" && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member._id)}
                            className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {user?.role === "admin" && (
                  <div className="mt-6 space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-700">Add new team member</p>
                    <select
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-900"
                    >
                      <option value="">Select member</option>
                      {allUsers.map((userOption) => (
                        <option key={userOption._id} value={userOption._id}>{userOption.name} ({userOption.email})</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddMember}
                      className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      Add member
                    </button>
                  </div>
                )}
              </section>
            </div>

            {!isNew && (
              <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Tasks</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">Project tasks</h3>
                  </div>
                  {user?.role === "admin" && (
                    <button
                      onClick={() => document.getElementById("task-form").scrollIntoView({ behavior: "smooth" })}
                      className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      Add new task
                    </button>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  {tasks.length === 0 ? (
                    <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                      No tasks added to this project yet.
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div key={task._id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-base font-semibold text-slate-900">{task.title}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{task.description || "No task description provided."}</p>
                          </div>
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
                          >
                            {['Todo', 'In Progress', 'Done'].map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-slate-500">
                          <span>Assigned to: <span className="font-medium text-slate-700">{task.assignedTo?.name || "N/A"}</span></span>
                          <span>Due: <span className="font-medium text-slate-700">{new Date(task.dueDate).toLocaleDateString()}</span></span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {user?.role === "admin" && (
                  <form id="task-form" onSubmit={handleCreateTask} className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                    <h4 className="text-lg font-semibold text-slate-900">Create a new task</h4>
                    {error && <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">Task title</span>
                        <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-900" required />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">Due date</span>
                        <input type="date" value={taskDue} onChange={(e) => setTaskDue(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-900" required />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Description</span>
                      <textarea value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} rows={4} className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-900" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Assign to</span>
                      <select value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-900" required>
                        <option value="">Choose member</option>
                        {members.map((member) => (
                          <option key={member._id} value={member._id}>{member.name}</option>
                        ))}
                      </select>
                    </label>
                    <button className="mt-4 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Create task</button>
                  </form>
                )}
              </section>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default ProjectView
