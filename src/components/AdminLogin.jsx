import { useState } from 'react'

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/.netlify/functions/verifyAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('Incorrect password')
        setPassword('')
        return
      }
      const data = await res.json()
      if (!data.token) {
        setError('Login failed')
        return
      }
      try {
        sessionStorage.setItem('adminToken', data.token)
      } catch {
        /* ignore */
      }
      onSuccess?.()
    } catch {
      setError('Network error — please try again')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 space-y-4"
    >
      <h2 className="font-display text-2xl text-pink">Admin Login</h2>
      <p className="text-sm text-gray-600">Enter the admin password to manage tasks and view history.</p>
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          if (error) setError('')
        }}
        placeholder="Password"
        autoFocus
        className="w-full rounded-xl border border-pink/40 px-3 py-3 outline-none focus:border-pink focus:ring-2 focus:ring-pink/30"
      />
      {error ? <p className="text-sm text-deep-pink">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-pink to-teal text-white font-display text-lg py-3 rounded-xl active:scale-[0.99] transition disabled:opacity-60"
      >
        {submitting ? 'Checking…' : 'Log In'}
      </button>
    </form>
  )
}
