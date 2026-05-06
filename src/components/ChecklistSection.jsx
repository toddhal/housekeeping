import ChecklistItem from './ChecklistItem.jsx'

// Maps the section.color key to Tailwind classes for header background,
// section card border, sub-section label color, and checked-checkbox fill.
const COLOR_MAP = {
  lpink: {
    headerBg: 'bg-lpink',
    headerText: 'text-pink-900',
    border: 'border-pink/30',
    label: 'text-pink',
    fill: 'bg-pink',
  },
  pink: {
    headerBg: 'bg-pink',
    headerText: 'text-white',
    border: 'border-pink/40',
    label: 'text-pink',
    fill: 'bg-pink',
  },
  teal: {
    headerBg: 'bg-teal',
    headerText: 'text-white',
    border: 'border-teal/40',
    label: 'text-teal',
    fill: 'bg-teal',
  },
  lteal: {
    headerBg: 'bg-lteal',
    headerText: 'text-teal-900',
    border: 'border-teal/30',
    label: 'text-teal',
    fill: 'bg-teal',
  },
  violet: {
    headerBg: 'bg-violet',
    headerText: 'text-white',
    border: 'border-violet/40',
    label: 'text-violet',
    fill: 'bg-violet',
  },
}

export default function ChecklistSection({ section, checkedItems, onToggle }) {
  const colors = COLOR_MAP[section.color] || COLOR_MAP.pink

  return (
    <section
      className={`rounded-2xl bg-white/60 shadow-sm border ${colors.border} overflow-hidden`}
    >
      <header className={`${colors.headerBg} ${colors.headerText} px-4 py-3 flex items-center gap-2`}>
        <span className="text-2xl" aria-hidden>{section.emoji}</span>
        <h2 className="font-display text-xl">{section.title}</h2>
        {section.optional ? (
          <span className="ml-auto text-xs uppercase tracking-wider opacity-80">Optional</span>
        ) : null}
      </header>
      <div className="p-3 space-y-4">
        {section.subSections?.map((sub, idx) => (
          <div key={`${section.id}-sub-${idx}`} className="space-y-2">
            {sub.label ? (
              <h3
                className={`text-xs font-bold uppercase tracking-wider ${colors.label}`}
              >
                {sub.label}
              </h3>
            ) : null}
            <ul className="space-y-2">
              {sub.items.map((item) => (
                <li key={item.id}>
                  <ChecklistItem
                    item={item}
                    checked={!!checkedItems[item.id]}
                    onToggle={onToggle}
                    accentClass={colors.fill}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
