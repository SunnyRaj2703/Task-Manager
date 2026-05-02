import React from "react"
import { NavLink } from "react-router-dom"
import { FiUsers, FiCheckSquare } from "react-icons/fi"

const Sidebar = ({ user }) => {
  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Overdue", path: "/overdue" },
  ]

  const adminMenuItems = [
    { label: "Team Members", path: "/admin/team-members", icon: FiUsers },
    { label: "Task Manager", path: "/admin/task-manager", icon: FiCheckSquare },
  ]

  return (
    <aside className="w-full max-w-[22rem] shrink-0 border-r border-slate-200 bg-slate-950 text-slate-100">
      <div className="px-8 py-10">
        <div className="mb-8 inline-flex rounded-full bg-slate-800 px-4 py-2 text-xs uppercase tracking-[0.35em] text-sky-300">
          Team Task Manager
        </div>
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Workspace</p>
          
        </div>
      </div>

      <div className="space-y-2 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-[1.5rem] px-5 py-4 text-sm font-semibold transition ${
                isActive ? "bg-slate-800 text-white shadow-lg shadow-slate-900/20" : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Admin Menu Items */}
      {user?.role === "admin" && (
        <div className="space-y-2 px-4 mt-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400 px-5">Admin</p>
          {adminMenuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-[1.5rem] px-5 py-4 text-sm font-semibold transition ${
                    isActive ? "bg-slate-800 text-white shadow-lg shadow-slate-900/20" : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            )
          })}
        </div>
      )}

      <div className="mt-10 rounded-[2rem] bg-slate-900 p-6 text-sm shadow-xl shadow-slate-900/40 ring-1 ring-white/5">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Signed in as</p>
        <p className="mt-3 text-lg font-semibold text-white">{user?.name}</p>
        <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
          {user?.role || "Member"}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
