// One row of the checklist. Big tap target (>=44px) for phone use.
export default function ChecklistItem({ item, checked, onToggle, accentClass }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(item.id)}
      className={[
        'w-full flex items-start gap-3 text-left rounded-xl px-3 py-3 min-h-[52px]',
        'bg-white/70 hover:bg-white active:bg-white check-anim',
        checked ? 'opacity-60' : 'opacity-100',
      ].join(' ')}
      aria-pressed={checked}
    >
      <span
        className={[
          'shrink-0 mt-0.5 w-7 h-7 rounded-md border-2 flex items-center justify-center check-anim',
          checked ? `${accentClass} border-transparent text-white` : 'bg-white border-gray-300 text-transparent',
        ].join(' ')}
        aria-hidden="true"
      >
        {/* Checkmark */}
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 10.5L8 14.5L16 6.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={[
          'flex-1 text-base leading-snug check-anim',
          checked ? 'line-through text-gray-500' : 'text-gray-800',
        ].join(' ')}
      >
        {item.text}
      </span>
    </button>
  )
}
