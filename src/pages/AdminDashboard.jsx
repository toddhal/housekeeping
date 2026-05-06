import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminLogin from '../components/AdminLogin.jsx'

function isAuthed() {
  try {
    return sessionStorage.getItem('isAdminAuth') === '1'
  } catch {
    return false
  }
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(isAuthed())
  const navigate = useNavigate()

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('isAdminAuth')
    } catch {
      /* ignore */
    }
    setAuthed(false)
    navigate('/admin')
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <AdminLogin onSuccess={() => setAuthed(true)} />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen px-4 py-6"
      style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}
    >
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl bg-gradient-to-r from-pink to-teal bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500">Welcome back!</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm rounded-full border border-pink/50 text-pink px-3 py-1.5 hover:bg-pink/10"
        >
          Log out
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <Link
          to="/admin/tasks"
          className="block rounded-2xl bg-white shadow-md p-5 border border-pink/30 active:scale-[0.99] transition"
        >
          <div className="text-3xl mb-1">📝</div>
          <div className="font-display text-xl text-pink">Edit Tasks</div>
          <div className="text-sm text-gray-600">Add, edit, reorder, or remove cleaning tasks.</div>
        </Link>

        <Link
          to="/admin/history"
          className="block rounded-2xl bg-white shadow-md p-5 border border-teal/30 active:scale-[0.99] transition"
        >
          <div className="text-3xl mb-1">📊</div>
          <div className="font-display text-xl text-teal">View History</div>
          <div className="text-sm text-gray-600">See past cleaning sessions and durations.</div>
        </Link>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-sm text-gray-500 underline">
          ← Back to cleaner view
        </Link>
      </div>
    </div>
  )
}
