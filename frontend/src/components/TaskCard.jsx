import React from "react"

const TaskCard = ({ task }) => {
  const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() && task.status !== "Done" : false

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h4 className="text-base font-semibold text-slate-900">{task.title}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">{task.description || "No details provided"}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          task.status === "Done"
            ? "bg-emerald-100 text-emerald-700"
            : task.status === "In Progress"
            ? "bg-sky-100 text-sky-700"
            : "bg-amber-100 text-amber-700"
        }`}>
          {task.status}
        </span>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 text-sm text-slate-500">
        <span>Assigned to: <span className="font-medium text-slate-700">{task.assignedTo?.name || "Unassigned"}</span></span>
        <span>Due: <span className="font-medium text-slate-700">{new Date(task.dueDate).toLocaleDateString()}</span></span>
      </div>
      {isOverdue && <div className="mt-4 rounded-3xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">Overdue task</div>}
    </div>
  )
}

export default TaskCard
