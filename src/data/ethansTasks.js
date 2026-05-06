// Cleaning checklist for Ethan's house. Same shape as defaultTasks.js.
const ethansTasks = [
  {
    id: 'laundry',
    emoji: '🧺',
    title: '1. Laundry — Start Immediately!',
    color: 'pink',
    subSections: [
      {
        label: '',
        items: [
          { id: 'laundry-1', text: 'Strip master bedroom bed sheets and pillow cases' },
          { id: 'laundry-2', text: 'Start washer right away' },
          { id: 'laundry-3', text: 'Move to dryer as soon as done' },
        ],
      },
    ],
  },
  {
    id: 'tineco-prep',
    emoji: '💧',
    title: '2. Tineco Mop/Vacuum — Do BEFORE Kitchen',
    color: 'teal',
    subSections: [
      {
        label: '',
        items: [
          { id: 'tineco-prep-1', text: 'Take Tineco parts out of sink' },
          { id: 'tineco-prep-2', text: 'Rinse if needed and set aside to dry (drying mats under the sink)' },
          { id: 'tineco-prep-3', text: 'Leave them drying while you clean kitchen' },
        ],
      },
    ],
  },
  {
    id: 'kitchen',
    emoji: '🍽️',
    title: '3. Kitchen',
    color: 'lpink',
    subSections: [
      {
        label: '',
        items: [
          { id: 'kitchen-1', text: 'Unload dishwasher (clean dishes)' },
          { id: 'kitchen-2', text: 'Load all dirty dishes from sink + counters' },
          { id: 'kitchen-3', text: 'Start dishwasher (pods are under the sink)' },
          { id: 'kitchen-4', text: 'Clear + wipe countertops' },
          { id: 'kitchen-5', text: 'Clean sink' },
          { id: 'kitchen-6', text: 'Wipe stovetop' },
        ],
      },
    ],
  },
  {
    id: 'bathrooms',
    emoji: '🛁',
    title: '4. Bathrooms — Quick Clean + 1 Deeper Task',
    color: 'lteal',
    subSections: [
      {
        label: 'All 3 bathrooms',
        items: [
          { id: 'bath-1', text: 'Wipe countertops' },
          { id: 'bath-2', text: 'Clean mirrors' },
          { id: 'bath-3', text: "General tidy (put items away, straighten, make sure there's TP)" },
          { id: 'bath-4', text: 'Empty small trash can' },
          { id: 'bath-5', text: 'Replace liner (Walmart bags in laundry storage closet)' },
        ],
      },
      {
        label: 'Upstairs guest bathroom',
        items: [
          {
            id: 'bath-6',
            text: 'Scrub tub/shower thoroughly — use Zep foaming Tub/Tile Cleaner (under the sink or above washing machine). Spray and let sit 3–5 minutes before scrubbing. New scrub brush is also under sink or above washing machine.',
          },
          { id: 'bath-7', text: 'Rinse clean' },
        ],
      },
    ],
  },
  {
    id: 'living',
    emoji: '🛋️',
    title: '5. Living Areas',
    color: 'pink',
    subSections: [
      {
        label: 'Upstairs Living + Dining Room (hard floors)',
        items: [
          { id: 'living-1', text: 'Pick up and straighten clutter' },
          { id: 'living-2', text: 'Fluff pillows / fold blankets' },
          { id: 'living-3', text: 'Wipe/dust surfaces' },
        ],
      },
      {
        label: 'Basement Living Room (carpet)',
        items: [
          { id: 'living-4', text: 'Pick up clutter' },
          { id: 'living-5', text: 'Vacuum thoroughly' },
        ],
      },
    ],
  },
  {
    id: 'bedrooms',
    emoji: '🛏️',
    title: '6. Bedrooms',
    color: 'teal',
    subSections: [
      {
        label: '',
        items: [
          { id: 'bedrooms-1', text: 'Vacuum carpet in both upstairs bedrooms' },
        ],
      },
    ],
  },
  {
    id: 'floors',
    emoji: '🧹',
    title: '7. Floors — Upstairs, Use Tineco',
    color: 'violet',
    subSections: [
      {
        label: 'Reassemble',
        items: [
          { id: 'floors-1', text: 'Make sure all parts are dry' },
          { id: 'floors-2', text: 'Insert clean water tank (fill with clean water + 1 cap of Tineco solution)' },
          { id: 'floors-3', text: 'Attach dirty water tank' },
          { id: 'floors-4', text: 'Install roller brush properly' },
          { id: 'floors-5', text: 'Snap everything firmly into place' },
        ],
      },
      {
        label: 'Use on ONLY upstairs hard floors',
        items: [
          { id: 'floors-6', text: 'Kitchen' },
          { id: 'floors-7', text: 'Dining room' },
          { id: 'floors-8', text: 'Upstairs living room' },
          { id: 'floors-9', text: '⛔ Do NOT use in bathrooms' },
        ],
      },
      {
        label: 'After using',
        items: [
          { id: 'floors-10', text: 'Empty dirty water tank' },
          { id: 'floors-11', text: 'Rinse dirty tank + filter' },
          { id: 'floors-12', text: 'Run self-cleaning cycle (button on base)' },
          { id: 'floors-13', text: 'Leave tanks open to air dry' },
        ],
      },
    ],
  },
  {
    id: 'trash',
    emoji: '🗑️',
    title: '8. Trash & Recycling',
    color: 'lpink',
    subSections: [
      {
        label: '',
        items: [
          { id: 'trash-1', text: 'Take out kitchen trash + recycling' },
          { id: 'trash-2', text: 'Replace kitchen liner (bags in pantry)' },
          { id: 'trash-3', text: 'Take all trash to bins outside garage (front driveway)' },
        ],
      },
    ],
  },
  {
    id: 'bedroom-finish',
    emoji: '🛌',
    title: '9. Bedroom — Finish When Laundry is Done',
    color: 'lteal',
    subSections: [
      {
        label: '',
        items: [
          { id: 'bedroom-finish-1', text: 'Put clean sheets back on bed' },
          { id: 'bedroom-finish-2', text: 'Make bed neatly' },
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
          { id: 'extra-2', text: 'Quick fridge clean' },
        ],
      },
    ],
  },
]

export default ethansTasks
