# TASK.md — Build the Cleaning Checklist App

Work through these tasks in order. Complete and verify each one before moving to the next.

---

## TASK 1 — Project Setup
- Initialize a new Vite + React project
- Install dependencies: `react-router-dom`, `tailwindcss`, `@tailwindcss/vite`
- Configure Tailwind in `vite.config.js` and `tailwind.config.js`
- Add Google Fonts (Fredoka One + Nunito) via `index.html` link tag
- Set up `.env.example` with all required variable names (no real values)
- Set up `netlify.toml` with build command `vite build`, publish dir `dist`, and functions dir `netlify/functions`
- Verify dev server starts with `npm run dev`

---

## TASK 2 — Default Task Data
Create `src/data/defaultTasks.js` exporting an array of section objects.

Each section has:
```js
{
  id: 'kitchen',
  emoji: '🍽️',
  title: '1. Kitchen',
  color: 'lpink', // lpink | pink | teal | lteal | violet
  subSections: [
    {
      label: 'Dishes',
      items: [
        { id: 'kitchen-1', text: 'Load any dirty dishes from sink + counters into dishwasher' },
        { id: 'kitchen-2', text: 'Start dishwasher' },
      ]
    }
  ]
}
```

Use the full task list from the checklist below. Copy it exactly:

### 1. Kitchen (color: lpink)
**Dishes:**
- Load any dirty dishes from sink + counters into dishwasher
- Start dishwasher

**Counters & Sink:**
- Clear + wipe countertops
- Clean sink

**Flat Top Stovetop — cleaner + scrubber are under the sink:**
- Apply flat top cleaner and scrub thoroughly
- Wipe clean and buff dry

**Stainless Appliances — stainless spray is under the sink:**
- Fridge — spray and wipe with the grain to remove fingerprints
- Hood/Vent — spray and wipe
- Stove exterior — spray and wipe
- Dishwasher front — spray and wipe

### 2. Bathrooms (color: lteal)
**Both Bathrooms:**
- Wipe countertops
- Clean mirrors
- General tidy (put items away, straighten, make sure there's TP)
- Empty small trash can
- Replace liner (bags are under the sink)

**Guest Bathroom — Tub:**
- Spray tub/shower cleaner, let sit 3–5 minutes, then scrub thoroughly
- Rinse clean

**Master Bathroom — Tile Shower:**
- Spray tile walls and floor of shower
- Scrub tiles and grout
- Rinse clean

### 3. Living Areas (color: pink)
*(no sub-sections)*
- Pick up and straighten clutter
- Fluff pillows / fold blankets
- Wipe/dust surfaces

### 4. Bedrooms (color: teal)
*(no sub-sections)*
- Pick up clutter in both bedrooms
- Vacuum carpet in both upstairs bedrooms

### 5. Floors (color: violet)
**Upstairs Bedrooms — Carpet (Cordless Vacuum):**
- Vacuum both carpeted bedrooms thoroughly
- Vacuum upstairs hallway

**Downstairs — Hardwood & Tile (Swiffer):**
- Dry sweep all hardwood and tile areas first
- Wet mop all hardwood and tile areas

### 6. Trash & Recycling (color: lpink)
*(no sub-sections)*
- Take out kitchen trash + recycling
- Replace kitchen liner (bags are under the sink)
- Take all trash to bins outside

### Extra (color: violet, optional section)
- Wipe light switches / door handles
- Quick fridge clean (inside)

---

## TASK 3 — Checklist Hook
Create `src/hooks/useChecklist.js`:
- Load tasks from localStorage on mount, falling back to `defaultTasks`
- Track checked state for every item by item `id`
- Expose: `sections`, `checkedItems`, `toggleItem`, `resetChecklist`, `totalItems`, `completedItems`, `isComplete`
- On first item checked, call `notifyStart()` from utils
- When `isComplete` becomes true, call `notifyDone()` from utils

---

## TASK 4 — Notification Utility
Create `src/utils/notifications.js`:
- Export `notifyStart()` and `notifyDone()` functions
- Each POSTs to `/.netlify/functions/sendSms` with `{ to: ADMIN_PHONE, message: '...' }`
- Use a `hasFired` flag in localStorage so notifications only send once per session
- Reset flag when `resetChecklist()` is called

Create `netlify/functions/sendSms.js`:
- Accepts POST with `{ to, message }` in body
- Uses Twilio REST API to send SMS from `TWILIO_FROM_NUMBER` to `to`
- Returns `{ success: true }` or `{ error: '...' }`
- Use node-fetch or built-in fetch (Node 18+)

---

## TASK 5 — Cleaner View (Main Page)
Create `src/pages/CleanerView.jsx`:

**Header:**
- Pink-to-teal gradient banner
- Title "🏠 House Cleaning Checklist" in Fredoka One
- Subtitle "Follow in order — you've got this! ✨"
- Progress bar showing X of Y tasks complete (animated fill, pink-to-teal gradient)

**Intro Note:**
- Dashed pink card: "💡 Feel free to light candles before you start so it smells amazing when you're done!"

**Sections:**
- Render each section using `ChecklistSection` component
- Sections are color-coded per the `color` field (lpink, pink, teal, lteal, violet)
- Each section has a colored header with emoji + title
- Sub-section labels appear as small uppercase pink/teal labels

**Checklist Items:**
- Each item has a tappable checkbox (large touch target for mobile)
- When checked: checkbox fills with color, text gets a strikethrough, item fades slightly
- Smooth CSS transition on check/uncheck

**When all items complete:**
- Confetti animation fires (use canvas-confetti from CDN)
- Auto-navigate to `/done` after 2 seconds

**Sticky Bottom Music Player:**
- Always visible at bottom of screen
- See TASK 7 for music player details

---

## TASK 6 — Done View
Create `src/pages/DoneView.jsx`:

- Full-screen celebration layout
- Big emoji ✅ and "You're done! Amazing work! 🎉"
- Show time elapsed since first item was checked
- "Request Payment via Cash App" button — opens `https://cash.app/$CASHTAG/AMOUNT` in new tab
- "Text for Payment" button — opens `sms:ADMIN_PHONE&body=Hey! I finished cleaning. Here's my Cash App: https://cash.app/$CASHTAG` 
- Small "Start Over" link that calls `resetChecklist()` and navigates back to `/`

---

## TASK 7 — Music Player Component
Create `src/components/MusicPlayer.jsx`:

- Load MusicKit JS via script tag in `index.html`: `https://js-cdn.music.apple.com/musickit/v3/musickit.js`
- On mount, initialize MusicKit with the developer token from env var
- Show an "Authorize Apple Music" button if not yet authorized
- Once authorized, show:
  - Current song name + artist
  - Play / Pause button
  - Skip forward button
  - A playlist or station selector (user's library playlists)
- Sticky bar at bottom of screen, above safe area on iOS
- Pink/teal gradient background
- Graceful fallback: if MusicKit fails to load, show a message with a link to open Apple Music app

---

## TASK 8 — Admin Login
Create `src/pages/AdminDashboard.jsx` and `src/components/AdminLogin.jsx`:

- Route `/admin` renders login form if not authenticated
- Simple password field — compare to `VITE_ADMIN_PASSWORD` env var
- On success, set `isAdminAuth = true` in sessionStorage and show dashboard
- Dashboard shows two cards: "Edit Tasks" and "View History"
- Logout button clears sessionStorage

---

## TASK 9 — Admin Task Editor
Create `src/pages/AdminTasks.jsx`:

- Display all sections and tasks in an editable list
- Inline edit: click any task text to edit it in place
- Add new item button within each sub-section
- Delete item button (trash icon) on each item
- Add new section button at the bottom
- Drag to reorder sections (use `@dnd-kit/core` and `@dnd-kit/sortable`)
- Save button writes updated tasks to localStorage
- Reset to Defaults button (with confirm dialog) restores `defaultTasks`
- Changes take effect immediately in the cleaner view

---

## TASK 10 — Admin Session History
Create `src/pages/AdminHistory.jsx`:

- Every cleaning session logs to localStorage:
  ```js
  { date, startTime, endTime, duration, itemsCompleted, totalItems }
  ```
- Display as a clean table / card list sorted newest first
- Show date, start time, end time, duration, completion %
- "Clear History" button with confirm dialog

---

## TASK 11 — Routing & App Shell
Update `src/App.jsx`:
- Set up React Router with all routes
- Wrap admin routes in an `<AdminRoute>` guard component that checks sessionStorage
- Add a simple `<NotFound>` page for unknown routes

---

## TASK 12 — Polish & Mobile Optimization
- Ensure all tap targets are at least 44px tall
- Add `viewport-fit=cover` and safe area insets for iPhone notch/home bar
- Add a web app manifest (`manifest.json`) so it can be added to home screen
- Add a simple app icon (pink/teal gradient with a house emoji)
- Test on a 390px wide viewport (iPhone 14 size)
- Ensure all text is readable and nothing overflows horizontally

---

## TASK 13 — Netlify Deployment Prep
- Confirm `netlify.toml` is correct
- Add a `_redirects` file in `public/` with `/* /index.html 200` for SPA routing
- Verify environment variables are documented in `.env.example`
- Run `npm run build` and confirm no errors
- Confirm `netlify/functions/sendSms.js` is in the right location for Netlify Functions

---

## Done!
Once all tasks are complete, the repo is ready to:
1. Connect to Netlify via GitHub
2. Add environment variables in Netlify dashboard
3. Deploy with one click
