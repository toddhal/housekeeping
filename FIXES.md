# FIXES.md — PR Code Review Fixes

Work through all 3 fixes in order. Each one is a targeted change — do not refactor anything outside the described scope.

---

## FIX 1 — Exclude Optional Tasks from Completion Check
**File:** `src/hooks/useChecklist.js`
**Problem:** The `flattenItems` loop includes sections marked `optional: true`, making it impossible for the cleaner to reach a "complete" state without checking bonus tasks.

**Fix:** Filter out optional sections before flattening.

Find this:
```js
for (const section of sections) {
  for (const sub of section.subSections || []) {
    for (const item of sub.items || []) items.push(item)
```

Replace with:
```js
for (const section of sections.filter(s => !s.optional)) {
  for (const sub of section.subSections || []) {
    for (const item of sub.items || []) items.push(item)
```

Also confirm that the "Extra" section in `src/data/defaultTasks.js` has `optional: true` on its object. If it doesn't, add it now.

---

## FIX 2 — Replace Client-Side Admin Auth with Server-Side Verification
**Problem:** Any user can open DevTools, set `sessionStorage.isAdminAuth = '1'`, and access the admin area without the password.

**Step 1 — Create a Netlify function to verify the password server-side.**

Create `netlify/functions/verifyAdmin.js`:
```js
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }
  try {
    const { password } = JSON.parse(event.body)
    const correct = process.env.ADMIN_PASSWORD
    if (!correct) return { statusCode: 500, body: 'Server misconfigured' }
    if (password !== correct) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Wrong password' }) }
    }
    const token = Buffer.from(`${password}:${process.env.APP_SECRET}`).toString('base64')
    return {
      statusCode: 200,
      body: JSON.stringify({ token })
    }
  } catch {
    return { statusCode: 400, body: 'Bad request' }
  }
}
```

**Step 2 — Update `src/components/AdminLogin.jsx`** to POST to `/.netlify/functions/verifyAdmin` instead of comparing the password client-side. On success, store the returned `token` in sessionStorage (not just a `'1'` flag).

**Step 3 — Update `src/App.jsx` `isAdminAuthed()`** to check that sessionStorage contains a non-empty `adminToken` value, not `isAdminAuth === '1'`.

**Step 4 — Add `APP_SECRET` and `ADMIN_PASSWORD` (server-side, no VITE_ prefix) to `.env.example`:**
```
ADMIN_PASSWORD=your_admin_password
APP_SECRET=a_long_random_string
```

Note: Remove `VITE_ADMIN_PASSWORD` from `.env.example` — the password should never be exposed to the client bundle.

---

## FIX 3 — Authenticate the sendSms Netlify Function
**File:** `netlify/functions/sendSms.js`
**Problem:** The endpoint is publicly accessible and will relay SMS to any `to` number with any `message`, exposing the Twilio account to abuse.

**Fix:** Require a shared secret header on all requests.

**Step 1 — In `netlify/functions/sendSms.js`**, add this check right after parsing the body:
```js
const appSecret = process.env.APP_SECRET
const callerSecret = event.headers['x-app-secret']
if (!appSecret || callerSecret !== appSecret) {
  return { statusCode: 403, body: 'Forbidden' }
}
```

Also add a destination whitelist — only allow sending to the admin phone number:
```js
const allowedTo = process.env.ADMIN_PHONE
if (to !== allowedTo) {
  return { statusCode: 403, body: 'Forbidden destination' }
}
```

**Step 2 — Update `src/utils/notifications.js`** to include the header on all fetch calls to sendSms:
```js
headers: {
  'Content-Type': 'application/json',
  'x-app-secret': import.meta.env.VITE_APP_SECRET
}
```

**Step 3 — Add `VITE_APP_SECRET` to `.env.example`** (this is the client-side copy, same value as `APP_SECRET`):
```
VITE_APP_SECRET=same_value_as_APP_SECRET
```

Note: `APP_SECRET` and `VITE_APP_SECRET` must be the same value — one lives in the Netlify function environment, one is bundled into the client. This is acceptable because the secret's only purpose is to prevent anonymous public abuse of the endpoint, not to protect truly sensitive data.

---

## After all 3 fixes
- Run `npm run build` — confirm no errors
- Test admin login: wrong password should fail, correct password should succeed
- Test that completing only required tasks (not optional/extra) triggers the done state
- Commit with message: "Fix PR review issues — optional tasks, admin auth, sendSms security"
