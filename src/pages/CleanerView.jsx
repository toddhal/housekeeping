import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useChecklist from '../hooks/useChecklist.js'
import ChecklistSection from '../components/ChecklistSection.jsx'
import MusicPlayer from '../components/MusicPlayer.jsx'
import HouseSelector from '../components/HouseSelector.jsx'
import houses from '../data/houses.js'

export default function CleanerView() {
  const navigate = useNavigate()
  const [activeHouseId, setActiveHouseId] = useState(() => {
    try {
      return localStorage.getItem('activeHouse') || 'home'
    } catch {
      return 'home'
    }
  })
  const activeHouse = houses.find((h) => h.id === activeHouseId) || houses[0]

  const {
    sections,
    checkedItems,
    toggleItem,
    resetChecklist,
    totalItems,
    completedItems,
    isComplete,
  } = useChecklist(activeHouseId)

  const firedRef = useRef(false)
  useEffect(() => {
    if (!isComplete || firedRef.current) return
    firedRef.current = true

    const confetti = typeof window !== 'undefined' ? window.confetti : null
    if (typeof confetti === 'function') {
      const end = Date.now() + 1500
      const colors = ['#f472b6', '#14b8a6', '#a78bfa', '#fb7185', '#2dd4bf']
      const frame = () => {
        confetti({
          particleCount: 4,
          startVelocity: 35,
          spread: 70,
          origin: { x: Math.random(), y: Math.random() * 0.4 },
          colors,
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }

    const t = setTimeout(() => navigate('/done'), 2000)
    return () => clearTimeout(t)
  }, [isComplete, navigate])

  // Reset the firedRef when switching houses so the done flow can fire again
  // for the new house.
  useEffect(() => {
    firedRef.current = false
  }, [activeHouseId])

  const pct = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100)
  const anyChecked = Object.values(checkedItems).some(Boolean)

  const handleSwitchHouse = (id) => {
    setActiveHouseId(id)
    try {
      localStorage.setItem('activeHouse', id)
    } catch {
      /* ignore */
    }
  }

  const handleReset = () => {
    if (!window.confirm('Reset all tasks for this house?')) return
    resetChecklist()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ paddingBottom: 'calc(140px + env(safe-area-inset-bottom))' }}
    >
      <header
        className="bg-gradient-to-r from-pink to-teal text-white px-4 pt-6 pb-5"
        style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl leading-tight">🏠 House Cleaning Checklist</h1>
            <p className="mt-1 text-sm opacity-95">Follow in order — you've got this! ✨</p>
          </div>
          {anyChecked ? (
            <button
              type="button"
              onClick={handleReset}
              className="shrink-0 self-start min-h-[44px] rounded-full border border-white/60 text-white text-sm px-3 py-2 hover:bg-white/10 active:bg-white/20 transition"
            >
              ↺ Reset
            </button>
          ) : null}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span>{completedItems} of {totalItems} tasks</span>
            <span>{pct}%</span>
          </div>
          <div className="h-3 w-full bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink to-teal transition-[width] duration-500 ease-out"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #fff 0%, #fdf2f8 50%, #f0fdfa 100%)',
              }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 space-y-4">
        <HouseSelector
          houses={houses}
          activeHouseId={activeHouseId}
          onSwitch={handleSwitchHouse}
        />

        <div className="rounded-2xl border-2 border-dashed border-pink/60 bg-pink-soft/70 p-3 text-sm text-pink-900">
          {activeHouse.introNote}
        </div>

        {sections.map((section) => (
          <ChecklistSection
            key={section.id}
            section={section}
            checkedItems={checkedItems}
            onToggle={toggleItem}
          />
        ))}

        {isComplete ? (
          <div className="rounded-2xl bg-gradient-to-r from-pink to-teal text-white p-4 text-center font-display text-xl">
            🎉 All done! Sending you to the finish line...
          </div>
        ) : null}
      </main>

      <MusicPlayer />
    </div>
  )
}
