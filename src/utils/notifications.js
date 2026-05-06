// Stubbed notification helpers. Right now they just log + persist a timestamp
// so the rest of the app can wire up start/done events. Twilio SMS will be
// wired in later via the Netlify function in netlify/functions/sendSms.js.

const START_KEY = 'checklist:startedAt'
const DONE_KEY = 'checklist:doneAt'
const START_FIRED = 'checklist:startFired'
const DONE_FIRED = 'checklist:doneFired'
const HISTORY_KEY = 'checklist:history'

function isFired(key) {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function setFired(key, value) {
  try {
    if (value) localStorage.setItem(key, '1')
    else localStorage.removeItem(key)
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

export function notifyStart() {
  if (isFired(START_FIRED)) return
  const now = new Date().toISOString()
  try {
    localStorage.setItem(START_KEY, now)
  } catch {}
  setFired(START_FIRED, true)
  // eslint-disable-next-line no-console
  console.log('[notifyStart] Cleaning has started!', now)
  sendSms('🧹 Cleaning has started!')
}

export function notifyDone({ totalItems = 0, completedItems = 0 } = {}) {
  if (isFired(DONE_FIRED)) return
  const now = new Date().toISOString()
  let startedAt = null
  try {
    startedAt = localStorage.getItem(START_KEY)
    localStorage.setItem(DONE_KEY, now)
  } catch {}
  setFired(DONE_FIRED, true)

  // Append session to history.
  try {
    const start = startedAt ? new Date(startedAt) : new Date(now)
    const end = new Date(now)
    const durationMs = Math.max(0, end.getTime() - start.getTime())
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    history.push({
      date: end.toISOString().slice(0, 10),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: durationMs,
      itemsCompleted: completedItems,
      totalItems,
    })
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    /* ignore */
  }

  // eslint-disable-next-line no-console
  console.log('[notifyDone] Cleaning is complete!', now)
  sendSms('✅ Cleaning is complete! Payment request sent.')
}

// Called by the hook's resetChecklist so a fresh session can fire again.
export function resetNotificationFlags() {
  setFired(START_FIRED, false)
  setFired(DONE_FIRED, false)
  try {
    localStorage.removeItem(START_KEY)
    localStorage.removeItem(DONE_KEY)
  } catch {
    /* ignore */
  }
}

export function getStartedAt() {
  try {
    return localStorage.getItem(START_KEY)
  } catch {
    return null
  }
}

export function getDoneAt() {
  try {
    return localStorage.getItem(DONE_KEY)
  } catch {
    return null
  }
}
