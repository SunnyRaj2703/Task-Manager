import React from "react"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-10 shadow-xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">404 error</p>
        <h1 className="mt-6 text-5xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-4 text-sm text-slate-500">The page you are looking for doesn’t exist or has been moved.</p>
        <Link to="/" className="mt-8 inline-flex rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          Go back home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
