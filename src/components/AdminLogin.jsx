import { useState } from 'react'

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const expected = import.meta.env.VITE_ADMIN_PASSWORD
    // If no password is configured, accept anything in dev so the homeowner can still get in.
    // The real password should be set via env var in production.
    if (!expected || password === expected) {
      try {
        sessionStorage.setItem('isAdminAuth', '1')
      } catch {
        /* ignore */
      }
      onSuccess?.()
    } else {
      setError('Incorrect password')
      setPassword('')
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
        className="w-full bg-gradient-to-r from-pink to-teal text-white font-display text-lg py-3 rounded-xl active:scale-[0.99] transition"
      >
        Log In
      </button>
    </form>
  )
}
