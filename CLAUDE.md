# CLAUDE.md — Cleaning Checklist App

## github repo
https://github.com/toddhal/housekeeping
create branch

## Project Overview
A mobile-first React/Vite web app used by a teenage house cleaner to follow a cleaning checklist, play music while she works, and request payment when done. The admin (homeowner) can edit tasks, view session history, and receive notifications when cleaning starts and finishes.

## Tech Stack
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State**: React useState / useReducer + localStorage for persistence
- **Notifications**: Stubbed (Twilio SMS to be wired up later)
- **Music**: Spotify iFrame Embed (no token required)
- **Payment**: Cash App deep link / cashtag URL
- **Deployment**: Netlify (with Netlify Functions for serverless backend)

## Color Palette (Brand)
The app uses a pink + teal theme designed for a 16-year-old.
- Primary Pink: `#f472b6`
- Deep Pink: `#fb7185`
- Primary Teal: `#14b8a6`
- Light Teal: `#2dd4bf`
- Violet accent: `#a78bfa`
- Background: white / soft pink `#fdf2f8` / soft teal `#f0fdfa`

## Font Pairing
- Display / Headers: `Fredoka One` (Google Fonts)
- Body: `Nunito` (Google Fonts)

## App Views / Routes
| Route | View | Access |
|---|---|---|
| `/` | Cleaner checklist view | Public |
| `/done` | Completion screen (payment request) | Public |
| `/admin` | Admin login + dashboard | Password protected |
| `/admin/tasks` | Edit tasks | Admin only |
| `/admin/history` | Session history log | Admin only |

## Project Structure
```
/
├── public/
├── src/
│   ├── components/
│   │   ├── ChecklistSection.jsx
│   │   ├── ChecklistItem.jsx
│   │   ├── MusicPlayer.jsx
│   │   ├── PaymentRequest.jsx
│   │   ├── AdminLogin.jsx
│   │   └── Notification.jsx
│   ├── pages/
│   │   ├── CleanerView.jsx
│   │   ├── DoneView.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminTasks.jsx
│   │   └── AdminHistory.jsx
│   ├── data/
│   │   └── defaultTasks.js
│   ├── hooks/
│   │   └── useChecklist.js
│   ├── utils/
│   │   └── notifications.js
│   ├── App.jsx
│   └── main.jsx
├── netlify/
│   └── functions/
│       └── sendSms.js
├── .env.example
├── CLAUDE.md
├── TASK.md
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Environment Variables
Store these in `.env` locally and in Netlify dashboard for production:
```
VITE_ADMIN_PASSWORD=your_admin_password
VITE_CASHAPP_CASHTAG=$yourcashtag
VITE_CASHAPP_AMOUNT=amount_in_dollars
```

## Key Behaviors
- Checklist state persists in localStorage so refreshing doesn't lose progress
- When cleaning starts (first checkbox checked), SMS fires to admin
- When all tasks are complete, app navigates to `/done` and SMS fires to admin
- Admin login uses a simple password stored in env var (no auth backend needed)
- Tasks edited by admin are saved to localStorage and override defaults
- Session history (start time, end time, date) is saved in localStorage
- Music player is always visible at the bottom of the cleaner view
- Payment button generates a Cash App deep link with pre-filled amount

## Notification Logic (Twilio)
Notifications are sent via a Netlify serverless function (`/netlify/functions/sendSms.js`) to keep Twilio credentials off the client. The function accepts `{ to, message }` in the POST body.

Trigger points:
1. **Cleaning starts** → first item is checked → SMS: "🧹 Cleaning has started!"
2. **Cleaning done** → all items checked → SMS: "✅ Cleaning is complete! Payment request sent."

## Apple Music Integration
Use MusicKit JS (loaded via CDN script tag). The developer token must be generated from an Apple Developer account. Wrap in a try/catch — if MusicKit fails to load or authorize, show a graceful fallback (a Spotify/YouTube link instead).

## Cash App Payment
Cash App supports deep links in the format:
`https://cash.app/$CASHTAG/AMOUNT`

The done screen shows a large "Request Payment" button that opens this URL. Also generate an SMS link the cleaner can tap to text the homeowner.

## Coding Conventions
- Functional components only, no class components
- Use Tailwind utility classes — no separate CSS files
- Keep components small and focused
- Use clear, descriptive variable names
- Add comments for any non-obvious logic
- Mobile-first responsive design (app is primarily used on a phone)
- All user-facing text should be friendly and encouraging in tone
