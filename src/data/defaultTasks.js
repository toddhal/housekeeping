// Default cleaning checklist data.
// Each section has an id, emoji, title, color key (lpink | pink | teal | lteal | violet),
// and one or more subSections. Sub-sections without a heading use an empty `label`.
const defaultTasks = [
  {
    id: 'kitchen',
    emoji: '🍽️',
    title: '1. Kitchen',
    color: 'lpink',
    subSections: [
      {
        label: 'Dishes',
        items: [
          { id: 'kitchen-1', text: 'Load any dirty dishes from sink + counters into dishwasher' },
          { id: 'kitchen-2', text: 'Start dishwasher' },
        ],
      },
      {
        label: 'Counters & Sink',
        items: [
          { id: 'kitchen-3', text: 'Clear + wipe countertops' },
          { id: 'kitchen-4', text: 'Clean sink' },
        ],
      },
      {
        label: 'Flat Top Stovetop — cleaner + scrubber are under the sink',
        items: [
          { id: 'kitchen-5', text: 'Apply flat top cleaner and scrub thoroughly' },
          { id: 'kitchen-6', text: 'Wipe clean and buff dry' },
        ],
      },
      {
        label: 'Stainless Appliances — stainless spray is under the sink',
        items: [
          { id: 'kitchen-7', text: 'Fridge — spray and wipe with the grain to remove fingerprints' },
          { id: 'kitchen-8', text: 'Hood/Vent — spray and wipe' },
          { id: 'kitchen-9', text: 'Stove exterior — spray and wipe' },
          { id: 'kitchen-10', text: 'Dishwasher front — spray and wipe' },
        ],
      },
    ],
  },
  {
    id: 'bathrooms',
    emoji: '🛁',
    title: '2. Bathrooms',
    color: 'lteal',
    subSections: [
      {
        label: 'Both Bathrooms',
        items: [
          { id: 'bath-1', text: 'Wipe countertops' },
          { id: 'bath-2', text: 'Clean mirrors' },
          { id: 'bath-3', text: "General tidy (put items away, straighten, make sure there's TP)" },
          { id: 'bath-4', text: 'Empty small trash can' },
          { id: 'bath-5', text: 'Replace liner (bags are under the sink)' },
        ],
      },
      {
        label: 'Guest Bathroom — Tub',
        items: [
          { id: 'bath-6', text: 'Spray tub/shower cleaner, let sit 3–5 minutes, then scrub thoroughly' },
          { id: 'bath-7', text: 'Rinse clean' },
        ],
      },
      {
        label: 'Master Bathroom — Tile Shower',
        items: [
          { id: 'bath-8', text: 'Spray tile walls and floor of shower' },
          { id: 'bath-9', text: 'Scrub tiles and grout' },
          { id: 'bath-10', text: 'Rinse clean' },
        ],
      },
    ],
  },
  {
    id: 'living',
    emoji: '🛋️',
    title: '3. Living Areas',
    color: 'pink',
    subSections: [
      {
        label: '',
        items: [
          { id: 'living-1', text: 'Pick up and straighten clutter' },
          { id: 'living-2', text: 'Fluff pillows / fold blankets' },
          { id: 'living-3', text: 'Wipe/dust surfaces' },
        ],
      },
    ],
  },
  {
    id: 'bedrooms',
    emoji: '🛏️',
    title: '4. Bedrooms',
    color: 'teal',
    subSections: [
      {
        label: '',
        items: [
          { id: 'bedrooms-1', text: 'Pick up clutter in both bedrooms' },
          { id: 'bedrooms-2', text: 'Vacuum carpet in both upstairs bedrooms' },
        ],
      },
    ],
  },
  {
    id: 'floors',
    emoji: '🧹',
    title: '5. Floors',
    color: 'violet',
    subSections: [
      {
        label: 'Upstairs Bedrooms — Carpet (Cordless Vacuum)',
        items: [
          { id: 'floors-1', text: 'Vacuum both carpeted bedrooms thoroughly' },
          { id: 'floors-2', text: 'Vacuum upstairs hallway' },
        ],
      },
      {
        label: 'Downstairs — Hardwood & Tile (Swiffer)',
        items: [
          { id: 'floors-3', text: 'Dry sweep all hardwood and tile areas first' },
          { id: 'floors-4', text: 'Wet mop all hardwood and tile areas' },
        ],
      },
    ],
  },
  {
    id: 'trash',
    emoji: '🗑️',
    title: '6. Trash & Recycling',
    color: 'lpink',
    subSections: [
      {
        label: '',
        items: [
          { id: 'trash-1', text: 'Take out kitchen trash + recycling' },
          { id: 'trash-2', text: 'Replace kitchen liner (bags are under the sink)' },
          { id: 'trash-3', text: 'Take all trash to bins outside' },
        ],
      },
    ],
  },
  {
    id: 'extra',
    emoji: '✨',
    title: 'Extra (optional)',
    color: 'violet',
    optional: true,
    subSections: [
      {
        label: '',
        items: [
          { id: 'extra-1', text: 'Wipe light switches / door handles' },
          { id: 'extra-2', text: 'Quick fridge clean (inside)' },
        ],
      },
    ],
  },
]

export default defaultTasks
