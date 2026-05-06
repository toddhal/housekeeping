import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import defaultTasks from '../data/defaultTasks.js'

const TASKS_KEY = 'checklist:tasks'

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
  // Deep-clone defaults so edits never mutate the imported data.
  return JSON.parse(JSON.stringify(defaultTasks))
}

function uniqueId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function isAuthed() {
  try {
    return sessionStorage.getItem('isAdminAuth') === '1'
  } catch {
    return false
  }
}

const COLOR_OPTIONS = ['lpink', 'pink', 'teal', 'lteal', 'violet']

function SortableSection({ section, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-2xl shadow-sm border border-pink/20">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder section"
          className="touch-none cursor-grab active:cursor-grabbing px-2 py-2 text-gray-400"
        >
          ⋮⋮
        </button>
        {children.header}
      </div>
      <div className="p-3 space-y-3">{children.body}</div>
    </div>
  )
}

export default function AdminTasks() {
  const navigate = useNavigate()
  const [sections, setSections] = useState(loadTasks)
  const [savedAt, setSavedAt] = useState(null)
  const dirtyRef = useRef(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  useEffect(() => {
    if (!isAuthed()) navigate('/admin')
  }, [navigate])

  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections])

  const markDirty = () => {
    dirtyRef.current = true
    setSavedAt(null)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setSections((prev) => {
      const oldIdx = prev.findIndex((s) => s.id === active.id)
      const newIdx = prev.findIndex((s) => s.id === over.id)
      if (oldIdx < 0 || newIdx < 0) return prev
      return arrayMove(prev, oldIdx, newIdx)
    })
    markDirty()
  }

  const updateSection = (sectionId, patch) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)))
    markDirty()
  }

  const updateItem = (sectionId, subIdx, itemId, text) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const subSections = s.subSections.map((sub, i) => {
          if (i !== subIdx) return sub
          return {
            ...sub,
            items: sub.items.map((it) => (it.id === itemId ? { ...it, text } : it)),
          }
        })
        return { ...s, subSections }
      })
    )
    markDirty()
  }

  const addItem = (sectionId, subIdx) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const subSections = s.subSections.map((sub, i) => {
          if (i !== subIdx) return sub
          return {
            ...sub,
            items: [...sub.items, { id: uniqueId(sectionId), text: 'New task' }],
          }
        })
        return { ...s, subSections }
      })
    )
    markDirty()
  }

  const deleteItem = (sectionId, subIdx, itemId) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const subSections = s.subSections.map((sub, i) => {
          if (i !== subIdx) return sub
          return { ...sub, items: sub.items.filter((it) => it.id !== itemId) }
        })
        return { ...s, subSections }
      })
    )
    markDirty()
  }

  const addSubSection = (sectionId) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        return {
          ...s,
          subSections: [...s.subSections, { label: 'New group', items: [] }],
        }
      })
    )
    markDirty()
  }

  const deleteSection = (sectionId) => {
    if (!confirm('Delete this whole section?')) return
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
    markDirty()
  }

  const addSection = () => {
    const id = uniqueId('section')
    setSections((prev) => [
      ...prev,
      {
        id,
        emoji: '✨',
        title: `${prev.length + 1}. New Section`,
        color: 'pink',
        subSections: [{ label: '', items: [{ id: uniqueId(id), text: 'First task' }] }],
      },
    ])
    markDirty()
  }

  const handleSave = () => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(sections))
      // Trigger storage event in same tab so the cleaner view picks it up if open.
      window.dispatchEvent(new StorageEvent('storage', { key: TASKS_KEY }))
    } catch {
      /* ignore */
    }
    dirtyRef.current = false
    setSavedAt(new Date())
  }

  const handleResetDefaults = () => {
    if (!confirm('Reset all tasks to the defaults? This cannot be undone.')) return
    const fresh = JSON.parse(JSON.stringify(defaultTasks))
    setSections(fresh)
    try {
      localStorage.removeItem(TASKS_KEY)
      window.dispatchEvent(new StorageEvent('storage', { key: TASKS_KEY }))
    } catch {
      /* ignore */
    }
    dirtyRef.current = false
    setSavedAt(new Date())
  }

  return (
    <div
      className="min-h-screen px-4 pt-4 pb-24"
      style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}
    >
      <header className="flex items-center justify-between mb-4">
        <div>
          <Link to="/admin" className="text-xs text-pink underline">← Dashboard</Link>
          <h1 className="font-display text-2xl bg-gradient-to-r from-pink to-teal bg-clip-text text-transparent">
            Edit Tasks
          </h1>
        </div>
        {savedAt ? (
          <span className="text-xs text-teal">Saved ✓</span>
        ) : (
          <span className="text-xs text-gray-400">Unsaved</span>
        )}
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.map((section) => (
              <SortableSection key={section.id} section={section}>
                {{
                  header: (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        value={section.emoji}
                        onChange={(e) => updateSection(section.id, { emoji: e.target.value })}
                        className="w-10 text-center text-xl rounded-md border border-gray-200 px-1 py-1"
                        aria-label="Section emoji"
                      />
                      <input
                        value={section.title}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                        className="flex-1 font-display text-lg rounded-md border border-gray-200 px-2 py-1"
                        aria-label="Section title"
                      />
                      <select
                        value={section.color}
                        onChange={(e) => updateSection(section.id, { color: e.target.value })}
                        className="text-xs rounded-md border border-gray-200 px-1 py-1"
                        aria-label="Section color"
                      >
                        {COLOR_OPTIONS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => deleteSection(section.id)}
                        className="text-deep-pink p-2"
                        aria-label="Delete section"
                      >
                        🗑️
                      </button>
                    </div>
                  ),
                  body: (
                    <>
                      {section.subSections.map((sub, subIdx) => (
                        <div key={`${section.id}-sub-${subIdx}`} className="space-y-2">
                          <input
                            value={sub.label}
                            onChange={(e) => {
                              setSections((prev) =>
                                prev.map((s) => {
                                  if (s.id !== section.id) return s
                                  const next = s.subSections.map((ss, i) =>
                                    i === subIdx ? { ...ss, label: e.target.value } : ss
                                  )
                                  return { ...s, subSections: next }
                                })
                              )
                              markDirty()
                            }}
                            placeholder="Sub-section label (optional)"
                            className="w-full text-xs uppercase tracking-wider font-bold text-pink bg-pink-soft/50 rounded-md px-2 py-1"
                          />
                          <ul className="space-y-1">
                            {sub.items.map((item) => (
                              <li key={item.id} className="flex items-center gap-2">
                                <input
                                  value={item.text}
                                  onChange={(e) =>
                                    updateItem(section.id, subIdx, item.id, e.target.value)
                                  }
                                  className="flex-1 rounded-md border border-gray-200 px-2 py-2 text-sm min-h-[44px]"
                                />
                                <button
                                  type="button"
                                  onClick={() => deleteItem(section.id, subIdx, item.id)}
                                  className="p-2 text-deep-pink"
                                  aria-label="Delete task"
                                >
                                  🗑️
                                </button>
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            onClick={() => addItem(section.id, subIdx)}
                            className="text-xs text-teal underline"
                          >
                            + Add task
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addSubSection(section.id)}
                        className="text-xs text-violet underline"
                      >
                        + Add sub-section
                      </button>
                    </>
                  ),
                }}
              </SortableSection>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={addSection}
        className="w-full mt-4 rounded-2xl border-2 border-dashed border-pink/60 text-pink py-4 font-display"
      >
        + Add New Section
      </button>

      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-2 z-40"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={handleResetDefaults}
          className="flex-1 rounded-xl border border-gray-300 text-gray-700 py-3 text-sm"
        >
          Reset to Defaults
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-[2] rounded-xl bg-gradient-to-r from-pink to-teal text-white font-display py-3"
        >
          Save
        </button>
      </div>
    </div>
  )
}
