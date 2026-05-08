// Per-house notification helpers. State is scoped under house-specific
// localStorage keys so each house has independent start/done events.
//
// History is a single shared list (`checklist:history`) — each entry includes
// a `house` label so the admin can see which house each session belonged to.

const HISTORY_KEY = 'checklist:history'

function notifyKey(houseId) {
  return `notify_fired_${houseId}`
}
function sessionKey(houseId) {
  return `session_${houseId}`
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

function sendSms(message) {
  const to = import.meta.env.VITE_ADMIN_PHONE
  if (!to) return
  try {
    fetch('/.netlify/functions/sendSms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-secret': import.meta.env.VITE_APP_SECRET,
      },
      body: JSON.stringify({ to, message }),
    }).catch(() => {
      /* swallow network errors — SMS is best-effort */
    })
  } catch {
    /* ignore */
  }
}

export function notifyStart(houseId, houseLabel = '') {
  const fired = readJson(notifyKey(houseId), {})
  if (fired.start) return
  const now = new Date().toISOString()
  const session = readJson(sessionKey(houseId), {}) || {}
  session.startedAt = now
  session.endedAt = null
  writeJson(sessionKey(houseId), session)
  writeJson(notifyKey(houseId), { ...fired, start: true })
  // eslint-disable-next-line no-console
  console.log(`[notifyStart] ${houseLabel || houseId} cleaning has started!`, now)
  sendSms(`🧹 ${houseLabel ? `${houseLabel}: ` : ''}Cleaning has started!`)
}

export function notifyDone({ houseId, houseLabel = '', totalItems = 0, completedItems = 0 }) {
  const fired = readJson(notifyKey(houseId), {})
  if (fired.done) return
  const now = new Date().toISOString()
  const session = readJson(sessionKey(houseId), {}) || {}
  const startedAt = session.startedAt || now
  session.endedAt = now
  writeJson(sessionKey(houseId), session)
  writeJson(notifyKey(houseId), { ...fired, done: true })

  // Append to shared history with house label.
  try {
    const start = new Date(startedAt)
    const end = new Date(now)
    const durationMs = Math.max(0, end.getTime() - start.getTime())
    const history = readJson(HISTORY_KEY, [])
    history.push({
      date: end.toISOString().slice(0, 10),
      house: houseLabel || houseId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: durationMs,
      itemsCompleted: completedItems,
      totalItems,
    })
    writeJson(HISTORY_KEY, history)
  } catch {
    /* ignore */
  }

  // eslint-disable-next-line no-console
  console.log(`[notifyDone] ${houseLabel || houseId} cleaning is complete!`, now)
  sendSms(`✅ ${houseLabel ? `${houseLabel}: ` : ''}Cleaning is complete! Payment request sent.`)
}

export function resetNotificationFlags(houseId) {
  try {
    localStorage.removeItem(notifyKey(houseId))
    localStorage.removeItem(sessionKey(houseId))
  } catch {
    /* ignore */
  }
}

export function getStartedAt(houseId) {
  const session = readJson(sessionKey(houseId), null)
  return session?.startedAt || null
}

export function getDoneAt(houseId) {
  const session = readJson(sessionKey(houseId), null)
  return session?.endedAt || null
}
