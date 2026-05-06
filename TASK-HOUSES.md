# TASK-HOUSES.md — Add Multi-House Support

Work through these tasks in order on a new branch called `feature/multi-house`.
Complete and verify each one before moving to the next.

---

## TASK H1 — Add Ethan's Task Data

Create `src/data/ethansTasks.js` using the same section object shape as `defaultTasks.js`.

Full task list to copy exactly:

### 1. Laundry — Start Immediately! (color: pink)
*(no sub-sections)*
- Strip master bedroom bed sheets and pillow cases
- Start washer right away
- Move to dryer as soon as done

### 2. Tineco Mop/Vacuum — Do BEFORE Kitchen (color: teal)
*(no sub-sections)*
- Take Tineco parts out of sink
- Rinse if needed and set aside to dry (drying mats under the sink)
- Leave them drying while you clean kitchen

### 3. Kitchen (color: lpink)
*(no sub-sections)*
- Unload dishwasher (clean dishes)
- Load all dirty dishes from sink + counters
- Start dishwasher (pods are under the sink)
- Clear + wipe countertops
- Clean sink
- Wipe stovetop

### 4. Bathrooms — Quick Clean + 1 Deeper Task (color: lteal)
**All 3 bathrooms:**
- Wipe countertops
- Clean mirrors
- General tidy (put items away, straighten, make sure there's TP)
- Empty small trash can
- Replace liner (Walmart bags in laundry storage closet)

**Upstairs guest bathroom:**
- Scrub tub/shower thoroughly — use Zep foaming Tub/Tile Cleaner (under the sink or above washing machine). Spray and let sit 3–5 minutes before scrubbing. New scrub brush is also under sink or above washing machine.
- Rinse clean

### 5. Living Areas (color: pink)
**Upstairs Living + Dining Room (hard floors):**
- Pick up and straighten clutter
- Fluff pillows / fold blankets
- Wipe/dust surfaces

**Basement Living Room (carpet):**
- Pick up clutter
- Vacuum thoroughly

### 6. Bedrooms (color: teal)
*(no sub-sections)*
- Vacuum carpet in both upstairs bedrooms

### 7. Floors — Upstairs, Use Tineco (color: violet)
**Reassemble:**
- Make sure all parts are dry
- Insert clean water tank (fill with clean water + 1 cap of Tineco solution)
- Attach dirty water tank
- Install roller brush properly
- Snap everything firmly into place

**Use on ONLY upstairs hard floors:**
- Kitchen
- Dining room
- Upstairs living room
- ⛔ Do NOT use in bathrooms

**After using:**
- Empty dirty water tank
- Rinse dirty tank + filter
- Run self-cleaning cycle (button on base)
- Leave tanks open to air dry

### 8. Trash & Recycling (color: lpink)
*(no sub-sections)*
- Take out kitchen trash + recycling
- Replace kitchen liner (bags in pantry)
- Take all trash to bins outside garage (front driveway)

### 9. Bedroom — Finish When Laundry is Done (color: lteal)
*(no sub-sections)*
- Put clean sheets back on bed
- Make bed neatly

### Extra (color: violet, optional: true)
- Wipe light switches / door handles
- Quick fridge clean

---

## TASK H2 — Create House Config

Create `src/data/houses.js`:

```js
import defaultTasks from './defaultTasks'
import ethansTasks from './ethansTasks'

const houses = [
  {
    id: 'home',
    label: "Todd's House",
    emoji: '🏠',
    tasks: defaultTasks,
    introNote: '💡 Feel free to light candles before you start so it smells amazing when you\'re done!',
  },
  {
    id: 'ethan',
    label: "Ethan's House",
    emoji: '🏡',
    tasks: ethansTasks,
    introNote: '💡 Feel free to light candles before you start — the lighter is in the tall hutch in the living room. Do NOT use the Tineco in bathrooms!',
  },
]

export default houses
```

---

## TASK H3 — Update useChecklist Hook to be House-Aware

**File:** `src/hooks/useChecklist.js`

The hook needs to scope all localStorage keys to the active house so each house has independent progress.

Make the following changes:

**1. Accept `houseId` as a parameter:**
```js
export function useChecklist(houseId) {
```

**2. Scope all localStorage keys using the houseId:**
```js
const STORAGE_KEY = `checklist_state_${houseId}`
const NOTIFY_KEY = `notify_fired_${houseId}`
const SESSION_KEY = `session_${houseId}`
```

**3. When `houseId` changes** (user switches houses), re-load state from the correct localStorage key. Use a `useEffect` that depends on `houseId`.

**4. Update `resetChecklist()`** to clear only the keys for the current `houseId`, not all houses.

---

## TASK H4 — Create HouseSelector Component

Create `src/components/HouseSelector.jsx`:

- A pill-style toggle with two options: "🏠 Todd's House" and "🏡 Ethan's House"
- Active house pill: solid pink background (`#f472b6`), white text, slightly scaled up
- Inactive house pill: white background, pink border, pink text
- Smooth CSS transition between states
- On switch, call the `onSwitch(houseId)` prop — do NOT reset progress
- Display below the main page header, above the intro note
- Mobile-friendly: pills should be wide enough to tap easily (min 44px height)

---

## TASK H5 — Update CleanerView to Support Multiple Houses

**File:** `src/pages/CleanerView.jsx`

**1. Import `houses` from `src/data/houses.js`**

**2. Add house state:**
```js
const [activeHouseId, setActiveHouseId] = useState(
  () => localStorage.getItem('activeHouse') || 'home'
)
```
Persist the active house selection to localStorage so it survives refresh.

**3. Look up the active house config:**
```js
const activeHouse = houses.find(h => h.id === activeHouseId)
```

**4. Pass `activeHouseId` to `useChecklist`:**
```js
const { sections, checkedItems, toggleItem, resetChecklist, ... } = useChecklist(activeHouseId)
```

**5. Render `<HouseSelector>` below the page header:**
```jsx
<HouseSelector
  houses={houses}
  activeHouseId={activeHouseId}
  onSwitch={(id) => {
    setActiveHouseId(id)
    localStorage.setItem('activeHouse', id)
  }}
/>
```

**6. Use `activeHouse.introNote`** for the intro note text so each house shows its own message.

**7. Use `activeHouse.tasks`** as the source of truth for rendering sections (the hook already handles this via `houseId`).

---

## TASK H6 — Add Reset Button to CleanerView

**File:** `src/pages/CleanerView.jsx`

Add a "Start Fresh" reset button. This lets her reset at the start of a new cleaning day without switching houses.

- Place it in the top-right corner of the page header
- Small button: white text, semi-transparent white border, no solid background (ghost style)
- Label: "↺ Reset"
- On tap: show a simple `window.confirm('Reset all tasks for this house?')` dialog
- If confirmed: call `resetChecklist()` and scroll to top
- Only show the button if at least one item has been checked (don't show on a fresh list)

---

## TASK H7 — Update Session History to Track House

**File:** `src/pages/AdminHistory.jsx` and `src/hooks/useChecklist.js`

When a session is saved to history, include the house name:

```js
{
  date,
  house: activeHouse.label,   // e.g. "Todd's House"
  startTime,
  endTime,
  duration,
  itemsCompleted,
  totalItems
}
```

Update the history table/cards in `AdminHistory.jsx` to show a "House" column/field.

---

## TASK H8 — Update Admin Task Editor for Both Houses

**File:** `src/pages/AdminTasks.jsx`

The admin task editor currently only edits one set of tasks. Update it to support both houses:

- Add a house selector at the top of the admin tasks page (can reuse `<HouseSelector>` or a simple dropdown)
- Edited tasks are saved to localStorage under house-scoped keys:
  - `tasks_home` for Todd's house
  - `tasks_ethan` for Ethan's house
- "Reset to Defaults" restores that house's `defaultTasks` or `ethansTasks` respectively
- The cleaner view reads from these same scoped keys

---

## TASK H9 — Smoke Test & Commit

- Switch between houses — confirm progress is fully independent
- Check off items in Todd's house, switch to Ethan's — Todd's progress should be untouched
- Reset Todd's house — Ethan's progress should be untouched  
- Complete all required tasks in one house — confirm done screen fires only for that house
- Reset button only appears after at least one item is checked
- Admin history shows the correct house label for each session
- Run `npm run build` — confirm no errors
- Commit with message: "Feature: multi-house support with independent progress and reset"
- Open PR against main
