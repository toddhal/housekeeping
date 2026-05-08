import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import houses from '../data/houses'
import { notifyDone, notifyStart, resetNotificationFlags } from '../utils/notifications.js'

function tasksKey(houseId) {
  return `tasks_${houseId}`
}
function stateKey(houseId) {
  return `checklist_state_${houseId}`
}

function lookupHouse(houseId) {
  return houses.find((h) => h.id === houseId) || houses[0]
}

function loadTasks(houseId) {
  const house = lookupHouse(houseId)
  try {
    const raw = localStorage.getItem(tasksKey(houseId))
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    /* ignore */
  }
  return house.tasks
}

function loadChecked(houseId) {
  try {
    const raw = localStorage.getItem(stateKey(houseId))
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
  // Optional sections (e.g. "Extra") don't count toward completion.
  for (const section of sections.filter((s) => !s.optional)) {
    for (const sub of section.subSections || []) {
      for (const item of sub.items || []) items.push(item)
    }
  }
  return items
}

export default function useChecklist(houseId = 'home') {
  const [sections, setSections] = useState(() => loadTasks(houseId))
  const [checkedItems, setCheckedItems] = useState(() => loadChecked(houseId))
  const wasComplete = useRef(false)

  // House switch — reload tasks + checked state from the active house's keys.
  useEffect(() => {
    setSections(loadTasks(houseId))
    setCheckedItems(loadChecked(houseId))
    wasComplete.current = false
  }, [houseId])

  // Cross-tab / admin-edit sync.
  useEffect(() => {
    function onStorage(e) {
      if (!e.key) return
      if (e.key === tasksKey(houseId)) setSections(loadTasks(houseId))
      if (e.key === stateKey(houseId)) setCheckedItems(loadChecked(houseId))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [houseId])

  // Persist checked state under the active house's key.
  useEffect(() => {
    try {
      localStorage.setItem(stateKey(houseId), JSON.stringify(checkedItems))
    } catch {
      /* ignore */
    }
  }, [checkedItems, houseId])

  const allItems = useMemo(() => flattenItems(sections), [sections])
  const totalItems = allItems.length
  const completedItems = useMemo(
    () => allItems.reduce((acc, it) => acc + (checkedItems[it.id] ? 1 : 0), 0),
    [allItems, checkedItems]
  )
  const isComplete = totalItems > 0 && completedItems === totalItems

  // Fire notifyDone exactly once when this house transitions to complete.
  useEffect(() => {
    if (isComplete && !wasComplete.current) {
      wasComplete.current = true
      const house = lookupHouse(houseId)
      notifyDone({ houseId, houseLabel: house.label, totalItems, completedItems })
    }
    if (!isComplete) wasComplete.current = false
  }, [isComplete, totalItems, completedItems, houseId])

  const toggleItem = useCallback(
    (id) => {
      setCheckedItems((prev) => {
        const next = { ...prev, [id]: !prev[id] }
        const prevAnyChecked = Object.values(prev).some(Boolean)
        const nextAnyChecked = Object.values(next).some(Boolean)
        if (!prevAnyChecked && nextAnyChecked) {
          const house = lookupHouse(houseId)
          notifyStart(houseId, house.label)
        }
        return next
      })
    },
    [houseId]
  )

  const resetChecklist = useCallback(() => {
    setCheckedItems({})
    try {
      localStorage.removeItem(stateKey(houseId))
    } catch {
      /* ignore */
    }
    resetNotificationFlags(houseId)
    wasComplete.current = false
  }, [houseId])

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
