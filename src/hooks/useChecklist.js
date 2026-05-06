import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import defaultTasks from '../data/defaultTasks.js'
import { notifyDone, notifyStart, resetNotificationFlags } from '../utils/notifications.js'

const TASKS_KEY = 'checklist:tasks'
const CHECKED_KEY = 'checklist:checked'

function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    /* ignore */
  }
  return defaultTasks
}

function loadChecked() {
  try {
    const raw = localStorage.getItem(CHECKED_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
    }
  } catch {
    /* ignore */
  }
  return {}
}

function flattenItems(sections) {
  const items = []
  for (const section of sections.filter(s => !s.optional)) {
    for (const sub of section.subSections || []) {
      for (const item of sub.items || []) items.push(item)
    }
  }
  return items
}

export default function useChecklist() {
  const [sections, setSections] = useState(loadTasks)
  const [checkedItems, setCheckedItems] = useState(loadChecked)

  // Re-read tasks when admin saves new ones in another tab.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === TASKS_KEY) setSections(loadTasks())
      if (e.key === CHECKED_KEY) setCheckedItems(loadChecked())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Persist checked state.
  useEffect(() => {
    try {
      localStorage.setItem(CHECKED_KEY, JSON.stringify(checkedItems))
    } catch {
      /* ignore */
    }
  }, [checkedItems])

  const allItems = useMemo(() => flattenItems(sections), [sections])
  const totalItems = allItems.length
  const completedItems = useMemo(
    () => allItems.reduce((acc, it) => acc + (checkedItems[it.id] ? 1 : 0), 0),
    [allItems, checkedItems]
  )
  const isComplete = totalItems > 0 && completedItems === totalItems

  // Fire notifyDone exactly once on completion edge.
  const wasComplete = useRef(false)
  useEffect(() => {
    if (isComplete && !wasComplete.current) {
      wasComplete.current = true
      notifyDone({ totalItems, completedItems })
    }
    if (!isComplete) wasComplete.current = false
  }, [isComplete, totalItems, completedItems])

  const toggleItem = useCallback(
    (id) => {
      setCheckedItems((prev) => {
        const next = { ...prev, [id]: !prev[id] }
        // Detect "first item checked" transition (no items checked before, one after).
        const prevAnyChecked = Object.values(prev).some(Boolean)
        const nextAnyChecked = Object.values(next).some(Boolean)
        if (!prevAnyChecked && nextAnyChecked) notifyStart()
        return next
      })
    },
    []
  )

  const resetChecklist = useCallback(() => {
    setCheckedItems({})
    try {
      localStorage.removeItem(CHECKED_KEY)
    } catch {
      /* ignore */
    }
    resetNotificationFlags()
    wasComplete.current = false
  }, [])

  return {
    sections,
    checkedItems,
    toggleItem,
    resetChecklist,
    totalItems,
    completedItems,
    isComplete,
  }
}
