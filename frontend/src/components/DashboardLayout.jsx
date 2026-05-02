import React from "react"
import Sidebar from "./Sidebar.jsx"
import Topbar from "./Topbar.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"

const DashboardLayout = ({ activeMenu, children }) => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[20rem_1fr]">
        <Sidebar user={user} />
        <main className="space-y-6 p-6 lg:p-8">
          <Topbar title={activeMenu || "Dashboard"} onLogout={logout} />
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
