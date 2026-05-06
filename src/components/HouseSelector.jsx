// Pill-style toggle for switching between houses. Switching does NOT reset
// progress — the hook just re-loads from the new house's localStorage keys.
export default function HouseSelector({ houses, activeHouseId, onSwitch }) {
  return (
    <div
      className="flex gap-2 p-1 rounded-full bg-white/70 border border-pink/30 shadow-sm w-full"
      role="tablist"
      aria-label="Select house"
    >
      {houses.map((house) => {
        const active = house.id === activeHouseId
        return (
          <button
            key={house.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSwitch(house.id)}
            className={[
              'flex-1 min-h-[44px] rounded-full font-display text-sm transition-all duration-200',
              'px-3 py-2',
              active
                ? 'bg-pink text-white scale-[1.03] shadow-md'
                : 'bg-white text-pink border border-pink/60',
            ].join(' ')}
          >
            <span className="mr-1" aria-hidden>{house.emoji}</span>
            {house.label}
          </button>
        )
      })}
    </div>
  )
}
