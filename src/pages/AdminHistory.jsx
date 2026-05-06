import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const HISTORY_KEY = 'checklist:history'

function isAuthed() {
  try {
    return sessionStorage.getItem('isAdminAuth') === '1'
  } catch {
    return false
  }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function formatDuration(ms) {
  if (!ms || ms < 0) return '—'
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m || 1}m`
}

function formatTime(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  } catch {
    return '—'
  }
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function AdminHistory() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState(() => loadHistory())

  useEffect(() => {
    if (!isAuthed()) navigate('/admin')
  }, [navigate])

  // Newest first.
  const sorted = [...sessions].sort((a, b) => {
    const ta = new Date(a.endTime || a.startTime || 0).getTime()
    const tb = new Date(b.endTime || b.startTime || 0).getTime()
    return tb - ta
  })

  const handleClear = () => {
    if (!confirm('Clear all session history? This cannot be undone.')) return
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch {
      /* ignore */
    }
    setSessions([])
  }

  return (
    <div
      className="min-h-screen px-4 pt-4 pb-10"
      style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}
    >
      <header className="mb-4">
        <Link to="/admin" className="text-xs text-pink underline">← Dashboard</Link>
        <div className="flex items-center justify-between mt-1">
          <h1 className="font-display text-2xl bg-gradient-to-r from-pink to-teal bg-clip-text text-transparent">
            Session History
          </h1>
          <button
            type="button"
            onClick={handleClear}
            disabled={!sorted.length}
            className="text-xs rounded-full border border-deep-pink text-deep-pink px-3 py-1.5 disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-pink/40 bg-pink-soft/40 p-6 text-center text-gray-600">
          No sessions yet. Once a cleaning session finishes, it'll show up here.
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((s, i) => {
            const pct = s.totalItems > 0 ? Math.round((s.itemsCompleted / s.totalItems) * 100) : 0
            return (
              <li key={`${s.endTime || s.startTime}-${i}`} className="rounded-2xl bg-white shadow-sm p-4 border border-pink/20">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-display text-lg text-pink">{formatDate(s.date || s.endTime || s.startTime)}</div>
                  <div className="text-xs px-2 py-1 rounded-full bg-teal-soft text-teal">{pct}%</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">Start</div>
                    <div>{formatTime(s.startTime)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">End</div>
                    <div>{formatTime(s.endTime)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">Duration</div>
                    <div>{formatDuration(s.duration)}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {s.itemsCompleted} of {s.totalItems} tasks completed
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
