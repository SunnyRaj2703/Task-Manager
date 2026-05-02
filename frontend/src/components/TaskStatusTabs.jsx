import React from "react"

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          type="button"
          onClick={() => setActiveTab(tab.label)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeTab === tab.label
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {tab.label}
          <span className="ml-2 text-xs text-slate-500">{tab.count}</span>
        </button>
      ))}
    </div>
  )
}

export default TaskStatusTabs
