import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useChecklist from '../hooks/useChecklist.js'
import PaymentRequest from '../components/PaymentRequest.jsx'
import { getStartedAt, getDoneAt } from '../utils/notifications.js'

function formatDuration(ms) {
  if (!ms || ms < 0) return '—'
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export default function DoneView() {
  const navigate = useNavigate()
  const { resetChecklist } = useChecklist()
  const [elapsed, setElapsed] = useState('—')

  useEffect(() => {
    const start = getStartedAt()
    const done = getDoneAt() || new Date().toISOString()
    if (start) {
      setElapsed(formatDuration(new Date(done).getTime() - new Date(start).getTime()))
    }
  }, [])

  // Build payment URLs from env. Defaults are placeholders so dev still works.
  const cashtagRaw = import.meta.env.VITE_CASHAPP_CASHTAG || '$yourcashtag'
  const cashtag = cashtagRaw.startsWith('$') ? cashtagRaw : `$${cashtagRaw}`
  const amount = import.meta.env.VITE_CASHAPP_AMOUNT || ''
  const adminPhone = import.meta.env.VITE_ADMIN_PHONE || ''

  const cashAppUrl = amount
    ? `https://cash.app/${cashtag}/${amount}`
    : `https://cash.app/${cashtag}`

  // sms: link with body — works on iOS/Android. Empty `to` is allowed.
  const smsBody = encodeURIComponent(
    `Hey! I finished cleaning. Here's my Cash App: https://cash.app/${cashtag}`
  )
  const smsUrl = `sms:${adminPhone}${adminPhone ? '&' : '?'}body=${smsBody}`

  const handleStartOver = () => {
    resetChecklist()
    navigate('/')
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-5 py-10"
      style={{
        paddingTop: 'calc(2.5rem + env(safe-area-inset-top))',
        paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <div className="text-7xl mb-4">✅</div>
      <h1 className="font-display text-3xl bg-gradient-to-r from-pink to-teal bg-clip-text text-transparent">
        You're done! Amazing work! 🎉
      </h1>
      <p className="mt-3 text-gray-600">
        Time elapsed: <span className="font-semibold text-gray-800">{elapsed}</span>
      </p>

      <div className="mt-8 w-full max-w-sm">
        <PaymentRequest cashAppUrl={cashAppUrl} smsUrl={smsUrl} />
      </div>

      <button
        type="button"
        onClick={handleStartOver}
        className="mt-8 text-sm text-pink underline underline-offset-2"
      >
        Start Over
      </button>
    </div>
  )
}
