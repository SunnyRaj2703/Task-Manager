import React from "react"
import { Routes, Route } from "react-router-dom"
import Login from "./pages/auth/Login.jsx"
import Signup from "./pages/auth/Signup.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Overdue from "./pages/Overdue.jsx"
import ProjectView from "./pages/ProjectView.jsx"
import NotFound from "./pages/NotFound.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import AdminRoute from "./components/AdminRoute.jsx"
import TeamMembers from "./pages/admin/TeamMembers.jsx"
import TaskManager from "./pages/admin/TaskManager.jsx"

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}> 
        <Route path="/" element={<Dashboard />} />
        <Route path="/overdue" element={<Overdue />} />
        <Route path="/projects/:projectId" element={<ProjectView />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin/team-members" element={<TeamMembers />} />
        <Route path="/admin/task-manager" element={<TaskManager />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
