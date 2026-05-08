import { Routes, Route, Navigate, Link } from 'react-router-dom'
import CleanerView from './pages/CleanerView.jsx'
import DoneView from './pages/DoneView.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminTasks from './pages/AdminTasks.jsx'
import AdminHistory from './pages/AdminHistory.jsx'

function isAdminAuthed() {
  try {
    return !!sessionStorage.getItem('adminToken')
  } catch {
    return false
  }
}

// Guards admin sub-routes; bounces unauthenticated users to /admin login.
function AdminRoute({ children }) {
  if (!isAdminAuthed()) return <Navigate to="/admin" replace />
  return children
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="text-6xl mb-3">🧹</div>
      <h1 className="font-display text-3xl bg-gradient-to-r from-pink to-teal bg-clip-text text-transparent">
        Page not found
      </h1>
      <p className="text-gray-500 mt-2">That page swept itself away.</p>
      <Link to="/" className="mt-6 rounded-full bg-pink text-white px-5 py-2 font-display">
        Go home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CleanerView />} />
      <Route path="/done" element={<DoneView />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route
        path="/admin/tasks"
        element={
          <AdminRoute>
            <AdminTasks />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/history"
        element={
          <AdminRoute>
            <AdminHistory />
          </AdminRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
