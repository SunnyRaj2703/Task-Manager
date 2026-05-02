import React from "react"

const Topbar = ({ title, onLogout }) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white px-6 py-5 shadow-xl shadow-slate-200/40">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Dashboard</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <input
            type="search"
            placeholder="Search projects"
            className="w-full min-w-[16rem] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          />
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">⏻</span>
          Sign out
        </button>
      </div>
    </header>
  )
}

export default Topbar
