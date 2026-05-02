import React from "react"

const ProjectCard = ({ project, taskCount, onView }) => {
  const badgeLabel = project.overdueTaskCount ? "Overdue" : project.dueSoonTaskCount ? "Due soon" : null
  const badgeClass = project.overdueTaskCount
    ? "bg-rose-100 text-rose-700"
    : project.dueSoonTaskCount
    ? "bg-amber-100 text-amber-700"
    : "bg-slate-100 text-slate-600"

  return (
    <div className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{project.description || "No description provided"}</p>
        </div>
        <button
          onClick={() => onView(project._id)}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-slate-700"
        >
          View
        </button>
      </div>
      {badgeLabel && (
        <div className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {badgeLabel}
        </div>
      )}
      <div className="mt-5 grid gap-3 text-sm text-slate-500 sm:grid-cols-3">
        <span>{taskCount || project.taskCount || 0} tasks</span>
        <span>{project.members.length} members</span>
        {project.dueDate && (
          <span>Due: <span className="font-medium text-slate-700">{new Date(project.dueDate).toLocaleDateString()}</span></span>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
